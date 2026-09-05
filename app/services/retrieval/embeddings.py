import time
import logfire
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings

BATCH_SIZE = 50
_GEMINI_DIM = 3072
_FALLBACK_DIM = 768

_active_model = None
_model_type: str | None = None 

def _probe_gemini() -> GoogleGenerativeAIEmbeddings | None:
    """
    Try one embed call to verify Gemini is reachable . return Model or None.
    """
    try:
        model = GoogleGenerativeAIEmbeddings(
            model = "models/gemini-embedding-2-preview",
            google_api_key = settings.GEMINI_API_KEY,
        )
        logfire.info("Gemini embeddings ready (gemini-embedding-2-preview, 3072 dims)")
        return model
    except Exception as e:
        logfire.error(f"Failed to initialize Gemini embeddings: {e}")
        return None
    
def _load_fallback():
    from sentence_transformers import SentenceTransformer
    logfire.info("Loading fallback embeddings (sentence-transformers/all-MiniLM-L6-v2, 768 dims)")
    return SentenceTransformer("all-mpnet-base-v2")
    
def _init():
    global _active_model, _model_type
    if _active_model is not None:
        return;
    gemini = _probe_gemini()
    if gemini:
        _active_model = gemini
        _model_type = "gemini"
    else:
        _active_model = _load_fallback()
        _model_type = "fallback"
    logfire.info(f"Using {_model_type} embeddings (dim: {get_embedding_dim()})")
    return;

def get_embedding_dim():
    """Return the vector dimension for the active model. """
    _init()
    return _GEMINI_DIM if _model_type == "gemini" else _FALLBACK_DIM 


def _embed_batch(batch: list[str]) -> list[list[float]]:
    if _model_type == "gemini":
        # Exponential backoff: 1 s → 2 s → 4 s → 8 s (4 attempts total)
        for attempt in range(4):
            try:
                return _active_model.embed_documents(batch)
            except Exception as e:
                err = str(e).lower()
                is_rate_limit = any(x in err for x in ("429", "rate", "quota", "resource_exhausted"))
                if is_rate_limit and attempt < 3:
                    wait = 2 ** attempt
                    logfire.warning(
                        f"Gemini rate limit hit — retrying in {wait}s "
                        f"(attempt {attempt + 1}/4)."
                    )
                    time.sleep(wait)
                else:
                    logfire.error(f"Gemini embedding failed: {e}")
                    raise
        raise RuntimeError("Gemini rate limit persisted after 4 attempts.")
    else:
        return _active_model.encode(batch, show_progress_bar=False).tolist()

          
def embed_query(query: str) -> list[float]:
    _init()
    if _model_type == "gemini":
        return _active_model.embed_query(query)
    return _active_model.encode(query).tolist()

def embed_texts(texts: list[str]) -> list[list[float]]:
    _init()
    all_embeddings: list[list[float]] = []
    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i:i+BATCH_SIZE]
        with logfire.span("Embed batch", model = _model_type, start = i , size = len(batch)):
            all_embeddings.extend(_embed_batch(batch))
    return all_embeddings