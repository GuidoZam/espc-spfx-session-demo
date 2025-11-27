import { defineConfig, devices } from '@playwright/test';
import { AuthFile } from "./tests/constants/AuthFile";

export default defineConfig({
	testDir: "./tests",
	retries: process.env.CI ? 2 : 0,
	workers: 1, // Use single worker to avoid SharePoint auth conflicts
	timeout: process.env.CI ? 120000 : 60000, // Increase timeout for CI environment
	use: {
		headless: true,
		baseURL: process.env.TEST_SHAREPOINT_SITE_URL,
		trace: "on-first-retry",
		actionTimeout: process.env.CI ? 45000 : 30000, // Increase action timeout for CI
		navigationTimeout: process.env.CI ? 45000 : 30000, // Increase navigation timeout for CI
		// Add viewport for consistency
		viewport: { width: 1280, height: 720 },
	},
	// Configure screenshot and snapshot behavior
	expect: {
		// Enable animations control for consistent snapshots
		toHaveScreenshot: {
			animations: 'disabled',
			scale: 'css',
			threshold: process.env.CI ? 0.3 : 0.2 // Higher threshold for CI
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
		{
			name: "Firefox",
			use: {
				...devices["Desktop Firefox"],
				storageState: AuthFile, // Using the auth (storage state) file
			},
			dependencies: ["setup"], // Setup will run first
		},
		{
			name: "WebKit",
			use: {
				...devices["Desktop Safari"],
				storageState: AuthFile, // Using the auth (storage state) file
			},
			dependencies: ["setup"], // Setup will run first
		}
	],
});
