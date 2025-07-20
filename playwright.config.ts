import { defineConfig, devices } from '@playwright/test';
import { AuthFile } from "./tests/constants/AuthFile";

export default defineConfig({
	testDir: "./tests",
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 2 : undefined,
	use: {
		headless: true,
		baseURL: process.env.TEST_SHAREPOINT_SITE_URL,
		trace: "on-first-retry",
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
		},
	],
});
