// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Happy Path', () => {
  test('Submit valid form with required fields only', async ({ page }) => {
    await page.goto('/forms');

    // 1. Fill the valid baseline (no contact checkboxes) and click submit-button
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('password-input').fill('Passw0rd!');
    await page.getByTestId('topic-select').selectOption('billing');
    await page.getByTestId('message-textarea').fill('I need help');
    await page.getByTestId('urgency-low-radio').check();
    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('form-success-message')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toHaveText('Form submitted successfully');
    await expect(page.getByTestId('form-error-message')).toBeHidden();
    for (const id of ['full-name-error', 'email-error', 'password-error', 'topic-error', 'message-error', 'urgency-error']) {
      await expect(page.getByTestId(id)).toBeHidden();
    }
    for (const id of ['full-name-input', 'email-input', 'password-input', 'topic-select', 'message-textarea']) {
      await expect(page.getByTestId(id)).toHaveAttribute('aria-invalid', 'false');
    }
    await expect(page).toHaveURL(/\/forms$/);

    // 2. Inspect field values after success
    // [BUG] The form must be cleared after a successful submit
    await expect(page.getByTestId('form-success-message')).toBeVisible();
    await expect(page.getByTestId('full-name-input')).toHaveValue('');
    await expect(page.getByTestId('email-input')).toHaveValue('');
    await expect(page.getByTestId('password-input')).toHaveValue('');
    await expect(page.getByTestId('topic-select')).toHaveValue('');
    await expect(page.getByTestId('message-textarea')).toHaveValue('');
    for (const id of ['urgency-low-radio', 'urgency-medium-radio', 'urgency-high-radio']) {
      await expect(page.getByTestId(id)).not.toBeChecked();
    }
  });
});
