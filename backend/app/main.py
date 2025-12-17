from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import labs, researchers, users, collaboration, ideal_lab
from .routers import doc_ingest
from dotenv import load_dotenv
import os

load_dotenv()
print("SMTP_EMAIL:", os.getenv("SMTP_EMAIL"))
print("SMTP_PASSWORD:", os.getenv("SMTP_PASSWORD"))
# -------------------------
# FastAPI App Initialization
# -------------------------
app = FastAPI(title="History of Lab Records: AI-Driven Analytics & Collaboration")
app.include_router(doc_ingest.router)
app.include_router(collaboration.router)
app.include_router(ideal_lab.router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Create DB Tables
# -------------------------
Base.metadata.create_all(bind=engine)

# -------------------------
# Include Routers
# -------------------------
app.include_router(users.router)
app.include_router(labs.router)
app.include_router(researchers.router)
app.include_router(collaboration.router)

# -------------------------
# Root Endpoint
# -------------------------
@app.get("/")
def root():
    return {"message": "NexaCore History of Lab Records Backend Running"}
