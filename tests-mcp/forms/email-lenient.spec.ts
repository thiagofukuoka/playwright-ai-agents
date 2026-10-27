// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page } from '@playwright/test';

async function submitWithEmail(page: Page, email: string) {
  await page.goto('/forms');
  await page.getByTestId('full-name-input').fill('Jane Doe');
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill('Passw0rd!');
  await page.getByTestId('topic-select').selectOption('billing');
  await page.getByTestId('message-textarea').fill('I need help');
  await page.getByTestId('urgency-low-radio').check();
  await page.getByTestId('submit-button').click();
}

test.describe('Forms - Edge Cases', () => {
  test('Email a@b.c (1-char TLD) is rejected', async ({ page }) => {
    await submitWithEmail(page, 'a@b.c');
    // [BUG] One-character TLD must be rejected
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
  });

  test('Email jane@x..com (consecutive dots) is rejected', async ({ page }) => {
    await submitWithEmail(page, 'jane@x..com');
    // [BUG] Consecutive dots in the domain must be rejected
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
  });

  test('Email a@b.c. (trailing dot) is rejected', async ({ page }) => {
    await submitWithEmail(page, 'a@b.c.');
    // [BUG] Trailing dot must be rejected
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
  });

  test('Email with surrounding spaces is trimmed and accepted', async ({ page }) => {
    await submitWithEmail(page, ' jane@x.com ');
    // Accepted because the value is trimmed (type=email also sanitizes surrounding spaces)
    await expect(page.getByTestId('email-input')).toHaveValue('jane@x.com');
    await expect(page.getByTestId('form-success-message')).toBeVisible();
    await expect(page.getByTestId('email-error')).toBeHidden();
  });

  test('Email jane@.com is rejected', async ({ page }) => {
    await submitWithEmail(page, 'jane@.com');
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('form-success-message')).toBeHidden();
  });
});
