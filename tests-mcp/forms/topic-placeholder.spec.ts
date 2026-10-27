// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Re-selecting topic placeholder', async ({ page }) => {
    await page.goto('/forms');

    // 1. Fill baseline, select 'billing', then selectOption('') (placeholder) and submit
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('password-input').fill('Passw0rd!');
    await page.getByTestId('topic-select').selectOption('billing');
    await page.getByTestId('message-textarea').fill('I need help');
    await page.getByTestId('urgency-low-radio').check();
    await page.getByTestId('topic-select').selectOption('');
    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('topic-error')).toBeVisible();
    await expect(page.getByTestId('topic-select')).toHaveValue('');
    await expect(page.getByTestId('full-name-error')).toBeHidden();
    await expect(page.getByTestId('email-error')).toBeHidden();
    await expect(page.getByTestId('password-error')).toBeHidden();
    await expect(page.getByTestId('message-error')).toBeHidden();
    await expect(page.getByTestId('urgency-error')).toBeHidden();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
  });
});
