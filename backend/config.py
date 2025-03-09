from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# (Optional) Configure CORS if your frontend is on a different origin (port).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in development, allow all. Restrict in production.
    allow_methods=["*"],
    allow_headers=["*"],
)
