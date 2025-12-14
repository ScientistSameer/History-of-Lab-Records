from fastapi import FastAPI
from .database import Base, engine
from .routers import labs, researchers, users

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MCP Atlas Backend")

# Include routers
app.include_router(labs.router)
app.include_router(researchers.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "MCP Atlas Backend Running"}
