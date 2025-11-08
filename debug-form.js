const { chromium } = require('playwright');

(async () => {
  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: 'playwright/.auth/user.json'
  });
  const page = await context.newPage();
  
  console.log('Navigating to page...');
  await page.goto('https://567mb2.sharepoint.com/sites/ESPC25Demo/SitePages/New-customer.aspx');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  console.log('Page loaded');
  
  // Check for forms
  const forms = await page.locator('form').count();
  console.log(`Found ${forms} forms on page`);
  
  // Check for specific input elements
  const customerNameInput = await page.locator('input#customerName').count();
  console.log(`Found ${customerNameInput} customerName inputs`);
  
  const customerEmailInput = await page.locator('input#customerEmail').count();
  console.log(`Found ${customerEmailInput} customerEmail inputs`);
  
  // Check for elements with customer in class
  const customerElements = await page.locator('[class*="customer"]').count();
  console.log(`Found ${customerElements} elements with "customer" in class`);
  
  // Check for submit buttons
  const submitButtons = await page.locator('button[type="submit"]').count();
  console.log(`Found ${submitButtons} submit buttons`);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-page.png', fullPage: true });
  console.log('Screenshot saved as debug-page.png');
  
  // Check page content for customer form
  const content = await page.content();
  console.log(`Page contains "customerName": ${content.includes('customerName')}`);
  console.log(`Page contains "customerEmail": ${content.includes('customerEmail')}`);
  console.log(`Page contains "Add Customer": ${content.includes('Add Customer')}`);
  
  await browser.close();
  console.log('Done!');
})();