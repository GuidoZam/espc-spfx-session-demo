import { defineConfig, devices } from '@playwright/test';
import { AuthFile } from "./tests/constants/AuthFile";

export default defineConfig({
	testDir: "./tests",
	retries: process.env.CI ? 2 : 0,
	workers: 1, // Use single worker to avoid SharePoint auth conflicts
	timeout: 60000, // Set test timeout to 60 seconds
	use: {
		headless: true,
		baseURL: process.env.TEST_SHAREPOINT_SITE_URL,
		trace: "on-first-retry",
		actionTimeout: 30000, // Set action timeout to 30 seconds
		navigationTimeout: 30000, // Set navigation timeout to 30 seconds
	},
	// Configure screenshot and snapshot behavior
	expect: {
		// Enable animations control for consistent snapshots
		toHaveScreenshot: {
			animations: 'disabled',
			scale: 'css',
			threshold: 0.2
		}
	},
	projects: [
		{
			name: "setup",
			testMatch: /login\.setup.ts/,
		},
		{
			name: "Chromium",
			use: {
				...devices["Desktop Chrome"],
				storageState: AuthFile, // Using the auth (storage state) file
			},
			dependencies: ["setup"], // Setup will run first
		},
	],
});
