/**
 * Jest Configuration for E2E Tests
 *
 * This configuration is specifically for E2E tests that interact with
 * live Gamma.app service. These tests:
 * - Have longer timeouts (2 minutes per test)
 * - Run serially (no parallel execution)
 * - Require authentication
 * - Create real presentations
 * - May be slower and more flaky
 *
 * Usage:
 * - npm run test:e2e (headless mode)
 * - npm run test:e2e:headed (headed mode with visual debugging)
 */

module.exports = {
  // Use Node.js environment for testing
  testEnvironment: 'node',

  // Test file patterns - only E2E tests
  testMatch: [
    '**/tests/e2e/**/*.e2e.test.js'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/fixtures/',
    '/tests/coverage/',
    '/tests/unit/',
    '/tests/integration/'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Verbose output for better debugging
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // E2E test timeout - 2 minutes per test
  testTimeout: 120000,

  // Transform settings
  transform: {},

  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'node'],

  // Ignore transform for node_modules
  transformIgnorePatterns: [
    'node_modules/'
  ],

  // Display individual test results
  notify: false,

  // Fail tests on console warnings
  errorOnDeprecated: false, // E2E tests may have warnings from Playwright

  // Coverage - not typically collected for E2E tests
  collectCoverage: false,

  // IMPORTANT: Run E2E tests serially (not in parallel)
  // This prevents authentication conflicts and resource contention
  maxWorkers: 1,

  // Bail after first failure (optional - comment out to run all tests)
  // bail: 1,

  // Retry failed tests (helps with flaky E2E tests)
  // Note: This requires jest-circus test runner (Jest 27+)
  // testRunner: 'jest-circus/runner',

  // Global timeout for entire test suite (30 minutes)
  globalTimeout: 1800000,

  // Detect open handles (helps find async cleanup issues)
  detectOpenHandles: true,

  // Force exit after tests complete (useful for Playwright)
  forceExit: true,

  // Environment variables for E2E tests
  testEnvironmentOptions: {
    // Add any environment-specific options here
  },

  // Coverage reporters (if enabled)
  coverageReporters: [
    'text',
    'text-summary'
  ],

  // Coverage directory
  coverageDirectory: 'tests/coverage/e2e',

  // Files to collect coverage from (if enabled)
  collectCoverageFrom: [
    'automation/gammaAutomation.js',
    '!automation/node_modules/**',
    '!automation/screenshots/**'
  ],

  // Reporter for test results
  reporters: [
    'default',
    // Uncomment to add JUnit reporter for CI/CD
    // ['jest-junit', {
    //   outputDirectory: './tests/coverage/e2e',
    //   outputName: 'junit-e2e.xml',
    //   suiteName: 'E2E Tests',
    // }]
  ],
};
