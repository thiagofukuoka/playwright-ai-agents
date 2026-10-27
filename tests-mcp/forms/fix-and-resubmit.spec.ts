// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Fix errors and resubmit', async ({ page }) => {
    await page.goto('/forms');

    const errorIds = ['full-name-error', 'email-error', 'password-error', 'topic-error', 'message-error', 'urgency-error'];
    const inputIds = ['full-name-input', 'email-input', 'password-input', 'topic-select', 'message-textarea'];

    // 1. Submit empty form, then fill all fields with valid values without submitting
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-error-message')).toBeVisible();

    // [BUG] Each field error must clear as soon as that field becomes valid
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await expect(page.getByTestId('full-name-error')).toBeHidden();
    await page.getByTestId('email-input').fill('jane@example.com');
    await expect(page.getByTestId('email-error')).toBeHidden();
    await page.getByTestId('password-input').fill('Passw0rd!');
    await expect(page.getByTestId('password-error')).toBeHidden();
    await page.getByTestId('topic-select').selectOption('billing');
    await expect(page.getByTestId('topic-error')).toBeHidden();
    await page.getByTestId('message-textarea').fill('I need help');
    await expect(page.getByTestId('message-error')).toBeHidden();
    await page.getByTestId('urgency-low-radio').check();
    await expect(page.getByTestId('urgency-error')).toBeHidden();

    // 2. Click submit-button
    await page.getByTestId('submit-button').click();

    for (const id of errorIds) {
      await expect(page.getByTestId(id)).toBeHidden();
    }
    await expect(page.getByTestId('form-error-message')).toBeHidden();
    await expect(page.getByTestId('form-success-message')).toBeVisible();
    for (const id of inputIds) {
      await expect(page.getByTestId(id)).toHaveAttribute('aria-invalid', 'false');
    }
  });
});
