/**
 * Carousel Markdown Parser
 * Parses carousel outline markdown files and extracts slide data
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse carousel markdown file and extract slides
 * @param {string} filePath - Path to the carousel markdown file
 * @returns {Object} Parsed carousel data with metadata and slides
 */
function parseCarouselMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const carousel = {
    metadata: {},
    slides: []
  };

  let currentSlide = null;
  let currentSection = null;
  let inCodeBlock = false;
  let codeBlockContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        const content = codeBlockContent.join('\n').trim();
        if (currentSlide && currentSection) {
          currentSlide[currentSection] = content;
        }
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        inCodeBlock = true;
      }
      continue;
    }

    // Collect code block content
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Parse metadata
    if (line.startsWith('**') && line.includes(':**')) {
      const match = line.match(/\*\*([^:]+):\*\*\s*(.+)/);
      if (match && !currentSlide) {
        const key = match[1].toLowerCase().replace(/\s+/g, '_');
        carousel.metadata[key] = match[2];
      }
      continue;
    }

    // Detect slide headers (## Slide N:)
    if (line.match(/^##\s+Slide\s+\d+:/)) {
      // Save previous slide
      if (currentSlide) {
        carousel.slides.push(currentSlide);
      }

      const slideMatch = line.match(/^##\s+Slide\s+(\d+):\s*(.+)/);
      currentSlide = {
        number: parseInt(slideMatch[1]),
        type: slideMatch[2].trim(),
        title: '',
        content: '',
        visualNotes: ''
      };
      currentSection = null;
      continue;
    }

    // Detect sections within slides
    if (currentSlide) {
      if (line.startsWith('### Title')) {
        currentSection = 'title';
        continue;
      }
      if (line.startsWith('### Content')) {
        currentSection = 'content';
        continue;
      }
      if (line.startsWith('### Visual Notes')) {
        currentSection = 'visualNotes';
        continue;
      }
    }
  }

  // Save last slide
  if (currentSlide) {
    carousel.slides.push(currentSlide);
  }

  return carousel;
}

/**
 * Format slide content for Gamma presentation
 * @param {Object} slide - Slide data
 * @returns {Object} Formatted slide for Gamma
 */
function formatSlideForGamma(slide) {
  return {
    number: slide.number,
    type: slide.type,
    title: slide.title,
    // Clean up bullet points and formatting
    content: slide.content
      .replace(/^•\s+/gm, '• ')  // Normalize bullet points
      .replace(/^\d+\.\s+/gm, (match) => match)  // Keep numbered lists
      .trim(),
    visualNotes: slide.visualNotes
      .replace(/^-\s+/gm, '• ')  // Convert dashes to bullets
      .trim()
  };
}

/**
 * Export carousel data to JSON for automation
 * @param {Object} carouselData - Parsed carousel data
 * @param {string} outputPath - Path to save JSON output
 */
function exportToJSON(carouselData, outputPath) {
  const formattedData = {
    metadata: carouselData.metadata,
    slides: carouselData.slides.map(formatSlideForGamma)
  };

  fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2), 'utf-8');
  console.log(`✓ Carousel data exported to: ${outputPath}`);
  return formattedData;
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node parseCarousel.js <carousel-file.md> [output.json]');
    console.log('Example: node parseCarousel.js drafts/carousel-ticket-triage-outline.md carousel-data.json');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || 'carousel-data.json';

  try {
    console.log(`Parsing carousel file: ${inputFile}`);
    const carouselData = parseCarouselMarkdown(inputFile);
    console.log(`✓ Found ${carouselData.slides.length} slides`);

    exportToJSON(carouselData, outputFile);
    console.log('✓ Parsing complete!');
  } catch (error) {
    console.error('Error parsing carousel:', error.message);
    process.exit(1);
  }
}

module.exports = {
  parseCarouselMarkdown,
  formatSlideForGamma,
  exportToJSON
};
