import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('input[type="email"]', 'demo@user.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should display dashboard metrics', async ({ page }) => {
    // Check if all metric cards are visible
    await expect(page.locator('text=Total Units')).toBeVisible();
    await expect(page.locator('text=Product SKUs')).toBeVisible();
    await expect(page.locator('text=Locations')).toBeVisible();
    await expect(page.locator('text=Total Movements')).toBeVisible();
    
    // Check if numbers are displayed
    await expect(page.locator('.text-2xl.font-bold').first()).toBeVisible();
  });

  test('should display chart', async ({ page }) => {
    // Check if chart title is visible
    await expect(page.locator('text=Top 10 Products')).toBeVisible();
    
    // Check if chart container exists
    await expect(page.locator('.h-\\[350px\\]')).toBeVisible();
  });

  test('should navigate to other pages', async ({ page }) => {
    // Navigate to Products
    await page.click('text=Products');
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('text=Add Product')).toBeVisible();
    
    // Navigate to Movements
    await page.click('text=Movements');
    await expect(page).toHaveURL(/.*movements/);
    
    // Navigate to Locations
    await page.click('text=Locations');
    await expect(page).toHaveURL(/.*locations/);
    await expect(page.locator('text=Add Location')).toBeVisible();
  });
});