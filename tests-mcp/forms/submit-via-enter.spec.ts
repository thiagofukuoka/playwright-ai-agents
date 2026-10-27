// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from '@playwright/test';

async function fillBaseline(page: Page) {
  await page.getByTestId('full-name-input').fill('Jane Doe');
  await page.getByTestId('email-input').fill('jane@example.com');
  await page.getByTestId('password-input').fill('Passw0rd!');
  await page.getByTestId('topic-select').selectOption('billing');
  await page.getByTestId('message-textarea').fill('I need help');
  await page.getByTestId('urgency-low-radio').check();
}

test.describe('Forms - Happy Path', () => {
  test('Submit via Enter key', async ({ page }) => {
    // 1. Fill baseline, focus full-name-input and press Enter
    await page.goto('/forms');
    await fillBaseline(page);
    await page.getByTestId('full-name-input').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('form-success-message')).toBeVisible();

    // 2. Reload, fill baseline, focus email-input and press Enter
    await page.goto('/forms');
    await fillBaseline(page);
    await page.getByTestId('email-input').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('form-success-message')).toBeVisible();

    // 3. Focus message-textarea and press Enter
    await page.goto('/forms');
    await fillBaseline(page);
    const message = page.getByTestId('message-textarea');
    await message.focus();
    await page.keyboard.press('Enter');
    await expect(message).toHaveValue('I need help\n');
    await expect(page.getByTestId('form-success-message')).toBeHidden();
    await expect(page.getByTestId('form-error-message')).toBeHidden();
  });
});
