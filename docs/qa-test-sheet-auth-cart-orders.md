# QA Test Sheet - Auth, Cart, Checkout, Orders

## Test Execution Sheet

| Test ID | Feature | Precondition | Steps | Expected Result | Actual Result | Status | Notes |
|---|---|---|---|---|---|---|---|
| AUTH-REG-001 | Registration success | App + API + DB running | Open Register -> fill valid data -> submit | User created, authenticated session starts, no server error |  |  |  |
| AUTH-REG-002 | Registration duplicate email | Existing user email available | Register again with same email | Error shown: email already exists (or equivalent) |  |  |  |
| AUTH-REG-003 | Registration client validation | Register page open | Submit empty/invalid fields | Inline validation shown, request blocked or rejected with clear message |  |  |  |
| AUTH-LOGIN-001 | Login success | Registered user exists | Open Login -> valid email/password -> submit | Login success, redirected/authorized state |  |  |  |
| AUTH-LOGIN-002 | Login invalid password | Registered user exists | Login with wrong password | Error shown, no login |  |  |  |
| AUTH-LOGIN-003 | Remember me ON | Registered user exists | Login with remember me checked -> close/reopen tab/browser | Session/token persists |  |  |  |
| AUTH-LOGIN-004 | Remember me OFF | Registered user exists | Login with remember me unchecked -> close/reopen tab/browser | Session/token cleared |  |  |  |
| AUTH-PROF-001 | View profile | User logged in | Open Profile page | User data displayed (name/email/role/status) |  |  |  |
| AUTH-PROF-002 | Update profile success | User logged in | Edit name/address/phone -> save | Success message, values persisted after refresh |  |  |  |
| AUTH-PROF-003 | Change password success | User logged in | Change password dialog -> valid current + new | Success message, old password fails, new password works |  |  |  |
| AUTH-PROF-004 | Change password invalid current | User logged in | Use wrong current password | Error shown, password unchanged |  |  |  |
| CART-ADD-001 | Add to cart success | Logged in, product stock > 0 | Add product to cart (UI/API) -> open Cart | Item appears with qty, price, subtotal; total updates |  |  |  |
| CART-ADD-002 | Add beyond stock | Logged in, known low stock product | Add/update quantity above stock | Conflict/error shown; cart unchanged appropriately |  |  |  |
| CART-UPD-001 | Increase/decrease quantity | Cart has item | Use +/- and/or input quantity | Quantity changes, subtotal and total recalculate |  |  |  |
| CART-UPD-002 | Remove single item | Cart has multiple items | Remove one item | Only selected item removed, totals update |  |  |  |
| CART-UPD-003 | Clear cart | Cart has items | Click Clear Cart | Cart becomes empty state |  |  |  |
| CHK-OUT-001 | Checkout success | Cart has items, user logged in | Open Checkout -> enter shipping -> payment method -> place order | Confirmation displayed, order ID visible, cart cleared |  |  |  |
| CHK-OUT-002 | Checkout empty cart | User logged in, empty cart | Open Checkout | Empty cart state shown, cannot place order |  |  |  |
| CHK-OUT-003 | Checkout missing address | Cart has items | Leave shipping blank -> place order | Validation/error shown, no order placed |  |  |  |
| ORD-LIST-001 | Orders list view | At least one order exists | Open Orders page | Orders shown with ID/date/total/status |  |  |  |
| ORD-LIST-002 | Orders empty state | No orders for user | Open Orders page | Empty state shown |  |  |  |
| ORD-DET-001 | Order detail quick view | Existing order | Click Quick View | Detail dialog shows items, totals, shipping/payment |  |  |  |
| ORD-DET-002 | Order detail full page | Existing order | Open /orders/{id} via Open Page | Full detail page shows correct order data |  |  |  |

## Suggested Test Data

- Name: QA User One
- Email: qa.user.one@example.com
- Password: QaUser@123
- Address: 45 Main Street, Colombo
- Phone: 0771234567
- Payment Method: CashOnDelivery

## Status Values

- Pass
- Fail
- Blocked
- Not Run

## Quick Summary Block

- Total: __
- Passed: __
- Failed: __
- Blocked: __
- Not Run: __
- Pass Rate: __%

## Defect Logging Notes

- For failed tests, capture:
  - Exact endpoint/page
  - Request payload (if API)
  - Actual response/status code
  - Screenshot or console error
  - Reproducibility (Always/Sometimes/Rare)
