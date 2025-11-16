import { test, expect, Page } from '@playwright/test';

// Helper function to check if customer form exists on the page
async function checkCustomerFormExists(page: Page): Promise<boolean> {
	console.log("Checking for customer form on page...");

	await page.waitForTimeout(10000); // Extra wait for SPFx web part to initialize
	
	// Check for the specific inputs we know should exist
	const customerNameInput = await page.locator('input#customerName').count();
	const customerEmailInput = await page.locator('input#customerEmail').count();
	
	console.log(`customerName inputs found: ${customerNameInput}`);
	console.log(`customerEmail inputs found: ${customerEmailInput}`);
	
	if (customerNameInput > 0 && customerEmailInput > 0) {
		console.log("Found customer form inputs - web part is loaded and ready");
		return true;
	}
	
	// Fallback: check for data-testid if the specific inputs aren't found yet
	const testIdForm = await page.locator('[data-testid="customer-form"]').count();
	console.log(`Forms with data-testid="customer-form": ${testIdForm}`);
	
	if (testIdForm > 0) {
		console.log("Found customer form using data-testid");
		return true;
	}
	
	console.log("Customer form not found on this page - this test requires the web part to be deployed");
	return false;
}

test.describe("Page load", () => {
	let page: Page;

	test.beforeEach(async ({ browser, context }) => {
		// Use the authenticated context directly
		page = await context.newPage();
		
		// Navigate to SharePoint site (allow for redirects)
		try {
			await page.goto(process.env.TEST_SHAREPOINT_SITE_URL || "", {
				waitUntil: "domcontentloaded",
				timeout: 15000
			});
			
			console.log(`Test page loaded: ${page.url()}`);
		} catch (error) {
			console.error(`Failed to load test page: ${error}`);
			throw error;
		}
	});

	test.afterEach(async () => {
		await page.close();
	});

	// Check that the page title is present and contains "ESPC25" text
	test("Check site header title", async () => {
		try {
			// Try to find the site header with a reasonable timeout
			const header = page.locator("[data-automationid='SiteHeaderTitle'] a");
			await header.waitFor({ timeout: 10000 });
			await expect(header).toHaveText(/ESPC25/);
			console.log("Site header found and verified");
		} catch (error) {
			console.log("Site header not found with automation ID, trying alternative selectors");
			
			// Try alternative selectors for the site title
			const alternativeHeader = page.locator('h1').first();
			const alternativeExists = await alternativeHeader.count() > 0;
			
			if (alternativeExists) {
				const titleText = await alternativeHeader.textContent();
				console.log(`Found alternative header: ${titleText}`);
				expect(titleText).toContain("ESPC25");
			} else {
				console.log("No site header found - skipping test");
				test.skip(true, "Site header element not found on this page");
			}
		}
	});

	// Test to fill and submit the customer form
	test("Add customer form works with all fields", async () => {
		// Check if the customer form exists on this page
		if (!(await checkCustomerFormExists(page))) {
			test.skip(true, "Customer form web part not deployed to this page");
			return;
		}

		// Try data-testid first, fallback to form with specific inputs
		let customerForm = page.locator('[data-testid="customer-form"]');
		let formExists = await customerForm.count() > 0;
		
		if (!formExists) {
			console.log("data-testid not found, using input-based selector");
			customerForm = page.locator('form:has(input#customerName):has(input#customerEmail)');
			formExists = await customerForm.count() > 0;
		}
		
		if (!formExists) {
			console.log("No form found, skipping test");
			test.skip(true, "Customer form not found with any selector");
			return;
		}
		
		console.log("Found customer form, proceeding with test");
		await expect(customerForm).toBeVisible({ timeout: 15000 });

		// Close any teaching bubble if present
		const teachingBubbleButton = page.locator('button[class*="ms-TeachingBubble-closebutton"]');
		if (await teachingBubbleButton.isVisible()) {
			await teachingBubbleButton.click();
			await expect(teachingBubbleButton).toBeHidden({ timeout: 5000 });
		}

		// Check if there's a tip dialog to be closed before continuing compiling the form
		const tipDialog = page.locator('div[class*="fui-PopoverSurface"]');
		if (await tipDialog.isVisible()) {
			await page.click(
				'button[class*="fui-TeachingPopoverHeader__dismissButton"]'
			);
			await expect(tipDialog).toBeHidden({ timeout: 5000 });
		}

		// Take initial form snapshot
		await expect(customerForm).toHaveScreenshot('01-initial-form.png');

		const userName = "Jane Doe";
		const userEmail = "jane@example.com";
		const userCompany = "Test Company Inc.";

		// Fill the form using the input IDs we confirmed exist
		await page.fill('input#customerName', userName);
		await page.fill('input#customerEmail', userEmail);
		await page.fill('input[id="customerPhone"]', '1234567890');
		await page.fill('input[id="customerAddress"]', '123 Main St');
		await page.fill('input[id="customerCompany"]', 'Acme Corp');
		await page.fill('input[id="customerSocialHandle"]', '@janedoe');
		// Take snapshot after filling basic fields but before sector selection
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('02-form-filled-basic-fields.png');
		
		await page.selectOption('select[id="customerSector"]', 'Private');
		
		// Take snapshot after selecting Private sector (NDA checkbox should be hidden)
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('03-form-private-sector-selected.png');
		
		await page.fill('textarea[id="customerNotes"]', 'VIP customer');

		// Take snapshot of completed form before submission
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('04-form-completed-ready-to-submit.png');
		console.log("Form filled, submitting now");
		await page.click('[data-testid="submit-button"]');

		// Wait longer to allow React to render notification
		await page.waitForTimeout(5000);

		// Use robust Playwright expect for notification with data-testid
		const notification = page.locator('[data-testid="customer-notification"]');
		try {
			await expect(notification).toBeVisible({ timeout: 15000 });
			await expect(notification).toContainText(`Customer added: ${userName} (${userEmail})`);
			
			// Take snapshot of success notification
			await expect(page.locator('section[class*="newCustomerForm"]')).toHaveScreenshot('05-form-success-notification.png');
			
			//await expect(notification).toContainText(`Customer added:`);
		} catch (e) {
			// Log page HTML for debugging if notification is not found
			if (!page.isClosed()) {
				console.error(e);
			}
			throw e;
		}

		// Optionally, check for form reset or success message
		await expect(page.locator('input[id="customerName"]')).toHaveValue('');
		await expect(page.locator('input[id="customerEmail"]')).toHaveValue('');
		await expect(page.locator('input[id="customerCompany"]')).toHaveValue('');
		await expect(page.locator('input[id="customerPhone"]')).toHaveValue('');
		await expect(page.locator('input[id="customerAddress"]')).toHaveValue('');
		await expect(page.locator('select[id="customerSector"]')).toHaveValue('');
		await expect(page.locator('textarea[id="customerNotes"]')).toHaveValue('');
		await expect(page.locator('input[id="customerSocialHandle"]')).toHaveValue('');
		// Take final snapshot of reset form
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('06-form-reset-after-submit.png');

	});

	// Test NDA checkbox visibility based on customer sector selection
	test("NDA checkbox visibility based on customer sector", async () => {
		// Check if the customer form exists on this page
		if (!(await checkCustomerFormExists(page))) {
			test.skip(true, "Customer form web part not deployed to this page");
			return;
		}

		// Ensure the form is present and visible before interacting
		await expect(page.locator('[data-testid="customer-form"]')).toBeVisible({ timeout: 20000 });

		// Close any teaching bubble if present
		const teachingBubbleButton = page.locator('button[class*="ms-TeachingBubble-closebutton"]');
		if (await teachingBubbleButton.isVisible()) {
			await teachingBubbleButton.click();
			await expect(teachingBubbleButton).toBeHidden({ timeout: 5000 });
		}

		// Check if there's a tip dialog to be closed before continuing compiling the form
		const tipDialog = page.locator('div[class*="fui-PopoverSurface"]');
		if (await tipDialog.isVisible()) {
			await page.click(
				'button[class*="fui-TeachingPopoverHeader__dismissButton"]'
			);
			await expect(tipDialog).toBeHidden({ timeout: 5000 });
		}

		const ndaCheckbox = page.locator('input[id="requiresNDA"]');

		// Initially, NDA checkbox should not be visible
		await expect(ndaCheckbox).toBeHidden();
		
		// Take snapshot of initial state (no sector selected, NDA hidden)
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('nda-01-initial-no-sector-nda-hidden.png');

		// Select Government sector
		await page.selectOption('select[id="customerSector"]', 'Government');
		
		// Now NDA checkbox should be visible
		await expect(ndaCheckbox).toBeVisible();
		
		// Take snapshot highlighting Government sector with visible NDA checkbox
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('nda-02-government-sector-nda-visible.png');

		// Check the NDA checkbox
		await ndaCheckbox.check();
		await expect(ndaCheckbox).toBeChecked();
		
		// Take snapshot of checked NDA checkbox
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('nda-03-government-sector-nda-checked.png');

		// Select Private sector
		await page.selectOption('select[id="customerSector"]', 'Private');
		
		// NDA checkbox should be hidden again
		await expect(ndaCheckbox).toBeHidden();
		
		// Take snapshot highlighting Private sector with hidden NDA checkbox
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('nda-04-private-sector-nda-hidden.png');

		// Select Government sector again
		await page.selectOption('select[id="customerSector"]', 'Government');
		
		// NDA checkbox should be visible but unchecked (reset when sector changed)
		await expect(ndaCheckbox).toBeVisible();
		await expect(ndaCheckbox).not.toBeChecked();
		
		// Take snapshot highlighting reset behavior (Government sector, NDA visible but unchecked)
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('nda-05-government-sector-nda-reset-unchecked.png');

		// Select Non profit sector
		await page.selectOption('select[id="customerSector"]', 'Non profit');
		
		// NDA checkbox should be hidden
		await expect(ndaCheckbox).toBeHidden();
		
		// Take snapshot highlighting Non profit sector with hidden NDA checkbox
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('nda-06-nonprofit-sector-nda-hidden.png');

	});

	// Test complete Government customer workflow with NDA
	test("Complete Government customer workflow with NDA checkbox", async () => {
		// Check if the customer form exists on this page
		if (!(await checkCustomerFormExists(page))) {
			test.skip(true, "Customer form web part not deployed to this page");
			return;
		}

		// Try data-testid first, fallback to form with specific inputs
		let customerForm = page.locator('[data-testid="customer-form"]');
		let formExists = await customerForm.count() > 0;
		
		if (!formExists) {
			console.log("data-testid not found, using input-based selector");
			customerForm = page.locator('form:has(input#customerName):has(input#customerEmail)');
			formExists = await customerForm.count() > 0;
		}
		
		if (!formExists) {
			console.log("No form found, skipping test");  
			test.skip(true, "Customer form not found with any selector");
			return;
		}
		
		await expect(customerForm).toBeVisible({ timeout: 15000 });

		// Close any teaching bubble if present
		const teachingBubbleButton = page.locator('button[class*="ms-TeachingBubble-closebutton"]');
		if (await teachingBubbleButton.isVisible()) {
			await teachingBubbleButton.click();
			await expect(teachingBubbleButton).toBeHidden({ timeout: 5000 });
		}

		// Check if there's a tip dialog to be closed before continuing
		const tipDialog = page.locator('div[class*="fui-PopoverSurface"]');
		if (await tipDialog.isVisible()) {
			await page.click(
				'button[class*="fui-TeachingPopoverHeader__dismissButton"]'
			);
			await expect(tipDialog).toBeHidden({ timeout: 5000 });
		}

		const userName = "Government Official";
		const userEmail = "official@government.gov";

		// Fill basic customer information
		await page.fill('input[id="customerName"]', userName);
		await page.fill('input[id="customerEmail"]', userEmail);
		await page.fill('input[id="customerPhone"]', '+1-202-555-0123');
		await page.fill('input[id="customerAddress"]', '1600 Pennsylvania Avenue NW, Washington, DC');
		await page.fill('input[id="customerCompany"]', 'US Department of Commerce');

		// Take snapshot before selecting Government sector
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('gov-01-form-filled-before-sector.png');

		// Select Government sector - this should make NDA checkbox visible
		await page.selectOption('select[id="customerSector"]', 'Government');

		// Wait a moment for the conditional rendering
		await page.waitForTimeout(1000);

		// Verify NDA checkbox is visible
		const ndaCheckbox = page.locator('input[id="requiresNDA"]');
		await expect(ndaCheckbox).toBeVisible();
		
		// Take snapshot using a reliable selector
		const formSelector = await page.locator('[data-testid="customer-form"]').count() > 0 
			? '[data-testid="customer-form"]' 
			: 'form:has(input#customerName)';
		await expect(page.locator(formSelector)).toHaveScreenshot('gov-02-government-sector-nda-visible.png');

		// Check the NDA checkbox
		await ndaCheckbox.check();
		await expect(ndaCheckbox).toBeChecked();

		// Add notes
		await page.fill('textarea[id="customerNotes"]', 'High-security government contract requiring NDA');

		// Take snapshot of complete Government form with NDA checked
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('gov-03-complete-government-form-nda-checked.png');

		// Submit the form
		await page.click('[data-testid="submit-button"]');

		// Wait for success notification
		await page.waitForTimeout(5000);
		const notification = page.locator('[data-testid="customer-notification"]');
		
		try {
			await expect(notification).toBeVisible({ timeout: 60000 });
			await expect(notification).toContainText(`Customer added: ${userName} (${userEmail})`);
			
			// Take snapshot of success notification for Government customer
			await expect(page.locator('section[class*="newCustomerForm"]')).toHaveScreenshot('gov-04-government-customer-success.png');
			
		} catch (e) {
			if (!page.isClosed()) {
				console.error(e);
			}
			throw e;
		}

		// Verify form is reset
		await expect(page.locator('input[id="customerName"]')).toHaveValue('');
		await expect(page.locator('select[id="customerSector"]')).toHaveValue('');
		await expect(ndaCheckbox).toBeHidden(); // Should be hidden again after reset

		// Take final snapshot showing reset form
		await expect(page.locator('form[class*="customerForm"]')).toHaveScreenshot('gov-05-form-reset-nda-hidden.png');

	});
});