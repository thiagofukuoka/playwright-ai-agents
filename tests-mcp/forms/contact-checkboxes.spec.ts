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
  test('Optional contact preference checkboxes', async ({ page }) => {
    await page.goto('/forms');
    const email = page.getByTestId('contact-email-checkbox');
    const sms = page.getByTestId('contact-sms-checkbox');
    const phone = page.getByTestId('contact-phone-checkbox');

    // 1. Check each checkbox individually and together, then uncheck them
    await email.check();
    await expect(email).toBeChecked();
    await expect(sms).not.toBeChecked();
    await expect(phone).not.toBeChecked();

    await sms.check();
    await phone.check();
    await expect(email).toBeChecked();
    await expect(sms).toBeChecked();
    await expect(phone).toBeChecked();

    await sms.uncheck();
    await expect(email).toBeChecked();
    await expect(sms).not.toBeChecked();
    await expect(phone).toBeChecked();

    await email.uncheck();
    await phone.uncheck();
    await expect(email).not.toBeChecked();
    await expect(sms).not.toBeChecked();
    await expect(phone).not.toBeChecked();

    // 2. Fill baseline with all three checked and submit
    await fillBaseline(page);
    await email.check();
    await sms.check();
    await phone.check();
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-success-message')).toBeVisible();

    // 3. Reload, fill baseline with none checked and submit
    await page.goto('/forms');
    await fillBaseline(page);
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-success-message')).toBeVisible();

    // 4. Click the label text 'Email me updates'
    await page.goto('/forms');
    await expect(email).not.toBeChecked();
    await page.getByText('Email me updates').click();
    await expect(email).toBeChecked();
  });
});
