// spec: specs/login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('login-with-valid-credentials', async ({ page }) => {
    // 1. Navigate to the home page
    await page.goto('/');
    await expect(page).toHaveTitle('HourToLearn Practice Site');

    // 2. Click 'Login' in the primary navigation
    await page.getByTestId('nav-login').click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByTestId('page-title')).toHaveText('Login');

    // 3. Type 'student' into the Username field
    await page.getByTestId('login-username').fill('student');

    // 4. Type 'Learn123!' into the Password field
    await page.getByTestId('login-password').fill('Learn123!');

    // 5. Click 'Sign in'
    const login = page.waitForResponse(
      (res) => res.url().endsWith('/login') && res.request().method() === 'POST',
    );
    await page.getByTestId('login-submit').click();
    expect((await login).status()).toBe(200);

    await expect(page).toHaveURL('/account');
    await expect(page).toHaveTitle('Account · HourToLearn Practice Site');
    await expect(page.getByTestId('page-title')).toHaveText('Account');
    await expect(page.getByTestId('account-welcome')).toHaveText('Welcome, student!');
    await expect(page.getByTestId('logout-button')).toBeVisible();

    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'pw_session')).toBeDefined();
  });
});
