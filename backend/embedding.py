from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

persist_directory = "./openai_chroma_db"
collection_name = "openai-rag-chroma"

# Embedding Model
embd = OpenAIEmbeddings(model="text-embedding-3-large")

vector_store = Chroma(
    persist_directory=persist_directory,
    embedding_function=embd,
    collection_name=collection_name
)

retriever = vector_store.as_retriever()
