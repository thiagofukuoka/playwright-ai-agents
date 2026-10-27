// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from '@playwright/test';

async function fillBaseline(page: Page, overrides: { name?: string; message?: string } = {}) {
  await page.getByTestId('full-name-input').fill(overrides.name ?? 'Jane Doe');
  await page.getByTestId('email-input').fill('jane@example.com');
  await page.getByTestId('password-input').fill('Passw0rd!');
  await page.getByTestId('topic-select').selectOption('billing');
  await page.getByTestId('message-textarea').fill(overrides.message ?? 'I need help');
  await page.getByTestId('urgency-low-radio').check();
}

test.describe('Forms - Edge Cases', () => {
  test('Whitespace-only name and message rejected', async ({ page }) => {
    await page.goto('/forms');

    // 1. Fill baseline but name '     ' and submit
    await fillBaseline(page, { name: '     ' });
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('full-name-error')).toBeVisible();
    await expect(page.getByTestId('message-error')).toBeHidden();
    await expect(page.getByTestId('form-success-message')).toBeHidden();

    // 2. Reload, fill baseline but message '   \n  ' and submit
    await page.goto('/forms');
    await fillBaseline(page, { message: '   \n  ' });
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('message-error')).toBeVisible();
    await expect(page.getByTestId('full-name-error')).toBeHidden();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
  });
});
