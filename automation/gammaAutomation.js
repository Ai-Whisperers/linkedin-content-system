/**
 * Gamma.app Playwright Automation
 * Automates the creation of presentations on Gamma from carousel data
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Configuration for Gamma automation
 */
const DEFAULT_CONFIG = {
  headless: false, // Set to true for production, false for debugging
  slowMo: 1000, // Slow down actions for visibility (ms)
  timeout: 120000, // 120 second timeout (2 minutes)
  navigationTimeout: 180000, // 180 second timeout for page loads (3 minutes)
  screenshotsDir: './automation/screenshots',
  theme: 'Professional', // Gamma theme
  slideRatio: '16:9', // Standard for LinkedIn
  usePersistentContext: true, // Use persistent browser context to bypass Cloudflare
  userDataDir: './automation/browser-data' // Directory for browser profile
};

/**
 * GammaAutomation class
 * Handles automated presentation creation on Gamma.app
 */
class GammaAutomation {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.browser = null;
    this.page = null;
  }

  /**
   * Initialize browser and navigate to Gamma
   */
  async init() {
    console.log('🚀 Launching browser...');

    // Create directories if they don't exist
    if (!fs.existsSync(this.config.screenshotsDir)) {
      fs.mkdirSync(this.config.screenshotsDir, { recursive: true });
    }
    if (this.config.usePersistentContext && !fs.existsSync(this.config.userDataDir)) {
      fs.mkdirSync(this.config.userDataDir, { recursive: true });
    }

    let context;

    if (this.config.usePersistentContext) {
      // Use persistent context to bypass Cloudflare
      console.log('   Using persistent browser profile to bypass Cloudflare...');
      context = await chromium.launchPersistentContext(this.config.userDataDir, {
        headless: false, // Must be false for persistent context
        slowMo: this.config.slowMo,
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        locale: 'en-US',
        args: [
          '--disable-blink-features=AutomationControlled'
        ]
      });

      this.browser = context; // Store context as browser for cleanup
      this.page = context.pages()[0] || await context.newPage();
    } else {
      // Regular browser context (will likely fail with Cloudflare)
      this.browser = await chromium.launch({
        headless: this.config.headless,
        slowMo: this.config.slowMo,
        args: [
          '--disable-blink-features=AutomationControlled'
        ]
      });

      context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        locale: 'en-US',
        timezoneId: 'America/New_York',
        permissions: []
      });

      // Add stealth scripts to avoid detection
      await context.addInitScript(() => {
        // Override the navigator.webdriver property
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });

        // Mock plugins to appear more like a real browser
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });

        // Mock languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
        });
      });

      this.page = await context.newPage();
    }

    this.page.setDefaultTimeout(this.config.timeout);
    console.log('✓ Browser launched');
  }

  /**
   * Navigate to Gamma and handle login
   */
  async navigateToGamma() {
    console.log('🔗 Navigating to Gamma.app...');
    console.log('   (This may take up to 3 minutes depending on your connection)');

    try {
      await this.page.goto('https://gamma.app', {
        waitUntil: 'domcontentloaded',
        timeout: this.config.navigationTimeout
      });
      await this.page.waitForTimeout(3000); // Wait 3 seconds for page to stabilize
      await this.takeScreenshot('01-gamma-homepage');
      console.log('✓ Page loaded successfully');
    } catch (error) {
      console.log('⚠️  Page load took longer than expected, but continuing...');
      await this.takeScreenshot('01-gamma-homepage-timeout');
    }

    console.log('\n⚠️  MANUAL STEPS REQUIRED:');
    console.log('1. Complete Cloudflare verification if it appears');
    console.log('2. Log in to your Gamma account (login will be saved for future runs)');
    console.log('3. Once logged in and on the Gamma dashboard, press ENTER in this terminal');
    console.log('\nℹ️  TIP: Your login will be saved, so you only need to do this once!\n');

    // Wait for manual login
    await this.waitForUserInput();
    console.log('✓ Login and verification confirmed');
  }

  /**
   * Wait for user input (for manual steps)
   */
  async waitForUserInput() {
    return new Promise((resolve) => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
  }

  /**
   * Create a new presentation
   */
  async createNewPresentation(title) {
    console.log('📄 Creating new presentation...');
    console.log('\n⚠️  MANUAL STEP:');
    console.log('1. Click "Create new" or "New" button in Gamma');
    console.log('2. Select "Presentation" or "Blank presentation"');
    console.log('3. Wait for the editor to load');
    console.log('4. Press ENTER in this terminal to continue\n');

    await this.waitForUserInput();
    await this.page.waitForTimeout(2000);
    await this.takeScreenshot('02-new-presentation');
    console.log('✓ Ready to add slides');
  }

  /**
   * Add a slide with content
   * @param {Object} slide - Slide data with title and content
   */
  async addSlide(slide) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 Slide ${slide.number}/${this.totalSlides}: ${slide.type}`);
    console.log('='.repeat(60));

    if (slide.title) {
      console.log(`\n📌 TITLE:`);
      console.log(slide.title);
    }

    if (slide.content) {
      console.log(`\n📄 CONTENT:`);
      console.log(slide.content);
    }

    console.log('\n⚠️  ACTION REQUIRED:');
    console.log('1. Copy the title and content above');
    console.log('2. Paste into your Gamma slide');
    console.log('3. Add a new slide for the next one (if not the last slide)');
    console.log('4. Press ENTER to continue to next slide\n');

    await this.waitForUserInput();
    await this.takeScreenshot(`03-slide-${slide.number}`);
    console.log(`✓ Slide ${slide.number} marked complete`);
  }

  /**
   * Type content into the active slide
   * @param {string} content - Content to type
   * @param {boolean} isTitle - Whether this is a title (vs body content)
   */
  async typeIntoActiveSlide(content, isTitle) {
    try {
      // Click on the slide editor area
      const selector = isTitle ? '[contenteditable="true"]' : '[contenteditable="true"]';
      await this.page.waitForSelector(selector, { timeout: 5000 });

      // Click and type
      await this.page.click(selector);
      await this.page.waitForTimeout(1000); // Increased wait time
      await this.page.keyboard.type(content, { delay: 100 }); // Slower typing

      // Move to next section if this is a title
      if (isTitle) {
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(1000); // Increased wait time
      }
    } catch (error) {
      console.log(`   ℹ️  Manual input may be needed: ${error.message}`);
    }
  }

  /**
   * Add a new slide
   */
  async addNewSlide() {
    try {
      // Try keyboard shortcut first (most reliable)
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(2000); // Increased wait time for new slide
    } catch (error) {
      console.log('   ℹ️  Using manual slide addition');
      console.log('Please add a new slide manually, then press ENTER...');
      await this.waitForUserInput();
    }
  }

  /**
   * Apply theme and styling
   */
  async applyTheme(themeName) {
    console.log(`🎨 Applying theme: ${themeName}`);

    try {
      // Look for theme/design button
      await this.page.click('button:has-text("Theme"), button:has-text("Design")', {
        timeout: 5000
      });

      await this.page.waitForTimeout(2000); // Increased wait time
      await this.takeScreenshot('04-theme-selector');

      console.log('⚠️  Please manually select the theme and press ENTER to continue...');
      await this.waitForUserInput();

      console.log('✓ Theme applied');
    } catch (error) {
      console.log('ℹ️  Skipping automatic theme application');
      console.log('Please manually apply your preferred theme.');
    }
  }

  /**
   * Export presentation
   * @param {string} format - Export format (PDF, PNG, etc.)
   */
  async exportPresentation(format = 'PDF') {
    console.log(`\n📥 Exporting presentation as ${format}...`);

    try {
      // Look for export/download button
      await this.page.click('button:has-text("Export"), button:has-text("Download")', {
        timeout: 5000
      });

      await this.page.waitForTimeout(2000); // Increased wait time
      await this.takeScreenshot('05-export-menu');

      console.log(`⚠️  Please manually select "${format}" export format`);
      console.log('Complete the export, then press ENTER to finish...');
      await this.waitForUserInput();

      console.log('✓ Export complete');
    } catch (error) {
      console.log('ℹ️  Please manually export the presentation');
      console.log('Press ENTER once export is complete...');
      await this.waitForUserInput();
    }
  }

  /**
   * Take a screenshot for debugging
   */
  async takeScreenshot(name) {
    if (this.page) {
      const filepath = path.join(this.config.screenshotsDir, `${name}.png`);
      await this.page.screenshot({ path: filepath, fullPage: true });
      console.log(`   📸 Screenshot: ${filepath}`);
    }
  }

  /**
   * Clean up and close browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('✓ Browser closed');
    }
  }

  /**
   * Main automation workflow
   * @param {Object} carouselData - Parsed carousel data
   */
  async runAutomation(carouselData) {
    try {
      this.totalSlides = carouselData.slides.length;

      await this.init();
      await this.navigateToGamma();
      await this.createNewPresentation(carouselData.metadata.title || 'New Presentation');

      // Apply theme
      if (this.config.theme) {
        await this.applyTheme(this.config.theme);
      }

      // Add all slides
      console.log(`\n📊 Ready to add ${this.totalSlides} slides...`);
      console.log('The script will show you each slide\'s content.');
      console.log('You\'ll manually paste it into Gamma, then press ENTER to continue.\n');

      for (const slide of carouselData.slides) {
        await this.addSlide(slide);
      }

      // Export
      await this.exportPresentation('PDF');

      console.log('\n✅ Automation complete!');
      console.log('Your presentation is ready for LinkedIn publishing.');

    } catch (error) {
      console.error('\n❌ Automation error:', error.message);
      await this.takeScreenshot('error');
      throw error;
    } finally {
      // Don't auto-close in interactive mode
      if (!this.config.headless) {
        console.log('\nPress ENTER to close the browser...');
        await this.waitForUserInput();
      }
      await this.close();
    }
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node gammaAutomation.js <carousel-data.json>');
    console.log('Example: node gammaAutomation.js carousel-data.json');
    process.exit(1);
  }

  const dataFile = args[0];

  (async () => {
    try {
      console.log('🎯 Gamma Automation Starting...\n');

      // Load carousel data
      const carouselData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      console.log(`✓ Loaded carousel data: ${carouselData.slides.length} slides\n`);

      // Run automation
      const automation = new GammaAutomation({
        headless: false,
        slowMo: 300
      });

      await automation.runAutomation(carouselData);

      console.log('\n🎉 All done!');
      process.exit(0);
    } catch (error) {
      console.error('\n💥 Fatal error:', error);
      process.exit(1);
    }
  })();
}

module.exports = GammaAutomation;
