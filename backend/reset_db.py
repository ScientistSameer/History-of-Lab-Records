# reset_db.py

from app.database import Base, engine
from app.models import Lab, Researcher, User  # import all models

def reset_database():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database reset complete!")


