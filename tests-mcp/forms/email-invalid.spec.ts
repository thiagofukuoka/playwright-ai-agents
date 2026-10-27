// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const invalidEmails = ['plainaddress', 'jane@example', 'jane@.com', '@x.com', 'jane@@x.com', 'jane doe@x.com'];

test.describe('Forms - Edge Cases', () => {
  for (const email of invalidEmails) {
    test(`Email invalid formats rejected - "${email}"`, async ({ page }) => {
      await page.goto('/forms');

      // 1. Fill baseline with the invalid email and submit
      await page.getByTestId('full-name-input').fill('Jane Doe');
      await page.getByTestId('email-input').fill(email);
      await page.getByTestId('password-input').fill('Passw0rd!');
      await page.getByTestId('topic-select').selectOption('billing');
      await page.getByTestId('message-textarea').fill('I need help');
      await page.getByTestId('urgency-low-radio').check();
      await page.getByTestId('submit-button').click();

      await expect(page.getByTestId('email-error')).toBeVisible();
      await expect(page.getByTestId('form-error-message')).toBeVisible();
      await expect(page.getByTestId('form-success-message')).toBeHidden();
    });
  }
});
