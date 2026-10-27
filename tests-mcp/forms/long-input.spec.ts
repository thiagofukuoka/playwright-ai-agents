// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Very long input', async ({ page }) => {
    await page.goto('/forms');

    // 1. Fill name with 10000 chars, message with 50000 chars, submit
    const longName = 'a'.repeat(10000);
    const longMessage = 'b'.repeat(50000);

    await page.getByTestId('full-name-input').fill(longName);
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('password-input').fill('Passw0rd!');
    await page.getByTestId('topic-select').selectOption('billing');
    await page.getByTestId('message-textarea').fill(longMessage);
    await page.getByTestId('urgency-low-radio').check();
    await page.getByTestId('submit-button').click();

    // No maxlength restrictions: success shown and values retained in full
    await expect(page.getByTestId('form-success-message')).toBeVisible();
    await expect(page.getByTestId('form-error-message')).toBeHidden();
    await expect(page.getByTestId('full-name-input')).toHaveValue(longName);
    await expect(page.getByTestId('message-textarea')).toHaveValue(longMessage);

    // Page remains responsive and layout is not broken: controls stay within the viewport width
    const viewportWidth = page.viewportSize()!.width;
    for (const id of ['full-name-input', 'message-textarea', 'submit-button']) {
      const box = await page.getByTestId(id).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth);
    }
    await page.getByTestId('reset-button').click();
    await expect(page.getByTestId('full-name-input')).toHaveValue('');
  });
});
