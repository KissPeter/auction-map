from fastapi import FastAPI
from backend.api import nav_auction
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Auction Map API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(nav_auction.router)
