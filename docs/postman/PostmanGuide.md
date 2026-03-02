# Postman API Testing Guide
## Supermarket Management System – Sprint 1

| Field       | Details                                    |
|-------------|--------------------------------------------|
| Base URL    | `http://localhost:5224/api`                |
| HTTPS URL   | `https://localhost:7002/api`               |
| Files       | `SupermarketAPI.postman_collection.json`   |
|             | `SupermarketAPI.postman_environment.json`  |

---

## Prerequisites

1. Backend API is running: `dotnet run` inside `SupermarketAPI/`
2. Postman is installed — download from https://www.postman.com/downloads/
3. Both JSON files are in `docs/postman/`

---

## 1. Import the Collection and Environment

### Step 1 – Import the Collection

1. Open Postman.
2. Click **Import** (top-left, next to "New").
3. Select **Files** tab.
4. Click **Choose Files** and select:
   ```
   docs/postman/SupermarketAPI.postman_collection.json
   ```
5. Click **Import**.

The collection **"Supermarket Management API – Sprint 1"** will appear in the left sidebar under **Collections**.

### Step 2 – Import the Environment

1. Click **Import** again.
2. Select the file:
   ```
   docs/postman/SupermarketAPI.postman_environment.json
   ```
3. Click **Import**.
4. In the top-right dropdown (currently shows "No Environment"), select **"Supermarket API – Local"**.

### Step 3 – Verify Environment Variables

Go to **Environments** (left sidebar) → click **"Supermarket API – Local"** and confirm:

| Variable             | Initial Value                       | Purpose                                    |
|----------------------|-------------------------------------|--------------------------------------------|
| `base_url`           | `http://localhost:5224/api`         | Base URL for all requests                  |
| `product_id`         | `1`                                 | Used by GET/PUT/DELETE by ID (update manually) |
| `new_product_id`     | _(empty)_                           | Auto-filled by POST TC-P01 test script     |
| `test_category`      | `Dairy`                             | Used by GET by Category tests              |
| `low_stock_threshold`| `10`                                | Used by GET Low Stock tests                |

> **Tip:** After running **TC-P01 Create Product**, `new_product_id` is automatically populated.
> All PUT and DELETE tests use `{{new_product_id}}`, so always run POST before PUT/DELETE.

---

## 2. Collection Structure & Request Overview

The collection is organised into 8 numbered folders that match the recommended execution order:

```
Supermarket Management API – Sprint 1
├── 01 – Health Check
│   └── API Reachable
├── 02 – GET /api/products
│   └── TC-G01  Get All Products
├── 03 – GET /api/products/{id}
│   ├── TC-GI01  Get Product by Valid ID
│   ├── TC-GI06  Get Product – Non-Existent ID (404)
│   ├── TC-GI07  Get Product – String ID (400)
│   └── TC-GI08  Get Product – Negative ID (404)
├── 04 – GET /api/products/category/{category}
│   ├── TC-GC01  Get Products by Category
│   └── TC-GC04  Get Products – Non-Existent Category (Empty Array)
├── 05 – GET /api/products/lowstock
│   ├── TC-LS01  Get Low Stock – Default Threshold (10)
│   ├── TC-LS02  Get Low Stock – Custom Threshold (6)
│   ├── TC-LS03  Get Low Stock – Threshold 0 (Empty Array)
│   ├── TC-LS06  Get Low Stock – Negative Threshold (400)
│   └── TC-LS07  Get Low Stock – Non-Integer Threshold (400)
├── 06 – POST /api/products
│   ├── TC-P01   Create Product – Valid (All Fields)        ← auto-sets {{new_product_id}}
│   ├── TC-P02   Create Product – No Image URL
│   ├── TC-P05   Create Product – Name Min Length (2 chars)
│   ├── TC-P07   Create Product – Price at Minimum (0.01)
│   ├── TC-P09   Create Product – Past Expiry Date
│   ├── TC-P11   Create Product – Missing Name (400)
│   ├── TC-P12   Create Product – Name Too Short (400)
│   ├── TC-P17   Create Product – Price Zero (400)
│   ├── TC-P18   Create Product – Negative Price (400)
│   ├── TC-P20   Create Product – Negative Quantity (400)
│   ├── TC-P23   Create Product – Invalid Image URL (400)
│   └── TC-P24   Create Product – Empty Body (400)
├── 07 – PUT /api/products/{id}
│   ├── TC-U01   Update Product – Valid Payload
│   ├── TC-U05   Update Product – Quantity to 0 (isLowStock true)
│   ├── TC-U09   Update Product – Non-Existent ID (404)
│   ├── TC-U10   Update Product – Missing Name (400)
│   ├── TC-U12   Update Product – Price Zero (400)
│   └── TC-U16   Update Product – String ID (400)
└── 08 – DELETE /api/products/{id}
    ├── TC-DEL04  Delete Non-Existent Product (404)
    ├── TC-DEL06  Delete Product – String ID (400)
    ├── TC-DEL01  Delete Product – Valid ID (204)           ← run last in folder
    ├── TC-DEL02  Verify Deleted Product Returns 404
    └── TC-DEL05  Delete Same Product Twice (Second = 404)
```

---

## 3. Run Tests in Bulk (Collection Runner)

### Option A – Postman Collection Runner (GUI)

1. Right-click the collection **"Supermarket Management API – Sprint 1"** in the sidebar.
2. Click **Run collection**.
3. In the **Collection Runner** panel:
   - **Environment:** Select `Supermarket API – Local`
   - **Iterations:** `1`
   - **Delay:** `100` ms (recommended — gives the API a brief pause between requests)
   - **Keep variable values:** ✅ Checked (required — `new_product_id` is passed from POST to PUT/DELETE)
4. Click **Run Supermarket Management API – Sprint 1**.

> The runner executes all requests **top-to-bottom** in folder order.
> Because TC-P01 auto-sets `{{new_product_id}}`, PUT and DELETE requests immediately use the correct new ID.

### Option B – Newman (CLI Runner)

Newman is the command-line equivalent of the Collection Runner. Useful for CI/CD pipelines.

**Install Newman:**
```powershell
npm install -g newman
npm install -g newman-reporter-htmlextra   # for rich HTML reports
```

**Run the full collection:**
```powershell
newman run docs/postman/SupermarketAPI.postman_collection.json `
  --environment docs/postman/SupermarketAPI.postman_environment.json `
  --delay-request 100
```

**Run a single folder only:**
```powershell
newman run docs/postman/SupermarketAPI.postman_collection.json `
  --environment docs/postman/SupermarketAPI.postman_environment.json `
  --folder "06 – POST /api/products" `
  --delay-request 100
```

**Run with additional output options:**
```powershell
newman run docs/postman/SupermarketAPI.postman_collection.json `
  --environment docs/postman/SupermarketAPI.postman_environment.json `
  --delay-request 100 `
  --bail                     # stop on first failure
  --verbose                  # print request/response details
```

---

## 4. Save Test Results

### Option A – Export Results from Collection Runner (GUI)

1. After the run completes, click **Export Results** in the top-right of the runner results view.
2. Save the file as `docs/test-results/postman-run-YYYY-MM-DD.json`.

### Option B – Newman JSON Report

```powershell
newman run docs/postman/SupermarketAPI.postman_collection.json `
  --environment docs/postman/SupermarketAPI.postman_environment.json `
  --delay-request 100 `
  --reporters json `
  --reporter-json-export docs/test-results/newman-report.json
```

### Option C – Newman HTML Report (Recommended for QA sharing)

```powershell
newman run docs/postman/SupermarketAPI.postman_collection.json `
  --environment docs/postman/SupermarketAPI.postman_environment.json `
  --delay-request 100 `
  --reporters htmlextra `
  --reporter-htmlextra-export docs/test-results/newman-report.html `
  --reporter-htmlextra-title "Supermarket API – Sprint 1 Test Results" `
  --reporter-htmlextra-browserTitle "Sprint 1 API Tests"
```

Open `docs/test-results/newman-report.html` in a browser to view a colour-coded pass/fail dashboard.

### Option D – Newman JUnit XML (For CI/CD integration)

```powershell
npm install -g newman-reporter-junitfull

newman run docs/postman/SupermarketAPI.postman_collection.json `
  --environment docs/postman/SupermarketAPI.postman_environment.json `
  --delay-request 100 `
  --reporters junitfull `
  --reporter-junitfull-export docs/test-results/newman-junit.xml
```

JUnit XML can be consumed by Azure DevOps, GitHub Actions, Jenkins, or any CI server.

---

## 5. Interpreting Results

### Collection Runner (GUI)

| Indicator       | Meaning                                |
|-----------------|----------------------------------------|
| Green ✓         | Test assertion passed                  |
| Red ✗           | Test assertion failed                  |
| Status code     | Actual HTTP status returned            |
| Response Time   | Milliseconds — flag anything > 2000 ms |

### Newman CLI Output

```
→ TC-P01 Create Product – Valid (All Fields)
  POST http://localhost:5224/api/products [201 Created, 312ms]
  ✓  TC-P01 Status 201 Created
  ✓  TC-P01 Response has a numeric id
  ✓  TC-P01 Name matches submitted value
  ✓  TC-P01 Price matches submitted value
  ✓  TC-P01 isLowStock false for qty=100
  ✓  TC-P03 Location header present
  ✓  TC-P04 createdAt is set
  ✓  TC-GI03 updatedAt is null on new product
  ✓  Content-Type is JSON                    ← collection-level test

→ TC-P11 Create Product – Missing Name (400)
  POST http://localhost:5224/api/products [400 Bad Request, 45ms]
  ✓  TC-P11 Status 400 for missing name
```

A summary table is printed at the end:

```
┌─────────────────────────┬───────────────────┬───────────────────┐
│                         │          executed │            failed │
├─────────────────────────┼───────────────────┼───────────────────┤
│              iterations │                 1 │                 0 │
│                requests │                35 │                 0 │
│            test-scripts │                35 │                 0 │
│      prerequest-scripts │                 0 │                 0 │
│              assertions │                72 │                 0 │
├─────────────────────────┼───────────────────┼───────────────────┤
│ total run duration: 3.1s│                   │                   │
│ total data received: 8kb│                   │                   │
└─────────────────────────┴───────────────────┴───────────────────┘
```

---

## 6. Recommended Execution Order

Run folders in this sequence to ensure environment variables flow correctly:

```
01 (smoke) → 02 (GET all) → 03 (GET by ID) → 04 (GET by category)
→ 05 (GET lowstock) → 06 POST [TC-P01 first] → 07 PUT → 08 DELETE
```

> **Important:** Within folder 08, run **TC-DEL04** and **TC-DEL06** before **TC-DEL01**.
> `TC-DEL01` deletes `{{new_product_id}}`, making TC-DEL02 and TC-DEL05 only valid after it.

---

## 7. Updating Test Data

To test with a specific existing product, update the environment variable before running:

1. Go to **Environments** → **Supermarket API – Local**.
2. Set `product_id` to the ID of an existing product.
3. Set `test_category` to a category that exists in your DB (e.g. `Dairy`, `Bakery`).
4. Click **Save**.

---

*End of Postman API Testing Guide*
