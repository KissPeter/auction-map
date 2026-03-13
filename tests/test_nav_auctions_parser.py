"""
Tests for NAV Auctions Parser

License: MIT
Author: BE Agent
"""

import pytest
from src.scraper.nav_auctions.parser import NavAuctionParser


class TestNavAuctionParser:
    """Test suite for NAV auction parser."""
    
    def test_parser_initialization(self):
        """Test parser can be initialized."""
        parser = NavAuctionParser()
        assert parser is not None
    
    def test_data_dictionary(self):
        """Test data dictionary returns expected fields."""
        parser = NavAuctionParser()
        dict_fields = parser.extract_data_dictionary()
        
        expected_fields = [
            "auction_id",
            "title",
            "price_huf",
            "location",
            "category",
            "start_date",
            "end_date",
            "image_url",
            "status",
        ]
        
        for field in expected_fields:
            assert field in dict_fields, f"Missing field: {field}"
    
    def test_empty_html_parsing(self):
        """Test parsing empty HTML content."""
        parser = NavAuctionParser()
        result = parser.parse("")
        assert isinstance(result, list)
        assert len(result) == 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])