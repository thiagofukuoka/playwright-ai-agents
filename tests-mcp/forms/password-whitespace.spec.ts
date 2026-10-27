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
  test('Whitespace-only password is rejected', async ({ page }) => {
    await page.goto('/forms');

    // 1. Fill baseline with password of 8 spaces and submit
    await fillBaseline(page, ' '.repeat(8));
    await page.getByTestId('submit-button').click();
    // [BUG] A whitespace-only password (8 spaces) must be rejected
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toBeHidden();

    // 2. Reload, password of 7 spaces and submit
    await page.goto('/forms');
    await fillBaseline(page, ' '.repeat(7));
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toBeHidden();

    // 3. Reload, password '       a' (7 spaces + a) and submit
    await page.goto('/forms');
    await fillBaseline(page, ' '.repeat(7) + 'a');
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('password-error')).toBeHidden();
    await expect(page.getByTestId('form-success-message')).toBeVisible();
  });
});
