# SPIKE: QA Technical Stack & Testing Strategy

> This document is mirrored from the [wiki page](https://github.com/KissPeter/auction-map/wiki/SPIKE-6-spike-qa-technical-stack--testing-strategy).
> Discussion happens on this PR. The wiki is the source of truth.



# SPIKE-6: QA Technical Stack & Testing Strategy

## Problem Statement
We need to finalize the QA testing stack beyond Playwright + pytest. The team needs alignment on test organization, mocking strategies, CI/CD integration, and performance testing approach before implementation begins. Specifically, we must ensure all tools are open-source (MIT/Apache-2.0/BSD), support parallel execution, handle scraping-specific flakiness, and integrate with Docker Compose for local development.

## Options Considered

### Test Organization & Structure
**Option 1: Pytest Plugins + `conftest` Hierarchy**
- **License:** MIT (Pytest ecosystem)
- **Pros:** Standardized structure (`e2e/`, `unit/`, `integration/`), easy parallel execution via `-n auto`, centralized fixtures in `conftest.py`.
- **Cons:** Requires discipline to maintain separation of concerns.

**Option 2: JUnit XML Reports + Separate Test Suites**
- **License:** MIT (JUnit)
- **Pros:** Standard reporting format for CI.
- **Cons:** Overhead of managing multiple test runners; less flexible than Pytest fixtures.

### Mocking Strategies
**Option 1: `responses` + `pytest-httpx`**
- **License:** BSD / Apache-2.0
- **Pros:** Lightweight HTTP mocking, integrates seamlessly with Playwright/Pytest, no external dependencies required for basic API mocking.
- **Cons:** Limited to HTTP mocking; does not mock DB or complex services directly.

**Option 2: `testcontainers-python`**
- **License:** Apache-2.0
- **Pros:** Spin up real Docker containers (Postgres, Redis, etc.) for integration tests, ensures environment parity with CI.
- **Cons:** Requires Docker to be running locally/CI; heavier setup time.

### Performance Testing
**Option 1: k6**
- **License:** Apache-2.0
- **Pros:** High performance (C++ core), excellent parallelism, native support for thresholds and assertions, easy CI integration via CLI.
- **Cons:** Requires learning Go/JS syntax for scripts (though Python bindings exist).

**Option 2: Locust**
- **License:** MIT
- **Pros:** Python-based scripting, easier for Python devs to read/write.
- **Cons:** Slower execution speed compared to k6; heavier memory footprint.

### Visual Regression
**Option 1: Percy (Self-hosted CLI)**
- **License:** MIT
- **Pros:** Industry standard, handles diffs automatically, supports Playwright integration.
- **Cons:** Requires self-hosting server for full feature set (or SaaS).

**Option 2: Playwright Built-in Snapshots**
- **License:** Apache-2.0
- **Pros:** Native to Playwright, no extra dependencies.
- **Cons:** Manual diff review required; less robust for large-scale UI changes.

### Test Data Management
**Option 1: `pytest-docker` + Mocking**
- **License:** MIT
- **Pros:** Spin up ephemeral databases per test run, cleanup automatically on teardown.
- **Cons:** Requires Docker Compose setup.

**Option 2: Static JSON Fixtures**
- **License:** MIT
- **Pros:** Fastest execution, no external dependencies.
- **Cons:** Hard to maintain for complex scraping sources (NAV, EER, MNV).

## Recommendation

### Core Stack
1.  **Test Framework:** `pytest` + `playwright` (Existing)
2.  **HTTP Mocking:** `responses` (BSD License) - Lightweight and sufficient for API mocking.
3.  **Service Mocking:** `testcontainers-python` (Apache-2.0) - For DB/Backend service integration tests.
4.  **Performance:** `k6` (Apache-2.0) - Superior performance and parallelism compared to Locust.
5.  **Visual Regression:** `percy-cli` (MIT) - Best-in-class diffing, self-hostable.
6.  **Flaky Test Handling:** `pytest-rerunfailures` (BSD) - To handle scraping/network flakiness automatically.

### Rationale
- **Open Source Compliance:** All selected tools use MIT or Apache-2.0 licenses, ensuring no legal blockers.
- **Parallelism:** Pytest's `-n auto` combined with `k6`'s multi-threading ensures fast CI runs.
- **Scraping Support:** `responses` allows mocking external scraping targets (NAV/EER/MNV) to prevent flakiness from upstream changes, while `pytest-rerunfailures` handles transient network issues.
- **CI/CD Ready:** All tools have robust CLI interfaces for GitHub Actions integration.

## Decision
**Awaiting human approval (label: spike-approved)**

---

### Implementation Patterns

#### Example `conftest.py` for Test Data & Fixtures
```python
# conftest.py
import pytest
from responses import RequestsMock
from testcontainers.postgres import PostgresContainer

@pytest.fixture(scope="session")
def mock_responses():
    with RequestsMock() as rsps:
        # Mock external scraping source (NAV)
        rsps.get("https://nav.example.com/api/data").json({"id": 1, "name": "Test"})
        yield rsps

@pytest.fixture(scope="function")
def db_container():
    with PostgresContainer("postgres:15").with_exposed_ports(5432) as container:
        container.start()
        yield container.get_connection_url()
        container.stop()
```

#### Example CI/CD Workflow (`.github/workflows/ci.yml`)
```yaml
name: QA Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      - name: Install Dependencies
        run: pip install -r requirements.txt
      - name: Run Pytest (Parallel)
        run: pytest -n auto --cov=src --cov-report=xml
      - name: Run Performance Tests (k6)
        run: k6 run scripts/perf.js
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

#### Performance Testing Guidelines
- **Thresholds:** Define latency p95 < 200ms for API endpoints.
- **Concurrency:** Start with 10 VUs, scale to 50 based on load test results.
- **Trigger:** Run performance tests only on PRs touching core scraper modules or backend APIs.

#### Visual Regression Priority
- **High Priority:** Core dashboard and data tables (NAV/EER/MNV views).
- **Medium Priority:** Admin panels.
- **Low Priority:** Utility pages.