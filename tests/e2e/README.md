# E2E Tests for Gamma.app Integration

This directory contains end-to-end tests that validate the `gammaAutomation.js` module's integration with the live Gamma.app service.

---

## 🚀 Quick Start

### 1. Setup

```bash
# Copy environment template
cp ../../.env.test.template ../../.env.test

# Edit with your Gamma.app credentials
nano ../../.env.test
```

### 2. Run Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with visible browser (for debugging)
npm run test:e2e:headed

# Run in debug mode (slow motion)
npm run test:e2e:debug
```

### 3. Verify

All 20 tests should pass:
```
✅ Authentication & Setup (3/3)
✅ Presentation Creation (4/4)
✅ Slide Manipulation (6/6)
✅ Full Workflows (3/3)
✅ Theme & Styling (2/2)
✅ Export (2/2)
✅ Error Handling (3/3)
✅ Performance (2/2)

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
```

---

## 📁 Directory Structure

```
tests/e2e/
├── README.md                          # This file
├── gammaAutomation.e2e.test.js        # Main test file (20 tests)
│
├── helpers/                           # Test utilities
│   ├── gammaPageSelectors.js          # Centralized selectors
│   └── gammaTestUtils.js              # Auth, cleanup, assertions
│
├── fixtures/                          # Test data
│   ├── gamma-test-carousel-3.json     # 3-slide carousel
│   ├── gamma-test-carousel-7.json     # 7-slide carousel
│   └── gamma-test-single-slide.json   # Single slide
│
├── screenshots/                       # Test screenshots
│   ├── debug/                        # Debug screenshots (on failure)
│   └── baseline/                     # Visual regression baselines
│
└── .sessions/                        # Session persistence
    └── gamma-session.json            # Saved auth session (auto-generated)
```

---

## 🧪 Test Suites

### 1. Authentication & Setup (3 tests)
Validates login, session persistence, and navigation.

### 2. Presentation Creation (4 tests)
Tests creating presentations with various configurations.

### 3. Slide Manipulation (6 tests)
Tests typing content, adding slides, and navigation.

### 4. Full Workflows (3 tests) ⭐
**Most Important:** Tests complete carousel creation end-to-end.

### 5. Theme & Styling (2 tests)
Tests theme selection and application.

### 6. Export (2 tests)
Tests export menu and PDF export options.

### 7. Error Handling (3 tests)
Tests error recovery and edge cases.

### 8. Performance (2 tests)
Tests execution speed and rapid operations.

---

## ⚙️ Configuration

### Environment Variables

**Required:**
```bash
GAMMA_TEST_EMAIL=your.email@example.com
GAMMA_TEST_PASSWORD=your_password_here
```

**Optional:**
```bash
HEADLESS=true                # Run without visible browser
SLOW_MO=300                  # Slow down automation (ms)
AUTO_CLEANUP=true            # Delete test presentations
PERSIST_SESSION=true         # Reuse auth sessions
```

See `.env.test.template` for all options.

---

## 🔧 Helpers

### gammaPageSelectors.js

Centralized repository of all Gamma.app UI selectors.

**Key Exports:**
- `AUTH_SELECTORS` - Login, logout, session
- `NAVIGATION_SELECTORS` - Homepage, dashboard, create new
- `EDITOR_SELECTORS` - Slide canvas, content editing
- `THEME_SELECTORS` - Theme selection and application
- `EXPORT_SELECTORS` - Export menu, formats
- `TIMEOUTS` - Timeout configuration

**Usage:**
```javascript
const { EDITOR_SELECTORS } = require('./helpers/gammaPageSelectors');
await page.click(EDITOR_SELECTORS.contentEditable);
```

### gammaTestUtils.js

Test utilities for authentication, cleanup, and assertions.

**Key Exports:**
- `GammaAuth` - Authentication management
- `PresentationManager` - Presentation lifecycle
- `VisualAssertions` - Content verification
- `SlideHelper` - Slide manipulation
- `waitHelpers` - Smart waiting utilities

**Usage:**
```javascript
const { GammaAuth } = require('./helpers/gammaTestUtils');
const auth = new GammaAuth(page);
await auth.login(credentials);
```

---

## 📊 Coverage

### Current

**Before E2E Tests:**
- Infrastructure: 19.4% (50 tests)
- Uncovered: 80.6% (275 lines)

**After E2E Tests (Expected):**
- Total: 65%+ (20 tests)
- Increase: +45.6%

### Target Methods

| Method | Lines | Current | Target |
|--------|-------|---------|--------|
| `runAutomation()` | 155 | 0% | 90% ⭐ |
| `addSlide()` | 30 | 0% | 80% |
| `typeIntoActiveSlide()` | 25 | 0% | 80% |
| `addNewSlide()` | 20 | 0% | 70% |
| `applyTheme()` | 15 | 0% | 70% |
| `exportPresentation()` | 30 | 0% | 70% |

---

## 🐛 Troubleshooting

### Common Issues

#### Authentication Fails
```bash
# Clear saved session
rm .sessions/gamma-session.json

# Run in headed mode to see login
npm run test:e2e:headed -- --testNamePattern="should authenticate"
```

#### Selector Not Found
```bash
# Run in debug mode to inspect page
npm run test:e2e:debug

# Check screenshots in:
screenshots/debug/

# Update selectors in:
helpers/gammaPageSelectors.js
```

#### Tests Are Flaky
```bash
# Increase timeouts
TEST_TIMEOUT=180000 npm run test:e2e

# Increase slow motion
SLOW_MO=1000 npm run test:e2e:headed
```

#### Cleanup Fails
```bash
# Disable auto-cleanup to investigate
AUTO_CLEANUP=false npm run test:e2e:headed

# Manually delete presentations:
# 1. Log in to Gamma.app
# 2. Go to dashboard
# 3. Delete presentations starting with "E2E Test"
```

---

## 🔄 Maintenance

### When Gamma.app UI Changes

**1. Identify Broken Selectors:**
```bash
npm run test:e2e:headed
# Note which tests fail
```

**2. Inspect Gamma.app UI:**
- Open browser DevTools
- Right-click element → Inspect
- Look for: data-testid, class names, aria labels

**3. Update Selectors:**
```javascript
// Edit: helpers/gammaPageSelectors.js
const EDITOR_SELECTORS = {
  // Old
  titleEditor: '.old-class',

  // New (with fallback)
  titleEditor: '[data-testid="title-editor"], .new-class',
};
```

**4. Test Updates:**
```bash
npm run test:e2e:headed
```

**5. Commit Changes:**
```bash
git add helpers/gammaPageSelectors.js
git commit -m "Update selectors for Gamma.app UI v2.5"
```

---

## 📚 Resources

### Documentation
- **E2E_TEST_PLAN.md** - Complete test plan (60+ pages)
- **E2E_IMPLEMENTATION_SUMMARY.md** - Implementation summary
- **gammaPageSelectors.js** - Selector reference
- **gammaTestUtils.js** - Utility reference

### External
- [Playwright Docs](https://playwright.dev/)
- [Jest E2E Testing](https://jestjs.io/docs/tutorial-async)
- [Gamma.app](https://gamma.app/)

---

## 🎯 Running Specific Tests

### By Suite
```bash
# Run authentication tests only
npm run test:e2e -- --testNamePattern="Authentication"

# Run workflow tests only
npm run test:e2e -- --testNamePattern="Full Carousel Workflows"
```

### By Test
```bash
# Run specific test
npm run test:e2e -- --testNamePattern="should create complete 3-slide carousel"

# Run tests matching pattern
npm run test:e2e -- --testNamePattern="carousel"
```

### With Options
```bash
# Verbose output
npm run test:e2e -- --verbose

# Bail on first failure
npm run test:e2e -- --bail

# Run with coverage
npm run test:e2e -- --coverage
```

---

## 📈 Performance

### Expected Execution Times

| Mode | Duration |
|------|----------|
| Headless | 5-10 minutes |
| Headed | 10-15 minutes |
| Debug | 15-20 minutes |

### Per-Suite Benchmarks

| Suite | Tests | Target | Max |
|-------|-------|--------|-----|
| Authentication | 3 | 30s | 60s |
| Presentation Creation | 4 | 60s | 120s |
| Slide Manipulation | 6 | 90s | 180s |
| **Full Workflows** | 3 | 180s | 360s |
| Theme & Styling | 2 | 30s | 60s |
| Export | 2 | 30s | 60s |
| Error Handling | 3 | 45s | 90s |
| Performance | 2 | 30s | 60s |

---

## 🚨 Important Notes

### Do NOT Commit
```bash
.env.test                    # Contains credentials
.sessions/gamma-session.json # Contains auth session
screenshots/debug/*.png      # Debug screenshots
```

### DO Commit
```bash
.env.test.template           # Template for credentials
helpers/gammaPageSelectors.js # Selector definitions
helpers/gammaTestUtils.js    # Test utilities
fixtures/*.json              # Test data
```

### Test Account
- Use dedicated test account (not production)
- Keep account clean (delete old presentations)
- Verify credentials periodically

### Gamma.app Changes
- Tests may break when Gamma.app updates UI
- Update selectors in gammaPageSelectors.js
- Document changes in commit messages
- Run tests weekly to catch changes early

---

## ✅ Success Criteria

**Tests are successful when:**
- ✅ All 20 tests passing
- ✅ <10 minute execution time (headless)
- ✅ 65%+ code coverage
- ✅ <5% flakiness rate
- ✅ Zero manual intervention required

---

## 📞 Support

**Issues?**
1. Check troubleshooting section above
2. Review E2E_TEST_PLAN.md
3. Check screenshots in `screenshots/debug/`
4. Run in headed mode to observe behavior
5. Review selector definitions in helpers/

**Updating Tests?**
1. Update test file: `gammaAutomation.e2e.test.js`
2. Update selectors: `helpers/gammaPageSelectors.js`
3. Update utilities: `helpers/gammaTestUtils.js`
4. Update documentation: `E2E_TEST_PLAN.md`

---

**Status:** ✅ **READY FOR EXECUTION**

**Next Steps:**
1. Configure .env.test
2. Run `npm run test:e2e:headed`
3. Verify all 20 tests pass
4. Set up CI/CD (see E2E_TEST_PLAN.md)

---

*Last Updated: 2025-10-21*
*Test Count: 20 E2E tests*
*Target Coverage: 65%+*
