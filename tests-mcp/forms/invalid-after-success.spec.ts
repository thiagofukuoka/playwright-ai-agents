// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Invalid resubmit after success', async ({ page }) => {
    await page.goto('/forms');

    // 1. Submit valid baseline (success), then change email to 'bad' and submit
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('password-input').fill('Passw0rd!');
    await page.getByTestId('topic-select').selectOption('billing');
    await page.getByTestId('message-textarea').fill('I need help');
    await page.getByTestId('urgency-low-radio').check();
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-success-message')).toBeVisible();

    await page.getByTestId('email-input').fill('bad');
    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('form-success-message')).toBeHidden();
    await expect(page.getByTestId('form-error-message')).toBeVisible();
    await expect(page.getByTestId('email-error')).toBeVisible();
    for (const id of ['full-name-error', 'password-error', 'topic-error', 'message-error', 'urgency-error']) {
      await expect(page.getByTestId(id)).toBeHidden();
    }
  });
});
