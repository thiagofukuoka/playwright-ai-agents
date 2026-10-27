import { test, expect } from '@playwright/test';

// Runs only in the 'mobile-youtube' project (Nexus 5), see playwright.config.ts.
test.describe('YouTube mobile search @external', () => {
  test('searching for a term navigates to its results', async ({ page }) => {
    // Consent dialog appears in some regions only.
    await page.addLocatorHandler(
      page.getByRole('button', { name: /accept all|reject all/i }),
      async (button) => {
        await button.click();
      },
    );

    await page.goto('https://m.youtube.com/');
    // Scoped: the home feed has a second "Search YouTube" button.
    await page.locator('#header-bar').getByRole('button', { name: 'Search YouTube' }).click();

    const searchBox = page.getByRole('combobox', { name: 'Search YouTube' });
    await searchBox.fill('automation');
    await searchBox.press('Enter');

    await expect(page).toHaveURL(/search_query=automation/);
  });
});
