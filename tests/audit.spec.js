import { test, expect } from '@playwright/test';

test.describe('App Audit', () => {
  test('should load the app and verify main UI components', async ({ page }) => {
    await page.goto('/');

    const header = page.getByRole('heading', { name: /sghash tracker/i });
    await expect(header.first()).toBeVisible({ timeout: 15000 });

    const root = page.locator('#root');
    await expect(root).toBeVisible();

    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.warn('Console errors during load:', errors);
    }
  });
});
