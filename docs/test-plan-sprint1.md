# Test Plan – Sprint 1
## Supermarket Management System

| Field          | Details                          |
|----------------|----------------------------------|
| Version        | 1.0                              |
| Sprint         | Sprint 1                         |
| Prepared by    | QA Engineer                      |
| Date           | 2026-03-02                       |
| Status         | Draft                            |

---

## Table of Contents
1. [Test Objectives](#1-test-objectives)
2. [Test Scope](#2-test-scope)
3. [Test Environment](#3-test-environment)
4. [Test Schedule](#4-test-schedule)
5. [Test Deliverables](#5-test-deliverables)
6. [Entry / Exit Criteria](#6-entry--exit-criteria)
7. [Test Cases](#7-test-cases)
8. [Risk & Mitigation](#8-risk--mitigation)

---

## 1. Test Objectives

- Verify that all Product CRUD operations exposed by the backend API behave correctly and return appropriate HTTP responses.
- Confirm that the Product List page renders data fetched from the API accurately.
- Validate that the Add Product form submits valid data, handles validation errors, and provides user feedback.
- Ensure the Edit Product form pre-populates existing data, accepts updates, and reflects changes correctly.
- Assert that the Delete Product flow prompts for confirmation and removes the record from both the UI and the database.
- Identify defects early in the sprint before code is merged to the main branch.
- Establish a regression baseline for future sprints.

---

## 2. Test Scope

### 2.1 In Scope

| Area                  | Feature                                 | Type                          |
|-----------------------|-----------------------------------------|-------------------------------|
| Backend API           | GET /api/products                       | Functional, Contract          |
| Backend API           | GET /api/products/{id}                  | Functional, Contract          |
| Backend API           | POST /api/products                      | Functional, Validation        |
| Backend API           | PUT /api/products/{id}                  | Functional, Validation        |
| Backend API           | DELETE /api/products/{id}               | Functional                    |
| Backend API           | Request / Response DTO mapping          | Contract                      |
| Backend API           | HTTP status codes (200/201/400/404/500) | Functional                    |
| Frontend              | Product List page – render & pagination | Functional, UI                |
| Frontend              | Add Product form – happy path           | Functional, UI                |
| Frontend              | Add Product form – validation errors    | Functional, UI                |
| Frontend              | Edit Product form – pre-populate data   | Functional, UI                |
| Frontend              | Edit Product form – save changes        | Functional, UI                |
| Frontend              | Delete Product – confirmation dialog    | Functional, UI                |
| Frontend              | Delete Product – item removed from list | Functional, UI                |
| Integration           | Frontend → Backend API data flow        | Integration                   |

### 2.2 Out of Scope

- Authentication & authorisation (not implemented in Sprint 1)
- Performance / load testing
- Mobile responsiveness
- Accessibility (WCAG) compliance
- Payment or inventory management features
- Database backup / restore procedures

---

## 3. Test Environment

### 3.1 Software

| Component         | Technology              | Version    |
|-------------------|-------------------------|------------|
| Backend Framework | ASP.NET Core Web API    | .NET 10.0  |
| ORM               | Entity Framework Core   | Latest     |
| Database          | SQL Server / SQLite      | Latest     |
| Frontend          | React + TypeScript      | Node 20+   |
| Browser           | Google Chrome           | Latest     |
| API Testing       | Postman                 | Latest     |
| Unit Test (BE)    | xUnit + Moq             | Latest     |
| Unit Test (FE)    | React Testing Library   | Latest     |
| E2E Testing       | Selenium WebDriver      | Latest     |

### 3.2 Hardware / Infrastructure

| Resource          | Details                               |
|-------------------|---------------------------------------|
| Developer Machine | Windows 11, 16 GB RAM, i7/Ryzen 5+    |
| Backend URL       | https://localhost:7xxx / http://localhost:5xxx |
| Frontend URL      | http://localhost:3000                 |
| Database          | Local instance                        |

### 3.3 Setup Checklist

- [ ] `dotnet restore` completed successfully in `SupermarketAPI/`
- [ ] `dotnet run` starts API without errors
- [ ] `npm install` completed in `frontend/`
- [ ] `npm start` serves app on http://localhost:3000
- [ ] Database migrations applied (`dotnet ef database update`)
- [ ] Postman collection imported
- [ ] Chrome + ChromeDriver versions match (for Selenium)

---

## 4. Test Schedule

| Phase                      | Activity                                      | Start      | End        | Owner       |
|----------------------------|-----------------------------------------------|------------|------------|-------------|
| Planning                   | Review requirements, finalise test plan       | 2026-03-02 | 2026-03-03 | QA Engineer |
| Environment Setup          | Configure local env, seed test data           | 2026-03-03 | 2026-03-04 | QA Engineer |
| Backend API Testing        | Execute Postman + xUnit tests                 | 2026-03-04 | 2026-03-06 | QA Engineer |
| Frontend Unit Testing      | Execute React Testing Library tests           | 2026-03-06 | 2026-03-08 | QA Engineer |
| Integration Testing        | Frontend ↔ API end-to-end flows               | 2026-03-09 | 2026-03-10 | QA Engineer |
| Regression Testing         | Re-test after bug fixes                       | 2026-03-11 | 2026-03-12 | QA Engineer |
| Test Closure               | Summary report, sign-off                      | 2026-03-12 | 2026-03-12 | QA Engineer |

---

## 5. Test Deliverables

| Deliverable                        | Format        | Due Date   |
|------------------------------------|---------------|------------|
| Test Plan (this document)          | Markdown      | 2026-03-03 |
| Postman Collection                 | JSON export   | 2026-03-04 |
| Backend xUnit Test Project         | C# project    | 2026-03-06 |
| Frontend RTL Test Suite            | .test.tsx     | 2026-03-08 |
| Selenium E2E Test Scripts          | .ts / .js     | 2026-03-10 |
| Bug Report Log                     | Markdown / CSV| Ongoing    |
| Test Summary / Closure Report      | Markdown      | 2026-03-12 |

---

## 6. Entry / Exit Criteria

### 6.1 Entry Criteria

All of the following must be true before testing begins:

- [ ] Sprint 1 user stories are marked **Development Complete** by the dev team.
- [ ] Backend API is deployed to local test environment and returns a 200 on `GET /api/products`.
- [ ] Frontend app builds without errors (`npm run build` exits 0).
- [ ] Test data seed script is prepared (at least 5 sample products).
- [ ] This test plan has been reviewed and approved.
- [ ] Postman collection covers all 5 CRUD endpoints.

### 6.2 Exit Criteria

Testing is complete and the sprint can be signed off when:

- [ ] 100 % of **critical** and **high** priority test cases have been executed.
- [ ] 0 open **Critical** defects.
- [ ] 0 open **High** defects.
- [ ] ≤ 2 open **Medium** defects (with accepted workaround documented).
- [ ] All originally failing tests that were fixed have been retested and passed.
- [ ] Test Summary Report has been submitted and accepted by the Product Owner.

---

## 7. Test Cases

### 7.1 Backend API – Product CRUD

| TC ID   | Title                                    | Method | Endpoint                  | Input / Precondition                                    | Expected Result                                  | Priority |
|---------|------------------------------------------|--------|---------------------------|---------------------------------------------------------|--------------------------------------------------|----------|
| TC-B01  | Get all products – success               | GET    | /api/products             | At least 1 product in DB                               | 200 OK, JSON array of products                   | High     |
| TC-B02  | Get all products – empty list            | GET    | /api/products             | No products in DB                                       | 200 OK, empty array `[]`                         | Medium   |
| TC-B03  | Get product by valid ID                  | GET    | /api/products/{id}        | Product with `id` exists                               | 200 OK, correct product object                   | High     |
| TC-B04  | Get product by invalid ID                | GET    | /api/products/99999       | Product does not exist                                  | 404 Not Found                                    | High     |
| TC-B05  | Create product – valid payload           | POST   | /api/products             | Valid `CreateProductDto` JSON body                     | 201 Created, response body contains new product  | Critical |
| TC-B06  | Create product – missing required fields | POST   | /api/products             | Empty body / missing `Name`                            | 400 Bad Request, validation error details        | High     |
| TC-B07  | Create product – negative price          | POST   | /api/products             | `Price: -5`                                            | 400 Bad Request                                  | High     |
| TC-B08  | Update product – valid payload           | PUT    | /api/products/{id}        | Existing product ID, valid `UpdateProductDto`          | 200 OK, updated product returned                 | Critical |
| TC-B09  | Update product – non-existent ID         | PUT    | /api/products/99999       | Non-existent ID                                        | 404 Not Found                                    | High     |
| TC-B10  | Update product – invalid payload         | PUT    | /api/products/{id}        | Empty name or negative stock                           | 400 Bad Request                                  | High     |
| TC-B11  | Delete product – valid ID                | DELETE | /api/products/{id}        | Existing product ID                                    | 204 No Content, product no longer in GET list    | Critical |
| TC-B12  | Delete product – non-existent ID         | DELETE | /api/products/99999       | Non-existent ID                                        | 404 Not Found                                    | High     |
| TC-B13  | Response DTO field mapping               | GET    | /api/products/{id}        | Product exists                                         | Response includes `id`, `name`, `price`, `stock` | Medium   |

---

### 7.2 Frontend – Product List Page

| TC ID   | Title                                    | Precondition                   | Steps                                           | Expected Result                                         | Priority |
|---------|------------------------------------------|--------------------------------|-------------------------------------------------|---------------------------------------------------------|----------|
| TC-F01  | Page renders product list                | API returns ≥ 1 product        | Navigate to `/`                                 | Product names, prices, and stock are visible            | Critical |
| TC-F02  | Empty state message shown                | API returns `[]`               | Navigate to `/`                                 | "No products found" (or equivalent) message displayed  | Medium   |
| TC-F03  | Loading indicator shown during fetch     | Slow network / API delay       | Navigate to `/`                                 | Spinner or "Loading…" text appears before data loads   | Medium   |
| TC-F04  | API error – error message shown          | API returns 500                | Navigate to `/`                                 | User-friendly error message displayed                  | High     |
| TC-F05  | Edit button navigates to edit page       | Product list loaded            | Click **Edit** on row 1                         | Navigates to `/edit/{id}`                              | High     |
| TC-F06  | Add Product button navigates to add page | Product list loaded            | Click **Add Product**                           | Navigates to `/add`                                    | High     |
| TC-F07  | Delete button triggers confirmation      | Product list loaded            | Click **Delete** on row 1                       | Confirmation dialog / prompt appears                   | High     |

---

### 7.3 Frontend – Add Product Form

| TC ID   | Title                                    | Precondition                   | Steps                                                        | Expected Result                                         | Priority |
|---------|------------------------------------------|--------------------------------|--------------------------------------------------------------|---------------------------------------------------------|----------|
| TC-A01  | Form renders all required fields         | Navigate to `/add`             | Observe form                                                 | Name, Price, Stock, Category fields visible             | High     |
| TC-A02  | Submit valid product                     | Form is open                   | Fill valid data, click **Save**                              | POST to API, redirect to list, new product appears      | Critical |
| TC-A03  | Submit with empty Name                   | Form is open                   | Leave Name blank, click **Save**                             | Validation error "Name is required" shown               | High     |
| TC-A04  | Submit with negative Price               | Form is open                   | Enter `-10` in Price, click **Save**                         | Validation error for invalid price                     | High     |
| TC-A05  | Submit with non-numeric Price            | Form is open                   | Enter `abc` in Price                                         | Validation error or input rejected                     | Medium   |
| TC-A06  | Cancel navigates back to list            | Form is open                   | Click **Cancel**                                             | Redirects to `/` without saving                        | Medium   |
| TC-A07  | API error shown on submit failure        | API returns 500                | Fill valid data, click **Save**                              | User-friendly error message displayed                  | High     |

---

### 7.4 Frontend – Edit Product Form

| TC ID   | Title                                    | Precondition                   | Steps                                                        | Expected Result                                         | Priority |
|---------|------------------------------------------|--------------------------------|--------------------------------------------------------------|---------------------------------------------------------|----------|
| TC-E01  | Form pre-populates existing data         | Navigate to `/edit/{id}`       | Observe form fields                                          | Fields populated with current product values            | Critical |
| TC-E02  | Update product – valid changes           | Form pre-populated             | Change Name, click **Save**                                  | PUT to API, redirect to list, updated name shown        | Critical |
| TC-E03  | Submit with empty Name                   | Form pre-populated             | Clear Name field, click **Save**                             | Validation error "Name is required"                    | High     |
| TC-E04  | Invalid product ID in URL                | Navigate to `/edit/99999`      | Observe page                                                 | 404 message or redirect to list                        | High     |
| TC-E05  | Cancel navigates back without saving     | Form pre-populated             | Modify fields, click **Cancel**                              | Redirects to `/`, original values unchanged            | Medium   |

---

### 7.5 Frontend – Delete Product

| TC ID   | Title                                    | Precondition                   | Steps                                                        | Expected Result                                         | Priority |
|---------|------------------------------------------|--------------------------------|--------------------------------------------------------------|---------------------------------------------------------|----------|
| TC-D01  | Confirm delete removes product           | Product list loaded            | Click **Delete** → confirm                                   | DELETE to API, product removed from list                | Critical |
| TC-D02  | Cancel delete keeps product              | Product list loaded            | Click **Delete** → cancel/dismiss                            | Product remains in list, no API call made              | High     |
| TC-D03  | API error on delete shows message        | API returns 500 on DELETE      | Click **Delete** → confirm                                   | Error message shown, product still in list             | High     |

---

## 8. Risk & Mitigation

| Risk                                         | Likelihood | Impact | Mitigation                                                    |
|----------------------------------------------|------------|--------|---------------------------------------------------------------|
| API not ready when FE testing starts         | Medium     | High   | Use `msw` (Mock Service Worker) to mock API responses in RTL |
| ChromeDriver version mismatch for Selenium   | Medium     | Medium | Pin `chromedriver` version in `package.json`                 |
| DB migration failures on fresh environment  | Low        | High   | Document migration steps; use seed script                    |
| Flaky async tests in React Testing Library  | Medium     | Medium | Use `waitFor` / `findBy*` queries consistently               |
| Scope creep from new Sprint 1 features      | Low        | Medium | Freeze scope at sprint start; log new items for Sprint 2     |

---

*End of Test Plan – Sprint 1*
