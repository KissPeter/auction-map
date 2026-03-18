"""
NAV Auctions Scraper Package
Analyzes and scrapes auction data from https://arveres.nav.gov.hu/

License: MIT
Author: BE Agent
"""

from .config import NAVScraperConfig
from .parser import NavAuctionParser
from .extractor import NavAuctionExtractor
from .pagination import NavPaginationHandler

__version__ = "0.1.0"
__author__ = "BE Agent"

__all__ = [
    "NAVScraperConfig",
    "NavAuctionParser",
    "NavAuctionExtractor",
    "NavPaginationHandler",
]