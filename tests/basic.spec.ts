import { test, expect, Page } from '@playwright/test';

test.describe("Page load", () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		// Open a new page to be reused between tests
		page = await browser.newPage();
		await page.goto(process.env.TEST_SHAREPOINT_SITE_URL || "", {
			waitUntil: "domcontentloaded",
		});
	});

	test.afterAll(async () => {
		await page.close();
	});

	test("Check site header title", async () => {
		const header = page.locator("[data-automationid='SiteHeaderTitle'] a");
		await header.waitFor();

		await expect(header).toHaveText(/Test/);
	});

	test("Add customer form works with all fields", async () => {
		// Adjust selectors as needed for your actual DOM
		await page.fill('input[id="customerName"]', 'John Doe');
		await page.fill('input[id="customerEmail"]', 'john@example.com');
		await page.fill('input[id="customerPhone"]', '1234567890');
		await page.fill('input[id="customerAddress"]', '123 Main St');
		await page.fill('input[id="customerCompany"]', 'Acme Corp');
		await page.fill('textarea[id="customerNotes"]', 'VIP customer');

		await page.click('button[type="submit"]');

		// dismiss dialog or alert
		await page.on('dialog', async dialog => {
			expect(dialog.message()).toContain('Customer added');
			await dialog.dismiss();
		});

		// Optionally, check for form reset or success message
		await expect(page.locator('input[id="customerName"]')).toHaveValue('');
		await expect(page.locator('input[id="customerEmail"]')).toHaveValue('');
		await expect(page.locator('input[id="customerCompany"]')).toHaveValue('');
		await expect(page.locator('input[id="customerPhone"]')).toHaveValue('');
		await expect(page.locator('input[id="customerAddress"]')).toHaveValue('');
		await expect(page.locator('textarea[id="customerNotes"]')).toHaveValue('');
	});
});