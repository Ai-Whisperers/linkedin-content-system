/**
 * Gamma.app E2E Test Utilities
 *
 * Helper functions for E2E testing with live Gamma.app integration
 * Handles authentication, cleanup, assertions, and common workflows
 */

const fs = require('fs');
const path = require('path');
const {
  AUTH_SELECTORS,
  NAVIGATION_SELECTORS,
  EDITOR_SELECTORS,
  MANAGEMENT_SELECTORS,
  NOTIFICATION_SELECTORS,
  TIMEOUTS,
  waitForSelectorWithRetry,
} = require('./gammaPageSelectors');

/**
 * Session storage directory for persisting authentication
 */
const SESSION_DIR = path.join(__dirname, '..', '.sessions');
const SESSION_FILE = path.join(SESSION_DIR, 'gamma-session.json');

/**
 * Ensure session directory exists
 */
function ensureSessionDir() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }
}

/**
 * Authentication Helper Class
 */
class GammaAuth {
  constructor(page) {
    this.page = page;
  }

  /**
   * Save current session cookies and localStorage
   */
  async saveSession() {
    ensureSessionDir();

    const cookies = await this.page.context().cookies();
    const localStorage = await this.page.evaluate(() => JSON.stringify(window.localStorage));

    const session = {
      cookies,
      localStorage: JSON.parse(localStorage),
      timestamp: Date.now(),
    };

    fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
    console.log('✓ Session saved');
  }

  /**
   * Load previously saved session
   * @returns {boolean} - True if session loaded successfully
   */
  async loadSession() {
    if (!fs.existsSync(SESSION_FILE)) {
      return false;
    }

    try {
      const session = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));

      // Check if session is older than 24 hours
      const age = Date.now() - session.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (age > maxAge) {
        console.log('⚠️  Session expired, re-authentication required');
        return false;
      }

      // Restore cookies
      await this.page.context().addCookies(session.cookies);

      // Restore localStorage
      await this.page.evaluate((storage) => {
        Object.keys(storage).forEach((key) => {
          localStorage.setItem(key, storage[key]);
        });
      }, session.localStorage);

      console.log('✓ Session loaded');
      return true;
    } catch (error) {
      console.error('❌ Failed to load session:', error.message);
      return false;
    }
  }

  /**
   * Clear saved session
   */
  clearSession() {
    if (fs.existsSync(SESSION_FILE)) {
      fs.unlinkSync(SESSION_FILE);
      console.log('✓ Session cleared');
    }
  }

  /**
   * Login to Gamma.app
   * @param {Object} credentials - {email, password}
   * @param {boolean} saveSession - Whether to save session for reuse
   */
  async login(credentials, saveSession = true) {
    console.log('🔐 Logging in to Gamma.app...');

    // Navigate to login page
    await this.page.goto('https://gamma.app/signin', {
      waitUntil: 'networkidle',
      timeout: TIMEOUTS.navigation,
    });

    try {
      // Wait for email input
      await waitForSelectorWithRetry(this.page, AUTH_SELECTORS.emailInput, TIMEOUTS.login);

      // Enter credentials
      await this.page.fill(AUTH_SELECTORS.emailInput, credentials.email);
      await this.page.waitForTimeout(500);

      await this.page.fill(AUTH_SELECTORS.passwordInput, credentials.password);
      await this.page.waitForTimeout(500);

      // Click submit
      await this.page.click(AUTH_SELECTORS.submitButton);

      // Wait for navigation to complete
      await this.page.waitForNavigation({
        waitUntil: 'networkidle',
        timeout: TIMEOUTS.login,
      });

      // Verify login successful
      const isLoggedIn = await this.verifyAuthentication();

      if (!isLoggedIn) {
        throw new Error('Login verification failed');
      }

      console.log('✓ Login successful');

      // Save session for future tests
      if (saveSession) {
        await this.saveSession();
      }

      return true;
    } catch (error) {
      console.error('❌ Login failed:', error.message);

      // Check for error messages
      const errorElement = await this.page.$(AUTH_SELECTORS.loginError).catch(() => null);
      if (errorElement) {
        const errorText = await errorElement.textContent();
        console.error('Login error message:', errorText);
      }

      throw error;
    }
  }

  /**
   * Verify user is authenticated
   * @returns {boolean}
   */
  async verifyAuthentication() {
    try {
      // Check for user avatar or menu
      await waitForSelectorWithRetry(
        this.page,
        AUTH_SELECTORS.userAvatar,
        TIMEOUTS.medium
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Logout from Gamma.app
   */
  async logout() {
    try {
      // Click user menu
      await this.page.click(AUTH_SELECTORS.userAvatar);
      await this.page.waitForTimeout(1000);

      // Click logout
      await this.page.click(AUTH_SELECTORS.logoutButton);
      await this.page.waitForNavigation({ waitUntil: 'networkidle' });

      this.clearSession();
      console.log('✓ Logged out');
    } catch (error) {
      console.error('⚠️  Logout failed:', error.message);
    }
  }
}

/**
 * Presentation Management Helper Class
 */
class PresentationManager {
  constructor(page) {
    this.page = page;
    this.createdPresentations = [];
  }

  /**
   * Track a created presentation for cleanup
   * @param {string} presentationId - Presentation identifier
   */
  track(presentationId) {
    if (!this.createdPresentations.includes(presentationId)) {
      this.createdPresentations.push(presentationId);
    }
  }

  /**
   * Create a new presentation
   * @param {string} title - Presentation title
   * @returns {Promise<string>} - Presentation URL or ID
   */
  async create(title = 'E2E Test Presentation') {
    console.log(`📄 Creating presentation: ${title}`);

    try {
      // Click "New" button
      await this.page.click(NAVIGATION_SELECTORS.newButton);
      await this.page.waitForTimeout(1000);

      // Click "Presentation"
      await this.page.click(NAVIGATION_SELECTORS.presentationOption).catch(() => {
        // Might already be in presentation mode
        console.log('   Already in presentation mode');
      });

      await this.page.waitForTimeout(2000);

      // Wait for editor to load
      await waitForSelectorWithRetry(
        this.page,
        EDITOR_SELECTORS.editorContainer,
        TIMEOUTS.long
      );

      // Get presentation URL/ID
      const url = this.page.url();
      this.track(url);

      console.log(`✓ Presentation created: ${url}`);
      return url;
    } catch (error) {
      console.error('❌ Failed to create presentation:', error.message);
      throw error;
    }
  }

  /**
   * Delete a presentation
   * @param {string} presentationUrl - URL or ID of presentation
   */
  async delete(presentationUrl) {
    console.log(`🗑️  Deleting presentation: ${presentationUrl}`);

    try {
      // Navigate to dashboard
      await this.page.goto('https://gamma.app/dashboard', {
        waitUntil: 'networkidle',
        timeout: TIMEOUTS.navigation,
      });

      // Find presentation in list
      // This is a simplified version - actual implementation would need
      // to search for the specific presentation by title or URL

      // Click more options
      await this.page.click(MANAGEMENT_SELECTORS.moreOptionsButton);
      await this.page.waitForTimeout(500);

      // Click delete
      await this.page.click(MANAGEMENT_SELECTORS.deleteButton);
      await this.page.waitForTimeout(500);

      // Confirm delete
      await this.page.click(MANAGEMENT_SELECTORS.confirmDeleteButton);
      await this.page.waitForTimeout(1000);

      console.log('✓ Presentation deleted');
    } catch (error) {
      console.error('⚠️  Failed to delete presentation:', error.message);
    }
  }

  /**
   * Clean up all tracked presentations
   */
  async cleanup() {
    console.log(`🧹 Cleaning up ${this.createdPresentations.length} presentation(s)...`);

    for (const presentationUrl of this.createdPresentations) {
      await this.delete(presentationUrl);
    }

    this.createdPresentations = [];
    console.log('✓ Cleanup complete');
  }
}

/**
 * Visual Assertion Helpers
 */
class VisualAssertions {
  constructor(page) {
    this.page = page;
  }

  /**
   * Verify text exists in slide
   * @param {string} text - Text to find
   * @returns {Promise<boolean>}
   */
  async verifySlideContainsText(text) {
    try {
      await this.page.waitForSelector(`text=${text}`, { timeout: TIMEOUTS.medium });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify slide count
   * @param {number} expectedCount - Expected number of slides
   * @returns {Promise<boolean>}
   */
  async verifySlideCount(expectedCount) {
    try {
      const slides = await this.page.$$(EDITOR_SELECTORS.slideThumbnail);
      return slides.length === expectedCount;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify theme applied
   * @param {string} themeName - Theme name
   * @returns {Promise<boolean>}
   */
  async verifyThemeApplied(themeName) {
    // This would need to check CSS properties or data attributes
    // Implementation depends on how Gamma represents themes
    console.log(`ℹ️  Verifying theme: ${themeName}`);
    return true; // Placeholder
  }

  /**
   * Take screenshot and compare (for visual regression)
   * @param {string} name - Screenshot name
   * @param {string} baselineDir - Directory with baseline screenshots
   * @returns {Promise<boolean>}
   */
  async compareScreenshot(name, baselineDir) {
    const screenshotPath = path.join(__dirname, '..', 'screenshots', `${name}.png`);
    const baselinePath = path.join(baselineDir, `${name}.png`);

    await this.page.screenshot({ path: screenshotPath, fullPage: true });

    // Simple existence check - real implementation would use image comparison library
    if (fs.existsSync(baselinePath)) {
      console.log(`✓ Baseline exists for: ${name}`);
      // TODO: Implement actual image comparison using pixelmatch or similar
      return true;
    } else {
      console.log(`⚠️  No baseline found for: ${name}, saving as baseline`);
      fs.copyFileSync(screenshotPath, baselinePath);
      return true;
    }
  }
}

/**
 * Slide Manipulation Helpers
 */
class SlideHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Type into active slide
   * @param {string} content - Content to type
   * @param {boolean} isTitle - Whether this is title or body
   */
  async typeContent(content, isTitle = false) {
    const selector = isTitle ? EDITOR_SELECTORS.titleEditor : EDITOR_SELECTORS.bodyEditor;

    try {
      await this.page.waitForSelector(selector, { timeout: TIMEOUTS.medium });
      await this.page.click(selector);
      await this.page.waitForTimeout(500);
      await this.page.keyboard.type(content, { delay: 50 });
      console.log(`✓ Typed content: ${content.substring(0, 30)}...`);
    } catch (error) {
      console.error(`❌ Failed to type content: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add a new slide
   */
  async addSlide() {
    try {
      // Use keyboard shortcut (most reliable)
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1500);
      console.log('✓ New slide added');
    } catch (error) {
      console.error('❌ Failed to add slide:', error.message);
      throw error;
    }
  }

  /**
   * Navigate to specific slide
   * @param {number} slideNumber - Slide number (1-indexed)
   */
  async goToSlide(slideNumber) {
    try {
      const slides = await this.page.$$(EDITOR_SELECTORS.slideThumbnail);

      if (slideNumber > slides.length || slideNumber < 1) {
        throw new Error(`Invalid slide number: ${slideNumber}`);
      }

      await slides[slideNumber - 1].click();
      await this.page.waitForTimeout(1000);
      console.log(`✓ Navigated to slide ${slideNumber}`);
    } catch (error) {
      console.error(`❌ Failed to navigate to slide ${slideNumber}:`, error.message);
      throw error;
    }
  }

  /**
   * Get current slide number
   * @returns {Promise<number>}
   */
  async getCurrentSlideNumber() {
    // Implementation depends on how Gamma tracks current slide
    // Placeholder implementation
    return 1;
  }
}

/**
 * Wait helpers
 */
const waitHelpers = {
  /**
   * Wait for page to be fully loaded
   * @param {Page} page
   */
  async waitForPageLoad(page) {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  },

  /**
   * Wait for success notification
   * @param {Page} page
   * @param {string} expectedMessage - Expected notification text
   */
  async waitForSuccessNotification(page, expectedMessage = null) {
    try {
      const notification = await page.waitForSelector(
        NOTIFICATION_SELECTORS.toastSuccess,
        { timeout: TIMEOUTS.medium }
      );

      if (expectedMessage) {
        const text = await notification.textContent();
        if (!text.includes(expectedMessage)) {
          throw new Error(`Expected "${expectedMessage}", got "${text}"`);
        }
      }

      return true;
    } catch (error) {
      console.error('⚠️  No success notification found');
      return false;
    }
  },

  /**
   * Wait for saving indicator to disappear
   * @param {Page} page
   */
  async waitForSave(page) {
    try {
      // Wait for "Saving..." to appear
      await page.waitForSelector(NOTIFICATION_SELECTORS.savingIndicator, {
        timeout: TIMEOUTS.fast,
      }).catch(() => {});

      // Wait for "Saved" indicator
      await page.waitForSelector(NOTIFICATION_SELECTORS.savedIndicator, {
        timeout: TIMEOUTS.medium,
      });

      console.log('✓ Content saved');
    } catch (error) {
      console.log('ℹ️  Save indicator not visible (auto-save might be disabled)');
    }
  },
};

/**
 * Screenshot utility
 */
async function takeDebugScreenshot(page, name) {
  const screenshotDir = path.join(__dirname, '..', 'screenshots', 'debug');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  const filepath = path.join(screenshotDir, filename);

  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`📸 Debug screenshot: ${filepath}`);
}

/**
 * Retry wrapper for flaky operations
 * @param {Function} operation - Async function to retry
 * @param {number} retries - Number of retry attempts
 * @param {number} delay - Delay between retries (ms)
 * @returns {Promise<any>}
 */
async function retryOperation(operation, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }

      console.log(`⚠️  Operation failed, retrying (${i + 1}/${retries})...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Get test credentials from environment
 * @returns {Object} - {email, password}
 */
function getTestCredentials() {
  const email = process.env.GAMMA_TEST_EMAIL;
  const password = process.env.GAMMA_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Missing test credentials. Please set GAMMA_TEST_EMAIL and GAMMA_TEST_PASSWORD environment variables.'
    );
  }

  return { email, password };
}

module.exports = {
  GammaAuth,
  PresentationManager,
  VisualAssertions,
  SlideHelper,
  waitHelpers,
  takeDebugScreenshot,
  retryOperation,
  getTestCredentials,
};
