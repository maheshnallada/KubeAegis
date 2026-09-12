# ============================================================
# CRITICAL: logfire MUST be configured before ALL other imports
# so that spans from all modules are captured from the start.
# ============================================================
import logfire
import os
from dotenv import load_dotenv

load_dotenv()
logfire.configure(token=os.getenv("LOGFIRE_TOKEN"))

# Now safe to import app modules - logfire is already active
import json
from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
from app.agents.graph import rag_agent
from app.agents.nodes.planner import planner_node
from app.agents.nodes.retriever import retrieve_node
from app.agents.state import AgentState
from app.guardrails import initialize_rails, guard
from app.gateway import portkey_client

from pydantic import BaseModel
from typing import Optional


# Initialize FastAPI
app = FastAPI(title="Enterprise Agentic RAG API")


@app.on_event("startup")
def startup_event():
    initialize_rails()

class QueryRequest(BaseModel):
    q: str
    thread_id: Optional[str] = "default_user"
    
    
@app.get("/")
def home():
    return {"message": "Enterprise LangGraph RAG API is live."}


@app.get("/graph")
def get_graph_image():
    """
    Returns the Mermaid image of the agent's workflow.
    """
    try:
        png_bytes = rag_agent.get_graph().draw_mermaid_png()
        return Response(content=png_bytes, media_type="image/png")
    except Exception as e:
        return {"error": f"Could not generate graph image: {e}"}
    
    
@app.post("/query")
def query(request: QueryRequest):
    """
    Executes the LangGraph RAG flow with memory using a POST request.
    """
    q = request.q
    thread_id = request.thread_id

    initial_state: AgentState = {
        "messages": [{"role": "user", "content": q}],
        "current_query": q,
        "documents": [],
        "plan": ["Start"],
        "status": "Initializing Graph..."
    }
    
    # Configuration for Memory (Thread ID)
    config = {"configurable": {"thread_id": thread_id}}
    
    try:
        # Gate 1: NeMo Guardrails — blocks off-topic, jailbreaks, and handles dialog
        rail_fired, rail_response = guard(q)
        if rail_fired:
            logfire.info(f"🛡️ Request blocked by guardrails | thread={thread_id}")
            return {
                "question": q,
                "answer": rail_response,
                "thought_process": ["Intent: Guardrails Fired", "Retrieval: Skipped"],
                "status": "Blocked by guardrails.",
                "sources": []
            }

        # Gate 2: LangGraph RAG pipeline
        # Run the graph synchronously to preserve Logfire context variables
        final_output = rag_agent.invoke(initial_state, config=config)
        
        return {
            "question": q,
            "answer": final_output.get("final_answer"),
            "thought_process": final_output.get("plan"),
            "status": final_output.get("status"),
            "sources": final_output.get("documents", [])
        }
    except Exception as e:
        logfire.error(f"❌ Backend Execution Failed: {e}")
        return {
            "question": q,
            "answer": "I apologize, but I encountered an internal error while processing your request. Please try again later.",
            "thought_process": ["Error encountered during execution."],
            "status": "error",
            "sources": []
        }


@app.post("/query/stream")
def query_stream(request: QueryRequest):
    """
    SSE streaming endpoint. 
    Runs guardrails → planner → retriever synchronously, 
    then streams LLM tokens as they arrive.
    
    SSE event types:
      data: <token>          — raw text chunk from LLM
      event: metadata        — JSON with thought_process, sources, status (sent once at end)
      event: error           — error message string
    """
    q = request.q
    thread_id = request.thread_id

    def event_stream():
        try:
            # ── Gate 1: Guardrails ────────────────────────────────────────────
            rail_fired, rail_response = guard(q)
            if rail_fired:
                logfire.info(f"🛡️ Stream blocked by guardrails | thread={thread_id}")
                for word in (rail_response or "").split(" "):
                    yield f"data: {json.dumps(word + ' ')}\n\n"
                meta = {
                    "thought_process": ["Intent: Guardrails Fired", "Retrieval: Skipped"],
                    "sources": [],
                    "status": "Blocked by guardrails.",
                    "is_blocked": True,
                }
                yield f"event: metadata\ndata: {json.dumps(meta)}\n\n"
                return

            config = {"configurable": {"thread_id": thread_id}}

            # ── Load conversation history from MemorySaver ────────────────────
            # rag_agent.get_state() returns the last checkpoint for this thread.
            # The messages list stored there is the full prior conversation.
            prior_messages: list = []
            try:
                snapshot = rag_agent.get_state(config)
                if snapshot and snapshot.values:
                    prior_messages = snapshot.values.get("messages", [])
            except Exception:
                pass  # No prior checkpoint — fresh thread

            # Append the new user message to the full history
            all_messages = prior_messages + [{"role": "user", "content": q}]
            logfire.info(f"🧠 Memory: {len(prior_messages)} prior messages loaded for thread={thread_id}")

            # ── Build state with full conversation history ─────────────────────
            state: AgentState = {
                "messages": all_messages,
                "current_query": q,
                "documents": [],
                "plan": ["Start"],
                "status": "Initializing...",
            }

            state.update(planner_node(state))
            logfire.info(f"🗺️ Planner decision: {state['current_query']}")

            # ── Gate 3: Retriever (only for technical queries) ────────────────
            if state["current_query"] != "CONVERSATIONAL":
                state.update(retrieve_node(state))
                logfire.info(f"🔍 Retrieved {len(state['documents'])} docs")

            # ── Build prompt ──────────────────────────────────────────────────
            history_str = ""
            for msg in state["messages"][:-1]:
                role = "User" if msg["role"] == "user" else "Assistant"
                history_str += f"{role}: {msg['content']}\n"

            user_msg = state["messages"][-1]["content"] if state["messages"] else ""

            if state["current_query"] == "CONVERSATIONAL":
                prompt = (
                    "You are a friendly and helpful Enterprise AI Assistant.\n"
                    "Answer the user's latest message using the CONVERSATION HISTORY below.\n\n"
                    f"CONVERSATION HISTORY:\n{history_str}\n\n"
                    f'LATEST MESSAGE:\n"{user_msg}"'
                )
            else:
                max_context_chars = 25_000
                full_context = ""
                for doc in state["documents"]:
                    if len(full_context) + len(doc) < max_context_chars:
                        full_context += doc + "\n\n"
                    else:
                        break

                prompt = (
                    "You are a Senior Technical Architect.\n"
                    "Answer the question using the TECHNICAL CONTEXT provided.\n\n"
                    f"TECHNICAL CONTEXT:\n{full_context}\n\n"
                    f"CONVERSATION HISTORY:\n{history_str}\n\n"
                    f'USER QUESTION:\n"{user_msg}"'
                )

            # ── Stream LLM tokens via Portkey ─────────────────────────────────
            full_answer = ""
            with logfire.span("✍️ LLM Stream"):
                stream = portkey_client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1,
                    stream=True,
                )
                for chunk in stream:
                    delta = chunk.choices[0].delta.content if chunk.choices else None
                    if delta:
                        full_answer += delta
                        yield f"data: {json.dumps(delta)}\n\n"

            # ── Persist to MemorySaver ────────────────────────────────────────
            # We write back the COMPLETE updated message list.
            # update_state with operator.add reducer means we must pass ONLY the
            # NEW messages (user + assistant), not the full list — MemorySaver
            # will append them on top of the existing checkpoint automatically.
            try:
                new_messages = [
                    {"role": "user", "content": q},
                    {"role": "assistant", "content": full_answer},
                ]
                rag_agent.update_state(config, {"messages": new_messages})
                logfire.info(f"💾 Memory saved: +2 messages for thread={thread_id}")
            except Exception as mem_err:
                logfire.warning(f"⚠️ Memory save failed (non-fatal): {mem_err}")

            # ── Final metadata event ──────────────────────────────────────────
            meta = {
                "thought_process": state.get("plan", []),
                "sources": state.get("documents", []),
                "status": state.get("status", "Done."),
                "is_blocked": False,
            }
            yield f"event: metadata\ndata: {json.dumps(meta)}\n\n"

        except Exception as e:
            logfire.error(f"❌ Stream failed: {e}")
            yield f"event: error\ndata: {json.dumps(str(e))}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disables nginx buffering
        },
    )

