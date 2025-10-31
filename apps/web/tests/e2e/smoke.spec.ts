import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TheraBrake/);
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('can navigate to login from homepage', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.locator('a[href*="/auth/login"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/auth\/login/);
    }
  });
});
