# Test Summary Report – Sprint 1
## Supermarket Management System

---

| Field              | Details                                    |
|--------------------|--------------------------------------------|
| **Project**        | Supermarket Management System              |
| **Sprint**         | Sprint 1                                   |
| **Report Date**    | YYYY-MM-DD                                 |
| **Sprint Period**  | 2026-03-02 → 2026-03-12                    |
| **Prepared By**    |                                            |
| **Reviewed By**    |                                            |
| **Report Version** | v1.0                                       |
| **Status**         | ☐ Draft   ☐ Final                          |

---

## 1. Executive Summary

### 1.1 Sprint Goal

> Validate Sprint 1 deliverables of the Supermarket Management System — a full-stack CRUD application consisting of an ASP.NET Core Web API backend and a React TypeScript frontend connected to a MySQL 8.0 database.

### 1.2 Summary Statement

```
[Write 3-5 sentences summarising the overall outcome of Sprint 1 testing.
Example template below — replace with actual numbers before finalising.]

Sprint 1 testing covered all planned backend API endpoints and frontend UI features.
A total of [X] test cases were executed across [X] testing days. [X] bugs were found,
of which [X] were critical/high severity. The sprint [MEETS / DOES NOT MEET] the
defined exit criteria. [X] bugs remain open heading into Sprint 2.
```

### 1.3 Sprint 1 Scope

The following features were in scope for Sprint 1 testing:

| # | Feature                            | Backend Endpoint(s)                              | Frontend Page             |
|---|------------------------------------|--------------------------------------------------|---------------------------|
| 1 | List all products                  | `GET /api/products`                              | ProductList (`/`)         |
| 2 | Get product by ID                  | `GET /api/products/{id}`                         | —                         |
| 3 | Get products by category           | `GET /api/products/category/{category}`          | —                         |
| 4 | Get low-stock products             | `GET /api/products/lowstock?threshold={n}`       | ProductList (badge)       |
| 5 | Create a product                   | `POST /api/products`                             | AddProduct (`/add-product`) |
| 6 | Update a product                   | `PUT /api/products/{id}`                         | EditProduct (`/edit-product/:id`) |
| 7 | Delete a product                   | `DELETE /api/products/{id}`                      | ProductList (delete dialog) |

**Out of Scope for Sprint 1:**
- Authentication / Authorization
- User management
- Search / filtering beyond category lookup
- Pagination
- Performance / load testing

---

## 2. Test Coverage

### 2.1 Test Cases Executed

| Area                     | Planned | Executed | Passed | Failed | Skipped | Pass Rate |
|--------------------------|---------|----------|--------|--------|---------|-----------|
| Backend API – GET All    | 8       | 0        | 0      | 0      | 0       | —         |
| Backend API – GET by ID  | 6       | 0        | 0      | 0      | 0       | —         |
| Backend API – GET Category | 7     | 0        | 0      | 0      | 0       | —         |
| Backend API – GET LowStock | 8     | 0        | 0      | 0      | 0       | —         |
| Backend API – POST       | 14      | 0        | 0      | 0      | 0       | —         |
| Backend API – PUT        | 14      | 0        | 0      | 0      | 0       | —         |
| Backend API – DELETE     | 9       | 0        | 0      | 0      | 0       | —         |
| Frontend – Product List  | 18      | 0        | 0      | 0      | 0       | —         |
| Frontend – Add Product   | 26      | 0        | 0      | 0      | 0       | —         |
| Frontend – Edit Product  | 21      | 0        | 0      | 0      | 0       | —         |
| Frontend – Delete        | 13      | 0        | 0      | 0      | 0       | —         |
| Frontend – Integration   | 22      | 0        | 0      | 0      | 0       | —         |
| Selenium E2E             | 7       | 0        | 0      | 0      | 0       | —         |
| **Total**                | **193** | **0**    | **0**  | **0**  | **0**   | **—**     |

### 2.2 Test Coverage by Priority

| Priority    | Total TCs | Executed | Pass Rate |
|-------------|-----------|----------|-----------|
| 🔴 P1 – Critical path | 0 | 0 | — |
| 🟠 P2 – High          | 0 | 0 | — |
| 🟡 P3 – Medium        | 0 | 0 | — |
| 🔵 P4 – Low           | 0 | 0 | — |

### 2.3 Test Coverage by Type

| Test Type                  | Tool Used              | TCs | Executed | Pass Rate |
|----------------------------|------------------------|-----|----------|-----------|
| API – Functional           | Postman                | 83  | 0        | —         |
| UI – Manual                | Chrome (manual)        | 103 | 0        | —         |
| E2E – Automated            | Selenium / Node.js     | 7   | 0        | —         |

### 2.4 Requirements Coverage

| User Story / Requirement            | Test Cases Linked | Status    |
|-------------------------------------|-------------------|-----------|
| US-01: View all products            | TC-G01 to TC-G08, TC-UI-01 to TC-UI-05 | ☐ Covered |
| US-02: Add a new product            | TC-C01 to TC-C14, TC-F01 to TC-F15     | ☐ Covered |
| US-03: Edit an existing product     | TC-U01 to TC-U14, TC-E01 to TC-E12     | ☐ Covered |
| US-04: Delete a product             | TC-D01 to TC-D09, TC-Del01 to TC-Del08 | ☐ Covered |
| US-05: Filter products by category  | TC-Cat01 to TC-Cat07                   | ☐ Covered |
| US-06: View low-stock alerts        | TC-L01 to TC-L08, TC-UI-06 to TC-UI-08 | ☐ Covered |

---

## 3. Bug Statistics

### 3.1 Bugs by Severity

| Severity     | Found | Fixed | Verified | Rejected | Deferred | Still Open |
|--------------|-------|-------|----------|----------|----------|------------|
| 🔴 Critical  | 0     | 0     | 0        | 0        | 0        | 0          |
| 🟠 High      | 0     | 0     | 0        | 0        | 0        | 0          |
| 🟡 Medium    | 0     | 0     | 0        | 0        | 0        | 0          |
| 🔵 Low       | 0     | 0     | 0        | 0        | 0        | 0          |
| **Total**    | **0** | **0** | **0**    | **0**    | **0**    | **0**      |

### 3.2 Bugs by Feature Area

| Feature Area          | Bugs Found | Critical | High | Medium | Low |
|-----------------------|------------|----------|------|--------|-----|
| API – POST            | 0          | 0        | 0    | 0      | 0   |
| API – PUT             | 0          | 0        | 0    | 0      | 0   |
| API – GET             | 0          | 0        | 0    | 0      | 0   |
| API – DELETE          | 0          | 0        | 0    | 0      | 0   |
| UI – Add Product form | 0          | 0        | 0    | 0      | 0   |
| UI – Edit Product     | 0          | 0        | 0    | 0      | 0   |
| UI – Product List     | 0          | 0        | 0    | 0      | 0   |
| UI – Delete dialog    | 0          | 0        | 0    | 0      | 0   |
| E2E / Integration     | 0          | 0        | 0    | 0      | 0   |
| **Total**             | **0**      | **0**    | **0**| **0**  | **0**|

### 3.3 Bugs by Root Cause

| Root Cause Category       | Count | % of Total |
|---------------------------|-------|------------|
| Frontend validation gap   | 0     | 0%         |
| Backend validation gap    | 0     | 0%         |
| State management (React)  | 0     | 0%         |
| Race condition             | 0     | 0%         |
| Data integrity / DB       | 0     | 0%         |
| Error handling / UX       | 0     | 0%         |
| Business logic gap        | 0     | 0%         |
| Other                     | 0     | 0%         |
| **Total**                 | **0** | **100%**   |

### 3.4 Bug List

> List all bugs found during Sprint 1. Reference full details in `docs/bug-report.md`.

| Bug ID  | Summary                             | Severity      | Status          | Found On   | Fixed On   | Verified On |
|---------|-------------------------------------|---------------|-----------------|------------|------------|-------------|
|         |                                     |               |                 |            |            |             |

### 3.5 Defect Density

| Area       | TCs Executed | Bugs Found | Defect Density |
|------------|--------------|------------|----------------|
| Backend API| 0            | 0          | 0 bugs/TC      |
| Frontend UI| 0            | 0          | 0 bugs/TC      |
| Overall    | 0            | 0          | 0 bugs/TC      |

> **Formula**: Defect Density = Total Bugs Found ÷ Total TCs Executed

---

## 4. Risk Assessment

### 4.1 Risks Identified During Sprint 1

| Risk ID | Description                                                         | Likelihood | Impact   | Mitigation                                              |
|---------|---------------------------------------------------------------------|------------|----------|---------------------------------------------------------|
| RSK-01  | MySQL Server not installed/running blocks all API and E2E testing   | Medium     | Critical | Install MySQL Server 8.0, verify port 3306 before testing |
| RSK-02  | Selenium ChromeDriver version mismatch with installed Chrome        | High       | High     | Match chromedriver version in package.json to Chrome version |
| RSK-03  | Backend auto-migration creates schema with undetected data issues   | Low        | High     | Verify all 7 columns exist in Products table after first `dotnet run` |
| RSK-04  | CORS policy restricted to localhost:3000 — fails if frontend runs on different port | Low | Medium | Confirm frontend port before testing; update Program.cs if changed |
| RSK-05  | Duplicate product creation via rapid form submission (race condition) | Medium    | Medium   | Test with Chrome network throttling (Slow 3G) |
| RSK-06  | Open High/Medium bugs carried into Sprint 2 may compound with new features | Medium | High | Resolve all High bugs before Sprint 2 begins |

### 4.2 Issues Blocking Testing

> List anything that prevented or delayed test execution.

| Blocker ID | Description                              | Date Raised | Date Resolved | Impact              |
|------------|------------------------------------------|-------------|---------------|---------------------|
|            |                                          |             |               |                     |

### 4.3 Environment Issues

```
Document any environment problems encountered during the sprint.
Examples:
- MySQL Server was not initially installed — required separate setup
- ChromeDriver version mismatch with installed Chrome version
- Backend failed to start due to missing connection string
- CORS errors during API testing from a different origin
```

---

## 5. Recommendations

### 5.1 Immediate Actions (Before Sprint 2)

> Items that must be resolved before the next sprint begins.

| # | Recommendation                                                                         | Priority   | Owner      |
|---|----------------------------------------------------------------------------------------|------------|------------|
| 1 | Fix all open 🔴 Critical and 🟠 High severity bugs found in Sprint 1                  | Must-have  | Developer  |
| 2 | Verify `updatedAt` timestamp is set correctly on every PUT request                    | Must-have  | Developer  |
| 3 | Add whitespace trimming to frontend name/category validation (ProductForm.tsx)         | Must-have  | Developer  |
| 4 | Disable submit button on first click to prevent duplicate product submissions          | Must-have  | Developer  |
| 5 | Retest all fixed bugs before signing off Sprint 1                                      | Must-have  | QA         |

### 5.2 Short-Term Improvements (Sprint 2)

| # | Recommendation                                                                         | Priority   | Owner      |
|---|----------------------------------------------------------------------------------------|------------|------------|
| 1 | Add server-side validation to reject past expiry dates on POST and PUT                | Should-have| Developer  |
| 2 | Make category search case-insensitive in the repository layer                          | Should-have| Developer  |
| 3 | Standardize error response format across all API endpoints (use ProblemDetails)        | Should-have| Developer  |
| 4 | Handle stale React state after navigation — refresh ProductList after add/edit/delete  | Should-have| Developer  |
| 5 | Show clear "Product not found" page when navigating to `/edit-product/{invalid-id}`    | Should-have| Developer  |
| 6 | Strip empty string `""` from optional fields (imageUrl) before API mapping             | Should-have| Developer  |

### 5.3 Testing Process Improvements

| # | Recommendation                                                                   | Priority   |
|---|----------------------------------------------------------------------------------|------------|
| 1 | Automate Happy Path regression tests via Selenium for each sprint                | High       |
| 2 | Run Postman collection via Newman CLI as part of each build verification         | High       |
| 3 | Add unit tests for `ProductRepository` CRUD methods using an in-memory test DB   | Medium     |
| 4 | Set up a dedicated test database (`SupermarketDB_test`) separate from dev DB     | Medium     |
| 5 | Document Chrome version and chromedriver version pairing in test environment setup | Low      |

---

## 6. Exit Criteria Status

> These criteria were defined in `docs/test-plan-sprint1.md`. Evaluate each before sign-off.

### 6.1 Mandatory Exit Criteria

| #  | Criterion                                                                  | Target     | Actual     | Status        |
|----|----------------------------------------------------------------------------|------------|------------|---------------|
| EC-01 | All planned test cases executed                                         | 193 / 193  | 0 / 193    | ☐ Met  ☐ Not Met |
| EC-02 | All critical-path API test cases (GET all, POST, PUT, DELETE) passed    | 100%       | —          | ☐ Met  ☐ Not Met |
| EC-03 | Zero open 🔴 Critical defects                                           | 0          | 0          | ☐ Met  ☐ Not Met |
| EC-04 | Zero open 🟠 High defects                                               | 0          | 0          | ☐ Met  ☐ Not Met |
| EC-05 | All fixed bugs verified by QA                                           | 100%       | —          | ☐ Met  ☐ Not Met |
| EC-06 | Postman collection run completed with results exported                  | Done       | —          | ☐ Met  ☐ Not Met |
| EC-07 | Selenium E2E suite executed without script-level failures               | 7 / 7      | 0 / 7      | ☐ Met  ☐ Not Met |

### 6.2 Optional / Stretch Exit Criteria

| #  | Criterion                                                              | Target  | Actual | Status        |
|----|------------------------------------------------------------------------|---------|--------|---------------|
| EC-08 | All 🟡 Medium defects have workarounds documented                   | 100%    | —      | ☐ Met  ☐ Not Met |
| EC-09 | Test execution log complete for all 9 sprint days                   | Done    | —      | ☐ Met  ☐ Not Met |
| EC-10 | Defect density is below 0.1 bugs per test case                      | < 0.10  | —      | ☐ Met  ☐ Not Met |

### 6.3 Overall Exit Decision

| Field              | Value                                          |
|--------------------|------------------------------------------------|
| **Decision**       | ☐ PASS — approved to proceed to Sprint 2       |
|                    | ☐ CONDITIONAL PASS — proceed with listed conditions |
|                    | ☐ FAIL — Sprint 1 must be extended             |
| **Conditions**     | _(list any conditions for a Conditional Pass)_ |
| **Justification**  |                                                |

---

## 7. Test Metrics Summary

### 7.1 Execution Trend

> Fill in daily actual numbers from `docs/test-execution-log.md`.

| Day | Date       | TCs Run | Cumulative Run | Cumulative Pass | Cumulative Fail | Bugs Found |
|-----|------------|---------|----------------|-----------------|-----------------|------------|
| 1   | 2026-03-02 | 0       | 0              | 0               | 0               | 0          |
| 2   | 2026-03-03 | 0       | 0              | 0               | 0               | 0          |
| 3   | 2026-03-04 | 0       | 0              | 0               | 0               | 0          |
| 4   | 2026-03-05 | 0       | 0              | 0               | 0               | 0          |
| 5   | 2026-03-06 | 0       | 0              | 0               | 0               | 0          |
| 6   | 2026-03-09 | 0       | 0              | 0               | 0               | 0          |
| 7   | 2026-03-10 | 0       | 0              | 0               | 0               | 0          |
| 8   | 2026-03-11 | 0       | 0              | 0               | 0               | 0          |
| 9   | 2026-03-12 | 0       | 0              | 0               | 0               | 0          |

### 7.2 Final Metrics Snapshot

| Metric                                  | Value |
|-----------------------------------------|-------|
| Total TCs planned                       | 193   |
| Total TCs executed                      | 0     |
| Total TCs passed                        | 0     |
| Total TCs failed                        | 0     |
| Total TCs skipped / not run             | 0     |
| Overall pass rate                       | — %   |
| Total bugs found                        | 0     |
| Bugs fixed and verified                 | 0     |
| Bugs still open end of sprint           | 0     |
| Defect detection rate (bugs/TC)         | —     |
| Testing days used / planned             | 0 / 9 |

---

## 8. Sign-Off

| Role            | Name | Signature | Date       | Decision              |
|-----------------|------|-----------|------------|-----------------------|
| QA Engineer     |      |           | 2026-03-12 | ☐ Approved  ☐ Rejected |
| Lead Developer  |      |           | 2026-03-12 | ☐ Approved  ☐ Rejected |
| Product Owner   |      |           | 2026-03-12 | ☐ Approved  ☐ Rejected |

### Sign-Off Notes

```
Any final comments from each reviewer before the sprint is officially closed.
```

---

## 9. Appendix

### A. Linked Documents

| Document                          | Location                                       |
|-----------------------------------|------------------------------------------------|
| Sprint 1 Test Plan                | `docs/test-plan-sprint1.md`                    |
| API Test Cases (83 TCs)           | `docs/api-test-cases.md`                       |
| Frontend Test Cases (103 TCs)     | `docs/FrontendTestCases.md`                    |
| Daily Test Execution Log          | `docs/test-execution-log.md`                   |
| Bug Report Log                    | `docs/bug-report.md`                           |
| Sample Bug Reports (reference)    | `docs/sample-bug-reports.md`                   |
| Postman Collection                | `docs/postman/SupermarketAPI.postman_collection.json` |
| Postman Environment               | `docs/postman/SupermarketAPI.postman_environment.json` |
| Postman Usage Guide               | `docs/postman/PostmanGuide.md`                 |
| Selenium E2E Test Script          | `tests/selenium/product.test.js`               |

### B. System Under Test Details

| Component       | Technology                          | Version  |
|-----------------|-------------------------------------|----------|
| Backend API     | ASP.NET Core Web API                | .NET 10  |
| ORM             | Entity Framework Core + Pomelo MySQL| 9.0.0    |
| Database        | MySQL Server                        | 8.0.42   |
| Frontend        | React + TypeScript                  | 19 / 5   |
| UI Library      | Material UI (MUI)                   | v6/v7    |
| HTTP Client     | Axios                               | —        |
| Routing         | React Router                        | v7       |
| API Testing     | Postman                             | Latest   |
| E2E Testing     | Selenium WebDriver + ChromeDriver   | 4.27 / 131 |

### C. Test Environment Configuration

| Setting              | Value                                                                 |
|----------------------|-----------------------------------------------------------------------|
| Backend URL (HTTP)   | `http://localhost:5224`                                               |
| Backend URL (HTTPS)  | `https://localhost:7002`                                              |
| Frontend URL         | `http://localhost:3000`                                               |
| Database host        | `localhost:3306`                                                      |
| Database name        | `SupermarketDB`                                                       |
| DB user              | `root`                                                                |
| CORS allowed origin  | `http://localhost:3000`                                               |
| API base path        | `/api/products`                                                       |

---

*End of Test Summary Report – Sprint 1*
