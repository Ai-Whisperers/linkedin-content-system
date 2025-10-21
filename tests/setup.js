/**
 * Jest Setup File
 *
 * This file runs before all tests to set up the testing environment.
 * It configures global test utilities, mocks, and custom matchers.
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.CI = process.env.CI || 'false';

// Increase test timeout for integration tests if needed
// Individual tests can override this with jest.setTimeout()
jest.setTimeout(10000); // 10 seconds default

// Global test utilities
global.testUtils = {
  /**
   * Wait for a specified number of milliseconds
   * @param {number} ms - Milliseconds to wait
   */
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Generate a random string for test data
   * @param {number} length - Length of string
   */
  randomString: (length = 10) => {
    return Math.random().toString(36).substring(2, length + 2);
  },

  /**
   * Create a temporary file path for testing
   * @param {string} filename - File name
   */
  tempFilePath: (filename) => {
    return `./tests/temp/${filename}`;
  }
};

// Mock console methods to reduce noise in test output
// Uncomment if you want to suppress console.log during tests
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };

// Custom matchers (if needed in the future)
expect.extend({
  /**
   * Check if a string contains no buzzwords
   */
  toHaveNoBuzzwords(received) {
    const buzzwords = [
      'AI magic',
      'revolutionary',
      'game-changing',
      'disruptive',
      'synergy'
    ];

    const found = buzzwords.filter(word =>
      received.toLowerCase().includes(word.toLowerCase())
    );

    const pass = found.length === 0;

    return {
      pass,
      message: () =>
        pass
          ? `Expected string to contain buzzwords, but found none`
          : `Expected string to have no buzzwords, but found: ${found.join(', ')}`
    };
  },

  /**
   * Check if a post has valid word count (120-180)
   */
  toHaveValidWordCount(received) {
    const wordCount = received.trim().split(/\s+/).length;
    const pass = wordCount >= 120 && wordCount <= 180;

    return {
      pass,
      message: () =>
        pass
          ? `Expected word count to be invalid, but got ${wordCount} words`
          : `Expected word count to be 120-180, but got ${wordCount} words`
    };
  }
});

// Silence specific warnings if needed
const originalWarn = console.warn;
console.warn = (...args) => {
  // Filter out specific warnings you want to ignore
  const warningMessage = args[0]?.toString() || '';

  // Example: Suppress deprecation warnings
  if (warningMessage.includes('Deprecation')) {
    return;
  }

  originalWarn(...args);
};

// Setup complete
console.log('🧪 Test environment initialized');
