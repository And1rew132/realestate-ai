import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('Find Your Perfect Home')
    
    // Check if navigation links are present
    await expect(page.getByRole('link', { name: 'Browse Properties' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible()
  })

  test('should navigate to listings page', async ({ page }) => {
    await page.goto('/')
    
    // Click on browse properties
    await page.getByRole('link', { name: 'Browse Properties' }).click()
    
    // Should be on listings page
    await expect(page).toHaveURL('/listings')
    await expect(page.locator('h1')).toContainText('Property Listings')
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if main heading is still visible on mobile
    await expect(page.locator('h1')).toContainText('Find Your Perfect Home')
  })
})
