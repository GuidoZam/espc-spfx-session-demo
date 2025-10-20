import { test, expect, Page } from '@playwright/test';

test.describe("Page load", () => {
	let page: Page;

	test.beforeEach(async ({ browser }) => {
		// Open a new page for each test
		page = await browser.newPage();
		await page.goto(process.env.TEST_SHAREPOINT_SITE_URL || "", {
			waitUntil: "domcontentloaded",
		});
	});

	test.afterEach(async () => {
		await page.close();
	});

	// Check that the page title is present and contains "ESPC25" text
	test("Check site header title", async () => {
		const header = page.locator("[data-automationid='SiteHeaderTitle'] a");
		await header.waitFor();
		await expect(header).toHaveText(/ESPC25/);
	});

	// Test to fill and submit the customer form
	test("Add customer form works with all fields", async () => {
		// Ensure the form is present and visible before interacting
		await expect(page.locator('form[class*="customerForm"]')).toBeVisible({ timeout: 10000 });

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

		const userName = "Jane Doe";
		const userEmail = "jane@example.com";

		// Adjust selectors as needed for your actual DOM
		await page.fill('input[id="customerName"]', userName);
		await page.fill('input[id="customerEmail"]', userEmail);
		await page.fill('input[id="customerPhone"]', '1234567890');
		await page.fill('input[id="customerAddress"]', '123 Main St');
		await page.fill('input[id="customerCompany"]', 'Acme Corp');
		await page.fill('textarea[id="customerNotes"]', 'VIP customer');
		await page.fill('input[id="customerSocialHandle"]', '@janedoe');
		await page.click('button[type="submit"][class*="submitBtn"]');

		// Wait longer to allow React to render notification
		await page.waitForTimeout(5000);

		// Use robust Playwright expect for notification
		const notification = page.locator('div[class*="ms-MessageBar--success"]');
		try {
			await expect(notification).toBeVisible({ timeout: 60000 });
			await expect(notification).toContainText(`Customer added: ${userName} (${userEmail})`);
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
		await expect(page.locator('textarea[id="customerNotes"]')).toHaveValue('');
		await expect(page.locator('input[id="customerSocialHandle"]')).toHaveValue('');
	});
});