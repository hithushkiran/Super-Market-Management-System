# Sample Bug Reports – Supermarket Management System

> **Purpose**: These are realistic example bugs commonly found in CRUD applications.  
> Use them as reference when testing — they show the level of detail required and the types  
> of issues to actively look for. If any of these bugs actually exist in the system,  
> copy the relevant entry into `docs/bug-report.md` and assign a real Bug ID.

---

## SAMPLE-BUG-01

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-01                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
POST /api/products returns 500 Internal Server Error when imageUrl field is 
submitted as an empty string "" instead of being omitted entirely.
```

### Environment

| Component    | Details                              |
|--------------|--------------------------------------|
| OS           | Windows 11                           |
| Browser      | N/A                                  |
| Frontend URL | http://localhost:3000                |
| Backend URL  | http://localhost:5224                |
| Database     | MySQL 8.0 – SupermarketDB            |
| Test Type    | ✅ API (Postman)                     |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🟠 High       |
| Status     | 🆕 New        |
| Test Case  | TC-C04        |

### Steps to Reproduce

```
1. Open Postman.
2. Send POST http://localhost:5224/api/products with this body:
   {
     "name": "Apple",
     "category": "Produce",
     "price": 1.99,
     "quantity": 50,
     "expiryDate": "2027-01-01T00:00:00",
     "imageUrl": ""
   }
3. Observe the response.
```

### Expected Result

```
HTTP 422 Unprocessable Entity (validation error) since "" is not a valid URL,
OR HTTP 201 Created if empty string is treated as null/omitted (field is optional).
The [Url] data annotation on CreateProductDto.ImageUrl should handle this gracefully.
```

### Actual Result

```
HTTP 500 Internal Server Error
Body: { "type": "https://tools.ietf.org/html/rfc9110#section-15.6.1", "title": "An error occurred while processing your request." }
No product is created. Console logs a NullReferenceException in MappingProfile.
```

### Screenshots / Logs

```
Response body from Postman:
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.6.1",
  "title": "An error occurred while processing your request.",
  "status": 500,
  "traceId": "00-abc123..."
}

Backend console:
System.NullReferenceException: Object reference not set to an instance of an object.
   at SupermarketAPI.Mappings.MappingProfile ...
```

> Attached: none

### Additional Notes

```
The frontend trims imageUrl to undefined before calling the API (ProductForm.tsx line ~60),
so this bug is not normally triggered from the UI. However, direct API calls or Postman 
usage can hit it. Fix: add a null-coalescing check in MappingProfile, or strip empty 
strings in the DTO before mapping.
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## SAMPLE-BUG-02

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-02                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
Add Product form accepts a product name consisting entirely of whitespace (e.g. "   ") 
and submits it to the API without a validation error.
```

### Environment

| Component    | Details                              |
|--------------|--------------------------------------|
| OS           | Windows 11                           |
| Browser      | Chrome 131                           |
| Frontend URL | http://localhost:3000                |
| Backend URL  | http://localhost:5224                |
| Database     | MySQL 8.0 – SupermarketDB            |
| Test Type    | ✅ UI (Manual)                       |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🟡 Medium     |
| Status     | 🆕 New        |
| Test Case  | TC-F06        |

### Steps to Reproduce

```
1. Open http://localhost:3000/add-product in Chrome.
2. In the Name field, type five spaces: "     ".
3. Fill in all other required fields with valid data:
   - Category: "Produce"
   - Price: 1.99
   - Quantity: 10
   - Expiry Date: 2027-01-01
4. Click Save Product.
5. Observe the result.
```

### Expected Result

```
Frontend should show validation error: "Name is required"
(or "Name must be at least 2 characters" after trimming).
API should never be called.
```

### Actual Result

```
No validation error is shown. The form submits successfully.
A product is created in the database with Name = "     " (5 spaces).
The product list then shows a card with a blank-looking name.
```

### Screenshots / Logs

```
API call observed in browser Network tab:
POST http://localhost:5224/api/products
Request body: { "name": "     ", "category": "Produce", ... }
Response: HTTP 201 Created

Product card in list shows name as empty/blank visually.
```

> Attached: none

### Additional Notes

```
Root cause: ProductForm.tsx validation checks `name === ""` instead of `name.trim() === ""`.
Backend CreateProductDto also uses [StringLength(2, MinimumLength = 2)] but does NOT use 
[RegularExpression] to reject whitespace-only strings.
Fix required in BOTH layers:
  - Frontend: change `if (!name)` to `if (!name.trim())`
  - Backend: add [RegularExpression(@".*\S.*")] or manual trim check in controller/service
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## SAMPLE-BUG-03

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-03                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
PUT /api/products/{id} allows updating a product's expiry date to a date 
in the past (e.g. 2020-01-01), marking the product as IsExpired = true with no warning. 
No validation is applied to prevent backdated expiry entries.
```

### Environment

| Component    | Details                              |
|--------------|--------------------------------------|
| OS           | Windows 11                           |
| Browser      | N/A                                  |
| Frontend URL | http://localhost:3000                |
| Backend URL  | http://localhost:5224                |
| Database     | MySQL 8.0 – SupermarketDB            |
| Test Type    | ✅ API (Postman)                     |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🟡 Medium     |
| Status     | 🆕 New        |
| Test Case  | TC-U09        |

### Steps to Reproduce

```
1. Create a product via POST /api/products (save the returned Id).
2. Send PUT http://localhost:5224/api/products/{id} with body:
   {
     "name": "Expired Milk",
     "category": "Dairy",
     "price": 2.50,
     "quantity": 5,
     "expiryDate": "2020-06-15T00:00:00"
   }
3. Send GET http://localhost:5224/api/products/{id}.
4. Observe the isExpired field in the response.
```

### Expected Result

```
Option A (strict): Return HTTP 400 Bad Request with message 
  "Expiry date cannot be in the past."
Option B (permissive): Allow the update but ensure business logic 
  downstream handles expired products correctly.
At minimum, the API should be consistent and documented.
```

### Actual Result

```
HTTP 200 OK. Product is updated with expiryDate = "2020-06-15T00:00:00".
GET response shows: "isExpired": true.
No error or warning is returned. A supermarket manager could accidentally 
set a past expiry date and it would be stored silently.
```

### Screenshots / Logs

```
GET /api/products/{id} response after update:
{
  "id": 7,
  "name": "Expired Milk",
  "category": "Dairy",
  "price": 2.50,
  "quantity": 5,
  "expiryDate": "2020-06-15T00:00:00",
  "isExpired": true,
  "isLowStock": true,
  ...
}
```

> Attached: none

### Additional Notes

```
The same issue exists for POST. UpdateProductDto and CreateProductDto have no 
[CustomValidation] or [Range] on ExpiryDate. This is a business logic gap, not 
a crash bug — hence Medium severity. Recommend adding a custom validation attribute 
or a check in the controller: if (dto.ExpiryDate < DateTime.UtcNow) return BadRequest(...).
Applies to TC-C09 (POST) and TC-U09 (PUT).
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## SAMPLE-BUG-04

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-04                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
Editing a product's quantity from a low-stock value (< 10) to a normal value (>= 10) 
does not update the Low Stock badge on the product list page until a full browser refresh.
```

### Environment

| Component    | Details                              |
|--------------|--------------------------------------|
| OS           | Windows 11                           |
| Browser      | Chrome 131                           |
| Frontend URL | http://localhost:3000                |
| Backend URL  | http://localhost:5224                |
| Database     | MySQL 8.0 – SupermarketDB            |
| Test Type    | ✅ UI (Manual)  ✅ Selenium           |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🟡 Medium     |
| Status     | 🆕 New        |
| Test Case  | TC-E05        |

### Steps to Reproduce

```
1. Add a product with Quantity = 5 (below the low-stock threshold of 10).
2. Confirm the product card shows a "Low Stock" badge on the list page.
3. Click Edit on the product.
4. Change Quantity from 5 to 25.
5. Click Save Product.
6. Observe the product card on the list page after being redirected back.
```

### Expected Result

```
After saving the edit, the product list should re-fetch data from the API 
(GET /api/products) and the "Low Stock" badge should be gone because 
isLowStock is now false (quantity 25 >= 10).
```

### Actual Result

```
The product list shows the updated quantity value (25) but the "Low Stock" badge 
is still visible. Only after pressing F5 (full page refresh) does the badge disappear.
```

### Screenshots / Logs

```
Browser Network tab after save:
- PUT /api/products/{id} → 200 OK  ✓
- GET /api/products → not called after redirect  ✗

The product list component is loaded from React Router navigation 
(useNavigate('/')) but does not trigger a fresh API call — it uses stale state.
```

> Attached: none

### Additional Notes

```
Root cause: EditProduct.tsx calls navigate('/') after a successful save. 
ProductList.tsx fetches products in useEffect([]) — which only runs on first mount. 
Since React Router navigates without unmounting/remounting the list if it was cached, 
the useEffect does not re-fire.
Fix: Add the API call to useEffect([location]) in ProductList.tsx, or pass a refresh 
key via navigation state: navigate('/', { state: { refresh: true } }).
Same issue may occur after Add Product — low stock badge on a newly added product 
with qty < 10 might not appear until refresh.
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## SAMPLE-BUG-05

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-05                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
Double-clicking the Delete button on the confirmation dialog submits two DELETE 
requests to the API for the same product ID, causing the second request to return 
a 404 error that is then surfaced as a visible alert to the user.
```

### Environment

| Component    | Details                              |
|--------------|--------------------------------------|
| OS           | Windows 11                           |
| Browser      | Chrome 131                           |
| Frontend URL | http://localhost:3000                |
| Backend URL  | http://localhost:5224                |
| Database     | MySQL 8.0 – SupermarketDB            |
| Test Type    | ✅ UI (Manual)                       |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🟡 Medium     |
| Status     | 🆕 New        |
| Test Case  | TC-D03        |

### Steps to Reproduce

```
1. Open http://localhost:3000 in Chrome.
2. Find any product in the list and click the Delete button on its card.
3. The "Confirm Delete" dialog appears.
4. QUICKLY double-click the "Delete" (confirm) button in the dialog.
5. Observe the result.
```

### Expected Result

```
Only one DELETE request is sent. The product is removed from the list. 
The dialog closes. No error is shown.
```

### Actual Result

```
Two DELETE requests are fired:
  - First:  DELETE /api/products/{id} → HTTP 204 No Content  (success)
  - Second: DELETE /api/products/{id} → HTTP 404 Not Found   (product already gone)

The second 404 triggers the catch block in ProductList.tsx, which calls:
  alert('Failed to delete product')

User sees a confusing error popup even though the product was successfully deleted.
The product disappears from the list, but the error alert is jarring.
```

### Screenshots / Logs

```
Browser Network tab:
DELETE http://localhost:5224/api/products/12  →  204 No Content
DELETE http://localhost:5224/api/products/12  →  404 Not Found

Browser alert dialog:
  "Failed to delete product"
```

> Attached: none

### Additional Notes

```
Fix: Disable the confirm button immediately after the first click (set a loading state or 
use a ref flag) to prevent double submission. Example:
  const [isDeleting, setIsDeleting] = useState(false);
  <Button disabled={isDeleting} onClick={handleDelete}>Delete</Button>

This is a classic "double submit" race condition. Low risk of actual data loss since 
the first request succeeds, but the false error alert is confusing.
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## SAMPLE-BUG-06

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-06                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
GET /api/products/lowstock?threshold=-1 returns HTTP 400 with the correct error message 
in development, but GET /api/products/lowstock?threshold=abc (non-integer) returns 
HTTP 400 with a generic ASP.NET model binding error instead of a human-readable message.
```

### Environment

| Component    | Details                              |
|--------------|--------------------------------------|
| OS           | Windows 11                           |
| Browser      | N/A                                  |
| Frontend URL | http://localhost:3000                |
| Backend URL  | http://localhost:5224                |
| Database     | MySQL 8.0 – SupermarketDB            |
| Test Type    | ✅ API (Postman)                     |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🔵 Low        |
| Status     | 🆕 New        |
| Test Case  | TC-L05        |

### Steps to Reproduce

```
1. Open Postman.
2. Send GET http://localhost:5224/api/products/lowstock?threshold=abc
3. Observe the response body.
```

### Expected Result

```
HTTP 400 Bad Request with a clear, human-readable message:
  { "message": "Threshold must be a valid integer." }
```

### Actual Result

```
HTTP 400 Bad Request with ASP.NET's default model binding error:
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "threshold": ["The value 'abc' is not valid for Int32."]
  }
}
```

### Screenshots / Logs

```
Request:  GET /api/products/lowstock?threshold=abc
Response: 400 Bad Request (model binding error – not custom)

Compare with correct negative-number handling:
Request:  GET /api/products/lowstock?threshold=-1
Response: 400 Bad Request  { message: "Threshold must be zero or greater." }  ✓
```

> Attached: none

### Additional Notes

```
This is inconsistency in error response format — one case returns a plain object 
{ message: "..." }, the other returns the full RFC 9110 ProblemDetails structure.
API consumers (including the React frontend) should expect a consistent error shape.
Low severity because "abc" is not a valid real-world input, but worth standardizing 
for a clean API contract. Fix: add [FromQuery] parameter validation or a custom 
ActionFilter to normalize error responses.
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## SAMPLE-BUG-07

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-07                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
Navigating directly to /edit-product/99999 (a non-existent product ID) causes the 
Edit Product page to briefly flash a loading spinner, then display a blank form 
with no error message visible to the user.
```

### Environment

| Component    | Details                              |
|--------------|--------------------------------------|
| OS           | Windows 11                           |
| Browser      | Chrome 131                           |
| Frontend URL | http://localhost:3000                |
| Backend URL  | http://localhost:5224                |
| Database     | MySQL 8.0 – SupermarketDB            |
| Test Type    | ✅ UI (Manual)                       |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🟡 Medium     |
| Status     | 🆕 New        |
| Test Case  | TC-E07        |

### Steps to Reproduce

```
1. Open Chrome and go to http://localhost:3000.
2. In the browser address bar, type: http://localhost:3000/edit-product/99999
3. Press Enter.
4. Observe what appears on screen.
```

### Expected Result

```
One of these outcomes:
  A) A clear error page: "Product not found. Return to product list." (with a link)
  B) Automatic redirect back to / with a toast/snackbar error notification.
```

### Actual Result

```
The page loads with a loading spinner briefly, then shows the Edit Product form 
with all fields empty/blank. No error message is displayed.
The user has no indication that the product doesn't exist and may attempt to fill 
in and submit the blank form (which then fails with a further error).
```

### Screenshots / Logs

```
Browser Network tab:
GET http://localhost:5224/api/products/99999  →  404 Not Found

EditProduct.tsx catches the 404 in the catch block and sets an error state,
but the error state is not rendered in the JSX when the product object is null.
```

> Attached: none

### Additional Notes

```
EditProduct.tsx has error handling that sets error = "Product not found", but 
the JSX might conditionally render the form when product === null without 
showing the error string. Check the conditional rendering logic:
  if (loading) return <CircularProgress />;
  // error state may not be rendered here if product is null
  return <ProductForm ... />;  ← this may render even when product is null
Fix: add explicit error display before rendering the form.
Also consider redirecting back to / automatically after a short delay.
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## SAMPLE-BUG-08

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-08                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
PUT /api/products/{id} does not update the UpdatedAt timestamp in the database 
when a product is edited — the field remains null after the first update.
```

### Environment

| Component    | Details                          |
|--------------|----------------------------------|
| OS           | Windows 11                       |
| Browser      | N/A                              |
| Frontend URL | http://localhost:3000            |
| Backend URL  | http://localhost:5224            |
| Database     | MySQL 8.0 – SupermarketDB        |
| Test Type    | ✅ API (Postman)                 |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🟠 High       |
| Status     | 🆕 New        |
| Test Case  | TC-U03        |

### Steps to Reproduce

```
1. Create a product via POST /api/products (note the returned id).
2. Confirm updatedAt is null in the POST response.
3. Send PUT http://localhost:5224/api/products/{id} with a changed name.
4. Send GET http://localhost:5224/api/products/{id}.
5. Check the updatedAt field in the response.
```

### Expected Result

```
After a successful PUT, the updatedAt field in the GET response should reflect 
the date/time of the edit (e.g. "2026-03-02T10:45:00Z"), not null.
```

### Actual Result

```
GET /api/products/{id} after editing:
{
  "id": 3,
  "name": "Updated Name",
  ...
  "createdAt": "2026-03-02T09:00:00Z",
  "updatedAt": null   ← not updated
}
```

### Screenshots / Logs

```
GET /api/products/{id} response:
{
  "id": 3,
  "name": "Updated Name",
  "category": "Dairy",
  "price": 1.99,
  "quantity": 20,
  "expiryDate": "2027-01-01T00:00:00Z",
  "createdAt": "2026-03-02T09:00:00Z",
  "updatedAt": null
}
```

> Attached: none

### Additional Notes

```
Root cause: ProductRepository.UpdateAsync likely maps the incoming DTO fields onto 
the existing entity but does not set entity.UpdatedAt = DateTime.UtcNow before 
calling SaveChangesAsync(). Since UpdatedAt is nullable in the model and has no 
default or EF Core ValueGeneratedOnUpdate configuration, it stays null.
Fix: In ProductRepository.UpdateAsync, after mapping the DTO fields, add:
  existingProduct.UpdatedAt = DateTime.UtcNow;
This is High severity because audit trail / data integrity is affected — 
managers rely on this timestamp to know when a product was last modified.
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## SAMPLE-BUG-09

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-09                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
The Add Product form "Save Product" button remains enabled and does not show 
a "Saving..." state if the user submits the form while the backend is slow to 
respond, allowing the user to click the button multiple times and create 
duplicate products.
```

### Environment

| Component    | Details                              |
|--------------|--------------------------------------|
| OS           | Windows 11                           |
| Browser      | Chrome 131                           |
| Frontend URL | http://localhost:3000                |
| Backend URL  | http://localhost:5224                |
| Database     | MySQL 8.0 – SupermarketDB            |
| Test Type    | ✅ UI (Manual)                       |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🟠 High       |
| Status     | 🆕 New        |
| Test Case  | TC-F10        |

### Steps to Reproduce

```
1. Open Chrome DevTools → Network tab → set Throttling to "Slow 3G".
2. Navigate to http://localhost:3000/add-product.
3. Fill in all fields with valid data.
4. Click "Save Product" three times quickly.
5. Observe the Number of POST requests in the Network tab.
6. Navigate to http://localhost:3000 and count how many duplicate products were created.
```

### Expected Result

```
After the first click, the button should:
  - Change text to "Saving..."
  - Become disabled (disabled={loading} in ProductForm.tsx)
Only one POST request should be sent. No duplicate products created.
```

### Actual Result

```
The button remains clickable during the API call under slow network conditions.
Three POST requests are sent. Three identical products appear in the product list.
(Note: Under normal network speed this may not reproduce — the request completes 
before a second click is registered. Use Slow 3G throttling to reproduce reliably.)
```

### Screenshots / Logs

```
Network tab (Slow 3G throttling):
POST /api/products  → 201 Created  (product id: 15)
POST /api/products  → 201 Created  (product id: 16)
POST /api/products  → 201 Created  (product id: 17)

Product list shows 3 identical "Apple" entries.
```

> Attached: none

### Additional Notes

```
ProductForm.tsx does have a `loading` state and should set `disabled={loading}` 
on the submit button. This bug may indicate that either:
  a) The disabled prop is not actually applied to the MUI Button component.
  b) The loading state is set asynchronously (after the first click registers), 
     too late to block rapid clicks.
Fix: Set loading = true synchronously at the very start of handleSubmit,
BEFORE the await call. Also verify the MUI Button receives disabled={loading}.
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## SAMPLE-BUG-10

| Field             | Details                          |
|-------------------|----------------------------------|
| **Bug ID**        | SAMPLE-BUG-10                    |
| **Date Reported** | 2026-03-02                       |
| **Reported By**   | QA Engineer                      |
| **Assigned To**   | Developer                        |
| **Sprint**        | Sprint 1                         |

### Summary

```
GET /api/products/category/{category} is case-sensitive — searching for "produce" 
returns 0 results when the stored category is "Produce", giving no indication to 
the user that the category exists under a different casing.
```

### Environment

| Component    | Details                              |
|--------------|--------------------------------------|
| OS           | Windows 11                           |
| Browser      | N/A                                  |
| Frontend URL | http://localhost:3000                |
| Backend URL  | http://localhost:5224                |
| Database     | MySQL 8.0 – SupermarketDB            |
| Test Type    | ✅ API (Postman)                     |

### Severity & Status

| Field      | Value         |
|------------|---------------|
| Severity   | 🟡 Medium     |
| Status     | 🆕 New        |
| Test Case  | TC-Cat03      |

### Steps to Reproduce

```
1. Ensure at least one product exists with Category = "Produce".
2. Send GET http://localhost:5224/api/products/category/Produce
   → Confirm this returns results.
3. Send GET http://localhost:5224/api/products/category/produce  (lowercase)
4. Send GET http://localhost:5224/api/products/category/PRODUCE  (uppercase)
5. Compare the results.
```

### Expected Result

```
All three requests should return the same products.
Category search should be case-insensitive (standard user expectation).
```

### Actual Result

```
GET /api/products/category/Produce  → 200 OK  [ { id: 1, ... }, { id: 5, ... } ]
GET /api/products/category/produce  → 200 OK  []   ← empty array
GET /api/products/category/PRODUCE  → 200 OK  []   ← empty array
```

### Screenshots / Logs

```
Postman screenshot:
GET /api/products/category/produce  →  []

MySQL query in ProductRepository:
WHERE p.Category = '{category}'   ← exact match, no LOWER() / COLLATE

MySQL default collation for SupermarketDB may be utf8mb4_0900_ai_ci 
(case-insensitive) or utf8mb4_bin (case-sensitive) depending on the 
server configuration used during installation.
```

> Attached: none

### Additional Notes

```
Behavior depends on the MySQL collation used when SupermarketDB was created.
Root fix: Normalize the category in the repository query:
  WHERE LOWER(p.Category) = LOWER(@category)
Or in LINQ: .Where(p => p.Category.ToLower() == category.ToLower())
Also consider normalizing category casing on INSERT/UPDATE to maintain 
consistent data (e.g. always TitleCase via a service layer).
Medium severity because it silently returns empty results which 
could mislead users into thinking a category doesn't exist.
```

### Fix History

| Date | Updated By | Status Change | Notes |
|------|------------|---------------|-------|
|      |            |               |       |

---

## Quick Reference — Bugs by Area

| Sample Bug ID   | Area          | Type                    | Severity   | What to Test                                |
|-----------------|---------------|-------------------------|------------|---------------------------------------------|
| SAMPLE-BUG-01   | API – POST    | Input edge case         | 🟠 High    | Empty string in optional URL field          |
| SAMPLE-BUG-02   | UI – Add Form | Validation gap           | 🟡 Medium  | Whitespace-only name field                  |
| SAMPLE-BUG-03   | API – PUT     | Business logic gap       | 🟡 Medium  | Past expiry date accepted without warning   |
| SAMPLE-BUG-04   | UI – Edit     | State management         | 🟡 Medium  | IsLowStock badge stale after edit           |
| SAMPLE-BUG-05   | UI – Delete   | Race condition           | 🟡 Medium  | Double-click confirm button fires 2 deletes |
| SAMPLE-BUG-06   | API – GET     | Error format consistency | 🔵 Low     | Non-integer threshold query param           |
| SAMPLE-BUG-07   | UI – Edit     | Error handling           | 🟡 Medium  | Non-existent product ID in URL              |
| SAMPLE-BUG-08   | API – PUT     | Data integrity           | 🟠 High    | UpdatedAt not set after edit                |
| SAMPLE-BUG-09   | UI – Add Form | Race condition           | 🟠 High    | Duplicate submit on slow network            |
| SAMPLE-BUG-10   | API – GET     | Search behavior          | 🟡 Medium  | Case-sensitive category search              |

---

*End of Sample Bug Reports – Sprint 1*
