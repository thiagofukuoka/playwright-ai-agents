// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Happy Path', () => {
  test('Initial page state', async ({ page }) => {
    // 1. Navigate to /forms
    await page.goto('/forms');
    await expect(page).toHaveTitle('Forms · HourToLearn Practice Site');
    await expect(page.getByTestId('page-title')).toHaveText('Forms');

    // 2. Inspect all form controls
    await expect(page.getByTestId('full-name-input')).toHaveValue('');
    await expect(page.getByTestId('email-input')).toHaveValue('');
    await expect(page.getByTestId('password-input')).toHaveValue('');
    await expect(page.getByTestId('message-textarea')).toHaveValue('');
    const topic = page.getByTestId('topic-select');
    await expect(topic).toHaveValue('');
    await expect(topic.locator('option:checked')).toHaveText('Select a topic…');

    for (const id of ['contact-email-checkbox', 'contact-sms-checkbox', 'contact-phone-checkbox', 'urgency-low-radio', 'urgency-medium-radio', 'urgency-high-radio']) {
      await expect(page.getByTestId(id)).not.toBeChecked();
    }

    await expect(page.getByTestId('submit-button')).toHaveText('Submit request');
    await expect(page.getByTestId('submit-button')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeEnabled();
    await expect(page.getByTestId('reset-button')).toHaveText('Reset');
    await expect(page.getByTestId('reset-button')).toBeVisible();
    await expect(page.getByTestId('reset-button')).toBeEnabled();
    await expect(page.locator('#password-hint')).toBeVisible();

    // 3. Check banners and errors
    await expect(page.getByTestId('form-error-message')).toBeHidden();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
    for (const id of ['full-name-error', 'email-error', 'password-error', 'topic-error', 'message-error', 'urgency-error']) {
      await expect(page.getByTestId(id)).toBeHidden();
    }
    for (const id of ['full-name-input', 'email-input', 'password-input', 'topic-select', 'message-textarea']) {
      await expect(page.getByTestId(id)).not.toHaveAttribute('aria-invalid', /.*/);
    }
  });
});
