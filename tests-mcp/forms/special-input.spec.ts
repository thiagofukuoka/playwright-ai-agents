// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Special, script-like and unicode input', async ({ page }) => {
    const dialogs: string[] = [];
    page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    await page.goto('/forms');

    // 1. Enter script-like text, SQL-like text, emoji and RTL text
    const name = '<script>alert(1)</script>';
    const message = `<script>alert(1)</script> '; DROP TABLE users;-- 😀 مرحبا بالعالم`;

    await page.getByTestId('full-name-input').fill(name);
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('password-input').fill('Passw0rd!');
    await page.getByTestId('topic-select').selectOption('billing');
    await page.getByTestId('message-textarea').fill(message);
    await page.getByTestId('urgency-low-radio').check();
    await page.getByTestId('submit-button').click();

    // Values are treated as plain text, success is shown
    await expect(page.getByTestId('form-success-message')).toBeVisible();
    await expect(page.getByTestId('form-error-message')).toBeHidden();
    await expect(page.getByTestId('full-name-input')).toHaveValue(name);
    await expect(page.getByTestId('message-textarea')).toHaveValue(message);
    expect(dialogs).toEqual([]);
  });
});
