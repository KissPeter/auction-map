"""
Tests for NAV Auctions Extractor

License: MIT
Author: BE Agent
"""

import json
import pytest
from src.scraper.nav_auctions.extractor import NavAuctionExtractor


class TestNavAuctionExtractor:
    """Test suite for NAV auction extractor."""
    
    def test_extractor_initialization(self):
        """Test extractor can be initialized."""
        extractor = NavAuctionExtractor()
        assert extractor is not None
    
    def test_extract_empty_html(self):
        """Test extraction from empty HTML."""
        extractor = NavAuctionExtractor()
        result = extractor.extract("")
        
        assert "status" in result
        assert result["status"] == "pending_analysis"
    
    def test_export_to_json(self):
        """Test JSON export functionality."""
        extractor = NavAuctionExtractor()
        data = [{"auction_id": "123", "title": "Test"}]
        
        json_output = extractor.export_to_json(data)
        parsed = json.loads(json_output)
        
        assert len(parsed) == 1
        assert parsed[0]["auction_id"] == "123"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])