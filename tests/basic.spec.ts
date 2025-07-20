import { test, expect, Page } from '@playwright/test';

test.describe("Page load", () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		// Open a new page to be reused between tests
		page = await browser.newPage();
		await page.goto(process.env.SHAREPOINT_SITE_URL || "", {
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
});