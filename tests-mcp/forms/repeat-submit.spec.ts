// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Double submit and repeated invalid submits', async ({ page }) => {
    await page.goto('/forms');

    // 1. Click submit-button twice on empty form
    await page.getByTestId('submit-button').click();
    await page.getByTestId('submit-button').click();

    // Single set of messages and one banner (no duplication)
    await expect(page.locator('.form-error:visible')).toHaveCount(6);
    await expect(page.getByTestId('form-error-message')).toHaveCount(1);
    await expect(page.getByTestId('form-error-message')).toBeVisible();
    await expect(page.getByTestId('form-error-message')).toHaveText('Please fix the highlighted fields and try again.');
    await expect(page.getByTestId('full-name-error')).toHaveCount(1);
    await expect(page.getByTestId('form-success-message')).toBeHidden();

    // 2. Submit valid baseline twice
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('password-input').fill('Passw0rd!');
    await page.getByTestId('topic-select').selectOption('billing');
    await page.getByTestId('message-textarea').fill('I need help');
    await page.getByTestId('urgency-low-radio').check();

    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-success-message')).toBeVisible();
    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('form-success-message')).toHaveCount(1);
    await expect(page.getByTestId('form-success-message')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toHaveText('Form submitted successfully');
    await expect(page.getByTestId('form-error-message')).toBeHidden();
    await expect(page.locator('.form-error:visible')).toHaveCount(0);
  });
});
