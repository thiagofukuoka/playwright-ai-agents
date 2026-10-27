// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Accessibility wiring: labels and roles', async ({ page }) => {
    await page.goto('/forms');

    // 1. Use getByLabel for every field label; each resolves to exactly one control
    const labels = [
      'Full name',
      'Email',
      'Password',
      'Topic',
      'Message',
      'Email me updates',
      'Text me updates',
      'Call me about this',
      'Low',
      'Medium',
      'High',
    ];
    for (const label of labels) {
      await expect(page.getByLabel(label, { exact: true })).toHaveCount(1);
    }

    // 2. Fieldsets are exposed as named groups; controls have the expected roles
    await expect(page.getByRole('group', { name: 'Contact preferences' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'How urgent is this?' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Full name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Message' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Topic' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Email me updates' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Text me updates' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Call me about this' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Low' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Medium' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'High' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit request' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

    // 3. Submit empty and check banners
    await page.getByRole('button', { name: 'Submit request' }).click();
    await expect(page.getByRole('alert')).toHaveText('Please fix the highlighted fields and try again.');
    await expect(page.getByTestId('form-error-message')).toHaveAttribute('role', 'alert');
    await expect(page.getByTestId('form-success-message')).toHaveAttribute('role', 'status');
  });
});
