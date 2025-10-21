#!/usr/bin/env node

/**
 * Carousel Runner Script
 * Combines parsing and automation in one convenient command
 */

const path = require('path');
const fs = require('fs');
const { parseCarouselMarkdown, exportToJSON } = require('./parseCarousel');
const GammaAutomation = require('./gammaAutomation');

// Load configuration
const CONFIG_PATH = path.join(__dirname, 'config.json');
let config = {};

if (fs.existsSync(CONFIG_PATH)) {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

/**
 * Main runner function
 */
async function runCarouselAutomation(markdownFile, options = {}) {
  const startTime = Date.now();

  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Gamma Carousel Automation for LinkedIn  ║');
  console.log('║           AI-Whisperers Content           ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    // Step 1: Parse markdown file
    console.log('📋 Step 1: Parsing carousel markdown...');
    const carouselData = parseCarouselMarkdown(markdownFile);
    console.log(`   ✓ Parsed ${carouselData.slides.length} slides`);
    console.log(`   ✓ Title: ${carouselData.metadata.title || 'Untitled'}\n`);

    // Step 2: Export to JSON for reference
    const jsonOutputPath = markdownFile.replace('.md', '-data.json');
    exportToJSON(carouselData, jsonOutputPath);

    // Step 3: Run automation
    console.log('🤖 Step 2: Starting Gamma automation...\n');
    const automation = new GammaAutomation({
      headless: options.headless || config.automation?.headless || false,
      slowMo: options.slowMo || config.automation?.slowMo || 300,
      timeout: config.automation?.timeout || 60000,
      screenshotsDir: config.automation?.screenshotsDir || './automation/screenshots',
      theme: config.gamma?.theme || 'Professional'
    });

    await automation.runAutomation(carouselData);

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║            ✅ SUCCESS!                     ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`   Duration: ${duration}s`);
    console.log(`   Slides created: ${carouselData.slides.length}`);
    console.log(`   Data saved: ${jsonOutputPath}`);
    console.log('\n📌 Next steps:');
    console.log('   1. Review the presentation in Gamma');
    console.log('   2. Adjust theme/colors if needed');
    console.log('   3. Export as PDF for LinkedIn');
    console.log('   4. Follow the publishing workflow\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);

  // Help text
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Gamma Carousel Automation - Create LinkedIn carousels from markdown

USAGE:
  node runCarousel.js <carousel-file.md> [options]

EXAMPLES:
  # Run with default settings (interactive mode)
  node runCarousel.js drafts/carousel-ticket-triage-outline.md

  # Run in headless mode (faster, no browser window)
  node runCarousel.js drafts/carousel-ticket-triage-outline.md --headless

  # Run with custom speed
  node runCarousel.js drafts/carousel-ticket-triage-outline.md --slowMo=500

OPTIONS:
  --headless     Run browser in headless mode (no visible window)
  --slowMo=N     Slow down actions by N milliseconds (default: 300)
  --help, -h     Show this help message

WORKFLOW:
  1. Parse carousel markdown file
  2. Extract slide content and metadata
  3. Launch Gamma.app in browser
  4. Create presentation with all slides
  5. Apply theme and formatting
  6. Export as PDF for LinkedIn

CONFIGURATION:
  Edit automation/config.json to customize:
  - Gamma theme and colors
  - Automation speed and timeouts
  - Export format and location
  - Brand logo placement

For more information, see automation/README.md
    `);
    process.exit(0);
  }

  // Parse arguments
  const markdownFile = args[0];
  const options = {};

  args.slice(1).forEach(arg => {
    if (arg === '--headless') {
      options.headless = true;
    }
    if (arg.startsWith('--slowMo=')) {
      options.slowMo = parseInt(arg.split('=')[1]);
    }
  });

  // Validate file exists
  if (!fs.existsSync(markdownFile)) {
    console.error(`❌ Error: File not found: ${markdownFile}`);
    process.exit(1);
  }

  // Run automation
  runCarouselAutomation(markdownFile, options);
}

module.exports = runCarouselAutomation;
