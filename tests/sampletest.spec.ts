import { expect, test } from "@playwright/test";

test("sample 01", () => {
  console.log("first test");
  console.log("second test");
});

test("web test", async ({ page }) => {
  await page.goto("http://localhost:3001/");
  await expect(page).toHaveTitle(/HourToLearn/);
});
