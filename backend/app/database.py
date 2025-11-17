"""
Database configuration for the employee profile API.
Uses SQLite as the database backend.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite Database in a file named employees.db
SQLALCHEMY_DATABASE_URL = "sqlite:///./employees.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # necesary SQLite with FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Class model
Base = declarative_base()

#Function that will be used by FastApi to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()