# Frontend Test Cases – Sprint 1
## Supermarket Management System

| Field         | Details                          |
|---------------|----------------------------------|
| Version       | 1.0                              |
| Sprint        | Sprint 1                         |
| Prepared by   | QA Engineer                      |
| Date          | 2026-03-02                       |
| Frontend URL  | `http://localhost:3000`          |
| Backend URL   | `http://localhost:5224/api`      |
| UI Library    | Material UI (MUI) v6             |

---

## Implementation Reference

| Item                    | Actual Value (from source code)                                  |
|-------------------------|------------------------------------------------------------------|
| Product List route      | `/`                                                              |
| Add Product route       | `/add-product`                                                   |
| Edit Product route      | `/edit-product/:id`                                              |
| Loading component       | MUI `<CircularProgress />` centred, full-height                  |
| Loading products error  | MUI `<Alert severity="error">` — `"Failed to load products. Please try again."` |
| Empty list message      | MUI `<Alert severity="info">` — `"No products found. Add your first product!"` |
| Low stock badge         | MUI `<Chip label="Low Stock" color="warning" />` (orange)        |
| Expired badge           | MUI `<Chip label="Expired" color="error" />` (red)               |
| Quantity colour         | `color="error"` (red text) when `quantity < 10`                  |
| Price format            | `$X.XX` via `product.price.toFixed(2)`                           |
| Expiry format           | `new Date(expiryDate).toLocaleDateString()` (locale-dependent)   |
| Add button label        | `"Add New Product"`                                              |
| Form title (add)        | `"Add New Product"`                                              |
| Form title (edit)       | `"Edit Product"`                                                 |
| Product Name field      | `TextField label="Product Name"`                                 |
| Category field          | `TextField label="Category"`                                     |
| Price field             | `TextField type="number" step="0.01" min="0"`                    |
| Quantity field          | `TextField type="number" min="0"`                                |
| Expiry Date field       | `TextField type="date"`                                          |
| Image URL field         | `TextField label="Image URL (optional)"`                         |
| Submit button           | `"Save Product"` / `"Saving..."` (disabled while submitting)     |
| Cancel button           | `"Cancel"` — navigates to `/`                                    |
| Submit error message    | MUI `<Alert severity="error">` — `"Failed to save product. Please try again."` |
| Delete dialog title     | `"Confirm Delete"`                                               |
| Delete dialog body      | `"Are you sure you want to delete this product? This action cannot be undone."` |
| Delete dialog buttons   | `"Cancel"` and `"Delete"` (red, MUI color="error")               |
| Delete error feedback   | Native `alert('Failed to delete product')`                       |
| Edit load error         | MUI `<Alert severity="error">` — `"Failed to load product"` or `"Product not found"` |

### Validation Error Messages (from `ProductForm.tsx`)

| Field        | Condition                     | Error Text                          |
|--------------|-------------------------------|-------------------------------------|
| `name`       | Empty / whitespace only       | `"Name is required"`                |
| `name`       | Length < 2 chars              | `"Name must be at least 2 characters"` |
| `category`   | Empty / whitespace only       | `"Category is required"`            |
| `price`      | Value `<= 0` or falsy         | `"Price must be greater than 0"`    |
| `quantity`   | Value `< 0`                   | `"Quantity cannot be negative"`     |
| `expiryDate` | Empty                         | `"Expiry date is required"`         |

> **Note:** `imageUrl` has no client-side URL validation in the form. The field is fully optional and its value is trimmed; an empty string is sent as `undefined` to the API.

---

## 🏠 Product List Page (`/`)

### Loading & Data States

| Test ID | Description            | Precondition                       | Steps                                                | Expected Result                                                                 | Actual Result | Status |
|---------|------------------------|------------------------------------|------------------------------------------------------|---------------------------------------------------------------------------------|---------------|--------|
| UI-001  | Loading spinner shown  | Backend is running, slow network   | 1. Open DevTools → Network → set throttle to "Slow 3G"<br>2. Navigate to `/` | MUI `CircularProgress` spinner is visible, centred vertically and horizontally  | | |
| UI-002  | Loading disappears after fetch | Backend returns products  | 1. Navigate to `/`<br>2. Wait for response          | Spinner disappears; product cards render                                        | | |
| UI-003  | Display products in grid | Backend has ≥ 1 product seeded    | 1. Navigate to `/`                                   | Products rendered as MUI `Card` components in a responsive grid                 | | |
| UI-004  | Empty state message    | No products in DB                  | 1. Clear all products<br>2. Navigate to `/`          | Blue info `Alert`: **"No products found. Add your first product!"**             | | |
| UI-005  | Error state message    | Backend is stopped                 | 1. Stop the backend<br>2. Navigate to `/`            | Red error `Alert`: **"Failed to load products. Please try again."**             | | |
| UI-006  | Page title shown       | Any                                | 1. Navigate to `/`                                   | Heading **"Products"** (`h4`) is visible                                        | | |
| UI-007  | "Add New Product" button visible | Any                    | 1. Navigate to `/`                                   | Button labelled **"Add New Product"** is visible in top-right of page           | | |

### Product Card Content

| Test ID | Description                    | Precondition                              | Steps                                             | Expected Result                                                                  | Actual Result | Status |
|---------|--------------------------------|-------------------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------|---------------|--------|
| UI-008  | Card shows product name        | Product "Whole Milk" seeded               | 1. Navigate to `/`                                | Card displays **"Whole Milk"** as `h5` heading                                   | | |
| UI-009  | Card shows category            | Product "Whole Milk" / category "Dairy"   | 1. Navigate to `/`                                | Card shows **"Category: Dairy"**                                                 | | |
| UI-010  | Card shows price formatted     | Product with price `1.99`                 | 1. Navigate to `/`                                | Card shows **"$1.99"** (2 decimal places, prefixed `$`)                          | | |
| UI-011  | Card shows quantity            | Product with quantity `50`                | 1. Navigate to `/`                                | Card shows **"Quantity: 50"** in default text colour                             | | |
| UI-012  | Quantity text red when < 10    | Product with quantity `5`                 | 1. Navigate to `/`                                | **"Quantity: 5"** text rendered in MUI `color="error"` (red)                    | | |
| UI-013  | Card shows expiry date         | Product with expiry `2026-04-01`          | 1. Navigate to `/`                                | Card shows **"Expiry:"** followed by locale-formatted date (e.g. `4/1/2026`)    | | |
| UI-014  | Card shows image when present  | Product with valid `imageUrl`             | 1. Navigate to `/`                                | `CardMedia` image renders at top of card (height 140px)                          | | |
| UI-015  | No image when `imageUrl` null  | Product without `imageUrl`                | 1. Navigate to `/`                                | `CardMedia` element is absent; card starts directly with content                 | | |

### Low Stock Indicator

| Test ID | Description                         | Precondition                          | Steps                                                    | Expected Result                                                                     | Actual Result | Status |
|---------|-------------------------------------|---------------------------------------|----------------------------------------------------------|-------------------------------------------------------------------------------------|---------------|--------|
| UI-016  | Low Stock chip shown (qty < 10)     | Product with `quantity = 5`           | 1. Navigate to `/`                                       | Orange MUI `Chip` with label **"Low Stock"** (`color="warning"`) shown next to name | | |
| UI-017  | Low Stock chip shown (qty = 0)      | Product with `quantity = 0`           | 1. Navigate to `/`                                       | **"Low Stock"** chip shown; **"Quantity: 0"** in red                                | | |
| UI-018  | Low Stock chip absent (qty = 10)    | Product with `quantity = 10`          | 1. Navigate to `/`                                       | **"Low Stock"** chip is **not** rendered                                            | | |
| UI-019  | Low Stock chip absent (qty > 10)    | Product with `quantity = 50`          | 1. Navigate to `/`                                       | **"Low Stock"** chip is **not** rendered                                            | | |
| UI-020  | Both chips can appear simultaneously | Product with qty=3 and past expiry   | 1. Navigate to `/`                                       | Both **"Low Stock"** (orange) and **"Expired"** (red) chips appear next to name     | | |

### Expired Indicator

| Test ID | Description                          | Precondition                                | Steps                | Expected Result                                                                 | Actual Result | Status |
|---------|--------------------------------------|---------------------------------------------|----------------------|---------------------------------------------------------------------------------|---------------|--------|
| UI-021  | Expired chip shown (past expiryDate) | Product with `expiryDate = "2025-01-01"`    | 1. Navigate to `/`   | Red MUI `Chip` with label **"Expired"** (`color="error"`) shown next to name    | | |
| UI-022  | Expired chip absent (future date)    | Product with `expiryDate = "2027-01-01"`    | 1. Navigate to `/`   | **"Expired"** chip is **not** rendered                                          | | |

### Navigation Buttons on Cards

| Test ID | Description                        | Precondition            | Steps                                     | Expected Result                                                    | Actual Result | Status |
|---------|------------------------------------|-------------------------|-------------------------------------------|--------------------------------------------------------------------|---------------|--------|
| UI-023  | Edit button present on every card  | ≥ 1 product             | 1. Navigate to `/`                        | Each card has a small **"Edit"** button (MUI `Button size="small" color="primary"`) | | |
| UI-024  | Edit button navigates to edit page | Product id=1 exists     | 1. Click **Edit** on product id=1         | URL changes to `/edit-product/1`; Edit Product form loads          | | |
| UI-025  | Delete button present on every card | ≥ 1 product            | 1. Navigate to `/`                        | Each card has a small **"Delete"** button (`color="error"`, red)   | | |
| UI-026  | Delete button opens confirmation dialog | ≥ 1 product       | 1. Click **Delete** on any product        | MUI `Dialog` opens immediately (no page navigation)                | | |

### AppBar Navigation

| Test ID | Description                          | Precondition | Steps                                        | Expected Result                                     | Actual Result | Status |
|---------|--------------------------------------|--------------|----------------------------------------------|-----------------------------------------------------|---------------|--------|
| UI-027  | "Products" nav link goes to list     | Any page     | 1. Click **Products** in AppBar              | Navigates to `/`; Product List renders              | | |
| UI-028  | "Add Product" nav link goes to form  | Any page     | 1. Click **Add Product** in AppBar           | Navigates to `/add-product`; Add form renders       | | |

---

## 📝 Add Product Form (`/add-product`)

### Form Rendering

| Test ID | Description                          | Precondition | Steps                                                          | Expected Result                                                               | Actual Result | Status |
|---------|--------------------------------------|--------------|----------------------------------------------------------------|-------------------------------------------------------------------------------|---------------|--------|
| UI-029  | Navigate to Add form via button      | Product list visible | 1. Click **Add New Product** button on Product List  | Navigates to `/add-product`; form renders with title **"Add New Product"**    | | |
| UI-030  | Navigate to Add form via AppBar      | Any          | 1. Click **Add Product** in AppBar                             | Same as UI-029                                                                | | |
| UI-031  | All six fields present               | Navigate to `/add-product` | 1. View the form                             | Fields visible: **Product Name**, **Category**, **Price**, **Quantity**, **Expiry Date**, **Image URL (optional)** | | |
| UI-032  | All fields empty on load             | Navigate to `/add-product` | 1. View the form                             | All fields initially empty / zero (Price=0, Quantity=0)                       | | |
| UI-033  | "Save Product" button present        | Navigate to `/add-product` | 1. View the form                             | Blue **"Save Product"** button visible (MUI `variant="contained"`)            | | |
| UI-034  | "Cancel" button present              | Navigate to `/add-product` | 1. View the form                             | **"Cancel"** button visible (MUI `variant="outlined"`)                        | | |

### Validation – Client Side

| Test ID | Description                          | Precondition                  | Steps                                                                  | Expected Result                                                               | Actual Result | Status |
|---------|--------------------------------------|-------------------------------|------------------------------------------------------------------------|-------------------------------------------------------------------------------|---------------|--------|
| UI-035  | Submit empty form shows all errors   | Navigate to `/add-product`    | 1. Click **Save Product** without filling anything                     | Inline errors shown: **"Name is required"**, **"Category is required"**, **"Price must be greater than 0"**, **"Expiry date is required"** | | |
| UI-036  | Name empty → error                   | Navigate to `/add-product`    | 1. Leave **Product Name** blank<br>2. Fill other fields<br>3. Click **Save Product** | Error under name: **"Name is required"**                        | | |
| UI-037  | Name = 1 char → error                | Navigate to `/add-product`    | 1. Enter `"A"` in **Product Name**<br>2. Click **Save Product**        | Error: **"Name must be at least 2 characters"**                               | | |
| UI-038  | Name = 2 chars → no error            | Navigate to `/add-product`    | 1. Enter `"AB"` in **Product Name**<br>2. Fill other fields<br>3. Click **Save Product** | No name validation error; form submits if other fields valid  | | |
| UI-039  | Category empty → error               | Navigate to `/add-product`    | 1. Leave **Category** blank<br>2. Fill other fields<br>3. Click **Save Product** | Error under category: **"Category is required"**                | | |
| UI-040  | Price = 0 → error                    | Navigate to `/add-product`    | 1. Set **Price** to `0`<br>2. Fill other fields<br>3. Click **Save Product** | Error: **"Price must be greater than 0"**                        | | |
| UI-041  | Price = negative → error             | Navigate to `/add-product`    | 1. Type `-5` in **Price** (browser may block via `min="0"` attr)<br>2. Click **Save Product** | Error: **"Price must be greater than 0"**                   | | |
| UI-042  | Price = 0.01 → no error              | Navigate to `/add-product`    | 1. Enter `0.01` in **Price**<br>2. Fill other fields<br>3. Click **Save Product** | No price error; form proceeds to submit                         | | |
| UI-043  | Quantity = negative → error          | Navigate to `/add-product`    | 1. Type `-1` in **Quantity** (browser `min="0"` may block)<br>2. Click **Save Product** | Error: **"Quantity cannot be negative"**                    | | |
| UI-044  | Quantity = 0 → no error              | Navigate to `/add-product`    | 1. Set **Quantity** to `0`<br>2. Fill other fields<br>3. Click **Save Product** | No quantity error; form submits                                 | | |
| UI-045  | Expiry date empty → error            | Navigate to `/add-product`    | 1. Clear the **Expiry Date** field<br>2. Click **Save Product**        | Error: **"Expiry date is required"**                                          | | |
| UI-046  | Error clears when field is corrected | Form showing name error       | 1. Leave Name blank → click Save → error appears<br>2. Type any text in Name | Name error disappears immediately on keypress                  | | |
| UI-047  | `imageUrl` is optional – no error if blank | Navigate to `/add-product` | 1. Fill all fields except Image URL<br>2. Click **Save Product**  | No error for Image URL; form submits                                          | | |
| UI-048  | `imageUrl` not validated client-side | Navigate to `/add-product`    | 1. Enter `"not-a-url"` in Image URL<br>2. Fill other fields<br>3. Click **Save Product** | No client-side URL format error; form attempts to submit (backend may reject) | | |

### Successful Submission

| Test ID | Description                                | Precondition                           | Steps                                                                                               | Expected Result                                                                             | Actual Result | Status |
|---------|--------------------------------------------|----------------------------------------|-----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|---------------|--------|
| UI-049  | Valid submission redirects to list         | Backend running                        | 1. Fill all required fields with valid data<br>2. Click **Save Product**                            | Redirects to `/`; Product List loads                                                        | | |
| UI-050  | New product appears in list                | Backend running                        | 1. Add product "Test Apple"<br>2. Verify on `/`                                                     | "Test Apple" card visible in Product List                                                   | | |
| UI-051  | Submit button shows "Saving..." during API call | Backend running (slow network throttle) | 1. Throttle network<br>2. Fill valid data<br>3. Click **Save Product**                       | Button text changes to **"Saving..."** and is disabled while awaiting API response          | | |
| UI-052  | Submit button re-enables on error          | Backend returns 500                    | 1. Fill valid data<br>2. Click **Save Product**                                                     | Button re-enables after failure; user can retry                                             | | |
| UI-053  | Submission without `imageUrl` sends `undefined` | Backend running               | 1. Fill all fields except Image URL<br>2. Submit<br>3. GET the new product via API                  | `imageUrl` is `null` in API response (empty string trimmed to `undefined` before POST)      | | |

### Error Handling

| Test ID | Description                         | Precondition           | Steps                                                               | Expected Result                                                               | Actual Result | Status |
|---------|-------------------------------------|------------------------|---------------------------------------------------------------------|-------------------------------------------------------------------------------|---------------|--------|
| UI-054  | API error shows Alert                | Backend returns 500    | 1. Fill valid data<br>2. Click **Save Product**                     | Red MUI `Alert`: **"Failed to save product. Please try again."** appears above form | | |
| UI-055  | Error Alert dismissed on retry      | Error alert visible    | 1. Fix issue<br>2. Click **Save Product** again                     | Alert disappears while new request is in flight                               | | |

### Cancel Button

| Test ID | Description                         | Precondition                    | Steps                                                         | Expected Result                                        | Actual Result | Status |
|---------|-------------------------------------|---------------------------------|---------------------------------------------------------------|--------------------------------------------------------|---------------|--------|
| UI-056  | Cancel navigates back to list       | Navigate to `/add-product`      | 1. Click **Cancel**                                           | Navigates to `/`; no product is added                  | | |
| UI-057  | Cancel with partial data does not save | Navigate to `/add-product`   | 1. Fill in Name and Category<br>2. Click **Cancel**           | No product created; Product List unchanged             | | |

---

## ✏️ Edit Product Form (`/edit-product/:id`)

### Loading & Pre-fill

| Test ID | Description                              | Precondition           | Steps                                                          | Expected Result                                                                  | Actual Result | Status |
|---------|------------------------------------------|------------------------|----------------------------------------------------------------|----------------------------------------------------------------------------------|---------------|--------|
| UI-058  | Loading spinner shown                    | Product exists         | 1. Throttle network<br>2. Navigate to `/edit-product/1`        | MUI `CircularProgress` spinner shown centred                                     | | |
| UI-059  | Form title is "Edit Product"             | Product id=1 exists    | 1. Navigate to `/edit-product/1`                               | Form heading displays **"Edit Product"** (`h4`)                                  | | |
| UI-060  | Name field pre-filled                    | Product id=1 exists    | 1. Navigate to `/edit-product/1`<br>2. Inspect **Product Name** field | Field contains current product name                                        | | |
| UI-061  | Category field pre-filled                | Product id=1 exists    | 1. Navigate to `/edit-product/1`                               | **Category** field contains current category                                     | | |
| UI-062  | Price field pre-filled                   | Product id=1 exists    | 1. Navigate to `/edit-product/1`                               | **Price** field contains current price value                                     | | |
| UI-063  | Quantity field pre-filled                | Product id=1 exists    | 1. Navigate to `/edit-product/1`                               | **Quantity** field contains current quantity                                     | | |
| UI-064  | Expiry Date field pre-filled             | Product id=1 exists    | 1. Navigate to `/edit-product/1`                               | **Expiry Date** date input shows date portion only (`YYYY-MM-DD` format, ISO time stripped via `.split('T')[0]`) | | |
| UI-065  | Image URL pre-filled when set            | Product id=1 has imageUrl | 1. Navigate to `/edit-product/1`                            | **Image URL** field shows the URL                                                | | |
| UI-066  | Image URL empty when null                | Product without imageUrl | 1. Navigate to `/edit-product/2`                              | **Image URL** field is empty (not "null" text)                                   | | |
| UI-067  | Error for non-existent ID                | No product id=99999    | 1. Navigate to `/edit-product/99999`                           | Red `Alert`: **"Failed to load product"** or **"Product not found"**             | | |
| UI-068  | Error for non-numeric ID in URL          | Any                    | 1. Navigate to `/edit-product/abc`                             | API call fails; error Alert shown: **"Failed to load product"** or **"Product not found"** | | |

### Update Functionality

| Test ID | Description                              | Precondition           | Steps                                                                         | Expected Result                                                     | Actual Result | Status |
|---------|------------------------------------------|------------------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------|---------------|--------|
| UI-069  | Update name – changes reflected in list  | Product id=1 exists    | 1. Navigate to `/edit-product/1`<br>2. Change name to "Skimmed Milk"<br>3. Click **Save Product** | Redirects to `/`; card shows **"Skimmed Milk"**   | | |
| UI-070  | Update price                             | Product id=1 exists    | 1. Change price to `2.50`<br>2. Click **Save Product**                        | List shows **"$2.50"** for the product                              | | |
| UI-071  | Update quantity to below 10 shows badge  | Product id=1 qty=50    | 1. Change quantity to `5`<br>2. Click **Save Product**                        | List shows **"Low Stock"** chip on the updated card                 | | |
| UI-072  | Update quantity to ≥ 10 removes badge    | Product with Low Stock | 1. Change quantity to `20`<br>2. Click **Save Product**                       | **"Low Stock"** chip is gone from the card                          | | |
| UI-073  | Update expiry to past date shows Expired | Product id=1           | 1. Change expiry to `2020-01-01`<br>2. Click **Save Product**                 | **"Expired"** chip appears on the card                              | | |
| UI-074  | Update expiry to future removes Expired  | Product marked Expired | 1. Change expiry to `2030-01-01`<br>2. Click **Save Product**                 | **"Expired"** chip disappears                                       | | |
| UI-075  | Successful update redirects to list      | Product id=1 exists    | 1. Change any field<br>2. Click **Save Product**                               | Navigates to `/`; updated product visible                           | | |

### Edit Validation

| Test ID | Description                              | Precondition              | Steps                                                                     | Expected Result                                              | Actual Result | Status |
|---------|------------------------------------------|---------------------------|---------------------------------------------------------------------------|--------------------------------------------------------------|---------------|--------|
| UI-076  | Clear name → error                       | On Edit form              | 1. Clear **Product Name** field<br>2. Click **Save Product**              | Error: **"Name is required"**                                | | |
| UI-077  | Name 1 char → error                      | On Edit form              | 1. Set name to `"X"`<br>2. Click **Save Product**                         | Error: **"Name must be at least 2 characters"**              | | |
| UI-078  | Price = 0 → error                        | On Edit form              | 1. Set price to `0`<br>2. Click **Save Product**                          | Error: **"Price must be greater than 0"**                    | | |
| UI-079  | Quantity negative → error                | On Edit form              | 1. Enter `-1` in Quantity<br>2. Click **Save Product**                    | Error: **"Quantity cannot be negative"**                     | | |
| UI-080  | API error on save shows Alert            | Backend returns 500       | 1. Fill valid data<br>2. Click **Save Product**                           | Red `Alert`: **"Failed to save product. Please try again."** | | |

### Cancel Edit

| Test ID | Description                              | Precondition              | Steps                                                 | Expected Result                                              | Actual Result | Status |
|---------|------------------------------------------|---------------------------|-------------------------------------------------------|--------------------------------------------------------------|---------------|--------|
| UI-081  | Cancel navigates to list                 | On Edit form              | 1. Click **Cancel**                                   | Navigates to `/`                                             | | |
| UI-082  | Cancel does not save changes             | On Edit form, data modified | 1. Change name to "CHANGED"<br>2. Click **Cancel**  | Product List shows original name; no API PUT was made        | | |

---

## 🗑️ Delete Functionality

### Confirmation Dialog

| Test ID | Description                               | Precondition              | Steps                                                         | Expected Result                                                                                       | Actual Result | Status |
|---------|-------------------------------------------|---------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|---------------|--------|
| UI-083  | Delete button opens dialog                | ≥ 1 product in list       | 1. Click **Delete** on any card                               | MUI `Dialog` opens; title: **"Confirm Delete"**                                                       | | |
| UI-084  | Dialog body text correct                  | Dialog open               | 1. Read dialog content                                        | **"Are you sure you want to delete this product? This action cannot be undone."**                     | | |
| UI-085  | Dialog has Cancel button                  | Dialog open               | 1. Observe dialog actions                                     | **"Cancel"** button present (left-side MUI default action)                                            | | |
| UI-086  | Dialog has Delete button                  | Dialog open               | 1. Observe dialog actions                                     | Red **"Delete"** button present (`color="error"`, has `autoFocus`)                                    | | |

### Cancel Delete

| Test ID | Description                               | Precondition              | Steps                                                         | Expected Result                                                               | Actual Result | Status |
|---------|-------------------------------------------|---------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------|---------------|--------|
| UI-087  | Cancel closes dialog                      | Dialog open               | 1. Click **Cancel** in dialog                                 | Dialog closes; product list unchanged; no API DELETE call made                | | |
| UI-088  | Dismiss via backdrop closes dialog        | Dialog open               | 1. Click outside the dialog (backdrop)                        | Dialog closes; product remains in list                                        | | |

### Confirm Delete

| Test ID | Description                               | Precondition              | Steps                                                                   | Expected Result                                                               | Actual Result | Status |
|---------|-------------------------------------------|---------------------------|-------------------------------------------------------------------------|-------------------------------------------------------------------------------|---------------|--------|
| UI-089  | Confirm delete removes product from list  | Product id=2 in list      | 1. Click **Delete** on product id=2<br>2. Click **Delete** in dialog    | Product id=2 card disappears from the list; list refreshes automatically      | | |
| UI-090  | Deleted product gone from API             | UI-089 executed           | 1. `GET /api/products/2` via Postman                                    | API returns `404 Not Found`                                                   | | |
| UI-091  | Delete multiple products                  | Products id=2, id=3 exist | 1. Delete id=2 → confirm<br>2. Delete id=3 → confirm                   | Both products removed from list                                               | | |
| UI-092  | Delete last product → empty state         | Only 1 product in DB      | 1. Delete it → confirm                                                  | Product List shows `Alert info`: **"No products found. Add your first product!"** | | |
| UI-093  | Delete failure shows native alert         | Backend returns 500 on DELETE | 1. Click **Delete** → confirm                                       | Native browser `alert('Failed to delete product')` appears; product remains in list | | |

---

## 🔄 Integration Tests

### Frontend ↔ Backend Data Flow

| Test ID | Description                           | Precondition              | Steps                                                                             | Expected Result                                                              | Actual Result | Status |
|---------|---------------------------------------|---------------------------|-----------------------------------------------------------------------------------|------------------------------------------------------------------------------|---------------|--------|
| INT-001 | Backend not running – load error      | Backend stopped           | 1. Stop backend<br>2. Navigate to `/`                                             | Red `Alert`: **"Failed to load products. Please try again."**                | | |
| INT-002 | Add product – appears in list         | Backend running           | 1. Add product "Integration Test Apple"<br>2. Navigate to `/`                    | "Integration Test Apple" card visible in list                                | | |
| INT-003 | Edit product – changes in list        | Product exists            | 1. Edit price to `9.99`<br>2. Navigate to `/`                                    | Card shows **"$9.99"**                                                       | | |
| INT-004 | Delete product – gone from list       | Product exists            | 1. Delete product<br>2. Verify list                                               | Product card absent; count decremented by 1                                  | | |
| INT-005 | Low stock after quantity update       | Product qty=50 exists     | 1. Edit quantity to `5`<br>2. Navigate to `/`                                    | **"Low Stock"** chip appears on updated card                                 | | |
| INT-006 | Expired after expiry date update      | Product with future expiry | 1. Edit expiry to `2020-01-01`<br>2. Navigate to `/`                            | **"Expired"** chip appears on updated card                                   | | |
| INT-007 | CORS – frontend can reach backend     | Both services running     | 1. Navigate to `/`<br>2. Open DevTools → Network                                 | No CORS error in console; requests to `http://localhost:5224/api` succeed    | | |
| INT-008 | API base URL correct                  | Backend running on :5224  | 1. Open DevTools → Network<br>2. Navigate to `/`                                 | XHR requests go to `http://localhost:5224/api/products`                      | | |
| INT-009 | 404 on edit navigates correctly       | No product id=99999       | 1. Navigate to `/edit-product/99999`                                             | Error `Alert` shown; no JS crash; Cancel button still functional             | | |
| INT-010 | Full CRUD round-trip                  | Backend running           | 1. Add product<br>2. Verify in list<br>3. Edit name<br>4. Verify updated<br>5. Delete<br>6. Verify gone | All steps produce correct UI state at each stage         | | |

---

## Test Execution Checklist

### Pre-Execution Setup
- [ ] Backend running: `dotnet run` in `SupermarketAPI/` (port 5224)
- [ ] Frontend running: `npm start` in `frontend/` (port 3000)
- [ ] Database migrated: `dotnet ef database update`
- [ ] Seed data inserted (at least 4 products incl. a low-stock and an expired one)
- [ ] Chrome DevTools available for network throttling tests
- [ ] Browser console cleared before each test

### Browsers to Test
| Browser        | Version | Priority |
|----------------|---------|----------|
| Google Chrome  | Latest  | Primary  |
| Microsoft Edge | Latest  | Secondary |
| Firefox        | Latest  | Optional  |

---

## Summary

| Section              | Total TCs | Critical | High | Medium |
|----------------------|-----------|----------|------|--------|
| Product List         | 28        | 3        | 18   | 7      |
| Add Product Form     | 29        | 4        | 17   | 8      |
| Edit Product Form    | 25        | 4        | 15   | 6      |
| Delete Functionality | 11        | 3        | 6    | 2      |
| Integration Tests    | 10        | 4        | 5    | 1      |
| **Total**            | **103**   | **18**   | **61** | **24** |

---

*End of Frontend Test Cases – Sprint 1*
