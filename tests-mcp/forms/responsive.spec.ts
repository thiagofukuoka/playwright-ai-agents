// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Layout at small viewport has no horizontal scroll', async ({ page }) => {
    // 1. Set viewport 375x667, load /forms, submit empty
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/forms');
    await page.getByTestId('submit-button').click();

    // All fields and error messages are present, visible and reachable
    const controls = [
      'full-name-input',
      'email-input',
      'password-input',
      'topic-select',
      'message-textarea',
      'contact-email-checkbox',
      'contact-sms-checkbox',
      'contact-phone-checkbox',
      'urgency-low-radio',
      'urgency-medium-radio',
      'urgency-high-radio',
      'submit-button',
      'reset-button',
    ];
    const errors = [
      'form-error-message',
      'full-name-error',
      'email-error',
      'password-error',
      'topic-error',
      'message-error',
      'urgency-error',
    ];
    for (const id of [...controls, ...errors]) {
      const locator = page.getByTestId(id);
      await locator.scrollIntoViewIfNeeded();
      await expect(locator).toBeVisible();
      await expect(locator).toBeInViewport();
    }

    // [BUG] The page must not overflow horizontally at 375px wide. Today the 250px sidebar does not
    // collapse and the form fields have a 200px min-width (observed scrollWidth 564 vs clientWidth 356).
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth, 'page should not scroll horizontally').toBeLessThanOrEqual(clientWidth);
  });
});
