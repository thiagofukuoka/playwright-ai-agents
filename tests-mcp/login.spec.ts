import { test, expect } from "@playwright/test";

// Flow recorded via Playwright MCP (see .playwright-mcp/)
// Locators generated with browser_generate_locator
test.beforeEach("Access WebSite", async ({ page }) => {
  await page.goto("http://localhost:3001/");
});

test("Login with valid credentials", async ({ page }) => {
  await page.getByTestId("nav-login").click();
  await expect(page).toHaveURL("http://localhost:3001/login");
  await expect(page.getByTestId("page-title")).toHaveText("Login");

  await page.getByTestId("login-username").fill("student");
  await page.getByTestId("login-password").fill("Learn123!");

  const loginResponse = page.waitForResponse(
    (res) => res.url().endsWith("/login") && res.request().method() === "POST",
  );
  await page.getByTestId("login-submit").click();
  expect((await loginResponse).status()).toBe(200);

  // Message is only visible for ~800ms before the redirect to /account
  await expect(page.getByTestId("login-success-message")).toHaveText(
    "Login successful",
  );

  await expect(page).toHaveURL("http://localhost:3001/account");
  await expect(page.getByTestId("page-title")).toHaveText("Account");
  await expect(page.getByTestId("account-welcome")).toHaveText(
    "Welcome, student!",
  );
  await expect(page.getByTestId("logout-button")).toBeVisible();

  const cookies = await page.context().cookies();
  expect(cookies.find((c) => c.name === "pw_session")).toBeDefined();
});
