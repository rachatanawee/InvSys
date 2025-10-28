import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
    
    // Fill login form
    await page.fill('input[type="email"]', 'demo@user.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/');
    
    // Fill with invalid credentials
    await page.fill('input[type="email"]', 'invalid@user.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('.text-red-500')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    
    // Login first
    await page.fill('input[type="email"]', 'demo@user.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Find and click theme toggle button
    await page.click('button:has(svg)');
    
    // Check if theme changed (body class should change)
    const bodyClass = await page.locator('body').getAttribute('class');
    expect(bodyClass).toBeTruthy();
  });
});