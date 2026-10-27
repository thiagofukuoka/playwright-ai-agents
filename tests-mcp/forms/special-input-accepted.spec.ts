// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Happy Path', () => {
  test('Valid special, unicode and long input accepted', async ({ page }) => {
    const errors: string[] = [];
    const dialogs: string[] = [];
    page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      // Ignore the site's missing favicon (404), which is unrelated to the form
      if (msg.type() === 'error' && !msg.location().url.endsWith('/favicon.ico')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/forms');

    // 1. Fill special/unicode/long values and submit
    const message = '<script>alert(1)</script> ñ 日本語 😀' + 'x'.repeat(5000);
    await page.getByTestId('full-name-input').fill("O'Brien <b>");
    await page.getByTestId('email-input').fill('a+b@sub.example.co');
    await page.getByTestId('password-input').fill('pässwörd');
    await page.getByTestId('topic-select').selectOption('technical');
    await page.getByTestId('message-textarea').fill(message);
    await page.getByTestId('urgency-low-radio').check();
    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('form-success-message')).toBeVisible();
    await expect(page.getByTestId('form-error-message')).toBeHidden();

    // Values are treated as plain text and retained as typed
    await expect(page.getByTestId('full-name-input')).toHaveValue("O'Brien <b>");
    await expect(page.getByTestId('message-textarea')).toHaveValue(message);

    // No script executed and nothing was rendered as HTML
    expect(dialogs).toEqual([]);
    await expect(page.locator('main b')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
