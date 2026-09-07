import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import Base, engine
from app.routers import request_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    if engine is not None:
        Base.metadata.create_all(bind=engine)

    yield


app = FastAPI(
    title="Client Request & Support Workflow API",
    version="0.1.0",
    lifespan=lifespan,
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    origins.append(frontend_url)


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