# API Test Cases – Backend Endpoints
## Supermarket Management System

| Field         | Details                          |
|---------------|----------------------------------|
| Version       | 1.0                              |
| Sprint        | Sprint 1                         |
| Prepared by   | QA Engineer                      |
| Date          | 2026-03-02                       |
| Base URL      | `https://localhost:<port>/api`   |

---

## Model Reference

### Request Body (POST / PUT)

| Field        | Type     | Required | Constraints                              |
|--------------|----------|----------|------------------------------------------|
| `name`       | string   | Yes      | Min 2 chars, Max 100 chars               |
| `category`   | string   | Yes      | Max 50 chars                             |
| `price`      | decimal  | Yes      | Min `0.01`                               |
| `quantity`   | int      | Yes      | Min `0`                                  |
| `expiryDate` | DateTime | Yes      | ISO 8601 string                          |
| `imageUrl`   | string   | No       | Must be a valid URL if provided          |

### Response Body (GET / POST / PUT)

| Field        | Type      | Notes                                       |
|--------------|-----------|---------------------------------------------|
| `id`         | int       | Auto-generated                              |
| `name`       | string    |                                             |
| `category`   | string    |                                             |
| `price`      | decimal   |                                             |
| `quantity`   | int       |                                             |
| `expiryDate` | DateTime  |                                             |
| `imageUrl`   | string?   | Null if not provided                        |
| `createdAt`  | DateTime  | Set on create                               |
| `updatedAt`  | DateTime? | Set on update, null on first create         |
| `isLowStock` | bool      | `true` when `quantity < 10`                 |
| `isExpired`  | bool      | `true` when `expiryDate < DateTime.UtcNow`  |

---

## Seed Test Data

Use the following products as pre-existing data before executing test cases that require existing records.

```json
[
  {
    "id": 1,
    "name": "Whole Milk",
    "category": "Dairy",
    "price": 1.99,
    "quantity": 50,
    "expiryDate": "2026-04-01T00:00:00Z",
    "imageUrl": "https://example.com/milk.jpg"
  },
  {
    "id": 2,
    "name": "White Bread",
    "category": "Bakery",
    "price": 2.49,
    "quantity": 5,
    "expiryDate": "2026-03-05T00:00:00Z",
    "imageUrl": null
  },
  {
    "id": 3,
    "name": "Cheddar Cheese",
    "category": "Dairy",
    "price": 4.99,
    "quantity": 8,
    "expiryDate": "2026-05-15T00:00:00Z",
    "imageUrl": null
  },
  {
    "id": 4,
    "name": "Expired Yogurt",
    "category": "Dairy",
    "price": 0.99,
    "quantity": 3,
    "expiryDate": "2025-01-01T00:00:00Z",
    "imageUrl": null
  }
]
```

---

## 1. GET /api/products

> Returns all products in the database.
> **Expected status codes:** `200 OK` | `500 Internal Server Error`

---

| TC ID  | Description                        | Precondition           | Test Data / Request                   | Expected Status | Expected Response Body                                              | Actual Result | Status |
|--------|------------------------------------|------------------------|---------------------------------------|-----------------|---------------------------------------------------------------------|---------------|--------|
| TC-G01 | Retrieve all products – list       | ≥ 1 product seeded     | `GET /api/products`                   | `200 OK`        | JSON array; each object has `id`, `name`, `category`, `price`, `quantity`, `expiryDate`, `createdAt`, `isLowStock`, `isExpired` | | |
| TC-G02 | Retrieve all products – empty DB   | No products in DB      | `GET /api/products`                   | `200 OK`        | `[]`                                                                | | |
| TC-G03 | Response includes computed fields  | Seed data loaded       | `GET /api/products`                   | `200 OK`        | Product with `quantity=5` has `"isLowStock": true`; product with past `expiryDate` has `"isExpired": true` | | |
| TC-G04 | `isLowStock` false when qty ≥ 10   | Product with qty=50 exists | `GET /api/products`               | `200 OK`        | "Whole Milk" has `"isLowStock": false`                             | | |
| TC-G05 | `isExpired` false for future date  | Product with future expiry exists | `GET /api/products`          | `200 OK`        | "Whole Milk" has `"isExpired": false`                              | | |

---

## 2. GET /api/products/{id}

> Returns a single product by integer ID.
> **Expected status codes:** `200 OK` | `404 Not Found` | `400 Bad Request` | `500 Internal Server Error`

---

| TC ID   | Description                              | Precondition         | Test Data / Request                     | Expected Status   | Expected Response Body                                        | Actual Result | Status |
|---------|------------------------------------------|----------------------|-----------------------------------------|-------------------|---------------------------------------------------------------|---------------|--------|
| TC-GI01 | Get existing product by ID               | Product id=1 exists  | `GET /api/products/1`                   | `200 OK`          | Object with `"id": 1`, correct name/category/price/quantity   | | |
| TC-GI02 | Get product – all fields present         | Product id=1 exists  | `GET /api/products/1`                   | `200 OK`          | Response contains: `id`, `name`, `category`, `price`, `quantity`, `expiryDate`, `imageUrl`, `createdAt`, `updatedAt`, `isLowStock`, `isExpired` | | |
| TC-GI03 | `updatedAt` is null on newly created product | Product just created | `GET /api/products/{newId}`           | `200 OK`          | `"updatedAt": null`                                           | | |
| TC-GI04 | Get product with `imageUrl` set          | Product id=1 exists  | `GET /api/products/1`                   | `200 OK`          | `"imageUrl": "https://example.com/milk.jpg"`                  | | |
| TC-GI05 | Get product with null `imageUrl`         | Product id=2 exists  | `GET /api/products/2`                   | `200 OK`          | `"imageUrl": null`                                            | | |
| TC-GI06 | Get product by non-existent ID           | No product with id=99999 | `GET /api/products/99999`           | `404 Not Found`   | Empty body or standard 404 problem details                    | | |
| TC-GI07 | Get product – string ID (route type mismatch) | Any            | `GET /api/products/abc`                 | `400 Bad Request` | Route constraint `{id:int}` rejects non-integer               | | |
| TC-GI08 | Get product – negative ID                | No product with id=-1 | `GET /api/products/-1`               | `404 Not Found`   | Route accepts negative int; repository returns null → 404     | | |
| TC-GI09 | Get product – zero ID                    | No product with id=0 | `GET /api/products/0`                | `404 Not Found`   | Repository returns null → 404                                 | | |
| TC-GI10 | `isLowStock` true when `quantity < 10`   | Product id=2 exists (qty=5) | `GET /api/products/2`          | `200 OK`          | `"isLowStock": true`                                          | | |
| TC-GI11 | `isExpired` true for past `expiryDate`   | Product id=4 exists  | `GET /api/products/4`                   | `200 OK`          | `"isExpired": true`                                           | | |

---

## 3. GET /api/products/category/{category}

> Returns products filtered by category (case handled by repository).
> **Expected status codes:** `200 OK` | `500 Internal Server Error`

---

| TC ID   | Description                                  | Precondition             | Test Data / Request                              | Expected Status | Expected Response Body                                           | Actual Result | Status |
|---------|----------------------------------------------|--------------------------|--------------------------------------------------|-----------------|------------------------------------------------------------------|---------------|--------|
| TC-GC01 | Get products by existing category            | Dairy products seeded    | `GET /api/products/category/Dairy`               | `200 OK`        | Array containing "Whole Milk", "Cheddar Cheese", "Expired Yogurt" | | |
| TC-GC02 | Response only contains matching category     | Seed data loaded         | `GET /api/products/category/Dairy`               | `200 OK`        | No products with `category` other than "Dairy" in response      | | |
| TC-GC03 | Get products by category with single result  | "Bakery" has 1 product   | `GET /api/products/category/Bakery`              | `200 OK`        | Array with 1 item: "White Bread"                                 | | |
| TC-GC04 | Get products by non-existent category        | No "Electronics" products | `GET /api/products/category/Electronics`        | `200 OK`        | `[]` (empty array, not 404)                                      | | |
| TC-GC05 | Category matching – URL-encoded spaces       | Category "Fresh Produce" exists | `GET /api/products/category/Fresh%20Produce` | `200 OK`      | Products in "Fresh Produce" returned                             | | |
| TC-GC06 | Category – single character value            | Any data                 | `GET /api/products/category/A`                   | `200 OK`        | Empty array or matching products (no validation on category filter) | | |
| TC-GC07 | All returned items have correct `category`   | Seed data loaded         | `GET /api/products/category/Dairy`               | `200 OK`        | Every object in array has `"category": "Dairy"`                  | | |

---

## 4. GET /api/products/lowstock

> Returns products below a stock threshold (default = 10).
> Query parameter: `threshold` (int, optional, default 10).
> **Expected status codes:** `200 OK` | `400 Bad Request` | `500 Internal Server Error`

---

| TC ID   | Description                                     | Precondition          | Test Data / Request                                     | Expected Status   | Expected Response Body                                               | Actual Result | Status |
|---------|-------------------------------------------------|-----------------------|---------------------------------------------------------|-------------------|----------------------------------------------------------------------|---------------|--------|
| TC-LS01 | Default threshold (10) returns low-stock items  | Seed data loaded      | `GET /api/products/lowstock`                            | `200 OK`          | Array with products with `quantity < 10`: White Bread (5), Cheddar Cheese (8), Expired Yogurt (3) | | |
| TC-LS02 | Custom threshold returns correct items          | Seed data loaded      | `GET /api/products/lowstock?threshold=6`                | `200 OK`          | Products with `quantity < 6`: White Bread (5), Expired Yogurt (3)   | | |
| TC-LS03 | Threshold = 0 returns no items (none < 0)       | Seed data loaded      | `GET /api/products/lowstock?threshold=0`                | `200 OK`          | `[]`                                                                 | | |
| TC-LS04 | Threshold = 1                                   | Seed data loaded      | `GET /api/products/lowstock?threshold=1`                | `200 OK`          | `[]` (no product has quantity 0)                                     | | |
| TC-LS05 | Threshold high enough to include all products   | Seed data loaded      | `GET /api/products/lowstock?threshold=100`              | `200 OK`          | All 4 seeded products returned                                       | | |
| TC-LS06 | Negative threshold rejected                     | Any                   | `GET /api/products/lowstock?threshold=-1`               | `400 Bad Request` | `"Threshold must be zero or greater."`                               | | |
| TC-LS07 | Non-integer threshold rejected by model binding | Any                   | `GET /api/products/lowstock?threshold=abc`              | `400 Bad Request` | Model binding error                                                  | | |
| TC-LS08 | `isLowStock` field is true for all results      | Seed data loaded      | `GET /api/products/lowstock`                            | `200 OK`          | Every object in array has `"isLowStock": true`                       | | |
| TC-LS09 | Empty DB returns empty array                    | No products in DB     | `GET /api/products/lowstock`                            | `200 OK`          | `[]`                                                                 | | |

---

## 5. POST /api/products

> Creates a new product.
> **Expected status codes:** `201 Created` | `400 Bad Request` | `500 Internal Server Error`

---

### 5.1 Positive Tests

| TC ID   | Description                                 | Precondition | Test Data / Request Body                                                                                                                                  | Expected Status  | Expected Response Body                                                                                | Actual Result | Status |
|---------|---------------------------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-------------------------------------------------------------------------------------------------------|---------------|--------|
| TC-P01  | Create product – all valid fields           | DB running   | `{ "name": "Orange Juice", "category": "Beverages", "price": 3.49, "quantity": 100, "expiryDate": "2026-12-31T00:00:00Z", "imageUrl": "https://example.com/oj.jpg" }` | `201 Created` | Response body contains new `id`, all submitted fields, `"isLowStock": false`, `"isExpired": false`, `"updatedAt": null` | | |
| TC-P02  | Create product – without optional `imageUrl` | DB running  | `{ "name": "Orange Juice", "category": "Beverages", "price": 3.49, "quantity": 100, "expiryDate": "2026-12-31T00:00:00Z" }`                              | `201 Created`    | `"imageUrl": null` in response                                                                        | | |
| TC-P03  | `Location` header is set correctly          | DB running   | Same as TC-P01                                                                                                                                            | `201 Created`    | `Location` header = `/api/products/{newId}`                                                           | | |
| TC-P04  | `createdAt` is auto-set                     | DB running   | Same as TC-P01                                                                                                                                            | `201 Created`    | `"createdAt"` is present; within a few seconds of current UTC time                                    | | |
| TC-P05  | Name at minimum length (2 chars)            | DB running   | `{ "name": "AB", "category": "Other", "price": 1.00, "quantity": 0, "expiryDate": "2027-01-01T00:00:00Z" }`                                             | `201 Created`    | Product created with `"name": "AB"`                                                                   | | |
| TC-P06  | Name at maximum length (100 chars)          | DB running   | `name` = 100-char string, other fields valid                                                                                                              | `201 Created`    | Product created successfully                                                                          | | |
| TC-P07  | Price at minimum (0.01)                     | DB running   | `{ "name": "Penny Candy", "category": "Confectionery", "price": 0.01, "quantity": 200, "expiryDate": "2027-01-01T00:00:00Z" }`                          | `201 Created`    | `"price": 0.01` in response                                                                           | | |
| TC-P08  | Quantity = 0 triggers `isLowStock: true`    | DB running   | `{ "name": "Rare Item", "category": "Other", "price": 9.99, "quantity": 0, "expiryDate": "2027-01-01T00:00:00Z" }`                                     | `201 Created`    | `"isLowStock": true`, `"quantity": 0`                                                                 | | |
| TC-P09  | Past `expiryDate` creates product (no DTO restriction) | DB running | `{ "name": "Old Stock", "category": "Other", "price": 1.00, "quantity": 5, "expiryDate": "2020-01-01T00:00:00Z" }`                          | `201 Created`    | `"isExpired": true` in response                                                                       | | |
| TC-P10  | Created product retrievable via GET         | DB running   | POST TC-P01 body, then `GET /api/products/{newId}`                                                                                                       | `200 OK`         | Returned product matches POSTed data                                                                  | | |

### 5.2 Negative Tests

| TC ID   | Description                                  | Precondition | Test Data / Request Body                                                                                                              | Expected Status   | Expected Response Body                                        | Actual Result | Status |
|---------|----------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------|-------------------|---------------------------------------------------------------|---------------|--------|
| TC-P11  | Missing `name`                               | DB running   | `{ "category": "Dairy", "price": 1.99, "quantity": 10, "expiryDate": "2027-01-01T00:00:00Z" }`                                      | `400 Bad Request` | Validation error mentioning `name`                            | | |
| TC-P12  | `name` below minimum length (1 char)         | DB running   | `{ "name": "A", "category": "Dairy", "price": 1.99, "quantity": 10, "expiryDate": "2027-01-01T00:00:00Z" }`                         | `400 Bad Request` | `StringLength` validation error for `name`                   | | |
| TC-P13  | `name` exceeds maximum length (101 chars)    | DB running   | `name` = 101-char string, other fields valid                                                                                          | `400 Bad Request` | `StringLength` validation error for `name`                   | | |
| TC-P14  | Missing `category`                           | DB running   | `{ "name": "Milk", "price": 1.99, "quantity": 10, "expiryDate": "2027-01-01T00:00:00Z" }`                                           | `400 Bad Request` | Validation error mentioning `category`                        | | |
| TC-P15  | `category` exceeds 50 chars                  | DB running   | `category` = 51-char string                                                                                                           | `400 Bad Request` | `StringLength` validation error for `category`               | | |
| TC-P16  | Missing `price`                              | DB running   | `{ "name": "Milk", "category": "Dairy", "quantity": 10, "expiryDate": "2027-01-01T00:00:00Z" }`                                     | `400 Bad Request` | Validation error mentioning `price`                           | | |
| TC-P17  | `price` = 0 (below minimum 0.01)             | DB running   | `{ "name": "Milk", "category": "Dairy", "price": 0, "quantity": 10, "expiryDate": "2027-01-01T00:00:00Z" }`                         | `400 Bad Request` | `Range` validation error for `price`                         | | |
| TC-P18  | `price` = negative value                     | DB running   | `{ "name": "Milk", "category": "Dairy", "price": -5.00, "quantity": 10, "expiryDate": "2027-01-01T00:00:00Z" }`                     | `400 Bad Request` | `Range` validation error for `price`                         | | |
| TC-P19  | `price` = non-numeric string                 | DB running   | `{ "name": "Milk", "category": "Dairy", "price": "expensive", "quantity": 10, "expiryDate": "2027-01-01T00:00:00Z" }`               | `400 Bad Request` | JSON deserialization / model binding error                    | | |
| TC-P20  | `quantity` = negative value                  | DB running   | `{ "name": "Milk", "category": "Dairy", "price": 1.99, "quantity": -1, "expiryDate": "2027-01-01T00:00:00Z" }`                     | `400 Bad Request` | `Range` validation error for `quantity`                      | | |
| TC-P21  | Missing `expiryDate`                         | DB running   | `{ "name": "Milk", "category": "Dairy", "price": 1.99, "quantity": 10 }`                                                            | `400 Bad Request` | Validation error mentioning `expiryDate`                     | | |
| TC-P22  | `expiryDate` in invalid format               | DB running   | `{ "name": "Milk", "category": "Dairy", "price": 1.99, "quantity": 10, "expiryDate": "not-a-date" }`                                | `400 Bad Request` | JSON / model binding error for `expiryDate`                  | | |
| TC-P23  | Invalid `imageUrl` (not a URL)               | DB running   | `{ "name": "Milk", "category": "Dairy", "price": 1.99, "quantity": 10, "expiryDate": "2027-01-01T00:00:00Z", "imageUrl": "not-a-url" }` | `400 Bad Request` | `Url` attribute validation error                             | | |
| TC-P24  | Empty request body                           | DB running   | `{}`                                                                                                                                  | `400 Bad Request` | Multiple required-field validation errors                     | | |
| TC-P25  | Content-Type header missing / wrong          | DB running   | Valid body sent with `Content-Type: text/plain`                                                                                       | `415 Unsupported Media Type` | Framework rejects non-JSON content type               | | |

---

## 6. PUT /api/products/{id}

> Updates an existing product by ID.
> **Expected status codes:** `200 OK` | `400 Bad Request` | `404 Not Found` | `500 Internal Server Error`

---

### 6.1 Positive Tests

| TC ID   | Description                                  | Precondition         | Test Data / Request                                                                                                                                              | Expected Status | Expected Response Body                                                                  | Actual Result | Status |
|---------|----------------------------------------------|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------------------------------------------------------------------------------------|---------------|--------|
| TC-U01  | Update all fields – fully valid payload      | Product id=1 exists  | `PUT /api/products/1` `{ "name": "Skimmed Milk", "category": "Dairy", "price": 1.79, "quantity": 45, "expiryDate": "2026-06-01T00:00:00Z" }`                  | `200 OK`        | Response reflects updated values; `"updatedAt"` is now set (not null)                  | | |
| TC-U02  | `updatedAt` is set after update              | Product id=1 exists  | Same as TC-U01                                                                                                                                                   | `200 OK`        | `"updatedAt"` is within a few seconds of current UTC time, not null                    | | |
| TC-U03  | `createdAt` unchanged after update           | Product id=1 exists  | Same as TC-U01                                                                                                                                                   | `200 OK`        | `"createdAt"` value matches original `createdAt` from GET before update                | | |
| TC-U04  | Update price to minimum (0.01)               | Product id=1 exists  | `PUT /api/products/1` with `"price": 0.01`                                                                                                                      | `200 OK`        | `"price": 0.01`                                                                         | | |
| TC-U05  | Update quantity to 0                         | Product id=1 exists  | `PUT /api/products/1` with `"quantity": 0`                                                                                                                      | `200 OK`        | `"quantity": 0`, `"isLowStock": true`                                                   | | |
| TC-U06  | Update `imageUrl` to null                    | Product id=1 (has imageUrl) | Same as TC-U01 without `imageUrl` field                                                                                                                  | `200 OK`        | `"imageUrl": null`                                                                      | | |
| TC-U07  | Update `imageUrl` to valid URL               | Product id=2 exists  | Same body with `"imageUrl": "https://example.com/bread.jpg"`                                                                                                    | `200 OK`        | `"imageUrl": "https://example.com/bread.jpg"`                                           | | |
| TC-U08  | Updated product retrievable via GET          | Product id=1 exists  | `PUT /api/products/1` then `GET /api/products/1`                                                                                                                 | `200 OK`        | GET response reflects all PUT changes                                                   | | |

### 6.2 Negative Tests

| TC ID   | Description                                  | Precondition          | Test Data / Request                                                                                                                 | Expected Status   | Expected Response Body                                        | Actual Result | Status |
|---------|----------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------|-------------------|---------------------------------------------------------------|---------------|--------|
| TC-U09  | Update non-existent product                  | No product id=99999  | `PUT /api/products/99999` with valid body                                                                                           | `404 Not Found`   | Empty or 404 problem details                                  | | |
| TC-U10  | Missing `name` in body                       | Product id=1 exists  | `PUT /api/products/1` `{ "category": "Dairy", "price": 1.99, "quantity": 10, "expiryDate": "2027-01-01T00:00:00Z" }`              | `400 Bad Request` | Validation error for `name`                                   | | |
| TC-U11  | `name` below minimum length (1 char)         | Product id=1 exists  | `PUT /api/products/1` with `"name": "X"`                                                                                            | `400 Bad Request` | `StringLength` validation error                               | | |
| TC-U12  | `price` = 0                                  | Product id=1 exists  | `PUT /api/products/1` with `"price": 0`                                                                                             | `400 Bad Request` | `Range` validation error for `price`                         | | |
| TC-U13  | `price` = negative                           | Product id=1 exists  | `PUT /api/products/1` with `"price": -10.00`                                                                                        | `400 Bad Request` | `Range` validation error for `price`                         | | |
| TC-U14  | `quantity` = negative                        | Product id=1 exists  | `PUT /api/products/1` with `"quantity": -5`                                                                                         | `400 Bad Request` | `Range` validation error for `quantity`                      | | |
| TC-U15  | Invalid `imageUrl`                           | Product id=1 exists  | `PUT /api/products/1` with `"imageUrl": "not-a-url"`, other fields valid                                                            | `400 Bad Request` | `Url` attribute validation error                             | | |
| TC-U16  | String ID in URL                             | Any                   | `PUT /api/products/abc` with valid body                                                                                             | `400 Bad Request` | Route constraint `{id:int}` rejects                          | | |
| TC-U17  | ID mismatch (body has no ID – correct)       | Product id=1 exists  | `PUT /api/products/1` with valid body (no `id` field in DTO – expected behaviour)                                                   | `200 OK`          | Route ID takes precedence; update applied to product id=1    | | |
| TC-U18  | Empty body                                    | Product id=1 exists  | `PUT /api/products/1` with `{}`                                                                                                     | `400 Bad Request` | Multiple required-field validation errors                     | | |

---

## 7. DELETE /api/products/{id}

> Deletes a product by ID.
> **Expected status codes:** `204 No Content` | `404 Not Found` | `400 Bad Request` | `500 Internal Server Error`

---

| TC ID   | Description                                  | Precondition               | Test Data / Request              | Expected Status       | Expected Response Body                                             | Actual Result | Status |
|---------|----------------------------------------------|----------------------------|----------------------------------|-----------------------|--------------------------------------------------------------------|---------------|--------|
| TC-DEL01 | Delete existing product                     | Product id=3 exists        | `DELETE /api/products/3`         | `204 No Content`      | Empty body                                                         | | |
| TC-DEL02 | Deleted product no longer retrievable       | TC-DEL01 executed          | `GET /api/products/3`            | `404 Not Found`       | Empty body or 404 problem details                                  | | |
| TC-DEL03 | Deleted product not in list                 | TC-DEL01 executed          | `GET /api/products`              | `200 OK`              | Array does not contain item with `"id": 3`                        | | |
| TC-DEL04 | Delete non-existent product                 | No product id=99999        | `DELETE /api/products/99999`     | `404 Not Found`       | Empty body or 404 problem details                                  | | |
| TC-DEL05 | Delete same product twice (idempotency)     | Product id=2 exists        | `DELETE /api/products/2` × 2    | 1st: `204` / 2nd: `404` | Second call returns 404                                          | | |
| TC-DEL06 | String ID in URL rejected by route          | Any                        | `DELETE /api/products/abc`       | `400 Bad Request`     | Route constraint rejects non-integer                               | | |
| TC-DEL07 | Negative ID – product not found             | No product id=-1           | `DELETE /api/products/-1`        | `404 Not Found`       | 404; route accepts negative int, repository returns false → 404   | | |
| TC-DEL08 | Zero ID – product not found                 | No product id=0            | `DELETE /api/products/0`         | `404 Not Found`       | Same as above                                                      | | |

---

## Summary Table

| Endpoint                              | Total TCs | Positive | Negative |
|---------------------------------------|-----------|----------|----------|
| GET /api/products                     | 5         | 5        | 0        |
| GET /api/products/{id}                | 11        | 5        | 6        |
| GET /api/products/category/{category} | 7         | 7        | 0        |
| GET /api/products/lowstock            | 9         | 8        | 1        |
| POST /api/products                    | 25        | 10       | 15       |
| PUT /api/products/{id}                | 18        | 8        | 10       |
| DELETE /api/products/{id}             | 8         | 3        | 5        |
| **Total**                             | **83**    | **46**   | **37**   |

---

## Postman Environment Variables

Create a Postman environment with these variables:

| Variable        | Example Value                      |
|-----------------|------------------------------------|
| `base_url`      | `https://localhost:7241/api`       |
| `product_id`    | `1`                                |
| `new_product_id`| (set dynamically via test script)  |

### Postman Test Script – Auto-capture new ID (use in POST test)

```javascript
// Add to POST /api/products – Tests tab
var json = pm.response.json();
pm.environment.set("new_product_id", json.id);
pm.test("Status 201", () => pm.response.to.have.status(201));
pm.test("Has id", () => pm.expect(json.id).to.be.a("number"));
pm.test("updatedAt is null", () => pm.expect(json.updatedAt).to.be.null);
pm.test("isLowStock computed", () => {
    var expected = json.quantity < 10;
    pm.expect(json.isLowStock).to.eql(expected);
});
```

### Postman Test Script – Validate GET by ID

```javascript
pm.test("Status 200", () => pm.response.to.have.status(200));
var json = pm.response.json();
var requiredFields = ["id","name","category","price","quantity","expiryDate","createdAt","isLowStock","isExpired"];
requiredFields.forEach(f => pm.test("Has field: " + f, () => pm.expect(json).to.have.property(f)));
```

### Postman Test Script – Validate DELETE

```javascript
pm.test("Status 204", () => pm.response.to.have.status(204));
pm.test("Empty body", () => pm.expect(pm.response.text()).to.be.empty);
```

---

*End of API Test Cases*
