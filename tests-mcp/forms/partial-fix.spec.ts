// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Partial fix keeps remaining errors', async ({ page }) => {
    await page.goto('/forms');

    // 1. Submit empty, fix only name and email, submit again
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-error-message')).toBeVisible();

    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('full-name-error')).toBeHidden();
    await expect(page.getByTestId('email-error')).toBeHidden();
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('topic-error')).toBeVisible();
    await expect(page.getByTestId('message-error')).toBeVisible();
    await expect(page.getByTestId('urgency-error')).toBeVisible();
    await expect(page.getByTestId('form-error-message')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
  });
});
