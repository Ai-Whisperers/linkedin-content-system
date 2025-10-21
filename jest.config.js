/**
 * Jest Configuration for LinkedIn Content Creator
 *
 * This configuration sets up Jest for testing:
 * - Unit tests (automation scripts)
 * - Integration tests (workflows)
 * - Content validators
 *
 * Coverage thresholds enforce 80% minimum coverage
 */

module.exports = {
  // Use Node.js environment for testing
  testEnvironment: 'node',

  // Coverage output directory
  coverageDirectory: 'tests/coverage',

  // Files to collect coverage from
  collectCoverageFrom: [
    'automation/**/*.js',
    '!automation/node_modules/**',
    '!automation/screenshots/**',
    '!automation/carousel-data.json',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],

  // Enforce minimum coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/fixtures/',
    '/tests/coverage/',
    '/tests/e2e/**/*.test.js' // E2E tests run separately with longer timeouts
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Coverage reporters
  coverageReporters: [
    'text',           // Console output
    'text-summary',   // Summary in console
    'html',           // HTML report
    'lcov'            // For CI/CD integration (Codecov, etc.)
  ],

  // Verbose output for better debugging
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Test timeout (10 seconds for unit tests)
  testTimeout: 10000,

  // Transform settings (if needed for ES6 modules in future)
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
  errorOnDeprecated: true,

  // Collect coverage from all files
  collectCoverage: false, // Enable with --coverage flag

  // Maximum workers (use half of available CPUs for faster tests)
  maxWorkers: '50%'
};
