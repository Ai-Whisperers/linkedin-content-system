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
  slowMo: 500, // Slow down actions for visibility (ms)
  timeout: 60000, // 60 second timeout
  screenshotsDir: './automation/screenshots',
  theme: 'Professional', // Gamma theme
  slideRatio: '16:9' // Standard for LinkedIn
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
    this.browser = await chromium.launch({
      headless: this.config.headless,
      slowMo: this.config.slowMo
    });

    const context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    this.page = await context.newPage();
    this.page.setDefaultTimeout(this.config.timeout);

    // Create screenshots directory if it doesn't exist
    if (!fs.existsSync(this.config.screenshotsDir)) {
      fs.mkdirSync(this.config.screenshotsDir, { recursive: true });
    }

    console.log('✓ Browser launched');
  }

  /**
   * Navigate to Gamma and handle login
   */
  async navigateToGamma() {
    console.log('🔗 Navigating to Gamma.app...');
    await this.page.goto('https://gamma.app', { waitUntil: 'networkidle' });
    await this.takeScreenshot('01-gamma-homepage');

    console.log('\n⚠️  MANUAL STEP REQUIRED:');
    console.log('Please log in to your Gamma account in the browser window.');
    console.log('Press ENTER in this terminal once you are logged in and ready to continue...\n');

    // Wait for manual login
    await this.waitForUserInput();
    console.log('✓ Login confirmed');
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

    try {
      // Look for "New" or "Create" button
      await this.page.waitForSelector('button:has-text("New"), button:has-text("Create")', {
        timeout: 10000
      });

      await this.page.click('button:has-text("New"), button:has-text("Create")');
      await this.page.waitForTimeout(2000);

      // Look for "Presentation" option
      await this.page.click('text=Presentation, text=Blank presentation', {
        timeout: 5000
      }).catch(() => {
        console.log('Note: "Presentation" option not found, continuing...');
      });

      await this.takeScreenshot('02-new-presentation');
      console.log('✓ New presentation created');
    } catch (error) {
      console.log(`⚠️  Could not automatically create presentation: ${error.message}`);
      console.log('Please manually click "New" and select "Presentation".');
      console.log('Press ENTER once you have created a new presentation...\n');
      await this.waitForUserInput();
    }
  }

  /**
   * Add a slide with content
   * @param {Object} slide - Slide data with title and content
   */
  async addSlide(slide) {
    console.log(`\n📝 Adding Slide ${slide.number}: ${slide.type}`);

    try {
      // Wait a moment for the previous slide to be processed
      await this.page.waitForTimeout(1000);

      // Add title
      if (slide.title) {
        console.log(`   Title: ${slide.title.substring(0, 50)}...`);
        await this.typeIntoActiveSlide(slide.title, true);
      }

      // Add content
      if (slide.content) {
        console.log(`   Content: ${slide.content.substring(0, 50)}...`);
        await this.typeIntoActiveSlide(slide.content, false);
      }

      // Add new slide for next iteration
      if (slide.number < this.totalSlides) {
        await this.addNewSlide();
      }

      await this.takeScreenshot(`03-slide-${slide.number}`);
      console.log(`✓ Slide ${slide.number} added`);
    } catch (error) {
      console.error(`❌ Error adding slide ${slide.number}:`, error.message);
      console.log('Press ENTER to continue with next slide...');
      await this.waitForUserInput();
    }
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
      await this.page.waitForTimeout(500);
      await this.page.keyboard.type(content, { delay: 50 });

      // Move to next section if this is a title
      if (isTitle) {
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(500);
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
      await this.page.waitForTimeout(1000);
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

      await this.page.waitForTimeout(1000);
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

      await this.page.waitForTimeout(1000);
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
      console.log(`\n📊 Adding ${this.totalSlides} slides...`);
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
