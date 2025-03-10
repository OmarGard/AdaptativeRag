from pprint import pprint
from langgraph.graph import END, StateGraph, START
from langchain.schema import Document
from langchain_google_community import GoogleSearchAPIWrapper
from langchain_core.tools import Tool
from models import GraphState
from llms import (
    question_router,
    retrieval_grader,
    rag_chain,
    hallucination_grader,
    answer_grader,
    question_rewriter
)
from embedding import retriever

# Define GRAPH_STAGES
GRAPH_STAGES = {
    "web_search": "web_search",
    "retrieve": "retrieve",
    "grade_documents": "grade_documents",
    "generate": "generate",
    "transform_query": "transform_query",
    "route_question": "route_question",
    "grade_generation_v_documents_and_question": "grade_generation_v_documents_and_question",
    "decide_to_generate": "decide_to_generate",
}

# Web Search Tool
search = GoogleSearchAPIWrapper(k=3)
def search_results(query):
    return search.results(query, num_results=3)
web_search_tool = Tool(
    name="google_search",
    description="Search Google for recent results.",
    func=search_results
)

### Graph function
async def retrieve(state):
    """
    Retrieve documents
    Args:
        state (dict): The current graph state
    Returns:
        state (dict): New key added to state, documents, that contains retrieved documents
    """
    print("---RETRIEVE---")
    websocket = state["websocket"]
    manager = state["manager"]
    await manager.send_message(websocket, GRAPH_STAGES["web_search"], "update_status")
    question = state["question"]
    documents = await retriever.ainvoke(question)
    return {"documents": documents, "question": question}

async def generate(state):
    """
    Generate answer
    Args:
        state (dict): The current graph state
    Returns:
        state (dict): New key added to state, generation, that contains LLM generation
    """
    print("---GENERATE---")
    websocket = state["websocket"]
    manager = state["manager"]
    await manager.send_message(websocket, GRAPH_STAGES["generate"], "update_status")
    question = state["question"]
    documents = state["documents"]
    attempts = state["attempts"]
    max_attempts = state["MAX_ATTEMPTS"]

    attempts += 1
    if attempts > max_attempts:
        print("---MAX ATTEMPTS REACHED---")
        generation = "I am sorry, I could not generate an answer."
    else:
        generation = await rag_chain.ainvoke({"context": documents, "question": question})

    return {
        "documents": documents,
        "question": question,
        "generation": generation,
        "attempts": attempts
    }

async def grade_documents(state):
    """
    Determines whether the retrieved documents are relevant to the question.
    Args:
        state (dict): The current graph state
    Returns:
        state (dict): Updates documents key with only filtered relevant documents
    """
    print("---CHECK DOCUMENT RELEVANCE TO QUESTION---")
    websocket = state["websocket"]
    manager = state["manager"]
    await manager.send_message(websocket, GRAPH_STAGES["grade_documents"], "update_status")

    question = state["question"]
    documents = state["documents"]

    filtered_docs = []
    for d in documents:
        score = await retrieval_grader.ainvoke(
            {"question": question, "document": d.page_content}
        )
        grade = score.binary_score
        if grade == "yes":
            print("---GRADE: DOCUMENT RELEVANT---")
            filtered_docs.append(d)
        else:
            print("---GRADE: DOCUMENT NOT RELEVANT---")
            continue
    return {"documents": filtered_docs, "question": question}

async def transform_query(state):
    """
    Transform the query to produce a better question.
    Args:
        state (dict): The current graph state
    Returns:
        state (dict): Updates question key with a re-phrased question
    """
    print("---TRANSFORM QUERY---")
    question = state["question"]
    documents = state["documents"]
    websocket = state["websocket"]
    manager = state["manager"]

    await manager.send_message(websocket, GRAPH_STAGES["transform_query"], "update_status")

    better_question = await question_rewriter.ainvoke({"question": question})

    return {"documents": documents, "question": better_question}

async def web_search(state):
    """
    Web search based on the re-phrased question.
    Args:
        state (dict): The current graph state
    Returns:
        state (dict): Updates documents key with appended web results
    """
    print("---WEB SEARCH---")
    question = state["question"]
    websocket = state["websocket"]
    manager = state["manager"]
    await manager.send_message(websocket, GRAPH_STAGES["web_search"], "update_status")
    docs = await web_search_tool.ainvoke({"query": question})
    web_results = "\n".join([d["snippet"] for d in docs])
    web_results = Document(page_content=web_results)

    return {"documents": web_results, "question": question}

### Edges ###
async def route_question(state):
    """
    Route question to web search or RAG.
    Args:
        state (dict): The current graph state
    Returns:
        str: Next node to call
    """
    print("---ROUTE QUESTION---")
    question = state["question"]
    websocket = state["websocket"]
    manager = state["manager"]
    await manager.send_message(websocket, GRAPH_STAGES["route_question"], "update_status")
    source = await question_router.ainvoke({"question": question})
    if source.datasource == "web_search":
        print("---ROUTE QUESTION TO WEB SEARCH---")
        return "web_search"
    elif source.datasource == "vectorstore":
        print("---ROUTE QUESTION TO RAG---")
        return "vectorstore"

async def decide_to_generate(state):
    """
    Determines whether to generate an answer, or re-generate a question.
    Args:
        state (dict): The current graph state
    Returns:
        str: Binary decision for next node to call
    """
    print("---ASSESS GRADED DOCUMENTS---")
    state["question"]
    filtered_documents = state["documents"]
    websocket = state["websocket"]
    manager = state["manager"]
    await manager.send_message(websocket, GRAPH_STAGES["decide_to_generate"], "update_status")
    if not filtered_documents:
        print(
            "---DECISION: ALL DOCUMENTS ARE NOT RELEVANT TO QUESTION, TRANSFORM QUERY---"
        )
        return "transform_query"
    else:
        print("---DECISION: GENERATE---")
        return "generate"

async def grade_generation_v_documents_and_question(state):
    """
    Determines whether the generation is grounded in the document and answers question.
    Args:
        state (dict): The current graph state
    Returns:
        str: Decision for next node to call
    """
    print("---CHECK HALLUCINATIONS---")
    
    question = state["question"]
    documents = state["documents"]
    generation = state["generation"]
    websocket = state["websocket"]
    manager = state["manager"]
    attempts = state["attempts"]
    max_attempts = state["MAX_ATTEMPTS"]
    if(attempts > max_attempts):
        return "useful"
    
    await manager.send_message(websocket, GRAPH_STAGES["grade_generation_v_documents_and_question"], "update_status")
    score = await hallucination_grader.ainvoke(
        {"documents": documents, "generation": generation}
    )
    grade = score.binary_score

    if grade == "yes":
        print("---DECISION: GENERATION IS GROUNDED IN DOCUMENTS---")
        score = await answer_grader.ainvoke({"question": question, "generation": generation})
        grade = score.binary_score
        if grade == "yes":
            print("---DECISION: GENERATION ADDRESSES QUESTION---")
            return "useful"
        else:
            print("---DECISION: GENERATION DOES NOT ADDRESS QUESTION---")
            return "not useful"
    else:
        pprint("---DECISION: GENERATION IS NOT GROUNDED IN DOCUMENTS, RE-TRY---")
        return "not supported"

workflow = StateGraph(GraphState)

# Define the nodes
workflow.add_node("web_search", web_search)
workflow.add_node("retrieve", retrieve)
workflow.add_node("grade_documents", grade_documents)
workflow.add_node("generate", generate)
workflow.add_node("transform_query", transform_query)

# Build graph
workflow.add_conditional_edges(
    START,
    route_question,
    {
        "web_search": "web_search",
        "vectorstore": "retrieve",
    },
)
workflow.add_edge("web_search", "generate")
workflow.add_edge("retrieve", "grade_documents")
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate,
    {
        "transform_query": "transform_query",
        "generate": "generate",
    },
)
workflow.add_edge("transform_query", "retrieve")
workflow.add_conditional_edges(
    "generate",
    grade_generation_v_documents_and_question,
    {
        "not supported": "generate",
        "useful": END,
        "not useful": "transform_query",
    },
)

# Compile
agent = workflow.compile()
