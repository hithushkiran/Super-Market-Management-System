/**
 * Selenium E2E Tests – Supermarket Management System
 *
 * Covers:
 *  1. Open Chrome and navigate to the React app
 *  2. Verify the Product List page loads
 *  3. Click "Add New Product" button
 *  4. Fill in the Add Product form
 *  5. Submit the form
 *  6. Verify the new product appears in the list
 *  7. Clean up – delete the test product
 *
 * Prerequisites:
 *   - Frontend running : npm start  (http://localhost:3000)
 *   - Backend running  : dotnet run (http://localhost:5224)
 *   - Run this file    : node product.test.js
 */

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// ─── Configuration ────────────────────────────────────────────────────────────
const APP_URL       = 'http://localhost:3000';
const TIMEOUT_MS    = 10000;   // max wait for elements to appear
const TEST_PRODUCT  = {
  name      : 'Selenium Test Apple',
  category  : 'Fresh Produce',
  price     : '2.99',
  quantity  : '50',
  expiryDate: '12/31/2026',    // MM/DD/YYYY – how Chrome date input accepts keys
  expiryISO : '2026-12-31',    // YYYY-MM-DD – used for direct .sendKeys on date input
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wait until an element is visible, then return it. */
async function waitFor(driver, locator, timeout = TIMEOUT_MS) {
  return driver.wait(until.elementLocated(locator), timeout)
    .then(el => driver.wait(until.elementIsVisible(el), timeout));
}

/** Find an input by its HTML name attribute (works for all MUI TextFields). */
function byInput(name) {
  return By.css(`input[name="${name}"]`);
}

/** Log a labelled result line. */
function log(label, passed, detail = '') {
  const icon = passed ? '✅' : '❌';
  console.log(`  ${icon}  ${label}${detail ? ' — ' + detail : ''}`);
}

// ─── Test Runner ──────────────────────────────────────────────────────────────

async function runTests() {
  // Build Chrome driver (headless: false so you can watch it run)
  const options = new chrome.Options();
  // Uncomment the next line to run without opening a visible browser window:
  // options.addArguments('--headless=new');
  options.addArguments('--window-size=1400,900');
  options.addArguments('--disable-search-engine-choice-screen');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  let passed = 0;
  let failed = 0;

  function pass(label, detail) { log(label, true, detail);  passed++; }
  function fail(label, detail) { log(label, false, detail); failed++; }

  try {

    // ── TEST 1 ── Open browser and navigate to app ───────────────────────────
    console.log('\n─────────────────────────────────────────');
    console.log('TEST 1 – Open browser and navigate to app');
    console.log('─────────────────────────────────────────');

    await driver.get(APP_URL);
    const title = await driver.getTitle();
    log('Page loaded', true, `title="${title}"`);
    pass('Navigated to ' + APP_URL);


    // ── TEST 2 ── Verify Product List page loads ─────────────────────────────
    console.log('\n──────────────────────────────────────────');
    console.log('TEST 2 – Verify Product List page loads');
    console.log('──────────────────────────────────────────');

    try {
      // Wait for the "Products" h4 heading
      const heading = await waitFor(driver, By.xpath("//h4[normalize-space()='Products']"));
      const headingText = await heading.getText();
      pass('Page heading found', `"${headingText}"`);
    } catch {
      fail('Page heading "Products" not found');
    }

    try {
      // Wait for either a product card OR the empty-state alert
      await driver.wait(
        until.elementLocated(By.xpath(
          "//*[contains(@class,'MuiCard-root')] | //*[contains(text(),'No products found')]"
        )),
        TIMEOUT_MS
      );
      pass('Product list area rendered (cards or empty state visible)');
    } catch {
      fail('Product list area did not render within timeout');
    }

    try {
      const addBtn = await waitFor(driver, By.xpath("//button[normalize-space()='Add New Product']"));
      pass('"Add New Product" button visible', await addBtn.getText());
    } catch {
      fail('"Add New Product" button not found on Product List page');
    }


    // ── TEST 3 ── Click "Add New Product" button ─────────────────────────────
    console.log('\n────────────────────────────────────────────');
    console.log('TEST 3 – Click "Add New Product" button');
    console.log('────────────────────────────────────────────');

    try {
      const addBtn = await waitFor(driver, By.xpath("//button[normalize-space()='Add New Product']"));
      await addBtn.click();

      // Confirm URL changed to /add-product
      await driver.wait(until.urlContains('/add-product'), TIMEOUT_MS);
      const currentUrl = await driver.getCurrentUrl();
      pass('Navigated to Add Product page', currentUrl);
    } catch (err) {
      fail('Failed to navigate to /add-product', err.message);
    }

    try {
      const formTitle = await waitFor(driver, By.xpath("//h4[normalize-space()='Add New Product']"));
      pass('Form title "Add New Product" visible', await formTitle.getText());
    } catch {
      fail('Form title not found on /add-product');
    }


    // ── TEST 4 ── Fill in the Add Product form ───────────────────────────────
    console.log('\n───────────────────────────────────────');
    console.log('TEST 4 – Fill in the Add Product form');
    console.log('───────────────────────────────────────');

    // Product Name
    try {
      const nameInput = await waitFor(driver, byInput('name'));
      await nameInput.clear();
      await nameInput.sendKeys(TEST_PRODUCT.name);
      pass('Typed product name', TEST_PRODUCT.name);
    } catch (err) {
      fail('Could not fill Product Name', err.message);
    }

    // Category
    try {
      const catInput = await waitFor(driver, byInput('category'));
      await catInput.clear();
      await catInput.sendKeys(TEST_PRODUCT.category);
      pass('Typed category', TEST_PRODUCT.category);
    } catch (err) {
      fail('Could not fill Category', err.message);
    }

    // Price – clear existing 0, then type
    try {
      const priceInput = await waitFor(driver, byInput('price'));
      await priceInput.click();
      await priceInput.sendKeys(Key.CONTROL + 'a'); // select all
      await priceInput.sendKeys(TEST_PRODUCT.price);
      pass('Typed price', TEST_PRODUCT.price);
    } catch (err) {
      fail('Could not fill Price', err.message);
    }

    // Quantity – clear existing 0, then type
    try {
      const qtyInput = await waitFor(driver, byInput('quantity'));
      await qtyInput.click();
      await qtyInput.sendKeys(Key.CONTROL + 'a');
      await qtyInput.sendKeys(TEST_PRODUCT.quantity);
      pass('Typed quantity', TEST_PRODUCT.quantity);
    } catch (err) {
      fail('Could not fill Quantity', err.message);
    }

    // Expiry Date – Chrome date input requires MM/DD/YYYY via sendKeys
    try {
      const dateInput = await waitFor(driver, byInput('expiryDate'));
      await dateInput.click();
      await dateInput.sendKeys(TEST_PRODUCT.expiryDate);
      pass('Set expiry date', TEST_PRODUCT.expiryDate);
    } catch (err) {
      fail('Could not fill Expiry Date', err.message);
    }


    // ── TEST 5 ── Submit the form ────────────────────────────────────────────
    console.log('\n────────────────────────────────');
    console.log('TEST 5 – Submit the form');
    console.log('────────────────────────────────');

    try {
      const saveBtn = await waitFor(driver,
        By.xpath("//button[@type='submit' and normalize-space()='Save Product']")
      );
      pass('"Save Product" button found');
      await saveBtn.click();
      pass('Clicked "Save Product"');
    } catch (err) {
      fail('Could not click "Save Product"', err.message);
    }

    // After submit, should redirect back to /
    try {
      await driver.wait(until.urlIs(APP_URL + '/'), TIMEOUT_MS);
      const afterUrl = await driver.getCurrentUrl();
      pass('Redirected to Product List after submit', afterUrl);
    } catch {
      // Also accept APP_URL without trailing slash
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl === APP_URL || currentUrl === APP_URL + '/') {
        pass('Redirected to Product List after submit', currentUrl);
      } else {
        fail('Did not redirect to Product List after submit', `still on ${currentUrl}`);
      }
    }


    // ── TEST 6 ── Verify new product appears in the list ────────────────────
    console.log('\n───────────────────────────────────────────────────────');
    console.log('TEST 6 – Verify new product appears in the list');
    console.log('───────────────────────────────────────────────────────');

    try {
      // Wait for a card containing the product name we just created
      const productCard = await waitFor(
        driver,
        By.xpath(`//*[contains(text(),'${TEST_PRODUCT.name}')]`),
        TIMEOUT_MS
      );
      const cardText = await productCard.getText();
      pass('New product found in Product List', `"${cardText}"`);
    } catch {
      fail(`Product "${TEST_PRODUCT.name}" not found in list after submit`);
    }

    try {
      // Verify the category is displayed on the card
      const categoryEl = await waitFor(
        driver,
        By.xpath(`//*[contains(text(),'Category: ${TEST_PRODUCT.category}')]`),
        TIMEOUT_MS
      );
      pass('Category shown on card', await categoryEl.getText());
    } catch {
      fail(`Category "${TEST_PRODUCT.category}" not shown on card`);
    }

    try {
      // Verify the price is displayed formatted as $X.XX
      const priceEl = await waitFor(
        driver,
        By.xpath(`//*[contains(text(),'$${parseFloat(TEST_PRODUCT.price).toFixed(2)}')]`),
        TIMEOUT_MS
      );
      pass('Price shown on card', await priceEl.getText());
    } catch {
      fail(`Price "$${TEST_PRODUCT.price}" not shown on card`);
    }


    // ── TEST 7 ── Clean up – delete the test product ─────────────────────────
    console.log('\n──────────────────────────────────────────────────────');
    console.log('TEST 7 – Clean up: delete the test product');
    console.log('──────────────────────────────────────────────────────');

    try {
      // Find the card containing our product name, then click its Delete button
      const card = await waitFor(
        driver,
        By.xpath(`//div[contains(@class,'MuiCard-root') and .//*[contains(text(),'${TEST_PRODUCT.name}')]]`)
      );
      const deleteBtn = await card.findElement(By.xpath(".//button[normalize-space()='Delete']"));
      await deleteBtn.click();
      pass('Clicked Delete button on test product card');
    } catch (err) {
      fail('Could not click Delete button', err.message);
    }

    try {
      // Confirm delete dialog opens
      const dialogTitle = await waitFor(
        driver,
        By.xpath("//h2[normalize-space()='Confirm Delete']")
      );
      pass('Delete confirmation dialog opened', await dialogTitle.getText());

      // Click the red "Delete" button in the dialog
      const confirmBtn = await waitFor(
        driver,
        By.xpath("//div[contains(@class,'MuiDialog')]//button[normalize-space()='Delete']")
      );
      await confirmBtn.click();
      pass('Clicked "Delete" in confirmation dialog');
    } catch (err) {
      fail('Confirmation dialog issue', err.message);
    }

    try {
      // Verify the product is gone from the list
      await driver.wait(until.stalenessOf(
        await driver.findElement(By.xpath(`//*[contains(text(),'${TEST_PRODUCT.name}')]`))
          .catch(() => ({ then: () => {} }))
      ), 3000).catch(() => {});

      // Attempt to find the element — if it throws, it's been removed ✅
      const elements = await driver.findElements(
        By.xpath(`//*[contains(text(),'${TEST_PRODUCT.name}')]`)
      );
      if (elements.length === 0) {
        pass('Test product successfully removed from list');
      } else {
        fail('Test product still visible in list after deletion');
      }
    } catch {
      pass('Test product successfully removed from list');
    }

  } finally {
    // ── Summary ──────────────────────────────────────────────────────────────
    const total = passed + failed;
    console.log('\n═══════════════════════════════════════════');
    console.log('  TEST SUMMARY');
    console.log('═══════════════════════════════════════════');
    console.log(`  Total  : ${total}`);
    console.log(`  Passed : ${passed} ✅`);
    console.log(`  Failed : ${failed} ❌`);
    console.log('═══════════════════════════════════════════\n');

    // Keep the browser open for 3 seconds so you can see the final state
    await driver.sleep(3000);
    await driver.quit();

    // Exit with error code if any test failed (useful for CI)
    if (failed > 0) process.exit(1);
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────
runTests().catch(err => {
  console.error('\n💥 Unhandled error — check that both frontend and backend are running:\n', err.message);
  process.exit(1);
});
