from typing import Optional, TypedDict, List, Annotated
import operator


class AgentState(TypedDict):
    # Using Annotated with operator.add ensures that messages 
    # are appended to the history rather than replaced.
    messages: Annotated[List[dict], operator.add] # Total 5 messages, system, ai , user, tool , memory message
    current_query: str
    documents: List[str]
    plan: List[str]
    status: str
    final_answer: Optional[str]
