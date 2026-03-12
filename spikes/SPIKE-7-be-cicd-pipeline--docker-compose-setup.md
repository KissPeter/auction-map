# BE: CI/CD Pipeline & Docker Compose Setup

> This document is mirrored from the [wiki page](https://github.com/KissPeter/auction-map/wiki/SPIKE-7-be-cicd-pipeline--docker-compose-setup).
> Discussion happens on this PR. The wiki is the source of truth.



BE Agent: SPIKE proposal ready at wiki page SPIKE-7-ci-cd-pipeline

---

# SPIKE-7: BE: CI/CD Pipeline & Docker Compose Setup

## Problem Statement
We need to establish a robust, reproducible development and testing environment for the FastAPI backend. The current state lacks automated infrastructure for running tests against PostgreSQL, linting code, and collecting artifacts. We must decide on the tooling stack that balances ease of local development (`docker-compose up`) with reliable CI/CD execution (GitHub Actions) while adhering to open-source licensing constraints.

## Options Considered

### Option 1: GitHub Actions + Docker Compose
- **Description:** Use GitHub Actions for CI/CD orchestration and Docker Compose for local development and test isolation. Python dependencies are installed via `pip` inside containers or cached layers.
- **License:** GitHub Actions (Service), Docker (Apache-2.0), Python Ecosystem (MIT/Apache-2.0/BSD).
- **Pros:**
  - **Reproducibility:** Ensures every developer and CI run uses the exact same environment (containers).
  - **Database Isolation:** PostgreSQL runs in a container, preventing local DB state pollution between test runs.
  - **Artifact Collection:** GitHub Actions natively supports uploading artifacts (coverage reports, logs) to the PR tab.
  - **Ecosystem Maturity:** Pre-built Python runners (`actions/setup-python`) and Docker actions are well-maintained with high star counts.
- **Cons:**
  - **Cold Start Time:** Initial `docker-compose up` or CI build can be slower than native installs (mitigated by caching).

### Option 2: Native Python Environments + Makefile
- **Description:** Use `pyenv` or virtual environments for local development and a Makefile to orchestrate test execution without Docker containers.
- **License:** MIT/Apache-2.0 (Python, pytest, etc.).
- **Pros:**
  - **Faster Iteration:** No container overhead for local dev.
  - **Simpler Debugging:** Direct access to system tools if needed.
- **Cons:**
  - **Dependency Hell:** Different developers may have different Python versions or library states.
  - **DB Complexity:** Running PostgreSQL locally requires manual setup, versioning, and data persistence management (e.g., `pg_dump` vs Docker volumes).
  - **CI Friction:** Requires complex CI steps to install system dependencies for DB drivers without containerization.

### Option 3: Self-Hosted Jenkins + Native Python
- **Description:** Use a self-hosted Jenkins server for CI and native Python environments for dev.
- **License:** Apache-2.0 (Jenkins).
- **Pros:**
  - **Full Control:** Complete control over pipeline logic.
- **Cons:**
  - **Maintenance Overhead:** Requires dedicated infrastructure management, security patching, and scaling.
  - **Complexity:** Higher barrier to entry for new contributors compared to GitHub Actions.
  - **Licensing Risk:** Jenkins plugins can sometimes introduce non-permissive licenses (though core is Apache-2.0).

## Recommendation
**Option 1: GitHub Actions + Docker Compose**

This option aligns best with the project constraints and technical context:
1.  **Open Source Compliance:** All core components (Docker, Python, pytest, ruff, black) are MIT/Apache-2.0 licensed.
2.  **Integration:** It supports the existing Playwright/pytest strategy by allowing test execution in a clean containerized environment.
3.  **Artifact Handling:** GitHub Actions provides native artifact storage for coverage reports and logs without extra plugins.
4.  **Local Dev Experience:** `docker-compose up` satisfies the requirement to start the system in a single command, ensuring parity between local and CI environments.

## Decision
**Awaiting human approval (label: spike-approved)**

Once approved, we will proceed with implementation using the following stack:
-   **CI:** GitHub Actions (`actions/setup-python`, `docker/build-push-action`)
-   **Local Dev:** Docker Compose (`docker-compose.yml` for API + Postgres)
-   **Linting/Type:** `ruff`, `mypy`, `black` (all MIT/Apache-2.0)
-   **Testing:** `pytest`, `pytest-cov` (MIT)

**Next Steps:**
1.  Add label "spike-approved" to issue #7.
2.  Create branch `feat/issue-7-ci-cd-pipeline`.
3.  Implement `docker-compose.yml`, `.env.example`, and GitHub Actions workflow files.