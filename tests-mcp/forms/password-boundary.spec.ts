// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from '@playwright/test';

async function fillBaseline(page: Page, password: string) {
  await page.getByTestId('full-name-input').fill('Jane Doe');
  await page.getByTestId('email-input').fill('jane@example.com');
  await page.getByTestId('password-input').fill(password);
  await page.getByTestId('topic-select').selectOption('billing');
  await page.getByTestId('message-textarea').fill('I need help');
  await page.getByTestId('urgency-low-radio').check();
}

test.describe('Forms - Edge Cases', () => {
  test('Password length boundary 7 vs 8', async ({ page }) => {
    await page.goto('/forms');

    // 1. Fill baseline with password '1234567' (7) and submit
    await fillBaseline(page, '1234567');
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toBeHidden();

    // 2. Reload, password '12345678' (8) and submit
    await page.goto('/forms');
    await fillBaseline(page, '12345678');
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('password-error')).toBeHidden();
    await expect(page.getByTestId('form-success-message')).toBeVisible();

    // 3. Reload, password of 9 and 128 chars
    for (const length of [9, 128]) {
      await page.goto('/forms');
      await fillBaseline(page, 'a'.repeat(length));
      await page.getByTestId('submit-button').click();
      await expect(page.getByTestId('password-error')).toBeHidden();
      await expect(page.getByTestId('form-success-message')).toBeVisible();
    }
  });
});
