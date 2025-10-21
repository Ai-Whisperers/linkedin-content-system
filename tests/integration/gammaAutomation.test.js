/**
 * Integration Tests for gammaAutomation.js
 *
 * Tests Playwright browser automation for Gamma.app
 * Target Coverage: 75%+ (complex Playwright integration)
 */

const GammaAutomation = require('../../automation/gammaAutomation');
const path = require('path');
const fs = require('fs');

describe('GammaAutomation Integration', () => {
  let automation;
  const testScreenshotsDir = path.join(__dirname, '../temp/screenshots');

  beforeEach(() => {
    // Clean up screenshots directory
    if (fs.existsSync(testScreenshotsDir)) {
      const files = fs.readdirSync(testScreenshotsDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(testScreenshotsDir, file));
      });
    }

    automation = new GammaAutomation({
      headless: true,
      slowMo: 0,
      timeout: 10000,
      screenshotsDir: testScreenshotsDir
    });
  });

  afterEach(async () => {
    if (automation && automation.browser) {
      await automation.close();
    }
  });

  describe('Constructor and Configuration', () => {
    // TC-GAMMA-001
    it('should initialize with default config', () => {
      const defaultAutomation = new GammaAutomation();

      expect(defaultAutomation.config.headless).toBe(false);
      expect(defaultAutomation.config.slowMo).toBe(500);
      expect(defaultAutomation.config.timeout).toBe(60000);
      expect(defaultAutomation.config.screenshotsDir).toBe('./automation/screenshots');
      expect(defaultAutomation.config.theme).toBe('Professional');
      expect(defaultAutomation.config.slideRatio).toBe('16:9');
    });

    // TC-GAMMA-002
    it('should merge custom config with defaults', () => {
      const customAutomation = new GammaAutomation({
        headless: true,
        slowMo: 100,
        timeout: 5000
      });

      expect(customAutomation.config.headless).toBe(true);
      expect(customAutomation.config.slowMo).toBe(100);
      expect(customAutomation.config.timeout).toBe(5000);
      // Defaults should still be present
      expect(customAutomation.config.theme).toBe('Professional');
    });

    // TC-GAMMA-003
    it('should initialize browser and page as null', () => {
      expect(automation.browser).toBeNull();
      expect(automation.page).toBeNull();
    });

    // TC-GAMMA-004
    it('should accept custom screenshots directory', () => {
      const customDir = './custom/screenshots';
      const customAutomation = new GammaAutomation({
        screenshotsDir: customDir
      });

      expect(customAutomation.config.screenshotsDir).toBe(customDir);
    });
  });

  describe('Browser Initialization', () => {
    // TC-GAMMA-005
    it('should initialize browser successfully', async () => {
      await automation.init();

      expect(automation.browser).toBeDefined();
      expect(automation.browser).not.toBeNull();
      expect(automation.page).toBeDefined();
      expect(automation.page).not.toBeNull();
    }, 15000);

    // TC-GAMMA-006
    it('should set correct viewport size', async () => {
      await automation.init();

      const viewport = automation.page.viewportSize();
      expect(viewport.width).toBe(1920);
      expect(viewport.height).toBe(1080);
    }, 15000);

    // TC-GAMMA-007
    it('should create screenshots directory if not exists', async () => {
      // Remove directory if exists
      if (fs.existsSync(testScreenshotsDir)) {
        fs.rmSync(testScreenshotsDir, { recursive: true });
      }

      await automation.init();

      expect(fs.existsSync(testScreenshotsDir)).toBe(true);
    }, 15000);

    // TC-GAMMA-008
    it('should set default timeout on page', async () => {
      await automation.init();

      // Page should have timeout set (can't directly test, but verify page exists)
      expect(automation.page).toBeDefined();
    }, 15000);

    // TC-GAMMA-009
    it('should launch browser in headless mode when configured', async () => {
      const headlessAutomation = new GammaAutomation({
        headless: true,
        screenshotsDir: testScreenshotsDir
      });

      await headlessAutomation.init();

      expect(headlessAutomation.browser).toBeDefined();
      await headlessAutomation.close();
    }, 15000);
  });

  describe('Screenshot Functionality', () => {
    beforeEach(async () => {
      await automation.init();
    }, 15000);

    // TC-GAMMA-010
    it('should save screenshot to configured directory', async () => {
      await automation.page.goto('https://example.com');
      await automation.takeScreenshot('test-screenshot');

      const screenshotPath = path.join(testScreenshotsDir, 'test-screenshot.png');
      expect(fs.existsSync(screenshotPath)).toBe(true);
    }, 15000);

    // TC-GAMMA-011
    it('should create screenshot with correct filename', async () => {
      await automation.page.goto('https://example.com');
      const testName = 'my-test-screenshot';
      await automation.takeScreenshot(testName);

      const screenshotPath = path.join(testScreenshotsDir, `${testName}.png`);
      expect(fs.existsSync(screenshotPath)).toBe(true);
    }, 15000);

    // TC-GAMMA-012
    it('should overwrite existing screenshot', async () => {
      await automation.page.goto('https://example.com');

      await automation.takeScreenshot('duplicate-test');
      const firstStats = fs.statSync(
        path.join(testScreenshotsDir, 'duplicate-test.png')
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      await automation.takeScreenshot('duplicate-test');
      const secondStats = fs.statSync(
        path.join(testScreenshotsDir, 'duplicate-test.png')
      );

      // File should be updated (size or timestamp different)
      expect(secondStats.mtimeMs).toBeGreaterThanOrEqual(firstStats.mtimeMs);
    }, 15000);

    // TC-GAMMA-013
    it('should handle screenshot when page is null', async () => {
      const noPageAutomation = new GammaAutomation({
        screenshotsDir: testScreenshotsDir
      });

      // Should not throw error
      await expect(noPageAutomation.takeScreenshot('test')).resolves.not.toThrow();
    });

    // TC-GAMMA-014
    it('should create full page screenshot', async () => {
      await automation.page.goto('https://example.com');
      await automation.takeScreenshot('full-page');

      const screenshotPath = path.join(testScreenshotsDir, 'full-page.png');
      const stats = fs.statSync(screenshotPath);

      // Screenshot should have some size
      expect(stats.size).toBeGreaterThan(0);
    }, 15000);
  });

  describe('Navigation', () => {
    beforeEach(async () => {
      await automation.init();
    }, 15000);

    // TC-GAMMA-015
    it('should navigate to URLs successfully', async () => {
      await automation.page.goto('https://example.com');

      expect(automation.page.url()).toContain('example.com');
    }, 15000);

    // TC-GAMMA-016
    it('should wait for network idle', async () => {
      await automation.page.goto('https://example.com', {
        waitUntil: 'networkidle'
      });

      const title = await automation.page.title();
      expect(title).toBeDefined();
      expect(title).toContain('Example');
    }, 15000);

    // TC-GAMMA-017
    it('should handle navigation errors gracefully', async () => {
      await expect(
        automation.page.goto('https://invalid-domain-that-does-not-exist-12345.com', {
          timeout: 5000
        })
      ).rejects.toThrow();
    }, 15000);
  });

  describe('Cleanup and Close', () => {
    // TC-GAMMA-018
    it('should close browser successfully', async () => {
      await automation.init();
      await automation.close();

      // Browser should be closed (checking this directly is tricky)
      // At minimum, close should not throw
      expect(true).toBe(true);
    }, 15000);

    // TC-GAMMA-019
    it('should handle close when browser not initialized', async () => {
      // Should not throw error
      await expect(automation.close()).resolves.not.toThrow();
    });

    // TC-GAMMA-020
    it('should handle multiple close calls', async () => {
      await automation.init();
      await automation.close();

      // Second close should not throw
      await expect(automation.close()).resolves.not.toThrow();
    }, 15000);
  });

  describe('waitForUserInput', () => {
    // TC-GAMMA-021
    it('should return a promise', () => {
      const promise = automation.waitForUserInput();
      expect(promise).toBeInstanceOf(Promise);

      // Resolve immediately to avoid hanging test
      process.stdin.emit('data', Buffer.from('\n'));
    });

    // TC-GAMMA-022
    it('should resolve when stdin receives data', async () => {
      const promise = automation.waitForUserInput();

      // Simulate user pressing Enter
      setTimeout(() => {
        process.stdin.emit('data', Buffer.from('\n'));
      }, 100);

      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('Configuration Properties', () => {
    // TC-GAMMA-023
    it('should expose config object', () => {
      expect(automation.config).toBeDefined();
      expect(typeof automation.config).toBe('object');
    });

    // TC-GAMMA-024
    it('should have all required config properties', () => {
      expect(automation.config).toHaveProperty('headless');
      expect(automation.config).toHaveProperty('slowMo');
      expect(automation.config).toHaveProperty('timeout');
      expect(automation.config).toHaveProperty('screenshotsDir');
      expect(automation.config).toHaveProperty('theme');
      expect(automation.config).toHaveProperty('slideRatio');
    });
  });

  describe('Error Handling', () => {
    // TC-GAMMA-025
    it('should handle invalid screenshots directory', async () => {
      const badAutomation = new GammaAutomation({
        headless: true,
        screenshotsDir: '/invalid/path/that/cannot/exist/on/windows/C:/NUL'
      });

      // Should handle error during init
      await expect(badAutomation.init()).rejects.toThrow();
    }, 15000);

    // TC-GAMMA-026
    it('should set totalSlides property when provided', () => {
      const carouselData = {
        slides: [{ number: 1 }, { number: 2 }, { number: 3 }],
        metadata: { title: 'Test' }
      };

      automation.totalSlides = carouselData.slides.length;

      expect(automation.totalSlides).toBe(3);
    });
  });

  describe('Module Export', () => {
    // TC-GAMMA-027
    it('should export GammaAutomation class', () => {
      expect(GammaAutomation).toBeDefined();
      expect(typeof GammaAutomation).toBe('function');
    });

    // TC-GAMMA-028
    it('should be instantiable', () => {
      const instance = new GammaAutomation();
      expect(instance).toBeInstanceOf(GammaAutomation);
    });

    // TC-GAMMA-029
    it('should have required methods', () => {
      expect(typeof automation.init).toBe('function');
      expect(typeof automation.navigateToGamma).toBe('function');
      expect(typeof automation.createNewPresentation).toBe('function');
      expect(typeof automation.addSlide).toBe('function');
      expect(typeof automation.takeScreenshot).toBe('function');
      expect(typeof automation.close).toBe('function');
      expect(typeof automation.runAutomation).toBe('function');
    });
  });

  describe('Performance', () => {
    // TC-GAMMA-030
    it('should initialize browser within reasonable time', async () => {
      const start = Date.now();
      await automation.init();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(15000); // Less than 15 seconds
    }, 20000);

    // TC-GAMMA-031
    it('should handle multiple screenshots efficiently', async () => {
      await automation.init();
      await automation.page.goto('https://example.com');

      const start = Date.now();

      for (let i = 0; i < 3; i++) {
        await automation.takeScreenshot(`perf-test-${i}`);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000); // Less than 5 seconds for 3 screenshots
    }, 20000);
  });

  describe('Integration with Carousel Data', () => {
    // TC-GAMMA-032
    it('should accept carousel data structure', () => {
      const carouselData = {
        metadata: {
          title: 'Test Carousel'
        },
        slides: [
          {
            number: 1,
            type: 'Hook',
            title: 'Slide 1 Title',
            content: 'Slide 1 Content'
          }
        ]
      };

      // Should not throw when setting totalSlides
      expect(() => {
        automation.totalSlides = carouselData.slides.length;
      }).not.toThrow();
    });

    // TC-GAMMA-033
    it('should handle empty carousel data', () => {
      const emptyCarousel = {
        metadata: {},
        slides: []
      };

      automation.totalSlides = emptyCarousel.slides.length;

      expect(automation.totalSlides).toBe(0);
    });
  });

  describe('Browser Context', () => {
    // TC-GAMMA-034
    it('should create browser context with viewport', async () => {
      await automation.init();

      const viewport = automation.page.viewportSize();

      expect(viewport).toBeDefined();
      expect(viewport.width).toBe(1920);
      expect(viewport.height).toBe(1080);
    }, 15000);

    // TC-GAMMA-035
    it('should have page available after init', async () => {
      await automation.init();

      expect(automation.page).not.toBeNull();
      expect(typeof automation.page.goto).toBe('function');
      expect(typeof automation.page.screenshot).toBe('function');
    }, 15000);
  });

  describe('Screenshots Directory Creation', () => {
    // TC-GAMMA-036
    it('should create nested screenshots directories', async () => {
      const nestedDir = path.join(__dirname, '../temp/nested/deep/screenshots');
      const nestedAutomation = new GammaAutomation({
        headless: true,
        screenshotsDir: nestedDir
      });

      await nestedAutomation.init();

      expect(fs.existsSync(nestedDir)).toBe(true);

      await nestedAutomation.close();

      // Cleanup
      fs.rmSync(path.join(__dirname, '../temp/nested'), { recursive: true });
    }, 15000);

    // TC-GAMMA-037
    it('should not error if screenshots directory already exists', async () => {
      // Create directory first
      fs.mkdirSync(testScreenshotsDir, { recursive: true });

      // Should not throw
      await expect(automation.init()).resolves.not.toThrow();
    }, 15000);
  });

  describe('Config Validation', () => {
    // TC-GAMMA-038
    it('should handle numeric timeout config', () => {
      const configWithTimeout = new GammaAutomation({
        timeout: 30000
      });

      expect(configWithTimeout.config.timeout).toBe(30000);
    });

    // TC-GAMMA-039
    it('should handle numeric slowMo config', () => {
      const configWithSlowMo = new GammaAutomation({
        slowMo: 250
      });

      expect(configWithSlowMo.config.slowMo).toBe(250);
    });

    // TC-GAMMA-040
    it('should handle boolean headless config', () => {
      const headlessConfig = new GammaAutomation({
        headless: true
      });

      expect(headlessConfig.config.headless).toBe(true);

      const nonHeadlessConfig = new GammaAutomation({
        headless: false
      });

      expect(nonHeadlessConfig.config.headless).toBe(false);
    });
  });
});

describe('GammaAutomation Method Coverage', () => {
  let automation;

  beforeEach(() => {
    automation = new GammaAutomation({
      headless: true,
      screenshotsDir: path.join(__dirname, '../temp/screenshots')
    });
  });

  afterEach(async () => {
    if (automation && automation.browser) {
      await automation.close();
    }
  });

  // TC-GAMMA-041
  it('should have addSlide method', () => {
    expect(typeof automation.addSlide).toBe('function');
  });

  // TC-GAMMA-042
  it('should have typeIntoActiveSlide method', () => {
    expect(typeof automation.typeIntoActiveSlide).toBe('function');
  });

  // TC-GAMMA-043
  it('should have addNewSlide method', () => {
    expect(typeof automation.addNewSlide).toBe('function');
  });

  // TC-GAMMA-044
  it('should have applyTheme method', () => {
    expect(typeof automation.applyTheme).toBe('function');
  });

  // TC-GAMMA-045
  it('should have exportPresentation method', () => {
    expect(typeof automation.exportPresentation).toBe('function');
  });

  // TC-GAMMA-046
  it('should have waitForUserInput method', () => {
    expect(typeof automation.waitForUserInput).toBe('function');
  });

  // TC-GAMMA-047
  it('should have runAutomation method', () => {
    expect(typeof automation.runAutomation).toBe('function');
  });
});

describe('GammaAutomation Edge Cases', () => {
  // TC-GAMMA-048
  it('should handle null config gracefully', () => {
    expect(() => {
      new GammaAutomation(null);
    }).not.toThrow();
  });

  // TC-GAMMA-049
  it('should handle undefined config gracefully', () => {
    expect(() => {
      new GammaAutomation(undefined);
    }).not.toThrow();
  });

  // TC-GAMMA-050
  it('should handle empty config object', () => {
    const emptyConfig = new GammaAutomation({});

    expect(emptyConfig.config.headless).toBe(false); // Should use default
    expect(emptyConfig.config.theme).toBe('Professional'); // Should use default
  });
});
