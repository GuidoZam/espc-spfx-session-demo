require('dotenv').config();
import { test as setup } from "@playwright/test";
import { AuthFile } from "./constants/AuthFile";

console.log("Starting authentication setup for user " + process.env.TEST_USERNAME);

/**
 * Login to Microsoft 365
 * More info: https://playwright.dev/docs/auth
 */
setup("authenticate", async ({ page }) => {
	await page.goto(process.env.TEST_SHAREPOINT_SITE_URL || "");

	const emailInput = page.locator("input[type=email]");
	await emailInput.waitFor();
	await emailInput.click();
	await emailInput.fill(process.env.TEST_USERNAME || "");

	await page.getByRole("button", { name: "Next" }).click();
	console.log("Clicked 'Next' after entering email.");

	const passwordInput = page.locator("input[type=password]");
	await passwordInput.waitFor();
	await passwordInput.click();
	await passwordInput.fill(process.env.TEST_PASSWORD || "");

	await page.locator("input[type=submit][value='Sign in']").click();
  console.log("Clicked 'Sign in' after entering password.");

	// Wait for the 'Yes' button up to 15 seconds
	const yesButton = page.locator("input[type=submit][value='Yes']");
	await yesButton.waitFor();
  console.log("Found 'Yes' button and ready for interaction.");
  await yesButton.click();
  console.log("Clicked 'Yes' to stay signed in.");

	console.log(`Successfully authenticated. Current URL: ${page.url()}`);

	// Save the authentication state for use in tests
	await page.context().storageState({ path: AuthFile });
});
