// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const urgencies = ['urgency-low-radio', 'urgency-medium-radio', 'urgency-high-radio'];

test.describe('Forms - Happy Path', () => {
  for (const urgency of urgencies) {
    test(`Submit valid form with every urgency level - ${urgency}`, async ({ page }) => {
      // 1. Reload, fill baseline with that radio checked, submit
      await page.goto('/forms');
      await page.getByTestId('full-name-input').fill('Jane Doe');
      await page.getByTestId('email-input').fill('jane@example.com');
      await page.getByTestId('password-input').fill('Passw0rd!');
      await page.getByTestId('topic-select').selectOption('billing');
      await page.getByTestId('message-textarea').fill('I need help');
      await page.getByTestId(urgency).check();
      await page.getByTestId('submit-button').click();

      await expect(page.getByTestId('form-success-message')).toBeVisible();
      await expect(page.getByTestId('urgency-error')).toBeHidden();
      await expect(page.getByTestId(urgency)).toBeChecked();
    });
  }
});
