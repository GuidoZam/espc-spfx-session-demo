require('dotenv').config();
import { test as setup } from "@playwright/test";
import { AuthFile } from "./constants/AuthFile";
import { login } from "playwright-m365-helpers";
import * as OTPAuth from "otpauth";

console.log("Starting authentication setup for user " + process.env.MFA_USERNAME);

setup("authenticate", async ({ page }) => {
  // 1. Open the login page
  await page.goto(process.env.MFA_M365_URL || "");

  // 2. Enter the email address
  const emailInput = page.locator("input[type=email]");
  await emailInput.click();
  await emailInput.fill(process.env.MFA_USERNAME || "");

  // 3. Click on the "Next" button
  await page.getByRole("button", { name: "Next" }).click();
  console.log("Clicked 'Next' after entering email.");

  // 4. Enter the password
  const passwordInput = page.locator("input[type=password]");
  await passwordInput.click();
  await passwordInput.fill(process.env.MFA_PASSWORD || "");

  // 5. Click on the "Sign in" button
  await page.locator("input[type=submit]").click();
  console.log("Clicked 'Sign in' after entering password.");

  // 6. Enter the TOTP code
  const otpInput = await page.waitForSelector("input#idTxtBx_SAOTCC_OTC");
  let totp = new OTPAuth.TOTP({
    issuer: "Microsoft",
    label: process.env.MFA_USERNAME,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: process.env.MFA_TOTP_SECRET,
  });
  const code = totp.generate();
  await otpInput.fill(code);
  console.log("Entered TOTP code.");

  // 7. Click on the "Next" button
  await page.locator("input[type=submit]").click();

  // 8. Click on the "Yes" button to stay signed in
  const yesButton = page.locator("input[type=submit][value='Yes']");
  await yesButton.waitFor();
  console.log("Found 'Yes' button and ready for interaction.");
  await yesButton.click();
  console.log("Clicked 'Yes' to stay signed in.");

  console.log(`Successfully authenticated. Current URL: ${page.url()}`);
  await page.context().storageState({ path: AuthFile });
});
