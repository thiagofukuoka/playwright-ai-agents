// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const fields = [
  { name: 'name', error: 'full-name-error', input: 'full-name-input' },
  { name: 'email', error: 'email-error', input: 'email-input' },
  { name: 'password', error: 'password-error', input: 'password-input' },
  { name: 'topic', error: 'topic-error', input: 'topic-select' },
  { name: 'message', error: 'message-error', input: 'message-textarea' },
  { name: 'urgency', error: 'urgency-error', input: undefined },
] as const;

test.describe('Forms - Edge Cases', () => {
  for (const missing of fields) {
    test(`Each required field missing individually - ${missing.name}`, async ({ page }) => {
      await page.goto('/forms');

      // 1. Fill baseline but leave only this field blank, then submit
      if (missing.name !== 'name') await page.getByTestId('full-name-input').fill('Jane Doe');
      if (missing.name !== 'email') await page.getByTestId('email-input').fill('jane@example.com');
      if (missing.name !== 'password') await page.getByTestId('password-input').fill('Passw0rd!');
      if (missing.name !== 'topic') await page.getByTestId('topic-select').selectOption('billing');
      if (missing.name !== 'message') await page.getByTestId('message-textarea').fill('I need help');
      if (missing.name !== 'urgency') await page.getByTestId('urgency-low-radio').check();
      await page.getByTestId('submit-button').click();

      // Only that field's error is visible
      for (const field of fields) {
        if (field.name === missing.name) {
          await expect(page.getByTestId(field.error)).toBeVisible();
        } else {
          await expect(page.getByTestId(field.error)).toBeHidden();
        }
        if (field.input) {
          await expect(page.getByTestId(field.input)).toHaveAttribute(
            'aria-invalid',
            field.name === missing.name ? 'true' : 'false',
          );
        }
      }

      await expect(page.getByTestId('form-error-message')).toBeVisible();
      await expect(page.getByTestId('form-success-message')).toBeHidden();
    });
  }
});
