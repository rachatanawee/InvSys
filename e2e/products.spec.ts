import { test, expect } from '@playwright/test';

test.describe('Products Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to products
    await page.goto('/');
    await page.fill('input[type="email"]', 'demo@user.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.click('text=Products');
    await expect(page).toHaveURL(/.*products/);
  });

  test('should display products table', async ({ page }) => {
    // Check if products table is visible
    await expect(page.locator('table')).toBeVisible();
    
    // Check table headers
    await expect(page.locator('text=Name')).toBeVisible();
    await expect(page.locator('text=SKU')).toBeVisible();
    await expect(page.locator('text=Quantity')).toBeVisible();
    await expect(page.locator('text=Location')).toBeVisible();
    await expect(page.locator('text=Actions')).toBeVisible();
  });

  test('should open add product modal', async ({ page }) => {
    // Click Add Product button
    await page.click('text=Add Product');
    
    // Check if modal is open
    await expect(page.locator('text=Add New Product')).toBeVisible();
    await expect(page.locator('input[placeholder*="name"]')).toBeVisible();
    
    // Close modal
    await page.click('text=Cancel');
    await expect(page.locator('text=Add New Product')).not.toBeVisible();
  });

  test('should edit existing product', async ({ page }) => {
    // Wait for products to load and click first Edit button
    await page.waitForSelector('button:has-text("Edit")');
    await page.click('button:has-text("Edit")');
    
    // Check if edit modal is open
    await expect(page.locator('text=Edit Product')).toBeVisible();
    
    // Check if form is populated
    const nameInput = page.locator('input').first();
    await expect(nameInput).not.toHaveValue('');
    
    // Close modal
    await page.click('text=Cancel');
  });

  test('should generate SKU', async ({ page }) => {
    // Open add product modal
    await page.click('text=Add Product');
    
    // Fill product name
    await page.fill('input', 'Test Product Name');
    
    // Click Generate SKU button
    await page.click('text=Generate');
    
    // Check if SKU is generated
    const skuInput = page.locator('input').nth(1);
    const skuValue = await skuInput.inputValue();
    expect(skuValue).toContain('TES-PRO-NAM');
  });
});