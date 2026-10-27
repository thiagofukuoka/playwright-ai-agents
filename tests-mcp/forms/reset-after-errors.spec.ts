// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Reset after errors', async ({ page }) => {
    await page.goto('/forms');

    const errorIds = ['full-name-error', 'email-error', 'password-error', 'topic-error', 'message-error', 'urgency-error'];
    const inputIds = ['full-name-input', 'email-input', 'password-input', 'topic-select', 'message-textarea'];

    // 1. Submit empty form (errors shown), click reset-button
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-error-message')).toBeVisible();
    await page.getByTestId('reset-button').click();

    for (const id of errorIds) {
      await expect(page.getByTestId(id)).toBeHidden();
    }
    await expect(page.getByTestId('form-error-message')).toBeHidden();
    for (const id of inputIds) {
      await expect(page.getByTestId(id)).toHaveAttribute('aria-invalid', 'false');
    }

    // 2. Fill partial data, submit (errors), reset
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('bad');
    await page.getByTestId('urgency-high-radio').check();
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-error-message')).toBeVisible();
    await expect(page.getByTestId('email-error')).toBeVisible();

    await page.getByTestId('reset-button').click();

    await expect(page.getByTestId('full-name-input')).toHaveValue('');
    await expect(page.getByTestId('email-input')).toHaveValue('');
    await expect(page.getByTestId('password-input')).toHaveValue('');
    await expect(page.getByTestId('topic-select')).toHaveValue('');
    await expect(page.getByTestId('message-textarea')).toHaveValue('');
    await expect(page.getByTestId('urgency-high-radio')).not.toBeChecked();
    for (const id of errorIds) {
      await expect(page.getByTestId(id)).toBeHidden();
    }
    await expect(page.getByTestId('form-error-message')).toBeHidden();
  });
});
