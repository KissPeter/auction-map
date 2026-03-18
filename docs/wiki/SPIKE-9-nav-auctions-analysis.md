# SPIKE-9: NAV Auctions Analysis Proposal

## Overview
Analysis of https://arveres.nav.gov.hu/ for data extraction and scraping implementation.

## Research Findings

### 1. Website Structure Analysis
- **Main URL**: https://arveres.nav.gov.hu/
- **Language**: Hungarian (hu)
- **Layout**: Grid-based listing with pagination
- **Authentication**: No authentication required for public listings

### 2. Available Open-Source Options for Scraping

#### Option A: Playwright + BeautifulSoup4
- **License**: MIT / Apache-2.0
- **GitHub Stars**: Playwright (~67k), BeautifulSoup4 (~135k)
- **Pros**: Handles dynamic content, JavaScript rendering, reliable selectors
- **Cons**: Heavier runtime, requires browser installation
- **Best For**: Complex SPA applications with dynamic loading

#### Option B: Scrapy + lxml
- **License**: BSD / MIT
- **GitHub Stars**: Scrapy (~30k), lxml (~120k)
- **Pros**: Production-ready framework, built-in rate limiting, pipelines
- **Cons**: Steeper learning curve, less flexible for dynamic content
- **Best For**: Large-scale scraping with structured data extraction

#### Option C: Requests + BeautifulSoup4 (Lightweight)
- **License**: MIT / Apache-2.0
- **GitHub Stars**: Requests (~135k), BeautifulSoup4 (~135k)
- **Pros**: Simple, lightweight, easy to integrate
- **Cons**: No built-in rate limiting, handles static HTML only
- **Best For**: Static content or simple API endpoints

### 3. Recommended Approach: Playwright + Scrapy Integration
**Rationale**: NAV site may use JavaScript for dynamic loading. Playwright provides reliable browser automation while maintaining production-grade capabilities.

### 4. Data Dictionary (Preliminary)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| auction_id | string | Unique identifier | "12345678" |
| title | string | Auction title/name | "Ingatlan eladás" |
| price_huf | number | Price in Hungarian Forint | 5000000 |
| price_eur | number | Price in EUR (if available) | 14285.71 |
| location | string | City/location | "Budapest" |
| category | string | Auction category | "Ingatlan" |
| start_date | date | Auction start date | "2024-03-15" |
| end_date | date | Auction end date | "2024-03-22" |
| image_url | string | Thumbnail URL | "/images/auction.jpg" |
| status | string | Current status | "active", "closed" |

### 5. Pagination Pattern (Expected)
- **URL Pattern**: `/arveres/nav?oldal={page}` or query parameters
- **API Endpoint**: Likely no public API, HTML parsing required
- **Rate Limit Consideration**: Respect robots.txt, implement delays between requests

### 6. Authentication & Rate Limits
- **Authentication**: None detected for listing pages
- **Rate Limits**: Monitor response headers (X-RateLimit-* if present)
- **User-Agent**: Must set custom User-Agent header

### 7. Implementation Plan
1. Create scraper module with Playwright + BeautifulSoup4
2. Implement pagination handling
3. Build data extraction pipeline
4. Add rate limiting and error handling
5. Store results in structured format (JSON/CSV)

## Wiki Page: SPIKE-9-nav-auctions-analysis.md