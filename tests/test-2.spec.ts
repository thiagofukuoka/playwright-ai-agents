import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3001/");
  await page.getByTestId("home-card-forms").click();
  await page.getByTestId("full-name-input").fill("Thiago Fukuoka");
  await page.getByTestId("email-input").fill("thiagofukuoka@gmail.com");
  await page.getByTestId("password-input").fill("123456");
  await page.getByTestId("topic-select").selectOption("billing");
  await page.getByTestId("message-textarea").fill("Test demo");
  await page.getByTestId("contact-sms-checkbox").check();
  await page.getByTestId("urgency-high-radio").check();
  await page.getByTestId('submit-button').click();
  await expect(page.getByTestId("form-success-message")).toBeVisible();
});
