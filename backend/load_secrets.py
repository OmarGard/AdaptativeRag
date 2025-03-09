import os
import json

def get_secrets():
    with open('./secrets.json') as secrets_file:
        return json.load(secrets_file)
    
def load_secrets():
    secrets = get_secrets()
    os.environ["LANGSMITH_API_KEY"]  = secrets.get("LANGSMITH_API_KEY")
    os.environ["GOOGLE_API_KEY"] = secrets.get("GOOGLE_API_KEY")
    os.environ["GOOGLE_CSE_ID"] = secrets.get("GOOGLE_CSE_ID")
    os.environ["OPENAI_API_KEY"] = secrets.get("OPENAI_API_KEY")
    os.environ["LANGSMITH_TRACING"] = "true"
