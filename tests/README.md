# Testing Documentation

## Quick Start

### Install Dependencies

```bash
npm install
```

This installs Jest and all testing dependencies.

### Run Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run with coverage report
npm run test:coverage

# Run in watch mode (re-runs on file changes)
npm run test:watch

# Run with verbose output
npm run test:verbose
```

### Validate a Post

```bash
# Validate a specific post
npm run validate:post drafts/posts/001-how-to-triage-agent.md
```

---

## Test Structure

```
tests/
├── unit/                    # Unit tests (functions, utilities)
│   └── parseCarousel.test.js
├── integration/             # Integration tests (components working together)
├── e2e/                     # End-to-end tests (full workflows)
├── fixtures/                # Test data files
│   └── valid-carousel.md
├── helpers/                 # Test utilities
│   ├── testUtils.js
│   └── mockData.js
├── temp/                    # Temporary test files (auto-cleaned)
├── coverage/                # Coverage reports (auto-generated)
├── setup.js                 # Global test setup
└── README.md                # This file
```

---

## Writing Tests

### Test File Naming

- **Unit tests:** `functionName.test.js`
- **Integration tests:** `workflowName.test.js`
- **E2E tests:** `fullScenario.test.js`

### Test Structure (AAA Pattern)

```javascript
describe('Feature or Component', () => {
  it('should do something specific', () => {
    // Arrange: Set up test data
    const input = 'test data';

    // Act: Execute the function
    const result = myFunction(input);

    // Assert: Verify the outcome
    expect(result).toBe('expected output');
  });
});
```

### Example Unit Test

```javascript
const { parseCarouselMarkdown } = require('../../automation/parseCarousel');

describe('parseCarouselMarkdown', () => {
  it('should parse a valid carousel', () => {
    // Arrange
    const fixturePath = './tests/fixtures/valid-carousel.md';

    // Act
    const result = parseCarouselMarkdown(fixturePath);

    // Assert
    expect(result.slides).toHaveLength(3);
    expect(result.metadata.title).toBeDefined();
  });
});
```

---

## Test Coverage

### Current Coverage Goals

- **Unit tests:** ≥80%
- **Integration tests:** ≥70%
- **E2E tests:** ≥50%

### View Coverage Report

```bash
npm run test:coverage
```

Then open: `tests/coverage/lcov-report/index.html` in your browser.

### Coverage Thresholds

Coverage thresholds are enforced in `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

---

## Content Validation

### Automated Quality Checks

The project includes automated validators for LinkedIn posts:

#### Word Count Validator
```javascript
const { validateWordCount } = require('../automation/validators/wordCountValidator');

const result = validateWordCount(postContent);
// { valid: true, count: 156, min: 120, max: 180 }
```

#### Hashtag Validator
```javascript
const { validateHashtags } = require('../automation/validators/hashtagValidator');

const result = validateHashtags(postContent);
// { valid: true, count: 4, broad: 2, niche: 2 }
```

#### Buzzword Detector
```javascript
const { detectBuzzwords } = require('../automation/validators/buzzwordDetector');

const result = detectBuzzwords(postContent);
// { valid: false, found: ['revolutionary', 'AI magic'] }
```

#### Emoji Counter
```javascript
const { validateEmojiCount } = require('../automation/validators/emojiCounter');

const result = validateEmojiCount(postContent);
// { valid: true, count: 2, max: 2, emojis: ['⚡', '🚀'] }
```

### Run All Quality Checks

```bash
npm run validate:post drafts/posts/001-how-to-triage-agent.md
```

**Output:**
```
✓ Word Count: 156 words (target: 120-180)
✓ Hashtags: 4 found (required: 4)
  - Broad: 2, Niche: 2
✓ Buzzwords: 0 found
✓ Emojis: 1 found (max: 2)

✅ OVERALL: PASS
```

---

## Test Utilities

### Available Helpers

Located in `tests/helpers/testUtils.js`:

```javascript
const {
  readFixture,           // Read test fixture file
  createTempFile,        // Create temporary test file
  cleanupTempFiles,      // Delete temp files after test
  countWords,            // Count words in text
  countEmojis,           // Count emojis in text
  extractHashtags,       // Extract hashtags from text
  findBuzzwords,         // Find buzzwords in text
  createMockCarousel,    // Generate mock carousel data
  createMockPost,        // Generate mock post content
  wait                   // Async wait helper
} = require('./tests/helpers/testUtils');
```

### Custom Matchers

Available in all tests:

```javascript
// Check if text has no buzzwords
expect(postContent).toHaveNoBuzzwords();

// Check if text has valid word count (120-180)
expect(postContent).toHaveValidWordCount();
```

---

## Debugging Tests

### Run a Single Test File

```bash
npm test tests/unit/parseCarousel.test.js
```

### Run Tests Matching a Pattern

```bash
npm test -- --testNamePattern="should parse"
```

### Enable Verbose Logging

```bash
npm run test:verbose
```

### View Screenshots (for Integration Tests)

Integration tests save screenshots to `automation/screenshots/` for debugging.

---

## Continuous Integration

### GitHub Actions

Tests run automatically on every push and pull request.

**Workflow:** `.github/workflows/test.yml`

**Runs:**
- Unit tests
- Integration tests
- Coverage check (fails if <80%)
- Post validation on all drafts

### Pre-commit Hooks

Install Husky for pre-commit testing:

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run test:unit"
```

---

## Best Practices

### 1. Test Isolation

Each test should be independent:

```javascript
afterEach(() => {
  cleanupTempFiles(); // Clean up after each test
});
```

### 2. Descriptive Test Names

```javascript
// Good
it('should parse carousel with 7 slides and extract metadata', () => {});

// Bad
it('should work', () => {});
```

### 3. Test Edge Cases

```javascript
describe('Edge cases', () => {
  it('should handle empty input', () => {});
  it('should handle missing sections', () => {});
  it('should throw error for invalid input', () => {});
});
```

### 4. Mock External Dependencies

```javascript
jest.mock('fs');
fs.readFileSync.mockReturnValue('mock content');
```

### 5. Keep Tests Fast

- Unit tests: <5 seconds total
- Integration tests: <30 seconds total
- Use mocks to avoid slow I/O operations

---

## Troubleshooting

### Tests Failing Locally

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Coverage Not Updating

```bash
# Delete coverage directory
rm -rf tests/coverage

# Re-run coverage
npm run test:coverage
```

### Module Not Found Errors

Check that paths are correct in `jest.config.js`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1'
}
```

---

## Additional Resources

### Documentation

- **Testing Plan:** `TESTING_PLAN.md` - Comprehensive QA strategy
- **Jest Docs:** https://jestjs.io/docs/getting-started
- **Playwright Docs:** https://playwright.dev/docs/intro

### Code Quality

- **ESLint:** `npm run lint` (if configured)
- **Prettier:** Format code consistently

### Getting Help

- Check the Testing Plan for detailed strategy
- Review example tests in `tests/unit/`
- Ask in team chat or create an issue

---

## Summary

**Quick Commands:**

```bash
npm test                    # Run all tests
npm run test:coverage       # Check coverage
npm run validate:post <file> # Validate a post
npm run test:watch          # Watch mode
```

**Coverage Goals:**
- Unit: 80%+
- Integration: 70%+
- E2E: 50%+

**Status:** ✅ Test infrastructure complete and operational

---

*Last Updated: 2025-10-21*
*Maintained By: QA Team*
