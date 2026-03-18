"""
Configuration for NAV Auctions Scraper

License: MIT
Author: BE Agent
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class NAVScraperConfig:
    """Configuration for NAV auctions scraping operations."""
    
    # Base URL
    base_url: str = "https://arveres.nav.gov.hu/"
    
    # User-Agent (required to avoid blocking)
    user_agent: str = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0 Safari/537.36"
    )
    
    # Rate limiting
    request_delay: float = 1.0  # seconds between requests
    max_requests_per_minute: int = 10
    
    # Headers
    headers: dict = field(default_factory=lambda: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "hu-HU,hu;q=0.9,en-US;q=0.8,en;q=0.7",
    })
    
    # Output settings
    output_format: str = "json"  # json|csv
    output_encoding: str = "utf-8"
    
    # Rate limit headers to check
    rate_limit_header: Optional[str] = None
    
    # Error handling
    max_retries: int = 3
    retry_delay: float = 2.0
    
    def get_headers(self) -> dict:
        """Get request headers with User-Agent."""
        return self.headers.copy()