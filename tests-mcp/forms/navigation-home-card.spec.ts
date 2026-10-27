// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Happy Path', () => {
  test('Navigate to Forms from home page card', async ({ page }) => {
    // 1. Go to / and click getByTestId('home-card-forms')
    await page.goto('/');
    await page.getByTestId('home-card-forms').click();
    await expect(page).toHaveURL(/\/forms$/);
    await expect(page.getByTestId('page-title')).toHaveText('Forms');
    await expect(page.getByTestId('full-name-input')).toHaveValue('');
    await expect(page.getByTestId('email-input')).toHaveValue('');
    await expect(page.getByTestId('topic-select')).toHaveValue('');
    await expect(page.getByTestId('form-error-message')).toBeHidden();
    await expect(page.getByTestId('form-success-message')).toBeHidden();

    // 2. Go to / and click sidebar link getByTestId('nav-forms')
    await page.goto('/');
    await page.getByTestId('nav-forms').click();
    await expect(page).toHaveURL(/\/forms$/);
  });
});
