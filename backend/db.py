from sqlmodel import Session, create_engine
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://auction:auction@localhost/auction_db")
engine = create_engine(DATABASE_URL, echo=False)

def get_session():
    return Session(engine)