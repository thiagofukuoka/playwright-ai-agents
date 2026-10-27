// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('No network request on submit', async ({ page }) => {
    await page.goto('/forms');
    // Wait until the sidebar (loaded dynamically) is rendered so initial page requests are done
    await expect(page.getByTestId('nav-forms')).toBeVisible();

    // 1. Register page.on('request') after load, ignoring the favicon and static assets
    const requests: string[] = [];
    const navigations: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.endsWith('/favicon.ico')) return;
      if (['stylesheet', 'script', 'image', 'font'].includes(request.resourceType())) return;
      requests.push(`${request.method()} ${url} (${request.resourceType()})`);
    });
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) navigations.push(frame.url());
    });

    // Submit invalid form
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-error-message')).toBeVisible();

    // Submit valid baseline
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('password-input').fill('Passw0rd!');
    await page.getByTestId('topic-select').selectOption('billing');
    await page.getByTestId('message-textarea').fill('I need help');
    await page.getByTestId('urgency-low-radio').check();
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-success-message')).toBeVisible();

    // No POST/GET/fetch/XHR request issued, URL unchanged, no reload
    expect(requests).toEqual([]);
    expect(navigations).toEqual([]);
    await expect(page).toHaveURL(/\/forms$/);
  });
});
