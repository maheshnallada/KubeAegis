import os 
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_FALLBACK_API_KEY = os.getenv("GROQ_FALLBACK_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL")
    GROQ_SLUG = os.getenv("GROQ_SLUG")
    GROQ_SLUG_2 = os.getenv("GROQ_SLUG")
    PORTKEY_API_KEY = os.getenv("PORTKEY_API_KEY")
    # Saved Portkey dashboard config slug (pc-...). Required when the Portkey org has
    # block_inline_config enabled, since inline config dicts are then rejected (400).
    PORTKEY_CONFIG_SLUG = os.getenv("PORTKEY_CONFIG_SLUG")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
    QDRANT_CLUSTER_ENDPOINT = os.getenv("QDRANT_CLUSTER_ENDPOINT")
    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    LOGFIRE_TOKEN = os.getenv("LOGFIRE_TOKEN")
    LANGSMITH_TRACING = os.getenv("LANGSMITH_TRACING")
    LANGSMITH_ENDPOINT = os.getenv("LANGSMITH_ENDPOINT")
    LANGSMITH_API_KEY = os.getenv("LANGSMITH_API_KEY")

settings = Settings()