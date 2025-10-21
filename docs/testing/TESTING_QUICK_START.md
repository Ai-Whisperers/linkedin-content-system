# Testing Quick Start Guide

## 1. Install Dependencies (One-Time Setup)

```bash
npm install
```

This installs Jest and all testing dependencies.

---

## 2. Run Your First Test

```bash
npm test
```

**Expected Output:**
```
PASS  tests/unit/parseCarousel.test.js
  ✓ should parse a valid carousel with 3 slides (45ms)
  ✓ should extract metadata correctly (12ms)
  ✓ should parse slide with all sections (8ms)
  ...

Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        2.341s
```

---

## 3. Validate a LinkedIn Post

```bash
npm run validate:post drafts/posts/001-how-to-triage-agent.md
```

**Example Output:**
```
🔍 Running Quality Checks...

📊 Quality Check Results:

✓ Word Count: 156 words (target: 120-180)
✓ Hashtags: 4 found (required: 4)
✓ Buzzwords: 0 found
✓ Emojis: 1 found (max: 2)

✅ OVERALL: PASS
```

---

## 4. Check Code Coverage

```bash
npm run test:coverage
```

**Output:**
```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
parseCarousel.js      |   95.12 |    89.47 |     100 |   95.12 |
wordCountValidator.js |     100 |      100 |     100 |     100 |
hashtagValidator.js   |     100 |      100 |     100 |     100 |
----------------------|---------|----------|---------|---------|
All files             |   96.28 |    91.53 |     100 |   96.28 |
----------------------|---------|----------|---------|---------|
```

Then open: `tests/coverage/lcov-report/index.html` in your browser for detailed report.

---

## 5. Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:unit` | Run only unit tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:watch` | Watch mode (auto-rerun on changes) |
| `npm run validate:post <file>` | Validate a specific post |

---

## 6. Validate All Existing Posts

```bash
# Post 1
npm run validate:post drafts/posts/001-how-to-triage-agent.md

# Post 2
npm run validate:post drafts/posts/002-case-study-repo-health.md

# Post 3
npm run validate:post drafts/posts/003-opinion-ai-sop-theater.md
```

---

## 7. What Gets Validated

### Word Count
- **Target:** 120-180 words
- **Pass:** ✓ 156 words
- **Fail:** ✗ 95 words (too short)

### Hashtags
- **Required:** Exactly 4 hashtags
- **Distribution:** 2 broad + 2 niche
- **Pass:** ✓ #Automation #DevOps #MultiAgentSystems #AIWhisperers
- **Fail:** ✗ 5 hashtags (too many)

### Buzzwords
- **Banned:** "AI magic", "revolutionary", "game-changing"
- **Pass:** ✓ No buzzwords detected
- **Fail:** ⚠ Found: "revolutionary", "AI magic"

### Emojis
- **Maximum:** 2 emojis per post
- **Pass:** ✓ 1 emoji found (⚡)
- **Fail:** ✗ 3 emojis (too many)

---

## 8. Troubleshooting

### Tests Not Running?

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Coverage Report Not Generating?

```bash
# Delete old coverage
rm -rf tests/coverage

# Generate fresh coverage
npm run test:coverage
```

### Validator Not Finding Posts?

Ensure the path is correct:
```bash
# Correct path (from project root)
npm run validate:post drafts/posts/001-how-to-triage-agent.md

# Incorrect
npm run validate:post 001-how-to-triage-agent.md
```

---

## 9. Integration with Publishing Workflow

### Before Publishing a Post

1. **Run automated validators:**
   ```bash
   npm run validate:post drafts/posts/YOUR-POST.md
   ```

2. **If PASS:** Proceed to manual quality checklist (`QUALITY_CHECKLIST.md`)

3. **If FAIL:** Fix issues and re-validate

4. **After fixes:** Run validator again to confirm

### Automated Pre-Publish Checklist

✅ Word count: 120-180
✅ Hashtags: Exactly 4 (2 broad + 2 niche)
✅ Buzzwords: None detected
✅ Emojis: ≤2

---

## 10. Next Steps

### For Developers

1. **Run tests before commits:**
   ```bash
   npm test
   ```

2. **Check coverage regularly:**
   ```bash
   npm run test:coverage
   ```

3. **Write tests for new features:**
   - Add tests in `tests/unit/` for new functions
   - Follow AAA pattern (Arrange, Act, Assert)

### For Content Writers

1. **Validate every post before submitting for review:**
   ```bash
   npm run validate:post YOUR-POST.md
   ```

2. **Fix issues flagged by validators**

3. **Proceed to manual checklist** (`QUALITY_CHECKLIST.md`)

---

## 11. Full Documentation

For comprehensive testing documentation, see:

- **TESTING_PLAN.md** - Complete QA strategy (46 pages)
- **TESTING_SUMMARY.md** - Implementation summary
- **tests/README.md** - Detailed testing guide
- **QUALITY_CHECKLIST.md** - Manual quality review

---

## 12. Help & Support

### Common Questions

**Q: Do I need to run tests manually?**
A: No, tests will run automatically in CI/CD once configured.

**Q: Can I validate multiple posts at once?**
A: Currently one at a time. Batch validation script coming soon.

**Q: What if my post fails validation?**
A: Review the error messages, fix issues, and re-run the validator.

**Q: How long does validation take?**
A: ~30 seconds for automated checks + 2-3 minutes for manual review.

---

## Summary

**Quick Commands:**
```bash
npm install                 # One-time setup
npm test                    # Run all tests
npm run validate:post <file> # Validate a post
npm run test:coverage       # Check coverage
```

**Validation Criteria:**
- ✅ 120-180 words
- ✅ 4 hashtags (2 broad + 2 niche)
- ✅ No buzzwords
- ✅ ≤2 emojis

**Status:** ✅ Ready to use!

---

*For detailed documentation, see TESTING_PLAN.md*
*Last Updated: 2025-10-21*
