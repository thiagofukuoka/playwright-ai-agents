// spec: specs/practice-features.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

// 15th day of next month, as YYYY-MM-DD (local time, zero-padded)
function nextMonth15(): string {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + 1, 15);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-15`;
}

test.describe('Practice Site Features', () => {
  test('Date Picker: Native Date Input', async ({ page }) => {
    const expectedDate = nextMonth15();

    await test.step('Navigate to the date picker page', async () => {
      await page.goto(`${BASE_URL}/date-picker`);
      await expect(page.getByTestId('page-title')).toHaveText('Date Picker');
      await expect(page.getByTestId('native-date-output')).toHaveText('No date selected yet.');
      await expect(page.getByTestId('native-date-input')).toHaveValue('');
    });

    await test.step('Open the popup', async () => {
      await page.getByTestId('native-date-input').click();
      await expect(page.getByTestId('native-date-popup')).toBeVisible();
    });

    await test.step('Go to next month and pick the 15th', async () => {
      await page.getByTestId('native-date-next-month').click();
      await page.getByTestId('native-date-days').getByRole('button', { name: '15', exact: true }).click();
      await expect(page.getByTestId('native-date-popup')).not.toBeVisible();
      await expect(page.getByTestId('native-date-input')).toHaveValue(expectedDate);
      await expect(page.getByTestId('native-date-output')).toHaveText(`Selected date: ${expectedDate}`);
    });
  });

  test('Table: Add a User', async ({ page }) => {
    const email = `nila.${Date.now()}@hourtolearn.dev`;

    await test.step('Navigate to the table page', async () => {
      await page.goto(`${BASE_URL}/table`);
      await expect(page.getByTestId('page-title')).toHaveText('Table');
      await expect(page.getByTestId('users-table')).toBeVisible();
      await expect(page.getByTestId('table-body').getByRole('row')).toHaveCount(5);
    });

    await test.step('Fill the add user form', async () => {
      await page.getByTestId('add-user-name-input').fill('Nila');
      await page.getByTestId('add-user-email-input').fill(email);
      await page.getByTestId('add-user-role-select').selectOption('Editor');
      await page.getByTestId('add-user-age-input').fill('30');
    });

    await test.step('Submit the form', async () => {
      await page.getByTestId('add-user-submit').click();
      await expect(page.getByTestId('add-user-name-input')).toHaveValue('');
      await expect(page.getByTestId('add-user-error-message')).not.toBeVisible();
    });

    await test.step('Search for the new user and verify the row', async () => {
      await page.getByTestId('table-search-input').fill(email);
      const row = page.getByTestId('table-body').getByRole('row').filter({ hasText: email });
      await expect(row).toHaveCount(1);
      await expect(row.getByRole('cell').nth(1)).toHaveText('Nila');
      await expect(row.getByRole('cell').nth(2)).toHaveText(email);
      await expect(row.getByRole('cell').nth(3)).toHaveText('Editor');
      await expect(row.getByRole('cell').nth(4)).toHaveText('30');
    });
  });

  test('Drag and Drop: Move a Task', async ({ page }) => {
    const todo = page.getByTestId('kanban-column-todo');
    const inProgress = page.getByTestId('kanban-column-in-progress');

    await test.step('Navigate to the drag and drop page', async () => {
      await page.goto(`${BASE_URL}/drag-drop`);
      await expect(page.getByTestId('page-title')).toHaveText('Drag & Drop');
      await expect(todo.getByTestId('kanban-card-2')).toHaveText('Set up CI pipeline');
    });

    await test.step('Drag "Set up CI pipeline" to In Progress', async () => {
      await todo.getByTestId('kanban-card-2').dragTo(inProgress.locator('[data-dropzone]'));
    });

    await test.step('Verify the card moved', async () => {
      await expect(inProgress.getByTestId('kanban-card-2')).toHaveText('Set up CI pipeline');
      await expect(todo.getByTestId('kanban-card-2')).toHaveCount(0);
      await expect(todo.getByText('Set up CI pipeline')).not.toBeVisible();
    });

    await test.step('Reset the board', async () => {
      await page.getByTestId('kanban-reset').click();
      await expect(todo.getByTestId('kanban-card-2')).toBeVisible();
      await expect(inProgress.getByTestId('kanban-card-2')).toHaveCount(0);
    });
  });

  test('Calendar: Add and Delete an Event', async ({ page }) => {
    const date = nextMonth15();
    const day = page.getByTestId(`calendar-day-${date}`);

    await test.step('Navigate to the calendar page', async () => {
      await page.goto(`${BASE_URL}/calendar`);
      await expect(page.getByTestId('page-title')).toHaveText('Calendar');
    });

    await test.step('Go to next month and select the 15th', async () => {
      await page.getByTestId('calendar-next-month').click();
      await day.click();
      await expect(page.getByTestId('calendar-event-input')).toBeVisible();
    });

    await test.step('Add the event', async () => {
      await page.getByTestId('calendar-event-input').fill('Team Meeting');
      await page.getByTestId('calendar-event-save').click();
      await expect(day.getByText('Team Meeting')).toBeVisible();
    });

    await test.step('Delete the event', async () => {
      await day.getByRole('button', { name: 'Delete event Team Meeting' }).click();
      await expect(day.getByText('Team Meeting')).toHaveCount(0);
      await expect(page.getByText('Team Meeting')).toHaveCount(0);
    });
  });

  test('Frames and Windows: Display a Message in an Embedded Frame', async ({ page }) => {
    const frame = page.frameLocator('[data-testid="embedded-frame"]');

    await test.step('Navigate to the frames page', async () => {
      await page.goto(`${BASE_URL}/frames-windows`);
      await expect(page.getByTestId('page-title')).toHaveText('Frames & Windows');
      await expect(page.getByTestId('embedded-frame')).toBeVisible();
    });

    await test.step('Verify the frame content', async () => {
      await expect(frame.getByText('Type something')).toBeVisible();
      await expect(frame.getByTestId('frame-message')).toHaveText('');
    });

    await test.step('Type a message and show it', async () => {
      await frame.getByTestId('frame-input').fill('Hello Playwright');
      await frame.getByTestId('frame-button').click();
      await expect(frame.getByTestId('frame-message')).toHaveText('Hello from inside the frame: Hello Playwright');
    });

    await test.step('Clear the input and show the message again', async () => {
      await frame.getByTestId('frame-input').fill('');
      await frame.getByTestId('frame-button').click();
      await expect(frame.getByTestId('frame-message')).toHaveText('Hello from inside the frame:');
    });
  });

  test('Frames and Windows: Open Content in a New Page', async ({ page }) => {
    await test.step('Navigate to the frames page', async () => {
      await page.goto(`${BASE_URL}/frames-windows`);
      await expect(page.getByTestId('open-new-tab-link')).toBeVisible();
    });

    await test.step('Open the link in a new tab', async () => {
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('open-new-tab-link').click();
      const newPage = await popupPromise;

      await expect(newPage).toHaveURL(/\/dynamic-content$/);
      await expect(newPage.getByTestId('page-title')).toHaveText('Dynamic Content');
      await expect(newPage.getByRole('heading', { name: 'Dynamic Content' })).toBeVisible();
      await expect(page).toHaveURL(/\/frames-windows$/);
    });
  });
});
