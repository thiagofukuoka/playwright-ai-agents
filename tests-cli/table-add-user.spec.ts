// Flow explored with playwright-cli (see .playwright-cli/)

import { test, expect } from '@playwright/test';

test.describe('Table - add user', () => {
  test('a newly created user is listed in the table', async ({ page }, testInfo) => {
    // Unique per run/browser: the server keeps users in memory and projects run in parallel.
    const id = `${testInfo.project.name}-${Date.now()}`;
    const user = {
      name: `Cli Tester ${id}`,
      email: `cli.tester.${id}@hourtolearn.dev`,
      role: 'Editor',
      age: '30',
    };

    await page.goto('/table');

    await page.getByTestId('add-user-name-input').fill(user.name);
    await page.getByTestId('add-user-email-input').fill(user.email);
    await page.getByTestId('add-user-role-select').selectOption(user.role);
    await page.getByTestId('add-user-age-input').fill(user.age);

    const created = page.waitForResponse(
      (res) => res.url().endsWith('/api/users') && res.request().method() === 'POST',
    );
    await page.getByTestId('add-user-submit').click();
    expect((await created).status()).toBe(201);

    await expect(page.getByTestId('add-user-error-message')).toBeHidden();

    // The table is paginated, so search to bring the new user onto the current page.
    await page.getByTestId('table-search-input').fill(user.name);

    const rows = page.getByTestId('table-body').getByRole('row');
    await expect(rows).toHaveCount(1);
    await expect(rows.first().getByRole('cell')).toHaveText(['', user.name, user.email, user.role, user.age]);
  });
});
