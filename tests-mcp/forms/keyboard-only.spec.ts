// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Happy Path', () => {
  test('Keyboard-only completion', async ({ page }) => {
    await page.goto('/forms');

    // 1. Use Tab, typing, ArrowDown on the select, Space on checkbox/radio to complete baseline,
    //    then Tab to submit-button and press Enter
    const name = page.getByTestId('full-name-input');
    await name.focus();
    await expect(name).toBeFocused();
    await page.keyboard.type('Jane Doe');

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('email-input')).toBeFocused();
    await page.keyboard.type('jane@example.com');

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('password-input')).toBeFocused();
    await page.keyboard.type('Passw0rd!');

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('topic-select')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('topic-select')).toHaveValue('billing');

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('message-textarea')).toBeFocused();
    await page.keyboard.type('I need help');

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('contact-email-checkbox')).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.getByTestId('contact-email-checkbox')).toBeChecked();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('contact-sms-checkbox')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('contact-phone-checkbox')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('urgency-low-radio')).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.getByTestId('urgency-low-radio')).toBeChecked();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('submit-button')).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.getByTestId('form-success-message')).toBeVisible();

    // Reset follows submit in the tab order
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('reset-button')).toBeFocused();
  });
});
