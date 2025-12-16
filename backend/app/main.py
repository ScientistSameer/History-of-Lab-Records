from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import labs, researchers, users, collaboration

app = FastAPI(title="MCP Atlas Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)


# Include routers
app.include_router(users.router)
app.include_router(labs.router)
app.include_router(researchers.router)
app.include_router(collaboration.router)

@app.get("/")
def root():
    return {"message": "MCP Atlas Backend Running"}
