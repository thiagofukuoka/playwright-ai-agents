// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Happy Path', () => {
  test('Reset clears values and success banner', async ({ page }) => {
    await page.goto('/forms');

    // 1. Fill baseline plus all checkboxes, submit successfully, click reset-button
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('password-input').fill('Passw0rd!');
    await page.getByTestId('topic-select').selectOption('billing');
    await page.getByTestId('message-textarea').fill('I need help');
    await page.getByTestId('urgency-low-radio').check();
    await page.getByTestId('contact-email-checkbox').check();
    await page.getByTestId('contact-sms-checkbox').check();
    await page.getByTestId('contact-phone-checkbox').check();
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-success-message')).toBeVisible();

    await page.getByTestId('reset-button').click();

    await expect(page.getByTestId('full-name-input')).toHaveValue('');
    await expect(page.getByTestId('email-input')).toHaveValue('');
    await expect(page.getByTestId('password-input')).toHaveValue('');
    await expect(page.getByTestId('message-textarea')).toHaveValue('');
    await expect(page.getByTestId('topic-select')).toHaveValue('');
    for (const id of ['contact-email-checkbox', 'contact-sms-checkbox', 'contact-phone-checkbox', 'urgency-low-radio', 'urgency-medium-radio', 'urgency-high-radio']) {
      await expect(page.getByTestId(id)).not.toBeChecked();
    }
    await expect(page.getByTestId('form-success-message')).toBeHidden();

    // Further submit shows all required errors (fresh state)
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-error-message')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
    await expect(page.getByTestId('full-name-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('topic-error')).toBeVisible();
    await expect(page.getByTestId('message-error')).toBeVisible();
    await expect(page.getByTestId('urgency-error')).toBeVisible();
  });
});
