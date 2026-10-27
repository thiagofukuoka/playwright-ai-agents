import { test, expect } from "@playwright/test";
import { text } from "node:stream/consumers";

test.beforeEach("Access WebSite", async ({ page }) => {
  await page.goto("http://localhost:3001/");
});

test("Date Picker", async ({ page }) => {
  await page.getByTestId("nav-date-picker").click();
  await page.getByTestId("native-date-input").click();
  await page.getByTestId("native-date-prev-month").click();
  await page.getByTestId("native-date-prev-month").click();
  await page.getByRole("button", { name: "4" }).first().click();
  await expect(page.getByTestId("native-date-output")).toContainText(
    "2026-08-04",
  );
  await expect(page.getByTestId("native-date-output")).toHaveText(
    "Selected date: 2026-08-04",
  );
});

test("Add a New User", async ({ page }) => {
  await page.getByTestId("nav-table").click();
  await page.getByTestId("add-user-name-input").click();
  await page.getByTestId("add-user-name-input").fill("Thiago Fukuoka");
  await page.getByTestId("add-user-email-input").click();
  await page
    .getByTestId("add-user-email-input")
    .fill("thiagofukuoka@gmail.com");
  await page.getByTestId("add-user-role-select").selectOption("Admin");
  await page.getByTestId("add-user-age-input").click();
  await page.getByTestId("add-user-age-input").fill("33");
  await page.getByTestId("add-user-submit").click();
  await page.getByTestId("table-search-input").click();
  await page.getByTestId("table-search-input").fill("Thiago Fukuoka");
  await expect(
    page.getByRole("cell", { name: "Thiago Fukuoka", exact: true }).first(),
  ).toBeVisible();

  const firstRow = page.getByTestId("table-body").locator("tr").first();
  console.log(await firstRow.locator(".cell-name").innerText());
  console.log(await firstRow.locator(".cell-email").innerText());
  console.log(await firstRow.locator(".cell-role").innerText());
  console.log(await firstRow.locator(".cell-age").innerText());
});

test("Drag and Drop", async ({ page }) => {
  await page.getByTestId("nav-drag-drop").click();
  await page
    .getByText("Review flaky test report")
    .dragTo(page.getByTestId("kanban-column-in-progress"));

  await expect(page.getByTestId("kanban-column-todo")).not.toContainText(
    "Review flaky test report",
  );
  await expect(page.getByTestId("kanban-column-in-progress")).toContainText(
    "Review flaky test report",
  );
});

test("Calendar", async ({ page }) => {
  await page.getByTestId("nav-calendar").click();
  await page.getByTestId("calendar-next-month").click();

  const dateSelected = page.getByTestId("calendar-day-2026-11-04");

  await dateSelected.click();
  await page.getByTestId("calendar-event-input").fill("Automation Test");
  await page.getByTestId("calendar-event-save").click();

  await expect(dateSelected.locator(".calendar-event-chip-text")).toHaveText(
    "Automation Test",
  );

  await dateSelected.locator(".calendar-event-delete").click();

  await expect(
    dateSelected.locator(".calendar-event-chip-text"),
  ).not.toBeVisible();
});

test("Frames", async({page}) => {
    await page.getByTestId('nav-frames-windows').click();
    await page.locator('[data-testid="embedded-frame"]').contentFrame().getByTestId('frame-input').click();
    await page.locator('[data-testid="embedded-frame"]').contentFrame().getByTestId('frame-input').fill('Test!!');
    await page.locator('[data-testid="embedded-frame"]').contentFrame().getByTestId('frame-button').click();
    await expect(page.locator('[data-testid="embedded-frame"]').contentFrame().getByTestId('frame-message')).toHaveText('Hello from inside the frame: Test!!');
})

test("New Page", async({page}) => {
    await page.getByTestId('nav-frames-windows').click();
    const page1Promise = page.waitForEvent('popup');
    await page.getByTestId('open-new-tab-link').click();
    const page1 = await page1Promise;
    console.log(await page1.getByTestId('page-title').textContent());
})