#!/usr/bin/env node

/**
 * Quality Checks Runner
 *
 * Runs all automated quality checks on a LinkedIn post
 * Implements checks from QUALITY_CHECKLIST.md
 */

const fs = require('fs');
const path = require('path');
const { validateWordCount } = require('./wordCountValidator');
const { validateHashtags } = require('./hashtagValidator');
const { detectBuzzwords } = require('./buzzwordDetector');
const { validateEmojiCount, analyzeEmojiPlacement } = require('./emojiCounter');

/**
 * Run all quality checks on post content
 * @param {string} postContent - Post content to validate
 * @returns {Object} Comprehensive validation result
 */
function runQualityChecks(postContent) {
  console.log('🔍 Running Quality Checks...\n');

  const results = {
    wordCount: validateWordCount(postContent),
    hashtags: validateHashtags(postContent),
    buzzwords: detectBuzzwords(postContent, {
      includeVague: true,
      includePromotional: false
    }),
    emojis: validateEmojiCount(postContent),
    emojiPlacement: analyzeEmojiPlacement(postContent)
  };

  // Calculate overall pass/fail
  const checks = [
    results.wordCount.valid,
    results.hashtags.valid,
    results.buzzwords.valid,
    results.emojis.valid
  ];

  const passed = checks.filter(c => c).length;
  const total = checks.length;
  const overallPassed = checks.every(c => c);

  return {
    passed: overallPassed,
    score: `${passed}/${total}`,
    results,
    summary: {
      wordCount: results.wordCount.count,
      hashtags: results.hashtags.count,
      buzzwords: results.buzzwords.found.length,
      emojis: results.emojis.count
    }
  };
}

/**
 * Display results in formatted output
 * @param {Object} checkResults - Results from runQualityChecks
 */
function displayResults(checkResults) {
  const { results, passed, score } = checkResults;

  console.log('📊 Quality Check Results:\n');
  console.log('═══════════════════════════════════════════════\n');

  // Word Count
  const wordIcon = results.wordCount.valid ? '✓' : '✗';
  const wordColor = results.wordCount.valid ? '' : '';
  console.log(`${wordIcon} Word Count: ${results.wordCount.count} words (target: 120-180)`);
  if (!results.wordCount.valid) {
    console.log(`  ⚠ ${results.wordCount.error}`);
  }
  console.log('');

  // Hashtags
  const hashtagIcon = results.hashtags.valid ? '✓' : '✗';
  console.log(`${hashtagIcon} Hashtags: ${results.hashtags.count} found (required: 4)`);
  if (results.hashtags.broad || results.hashtags.niche) {
    console.log(`  - Broad: ${results.hashtags.broad}, Niche: ${results.hashtags.niche}`);
  }
  if (!results.hashtags.valid) {
    results.hashtags.errors.forEach(err => {
      console.log(`  ⚠ ${err}`);
    });
  }
  console.log('');

  // Buzzwords
  const buzzwordIcon = results.buzzwords.valid ? '✓' : '⚠';
  console.log(`${buzzwordIcon} Buzzwords: ${results.buzzwords.found.length} found`);
  if (results.buzzwords.found.length > 0) {
    console.log(`  ⚠ Found: ${results.buzzwords.found.join(', ')}`);
    console.log(`  💡 Replace with specific metrics or concrete examples`);
  }
  console.log('');

  // Emojis
  const emojiIcon = results.emojis.valid ? '✓' : '✗';
  console.log(`${emojiIcon} Emojis: ${results.emojis.count} found (max: 2)`);
  if (results.emojis.count > 0) {
    console.log(`  Emojis: ${results.emojis.emojis.join(' ')}`);
  }
  if (!results.emojis.valid) {
    console.log(`  ⚠ ${results.emojis.error}`);
  }
  console.log('');

  // Overall Result
  console.log('═══════════════════════════════════════════════\n');
  if (passed) {
    console.log('✅ OVERALL: PASS');
    console.log(`   All quality checks passed (${score})`);
  } else {
    console.log('❌ OVERALL: FAIL');
    console.log(`   Quality checks passed: ${score}`);
    console.log('   Please address the issues above before publishing');
  }
  console.log('');

  return passed;
}

/**
 * CLI Usage
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node runQualityChecks.js <post-file.md>');
    console.log('Example: node runQualityChecks.js drafts/posts/001-how-to-triage-agent.md');
    process.exit(1);
  }

  const postFile = args[0];

  if (!fs.existsSync(postFile)) {
    console.error(`Error: File not found: ${postFile}`);
    process.exit(1);
  }

  try {
    const postContent = fs.readFileSync(postFile, 'utf-8');

    // Extract just the post content (skip metadata)
    const contentMatch = postContent.match(/## Post Content\s+([\s\S]*?)(?=\n##|$)/);
    const actualContent = contentMatch ? contentMatch[1].trim() : postContent;

    const results = runQualityChecks(actualContent);
    const passed = displayResults(results);

    process.exit(passed ? 0 : 1);
  } catch (error) {
    console.error('Error running quality checks:', error.message);
    process.exit(1);
  }
}

module.exports = {
  runQualityChecks,
  displayResults
};
