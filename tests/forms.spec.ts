import { test, expect } from '@playwright/test';

test.describe('Forms page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('home-card-forms').click();
    await expect(page).toHaveURL(/\/forms/);
  });

  test('submitting a valid form shows the success message', async ({ page }) => {
    await page.getByTestId('full-name-input').fill('testuser');
    await page.getByTestId('email-input').fill('test@tester.com');
    await page.getByTestId('password-input').fill('Password123');
    await page.getByTestId('topic-select').selectOption('technical');
    await page.getByTestId('message-textarea').fill('Something is not working.');
    await page.getByTestId('urgency-medium-radio').check();
    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('form-success-message')).toBeVisible();
  });
});
