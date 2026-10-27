// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const topics = [
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical issue' },
  { value: 'account', label: 'Account access' },
  { value: 'other', label: 'Other' },
];

test.describe('Forms - Happy Path', () => {
  for (const { value, label } of topics) {
    test(`Submit valid form with every topic option - ${value}`, async ({ page }) => {
      // 1. Reload /forms, fill baseline, selectOption(value), submit
      await page.goto('/forms');
      await page.getByTestId('full-name-input').fill('Jane Doe');
      await page.getByTestId('email-input').fill('jane@example.com');
      await page.getByTestId('password-input').fill('Passw0rd!');
      await page.getByTestId('topic-select').selectOption(value);
      await page.getByTestId('message-textarea').fill('I need help');
      await page.getByTestId('urgency-low-radio').check();
      await page.getByTestId('submit-button').click();

      await expect(page.getByTestId('form-success-message')).toBeVisible();
      await expect(page.getByTestId('topic-error')).toBeHidden();
      await expect(page.getByTestId('topic-select')).toHaveValue(value);
      await expect(page.getByTestId('topic-select').locator('option:checked')).toHaveText(label);
    });
  }
});
