# E2E Test Plan: Gamma.app Integration

**Project:** AI-Whisperers LinkedIn Content System
**Component:** gammaAutomation.js
**Test Type:** End-to-End (E2E) with Live Gamma.app Integration
**Target Coverage:** 19.4% → 65%+
**Test Count:** 20 E2E tests
**Estimated Execution Time:** 5-10 minutes (headless), 10-15 minutes (headed)
**Date Created:** 2025-10-21
**Status:** Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Test Architecture](#test-architecture)
4. [Test Suites](#test-suites)
5. [Setup Instructions](#setup-instructions)
6. [Running Tests](#running-tests)
7. [CI/CD Integration](#cicd-integration)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)
10. [Coverage Goals](#coverage-goals)

---

## Overview

### Purpose

This E2E test suite validates the `gammaAutomation.js` module's integration with the live Gamma.app service. Unlike unit and integration tests that mock external dependencies, these tests:

- **Interact with real Gamma.app** - Tests create actual presentations
- **Validate full workflows** - From authentication to export
- **Detect UI changes** - Break when Gamma.app updates its interface
- **Require credentials** - Use real account for testing
- **Run slower** - Network operations and browser automation take time

### Why E2E Tests?

**Current Coverage Gap:**
- **Infrastructure tests (50 tests):** 19.4% coverage
- **Missing:** `runAutomation()` workflow (155 lines), Gamma.app interactions (120 lines)
- **Total uncovered:** 80.6% of gammaAutomation.js

**E2E tests fill this gap by:**
1. Testing real Gamma.app selector interactions
2. Validating complete carousel creation workflows
3. Detecting breaking changes in Gamma.app UI
4. Ensuring production readiness

### Test Pyramid Position

```
         E2E Tests (20 tests)                    ▲
      ┌──────────────────┐                       │
      │ Live Gamma.app   │                       │ 10% of tests
      │ Full Workflows   │                       │ Slowest, most realistic
      └──────────────────┘                       │
                                                 │
    Integration Tests (50 tests)                 │
   ┌──────────────────────────┐                  │ 28% of tests
   │ Infrastructure Testing   │                  │ Medium speed
   │ Browser, Screenshots    │                  │
   └──────────────────────────┘                  │
                                                 │
      Unit Tests (130 tests)                     │
  ┌────────────────────────────────┐             │ 62% of tests
  │ Validators, Parsers (100%)     │             │ Fast, isolated
  └────────────────────────────────┘             ▼

Total: 200 tests
Target Coverage: 65%+
```

---

## Prerequisites

### 1. Gamma.app Account

**Required:**
- Active Gamma.app account (free tier sufficient)
- Valid email and password
- Access to create and delete presentations

**Recommended:**
- Dedicated test account (avoid using production account)
- Clean account state (no existing presentations)

### 2. Environment Setup

**Node.js & Dependencies:**
```bash
# Install dependencies
npm install

# Verify Playwright is installed
npx playwright --version
```

**Environment Variables:**
```bash
# Copy template
cp .env.test.template .env.test

# Edit with your credentials
# GAMMA_TEST_EMAIL=your.email@example.com
# GAMMA_TEST_PASSWORD=your_password_here
```

### 3. System Requirements

**Operating System:**
- Windows, macOS, or Linux
- Internet connection required

**Browser:**
- Chromium (installed automatically by Playwright)
- Firefox and WebKit also supported

**Resources:**
- Minimum 4GB RAM
- Stable internet connection (tests fail on network issues)

---

## Test Architecture

### File Structure

```
tests/e2e/
├── gammaAutomation.e2e.test.js       # Main test file (20 tests)
├── helpers/
│   ├── gammaPageSelectors.js         # Centralized selectors repository
│   └── gammaTestUtils.js             # Auth, cleanup, assertions
├── fixtures/
│   ├── gamma-test-carousel-3.json    # 3-slide carousel
│   ├── gamma-test-carousel-7.json    # 7-slide carousel
│   └── gamma-test-single-slide.json  # Single slide
├── screenshots/                       # Test screenshots
│   ├── debug/                        # Debug screenshots
│   └── baseline/                     # Visual regression baselines
└── .sessions/                        # Session persistence
    └── gamma-session.json            # Saved auth session

jest.e2e.config.js                    # E2E Jest configuration
.env.test                             # Test credentials (gitignored)
.env.test.template                    # Template for credentials
```

### Key Components

#### 1. gammaPageSelectors.js

**Purpose:** Centralized selector repository

**Strategy:**
- Primary: `data-testid` attributes (most stable)
- Fallback 1: CSS class selectors (moderate stability)
- Fallback 2: Text-based selectors (least stable)
- Fallback 3: XPath (last resort)

**Example:**
```javascript
const EDITOR_SELECTORS = {
  contentEditable: '[contenteditable="true"]',
  titleEditor: '[contenteditable="true"]:first, [data-testid="title-editor"]',
  bodyEditor: '[contenteditable="true"]:last, [data-testid="body-editor"]',
};
```

**Benefits:**
- Single source of truth for selectors
- Easy updates when Gamma.app UI changes
- Multiple fallback options reduce flakiness

#### 2. gammaTestUtils.js

**Purpose:** Test utilities and helpers

**Classes:**
- `GammaAuth` - Authentication and session management
- `PresentationManager` - Create, track, cleanup presentations
- `VisualAssertions` - Verify slide content, themes, screenshots
- `SlideHelper` - Type content, add slides, navigate

**Functions:**
- `waitHelpers` - Smart waiting for page loads, notifications
- `takeDebugScreenshot()` - Capture screenshots on failure
- `retryOperation()` - Retry flaky operations
- `getTestCredentials()` - Load credentials from environment

#### 3. Test Fixtures

**Purpose:** Realistic carousel data for testing

**Fixtures:**
- `gamma-test-carousel-3.json` - 3-slide carousel (fast tests)
- `gamma-test-carousel-7.json` - 7-slide carousel (realistic workflow)
- `gamma-test-single-slide.json` - Single slide (edge case)

---

## Test Suites

### Suite 1: Authentication & Setup (3 tests)

**Purpose:** Validate authentication and session management

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| E2E-AUTH-001 | Authenticate with valid credentials | Successfully logged in |
| E2E-AUTH-002 | Persist session across page reloads | Session remains valid |
| E2E-AUTH-003 | Navigate to dashboard | Dashboard loads correctly |

**Coverage:** Lines 61-73, 78-84 (authentication methods)

---

### Suite 2: Presentation Creation (4 tests)

**Purpose:** Validate presentation creation workflow

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| E2E-CREATE-001 | Create new blank presentation | Presentation created, editor loaded |
| E2E-CREATE-002 | Create presentation with custom title | Title set correctly |
| E2E-CREATE-003 | Load editor with default first slide | Slide canvas visible |
| E2E-CREATE-004 | Create multiple presentations sequentially | Both presentations created |

**Coverage:** Lines 89-116 (createNewPresentation method)

---

### Suite 3: Slide Manipulation (6 tests)

**Purpose:** Validate slide content and navigation

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| E2E-SLIDE-001 | Type title into slide | Title appears in slide |
| E2E-SLIDE-002 | Type content into slide body | Content appears in slide |
| E2E-SLIDE-003 | Add a new slide | Slide count increases |
| E2E-SLIDE-004 | Create multiple slides sequentially | All slides created |
| E2E-SLIDE-005 | Handle special characters | Special chars rendered |
| E2E-SLIDE-006 | Navigate between slides | Navigation works correctly |

**Coverage:** Lines 122-153, 160-179, 184-194 (slide manipulation methods)

---

### Suite 4: Full Carousel Workflows (3 tests)

**Purpose:** Validate end-to-end carousel creation

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| E2E-WORKFLOW-001 | Create complete 3-slide carousel | All 3 slides created with content |
| E2E-WORKFLOW-002 | Create complete 7-slide carousel | All 7 slides created with content |
| E2E-WORKFLOW-003 | Handle single-slide carousel | Single slide created |

**Coverage:** Lines 274-310 (runAutomation method - primary target)

**This is the MOST IMPORTANT suite** - covers the main `runAutomation()` workflow.

---

### Suite 5: Theme & Styling (2 tests)

**Purpose:** Validate theme application

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| E2E-THEME-001 | Open theme selector | Theme panel appears |
| E2E-THEME-002 | Apply theme to presentation | Theme applied |

**Coverage:** Lines 199-219 (applyTheme method)

---

### Suite 6: Export & Download (2 tests)

**Purpose:** Validate export functionality

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| E2E-EXPORT-001 | Open export menu | Export menu appears |
| E2E-EXPORT-002 | Show PDF export option | PDF option available |

**Coverage:** Lines 225-247 (exportPresentation method)

---

### Suite 7: Error Handling & Edge Cases (3 tests)

**Purpose:** Validate error recovery

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| E2E-ERROR-001 | Handle network timeout gracefully | Timeout caught and handled |
| E2E-ERROR-002 | Recover from failed selector lookup | Retry succeeds |
| E2E-ERROR-003 | Handle empty carousel data | Graceful handling |

**Coverage:** Error handling in all methods

---

### Suite 8: Performance & Reliability (2 tests)

**Purpose:** Validate performance and stability

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| E2E-PERF-001 | Create presentation within reasonable time | < 15 seconds |
| E2E-PERF-002 | Handle rapid slide creation | No errors |

**Coverage:** Performance characteristics of all methods

---

## Setup Instructions

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd contentCreator
npm install
```

### Step 2: Configure Environment

```bash
# Copy template
cp .env.test.template .env.test

# Edit .env.test
nano .env.test  # or use your favorite editor
```

**Required variables:**
```bash
GAMMA_TEST_EMAIL=your.email@example.com
GAMMA_TEST_PASSWORD=your_password_here
```

**Optional variables:**
```bash
HEADLESS=true              # Set to false for debugging
SLOW_MO=300                # Slow down automation (ms)
AUTO_CLEANUP=true          # Delete test presentations
```

### Step 3: Verify Setup

```bash
# Verify environment variables
node -e "require('dotenv').config({ path: '.env.test' }); console.log(process.env.GAMMA_TEST_EMAIL)"

# Should output your email address
```

### Step 4: Run Sample Test

```bash
# Run one test to verify setup
npm run test:e2e:headed -- --testNamePattern="should authenticate"
```

If successful, you should see:
- Browser window opens
- Navigates to Gamma.app
- Logs in automatically
- Test passes ✓

---

## Running Tests

### Local Development

#### Headed Mode (Visual Debugging)
```bash
# Run all E2E tests with visible browser
npm run test:e2e:headed

# Run specific test
npm run test:e2e:headed -- --testNamePattern="should create"

# Debug mode (slow motion)
npm run test:e2e:debug
```

**When to use:**
- First time running tests
- Debugging test failures
- Verifying selector changes
- Understanding test flow

#### Headless Mode (Fast Execution)
```bash
# Run all E2E tests headlessly
npm run test:e2e

# Run specific suite
npm run test:e2e -- --testNamePattern="Authentication"
```

**When to use:**
- CI/CD pipelines
- Quick validation
- Automated testing

### Test Execution Options

```bash
# Run single test file
npm run test:e2e -- gammaAutomation.e2e.test.js

# Run tests matching pattern
npm run test:e2e -- --testNamePattern="carousel"

# Verbose output
npm run test:e2e -- --verbose

# Bail on first failure
npm run test:e2e -- --bail

# Update snapshots (if using visual regression)
npm run test:e2e -- --updateSnapshot
```

### Environment Overrides

```bash
# Override headless mode
HEADLESS=false npm run test:e2e

# Increase timeout
TEST_TIMEOUT=180000 npm run test:e2e

# Disable cleanup (for debugging)
AUTO_CLEANUP=false npm run test:e2e:headed
```

---

## CI/CD Integration

### GitHub Actions

**File:** `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    # Run nightly at 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Run E2E tests
        env:
          GAMMA_TEST_EMAIL: ${{ secrets.GAMMA_TEST_EMAIL }}
          GAMMA_TEST_PASSWORD: ${{ secrets.GAMMA_TEST_PASSWORD }}
          CI: true
          HEADLESS: true
        run: npm run test:e2e

      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-failure-screenshots
          path: tests/e2e/screenshots/debug/

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-test-results
          path: tests/coverage/e2e/
```

### Required Secrets

**GitHub Settings → Secrets and variables → Actions:**

1. `GAMMA_TEST_EMAIL` - Gamma.app test account email
2. `GAMMA_TEST_PASSWORD` - Gamma.app test account password

### Test Frequency

**Recommended:**
- **On every commit:** Run unit + integration tests only (fast)
- **On pull request:** Run all tests including E2E
- **Nightly:** Run full E2E suite to catch Gamma.app UI changes

**Rationale:**
- E2E tests are slower (5-10 minutes)
- Reduces CI/CD pipeline time
- Still catches issues before merge

---

## Troubleshooting

### Common Issues

#### 1. Authentication Failures

**Symptom:**
```
❌ Login failed: Timeout 15000ms exceeded
```

**Causes:**
- Invalid credentials
- Gamma.app login page changed
- Network issues
- 2FA enabled

**Solutions:**
```bash
# Verify credentials
echo $GAMMA_TEST_EMAIL
echo $GAMMA_TEST_PASSWORD

# Run in headed mode to see login flow
npm run test:e2e:headed -- --testNamePattern="should authenticate"

# Clear saved session
rm tests/e2e/.sessions/gamma-session.json
```

#### 2. Selector Not Found

**Symptom:**
```
❌ Error: Timeout 10000ms exceeded waiting for selector
```

**Causes:**
- Gamma.app UI changed
- Selector typo
- Page not fully loaded

**Solutions:**
```bash
# Run in debug mode to see page state
npm run test:e2e:debug

# Take screenshot to see current state
# (automatically saved on failure in tests/e2e/screenshots/debug/)

# Update selectors in gammaPageSelectors.js
```

#### 3. Flaky Tests

**Symptom:**
```
Tests pass sometimes, fail other times
```

**Causes:**
- Network latency
- Race conditions
- Insufficient wait times

**Solutions:**
```javascript
// Increase timeouts
await page.waitForTimeout(2000);

// Use retry logic
await retryOperation(async () => {
  await slideHelper.typeContent(title, true);
}, 3, 1000);

// Wait for network idle
await page.waitForLoadState('networkidle');
```

#### 4. Presentation Cleanup Failures

**Symptom:**
```
⚠️  Failed to delete presentation
```

**Causes:**
- Presentation not found
- Gamma.app API changed
- Network issues

**Solutions:**
```bash
# Manually clean up test presentations
# 1. Log in to Gamma.app
# 2. Go to dashboard
# 3. Delete presentations starting with "E2E Test"

# Disable auto-cleanup for debugging
AUTO_CLEANUP=false npm run test:e2e:headed
```

#### 5. Session Persistence Issues

**Symptom:**
```
⚠️  Session expired, re-authentication required
```

**Solutions:**
```bash
# Clear session and re-authenticate
rm tests/e2e/.sessions/gamma-session.json
npm run test:e2e:headed

# Disable session persistence
PERSIST_SESSION=false npm run test:e2e
```

### Debug Checklist

When tests fail:

- [ ] Check test output for specific error message
- [ ] Review debug screenshots (`tests/e2e/screenshots/debug/`)
- [ ] Run test in headed mode to observe behavior
- [ ] Verify credentials are correct
- [ ] Check Gamma.app is accessible in browser
- [ ] Look for Gamma.app UI changes
- [ ] Review selector definitions in `gammaPageSelectors.js`
- [ ] Increase timeout if network is slow
- [ ] Check for console errors in browser
- [ ] Verify Node.js and Playwright versions

---

## Maintenance

### Updating Selectors

**When Gamma.app UI Changes:**

1. **Identify broken selectors:**
```bash
# Run tests to see which fail
npm run test:e2e:headed
```

2. **Inspect Gamma.app UI:**
```javascript
// In browser DevTools:
// 1. Right-click element → Inspect
// 2. Look for:
//    - data-testid attributes
//    - class names
//    - aria labels
//    - text content
```

3. **Update gammaPageSelectors.js:**
```javascript
const EDITOR_SELECTORS = {
  // Old (broken)
  titleEditor: '.old-title-class',

  // New (updated)
  titleEditor: '[data-testid="title-editor"], .new-title-class',
};
```

4. **Test updates:**
```bash
npm run test:e2e:headed -- --testNamePattern="type title"
```

### Version Control

**Selector History:**
- Track selector changes in git
- Document reason for each update
- Keep fallback selectors for compatibility

**Example commit:**
```bash
git add tests/e2e/helpers/gammaPageSelectors.js
git commit -m "Update editor selectors for Gamma.app UI v2.5"
```

### Documentation

**Update when:**
- Gamma.app UI significantly changes
- New test scenarios added
- Selector strategy evolves
- Authentication flow changes

**Files to update:**
- This file (E2E_TEST_PLAN.md)
- gammaPageSelectors.js comments
- Test file comments
- README.md

---

## Coverage Goals

### Current Coverage

**Before E2E Tests:**
- Infrastructure tests: 19.4%
- Untested: 80.6% (275 lines)

**Breakdown:**
| Method | Lines | Current Coverage | Target |
|--------|-------|------------------|--------|
| `runAutomation()` | 155 | 0% | 90% |
| `addSlide()` | 30 | 0% | 80% |
| `typeIntoActiveSlide()` | 25 | 0% | 80% |
| `addNewSlide()` | 20 | 0% | 70% |
| `applyTheme()` | 15 | 0% | 70% |
| `exportPresentation()` | 30 | 0% | 70% |
| **Total uncovered** | **275** | **0%** | **80%** |

### Target Coverage After E2E Tests

**Expected coverage:** 65%+

**Coverage by suite:**
| Suite | Lines Covered | Coverage Contribution |
|-------|---------------|----------------------|
| Authentication (3 tests) | 20 | 5.7% |
| Presentation Creation (4 tests) | 30 | 8.5% |
| Slide Manipulation (6 tests) | 75 | 21.4% |
| Full Workflows (3 tests) | 155 | 44.2% ⭐ |
| Theme & Styling (2 tests) | 20 | 5.7% |
| Export (2 tests) | 30 | 8.5% |
| Error Handling (3 tests) | 20 | 5.7% |
| **Total** | **~230** | **~65%** |

### Remaining Gap

**After E2E tests:**
- Coverage: 65%
- Remaining: 35% (121 lines)

**What's still uncovered:**
- Edge cases in all methods (~50 lines)
- Error recovery paths (~30 lines)
- Rarely-used features (~40 lines)

**To reach 80%:**
- Add 10 more edge case tests
- Add visual regression tests
- Add network failure simulations
- **Estimated time:** 4-6 hours

---

## Test Metrics

### Success Criteria

**Tests must achieve:**
- ✅ All 20 tests passing (100% pass rate)
- ✅ <10 minute execution time (headless)
- ✅ 65%+ code coverage
- ✅ <5% flakiness rate
- ✅ Zero manual intervention required

### Performance Benchmarks

**Target execution times:**
| Test Suite | Tests | Target Time | Max Time |
|------------|-------|-------------|----------|
| Authentication | 3 | 30s | 60s |
| Presentation Creation | 4 | 60s | 120s |
| Slide Manipulation | 6 | 90s | 180s |
| Full Workflows | 3 | 180s | 360s |
| Theme & Styling | 2 | 30s | 60s |
| Export | 2 | 30s | 60s |
| Error Handling | 3 | 45s | 90s |
| Performance | 2 | 30s | 60s |
| **Total** | **20** | **~8 min** | **~16 min** |

---

## Next Steps

### Phase 1: Setup (1 hour)
1. Configure .env.test with credentials
2. Run sample test to verify setup
3. Review documentation

### Phase 2: Execution (2 hours)
1. Run full E2E suite in headed mode
2. Verify all tests pass
3. Fix any selector issues

### Phase 3: CI/CD Integration (1 hour)
1. Add secrets to GitHub
2. Configure workflow
3. Test CI/CD execution

### Phase 4: Monitoring (Ongoing)
1. Run tests weekly
2. Update selectors when Gamma.app changes
3. Add new tests for new features

---

## Resources

**Documentation:**
- [Playwright Docs](https://playwright.dev/)
- [Jest E2E Testing](https://jestjs.io/docs/tutorial-async)
- [Gamma.app Help](https://gamma.app/help)

**Files:**
- `tests/e2e/gammaAutomation.e2e.test.js` - Test implementation
- `tests/e2e/helpers/gammaPageSelectors.js` - Selectors
- `tests/e2e/helpers/gammaTestUtils.js` - Utilities
- `jest.e2e.config.js` - Jest configuration

**Commands:**
```bash
npm run test:e2e           # Run E2E tests (headless)
npm run test:e2e:headed    # Run E2E tests (headed)
npm run test:e2e:debug     # Run with slow motion
```

---

**Status:** ✅ **READY FOR EXECUTION**

**Coverage Target:** 19.4% → 65%+
**Test Count:** 20 E2E tests
**Estimated Time:** 5-10 minutes per run

---

*E2E Test Plan Generated: 2025-10-21*
*All infrastructure complete and ready for testing*
