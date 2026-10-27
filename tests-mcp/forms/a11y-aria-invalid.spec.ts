// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Accessibility wiring: aria-invalid and aria-describedby', async ({ page }) => {
    await page.goto('/forms');

    const inputs = ['full-name-input', 'email-input', 'password-input', 'topic-select', 'message-textarea'];

    // 1. Before submit, read aria-describedby on each input
    await expect(page.getByTestId('full-name-input')).toHaveAttribute('aria-describedby', 'full-name-error');
    await expect(page.getByTestId('email-input')).toHaveAttribute('aria-describedby', 'email-error');
    await expect(page.getByTestId('password-input')).toHaveAttribute('aria-describedby', 'password-hint password-error');
    await expect(page.getByTestId('topic-select')).toHaveAttribute('aria-describedby', 'topic-error');
    await expect(page.getByTestId('message-textarea')).toHaveAttribute('aria-describedby', 'message-error');
    await expect(page.getByRole('group', { name: 'How urgent is this?' })).toHaveAttribute(
      'aria-describedby',
      'urgency-error',
    );

    // aria-invalid is absent before the first submit
    for (const id of inputs) {
      await expect(page.getByTestId(id)).not.toHaveAttribute('aria-invalid', /.*/);
    }

    // 2. Submit empty, then fix and resubmit valid: aria-invalid absent -> 'true' -> 'false'
    await page.getByTestId('submit-button').click();
    for (const id of inputs) {
      await expect(page.getByTestId(id)).toHaveAttribute('aria-invalid', 'true');
    }

    // Referenced error elements are the visible error texts
    await expect(page.getByTestId('full-name-input')).toHaveAccessibleDescription('Full name is required.');
    await expect(page.getByTestId('email-input')).toHaveAccessibleDescription('A valid email is required.');
    await expect(page.getByTestId('password-input')).toHaveAccessibleDescription(
      'At least 8 characters. Password must be at least 8 characters.',
    );
    await expect(page.getByTestId('topic-select')).toHaveAccessibleDescription('Please choose a topic.');
    await expect(page.getByTestId('message-textarea')).toHaveAccessibleDescription('Please describe your issue.');
    await expect(page.getByRole('group', { name: 'How urgent is this?' })).toHaveAccessibleDescription(
      'Please select an urgency level.',
    );
    await expect(page.getByTestId('full-name-error')).toBeVisible();
    await expect(page.getByTestId('urgency-error')).toBeVisible();

    // 3. Check radios on error
    // [BUG] Urgency radios must get aria-invalid='true' when urgency is missing on submit
    await expect(page.getByTestId('urgency-low-radio')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByTestId('urgency-medium-radio')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByTestId('urgency-high-radio')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByRole('group', { name: 'How urgent is this?' })).not.toHaveAttribute('aria-invalid', /.*/);
    await expect(page.getByTestId('contact-email-checkbox')).not.toHaveAttribute('aria-invalid', /.*/);

    // Fix and resubmit valid
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('password-input').fill('Passw0rd!');
    await page.getByTestId('topic-select').selectOption('billing');
    await page.getByTestId('message-textarea').fill('I need help');
    await page.getByTestId('urgency-low-radio').check();

    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('form-success-message')).toBeVisible();
    for (const id of inputs) {
      await expect(page.getByTestId(id)).toHaveAttribute('aria-invalid', 'false');
    }
    // [BUG] After a valid resubmit the urgency radios must have aria-invalid='false'
    for (const id of ['urgency-low-radio', 'urgency-medium-radio', 'urgency-high-radio']) {
      await expect(page.getByTestId(id)).toHaveAttribute('aria-invalid', 'false');
    }
  });
});
