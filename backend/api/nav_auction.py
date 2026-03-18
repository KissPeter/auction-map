from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from sqlmodel import Session, select
from backend.db import get_session
from backend.models import NavAuction

router = APIRouter()

@router.get("/nav-auctions", response_model=List[NavAuction], tags=["NAV Auctions"])
def get_nav_auctions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
):
    with get_session() as session:
        query = select(NavAuction)
        if start_date:
            query = query.where(NavAuction.start_date >= start_date)
        if end_date:
            query = query.where(NavAuction.end_date <= end_date)
        if location:
            query = query.where(NavAuction.location.ilike(f"%{location}%"))
        total = session.exec(query).count()
        query = query.offset((page-1)*page_size).limit(page_size)
        auctions = session.exec(query).all()
        return {
            "data": auctions,
            "total": total,
            "page": page,
            "page_size": page_size,
        }