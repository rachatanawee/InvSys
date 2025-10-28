import { test, expect } from '@playwright/test';

test.describe('Inventory Movements', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[type="email"]', 'demo@user.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should open receive product modal', async ({ page }) => {
    // Click Receive button in header
    await page.click('text=Receive');
    
    // Check if modal is open
    await expect(page.locator('text=Receive')).toBeVisible();
    await expect(page.locator('input[placeholder*="product"]')).toBeVisible();
    
    // Close modal
    await page.press('body', 'Escape');
  });

  test('should open transfer product modal', async ({ page }) => {
    // Click Transfer button in header
    await page.click('text=Transfer');
    
    // Check if modal is open
    await expect(page.locator('text=Transfer')).toBeVisible();
    
    // Should have from and to location selectors
    await expect(page.locator('select')).toHaveCount(3); // product, from, to
  });

  test('should open ship product modal', async ({ page }) => {
    // Click Ship button in header
    await page.click('text=Ship');
    
    // Check if modal is open
    await expect(page.locator('text=Ship')).toBeVisible();
    
    // Should have from location selector but no to location
    await expect(page.locator('select')).toHaveCount(2); // product, from
  });

  test('should view movements history', async ({ page }) => {
    // Navigate to movements page
    await page.click('text=Movements');
    await expect(page).toHaveURL(/.*movements/);
    
    // Check if movements table is visible
    await expect(page.locator('table')).toBeVisible();
    
    // Check table headers
    await expect(page.locator('text=Product')).toBeVisible();
    await expect(page.locator('text=Type')).toBeVisible();
    await expect(page.locator('text=Quantity')).toBeVisible();
    await expect(page.locator('text=Date')).toBeVisible();
  });

  test('should filter products in movement form', async ({ page }) => {
    // Open receive modal
    await page.click('text=Receive');
    
    // Type in product search
    await page.fill('input[placeholder*="product"]', 'Laptop');
    
    // Should show filtered results
    await expect(page.locator('text=Laptop')).toBeVisible();
  });
});