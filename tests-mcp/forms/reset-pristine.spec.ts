// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Happy Path', () => {
  test('Reset on pristine form is harmless', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      // Ignore the site's missing favicon (404), which is unrelated to the form
      if (msg.type() === 'error' && !msg.location().url.endsWith('/favicon.ico')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/forms');

    // 1. Click reset-button immediately on fresh page
    await page.getByTestId('reset-button').click();

    await expect(page.getByTestId('full-name-input')).toHaveValue('');
    await expect(page.getByTestId('email-input')).toHaveValue('');
    await expect(page.getByTestId('password-input')).toHaveValue('');
    await expect(page.getByTestId('message-textarea')).toHaveValue('');
    await expect(page.getByTestId('topic-select')).toHaveValue('');
    await expect(page.getByTestId('form-error-message')).toBeHidden();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
    for (const id of ['full-name-error', 'email-error', 'password-error', 'topic-error', 'message-error', 'urgency-error']) {
      await expect(page.getByTestId(id)).toBeHidden();
    }
    expect(errors).toEqual([]);
  });
});
