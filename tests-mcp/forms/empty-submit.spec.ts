// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Empty submit shows all errors', async ({ page }) => {
    await page.goto('/forms');

    // 1. Click submit-button on untouched form
    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('full-name-error')).toHaveText('Full name is required.');
    await expect(page.getByTestId('email-error')).toHaveText('A valid email is required.');
    await expect(page.getByTestId('password-error')).toHaveText('Password must be at least 8 characters.');
    await expect(page.getByTestId('topic-error')).toHaveText('Please choose a topic.');
    await expect(page.getByTestId('message-error')).toHaveText('Please describe your issue.');
    await expect(page.getByTestId('urgency-error')).toHaveText('Please select an urgency level.');

    await expect(page.getByTestId('form-error-message')).toBeVisible();
    await expect(page.getByTestId('form-error-message')).toHaveText('Please fix the highlighted fields and try again.');
    await expect(page.getByTestId('form-success-message')).toBeHidden();

    for (const id of ['full-name-input', 'email-input', 'password-input', 'topic-select', 'message-textarea']) {
      await expect(page.getByTestId(id)).toHaveAttribute('aria-invalid', 'true');
    }

    // 2. Check focus
    // [BUG] Focus must move to the first invalid field
    await expect(page.getByTestId('full-name-input')).toBeFocused();
  });
});
