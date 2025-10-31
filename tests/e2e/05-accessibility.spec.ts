/**
 * Accessibility Tests
 * WCAG 2.1 AA Compliance Testing
 */

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests - WCAG 2.1 AA', () => {
  test.describe('Automated Accessibility Scans', () => {
    test('Homepage should have no accessibility violations', async ({ page }) => {
      await page.goto('/')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Login page should have no accessibility violations', async ({ page }) => {
      await page.goto('/auth/login')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Course listing should have no accessibility violations', async ({ page }) => {
      await page.goto('/courses')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Dashboard should have no accessibility violations', async ({ page }) => {
      // Login first
      await page.goto('/auth/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'Test123!@#')
      await page.click('button[type="submit"]')

      await page.waitForURL(/\/dashboard/)

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should navigate through form fields with Tab', async ({ page }) => {
      await page.goto('/auth/login')

      await page.keyboard.press('Tab')
      await expect(page.locator('input[name="email"]')).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.locator('input[name="password"]')).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.locator('button[type="submit"]')).toBeFocused()
    })

    test('should navigate main navigation with keyboard', async ({ page }) => {
      await page.goto('/')

      // Tab to first navigation link
      await page.keyboard.press('Tab')
      
      // Keep tabbing through navigation
      let navLinksFocused = 0
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
        const focused = await page.evaluate(() => {
          const el = document.activeElement
          return el?.tagName === 'A' && el?.getAttribute('href')
        })
        if (focused) navLinksFocused++
      }

      expect(navLinksFocused).toBeGreaterThan(0)
    })

    test('should activate buttons with Enter key', async ({ page }) => {
      await page.goto('/courses')

      // Focus on a course card button
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Find and focus a "View Course" button
      const viewButton = page.locator('button:has-text("View"), a:has-text("View")').first()
      await viewButton.focus()
      
      await page.keyboard.press('Enter')
      
      // Should navigate to course detail
      await expect(page).toHaveURL(/\/courses\//)
    })

    test('should activate buttons with Space key', async ({ page }) => {
      await page.goto('/courses')

      const viewButton = page.locator('button:has-text("View")').first()
      await viewButton.focus()
      
      await page.keyboard.press('Space')
      
      // Should trigger action
      await expect(page).not.toHaveURL('/courses')
    })

    test('should trap focus in modal dialogs', async ({ page }) => {
      await page.goto('/')

      // Open a modal (adjust selector based on your implementation)
      const openModalButton = page.locator('button:has-text("Sign Up"), button:has-text("Register")')
      if (await openModalButton.count() > 0) {
        await openModalButton.first().click()

        // Tab through modal elements
        await page.keyboard.press('Tab')
        const firstFocus = await page.evaluate(() => document.activeElement?.tagName)

        // Tab multiple times to check focus stays in modal
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab')
        }

        // Focused element should still be within modal
        const isInModal = await page.evaluate(() => {
          const modal = document.querySelector('[role="dialog"], .modal')
          const focused = document.activeElement as HTMLElement | null
          return !!(modal && focused && modal.contains(focused))
        })
        expect(isInModal).toBe(true)
      }
    })

    test('should allow Escape key to close modals', async ({ page }) => {
      await page.goto('/')

      const openModalButton = page.locator('button:has-text("Sign Up"), button:has-text("Register")')
      if (await openModalButton.count() > 0) {
        await openModalButton.first().click()

        const modal = page.locator('[role="dialog"], .modal')
        await expect(modal).toBeVisible()

        await page.keyboard.press('Escape')
        
        await expect(modal).not.toBeVisible()
      }
    })
  })

  test.describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/')

      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
      
      expect(headings.length).toBeGreaterThan(0)
      
      // Should have at least one h1
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBeGreaterThan(0)
    })

    test('should have descriptive alt text for images', async ({ page }) => {
      await page.goto('/courses')

      const images = await page.locator('img').all()
      
      for (const image of images) {
        const alt = await image.getAttribute('alt')
        const ariaLabel = await image.getAttribute('aria-label')
        
        // Decorative images should have empty alt, informative ones should have text
        if (alt !== null) {
          // If not decorative, alt should be descriptive
          if (alt.length > 0) {
            expect(alt.length).toBeGreaterThan(3)
          }
        } else {
          // Should have aria-label if no alt
          expect(ariaLabel).toBeTruthy()
        }
      }
    })

    test('should have proper ARIA labels for interactive elements', async ({ page }) => {
      await page.goto('/')

      const buttons = await page.locator('button').all()
      
      for (const button of buttons) {
        const text = await button.textContent()
        const ariaLabel = await button.getAttribute('aria-label')
        const ariaLabelledBy = await button.getAttribute('aria-labelledby')
        
        // Button should have either text, aria-label, or aria-labelledby
        const hasLabel = text?.trim().length || ariaLabel || ariaLabelledBy
        expect(hasLabel).toBeTruthy()
      }
    })

    test('should announce form errors to screen readers', async ({ page }) => {
      await page.goto('/auth/login')

      await page.fill('input[name="email"]', 'invalid')
      await page.click('button[type="submit"]')

      // Check for aria-live region or role="alert"
      const errorMessage = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"]')
      await expect(errorMessage).toBeVisible()
    })

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/auth/register')

      const inputs = await page.locator('input[type="email"], input[type="password"], input[type="text"]').all()
      
      for (const input of inputs) {
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')
        
        // Input should have label association
        if (id) {
          const label = await page.locator(`label[for="${id}"]`).count()
          const hasLabel = label > 0 || ariaLabel || ariaLabelledBy
          expect(hasLabel).toBeTruthy()
        } else {
          expect(ariaLabel || ariaLabelledBy).toBeTruthy()
        }
      }
    })

    test('should mark required fields appropriately', async ({ page }) => {
      await page.goto('/auth/register')

      const requiredInputs = await page.locator('input[required]').all()
      
      for (const input of requiredInputs) {
        const ariaRequired = await input.getAttribute('aria-required')
        const hasAsterisk = await page.locator(`label[for="${await input.getAttribute('id')}"] >> text=*`).count()
        
        // Should have either aria-required or visual indicator
        expect(ariaRequired === 'true' || hasAsterisk > 0).toBe(true)
      }
    })
  })

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .disableRules(['color-contrast']) // We'll check this separately
        .analyze()

      // Run color contrast check
      const contrastResults = await new AxeBuilder({ page })
        .include('body')
        .withRules(['color-contrast'])
        .analyze()

      expect(contrastResults.violations).toEqual([])
    })

    test('should maintain contrast in dark mode', async ({ page }) => {
      await page.goto('/')

      // Enable dark mode if available
      const darkModeToggle = page.locator('button:has-text("Dark"), [aria-label*="Dark mode"]')
      if (await darkModeToggle.count() > 0) {
        await darkModeToggle.click()

        const contrastResults = await new AxeBuilder({ page })
          .include('body')
          .withRules(['color-contrast'])
          .analyze()

        expect(contrastResults.violations).toEqual([])
      }
    })
  })

  test.describe('Responsive and Zoom', () => {
    test('should remain usable at 200% zoom', async ({ page }) => {
      await page.goto('/')
      
      // Zoom to 200%
      await page.evaluate(() => {
        document.body.style.zoom = '2'
      })

      // Check that content is still accessible
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('nav')).toBeVisible()
      
      // Text should not overflow
      const hasOverflow = await page.evaluate(() => {
        const elements = document.querySelectorAll('*')
        return Array.from(elements).some(el => {
          return el.scrollWidth > el.clientWidth + 5
        })
      })

      expect(hasOverflow).toBe(false)
    })

    test('should be usable on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Check mobile menu functionality
      const mobileMenu = page.locator('button:has-text("Menu"), [aria-label*="menu"]')
      if (await mobileMenu.count() > 0) {
        await mobileMenu.click()
        await expect(page.locator('nav')).toBeVisible()
      }

      // Check that touch targets are large enough (minimum 44x44px)
      const buttons = await page.locator('button, a').all()
      for (const button of buttons.slice(0, 5)) { // Check first 5
        const box = await button.boundingBox()
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })

  test.describe('Video Player Accessibility', () => {
    test('should have keyboard controls for video player', async ({ page }) => {
      await page.goto('/learn/course-slug/lesson-slug')

      const videoPlayer = page.locator('video, [data-testid="video-player"]')
      if (await videoPlayer.count() > 0) {
        await videoPlayer.focus()

        // Space should play/pause
        await page.keyboard.press('Space')
        await page.waitForTimeout(500)
        
        // Should have visible controls
        const controls = page.locator('button:has-text("Play"), button:has-text("Pause")')
        await expect(controls.first()).toBeVisible()
      }
    })

    test('should support captions', async ({ page }) => {
      await page.goto('/learn/course-slug/lesson-slug')

      const videoPlayer = page.locator('video')
      if (await videoPlayer.count() > 0) {
        // Check for track element
        const captions = await page.locator('track[kind="captions"]').count()
        expect(captions).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/')

      await page.keyboard.press('Tab')
      
      // Check that focused element has visible outline
      const focusedStyle = await page.evaluate(() => {
        const el = document.activeElement
        const styles = window.getComputedStyle(el!)
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        }
      })

      // Should have some visible focus indicator
      const hasFocusIndicator = 
        focusedStyle.outline !== 'none' ||
        parseFloat(focusedStyle.outlineWidth) > 0 ||
        focusedStyle.boxShadow !== 'none'

      expect(hasFocusIndicator).toBe(true)
    })

    test('should not trap focus unexpectedly', async ({ page }) => {
      await page.goto('/courses')

      // Tab through page
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab')
      }

      // Should eventually reach footer or cycle back to top
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBeTruthy()
    })
  })
})
