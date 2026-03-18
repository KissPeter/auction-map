from sqlmodel import SQLModel, Field
from typing import Optional, List

class NavAuction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    location: str
    start_date: str
    end_date: str
    category: str
    description: Optional[str]
    images: Optional[List[str]]