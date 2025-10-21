/**
 * Test Utilities
 *
 * Common helper functions for testing
 */

const fs = require('fs');
const path = require('path');

/**
 * Read a fixture file
 * @param {string} fixtureName - Name of fixture file
 * @returns {string} File contents
 */
function readFixture(fixtureName) {
  const fixturePath = path.join(__dirname, '..', 'fixtures', fixtureName);
  return fs.readFileSync(fixturePath, 'utf-8');
}

/**
 * Create a temporary file for testing
 * @param {string} filename - Name of temp file
 * @param {string} content - Content to write
 * @returns {string} Path to created file
 */
function createTempFile(filename, content) {
  const tempDir = path.join(__dirname, '..', 'temp');

  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

/**
 * Clean up temporary test files
 */
function cleanupTempFiles() {
  const tempDir = path.join(__dirname, '..', 'temp');

  if (fs.existsSync(tempDir)) {
    const items = fs.readdirSync(tempDir);
    items.forEach(item => {
      const itemPath = path.join(tempDir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        // Recursively delete directory contents
        const subItems = fs.readdirSync(itemPath);
        subItems.forEach(subItem => {
          fs.unlinkSync(path.join(itemPath, subItem));
        });
        fs.rmdirSync(itemPath);
      } else {
        // Delete file
        fs.unlinkSync(itemPath);
      }
    });
  }
}

/**
 * Count words in a string
 * @param {string} text - Text to count
 * @returns {number} Word count
 */
function countWords(text) {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Count emojis in a string
 * @param {string} text - Text to check
 * @returns {number} Emoji count
 */
function countEmojis(text) {
  // Regex to match emojis (basic pattern)
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
}

/**
 * Extract hashtags from text
 * @param {string} text - Text to parse
 * @returns {string[]} Array of hashtags (without #)
 */
function extractHashtags(text) {
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;

  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }

  return hashtags;
}

/**
 * Check if text contains any buzzwords
 * @param {string} text - Text to check
 * @param {string[]} buzzwords - List of buzzwords to check
 * @returns {string[]} Found buzzwords
 */
function findBuzzwords(text, buzzwords) {
  const lowerText = text.toLowerCase();
  return buzzwords.filter(word =>
    lowerText.includes(word.toLowerCase())
  );
}

/**
 * Create a mock carousel object
 * @param {number} slideCount - Number of slides
 * @returns {Object} Mock carousel data
 */
function createMockCarousel(slideCount = 7) {
  const slides = [];

  for (let i = 1; i <= slideCount; i++) {
    slides.push({
      number: i,
      type: i === 1 ? 'Hook' : `Slide ${i}`,
      title: `Test Slide ${i} Title`,
      content: `This is test content for slide ${i}`,
      visualNotes: `Visual notes for slide ${i}`
    });
  }

  return {
    metadata: {
      title: 'Test Carousel',
      slides: slideCount.toString()
    },
    slides
  };
}

/**
 * Create a mock post with specified word count
 * @param {number} wordCount - Desired word count
 * @returns {string} Mock post content
 */
function createMockPost(wordCount = 150) {
  const words = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');
  let post = '';
  let currentCount = 0;

  while (currentCount < wordCount) {
    post += words[currentCount % words.length] + ' ';
    currentCount++;
  }

  return post.trim();
}

/**
 * Wait for a specified time (for async tests)
 * @param {number} ms - Milliseconds to wait
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  readFixture,
  createTempFile,
  cleanupTempFiles,
  countWords,
  countEmojis,
  extractHashtags,
  findBuzzwords,
  createMockCarousel,
  createMockPost,
  wait
};
