from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import request_routes

app = FastAPI(
    title="Client Request & Support Workflow API",
    version="0.1.0"
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(request_routes.router)


@app.get("/")
def root():
    return {
        "message": "Client Request & Support Workflow API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }