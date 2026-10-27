// spec: specs/forms.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Forms - Edge Cases', () => {
  test('Urgency radios mutually exclusive', async ({ page }) => {
    await page.goto('/forms');

    const low = page.getByTestId('urgency-low-radio');
    const medium = page.getByTestId('urgency-medium-radio');
    const high = page.getByTestId('urgency-high-radio');

    // 1. Check low, then medium, then high
    await low.check();
    await expect(low).toBeChecked();
    await expect(medium).not.toBeChecked();
    await expect(high).not.toBeChecked();

    await medium.check();
    await expect(medium).toBeChecked();
    await expect(low).not.toBeChecked();
    await expect(high).not.toBeChecked();

    await high.check();
    await expect(high).toBeChecked();
    await expect(low).not.toBeChecked();
    await expect(medium).not.toBeChecked();

    // 2. Click an already checked radio
    await high.click();
    await expect(high).toBeChecked();
    await expect(low).not.toBeChecked();
    await expect(medium).not.toBeChecked();
  });
});
