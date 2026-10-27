// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Errors clear as each field is fixed', async ({ page }) => {
    await page.goto('/forms');

    // 1. Submit empty form, type 'Jane' in full-name-input, select topic, check a radio
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-error-message')).toBeVisible();

    // [BUG] Fixing a field must clear that field's error immediately, without resubmitting
    await page.getByTestId('full-name-input').fill('Jane');
    await expect(page.getByTestId('full-name-error')).toBeHidden();
    await expect(page.getByTestId('full-name-input')).toHaveAttribute('aria-invalid', 'false');

    await page.getByTestId('topic-select').selectOption('billing');
    await expect(page.getByTestId('topic-error')).toBeHidden();
    await expect(page.getByTestId('topic-select')).toHaveAttribute('aria-invalid', 'false');

    await page.getByTestId('urgency-low-radio').check();
    await expect(page.getByTestId('urgency-error')).toBeHidden();

    // Fields not yet fixed keep their errors
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('message-error')).toBeVisible();
  });
});
