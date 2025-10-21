/**
 * Emoji Counter
 *
 * Validates LinkedIn posts have maximum 2 emojis per brand guidelines
 */

/**
 * Count emojis in text
 * @param {string} text - Text to check
 * @returns {number} Emoji count
 */
function countEmojis(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  // Comprehensive emoji regex
  // Covers most emoji ranges in Unicode
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{FE00}-\u{FE0F}]|[\u{1F018}-\u{1F270}]/gu;

  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
}

/**
 * Extract emojis from text
 * @param {string} text - Text to check
 * @returns {string[]} Array of emojis found
 */
function extractEmojis(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{FE00}-\u{FE0F}]|[\u{1F018}-\u{1F270}]/gu;

  const matches = text.match(emojiRegex);
  return matches || [];
}

/**
 * Validate emoji count
 * @param {string} text - Post content
 * @param {Object} options - Validation options
 * @param {number} options.max - Maximum emojis allowed (default: 2)
 * @returns {Object} Validation result
 */
function validateEmojiCount(text, options = {}) {
  const max = options.max || 2;

  const count = countEmojis(text);
  const emojis = extractEmojis(text);
  const valid = count <= max;

  return {
    valid,
    count,
    max,
    emojis,
    error: valid ? null : `Too many emojis: ${count} (maximum: ${max})`,
    message: valid
      ? `Emoji count OK: ${count} emoji${count !== 1 ? 's' : ''}`
      : `Too many emojis: ${count} found, maximum is ${max}`
  };
}

/**
 * Check if emojis are placed appropriately
 * Based on brand guidelines: emojis should be in Hook or Example sections, not scattered
 * @param {string} text - Post content
 * @returns {Object} Analysis result
 */
function analyzeEmojiPlacement(text) {
  if (!text || typeof text !== 'string') {
    return {
      appropriate: true,
      message: 'No text to check'
    };
  }

  const lines = text.split('\n');
  const emojisPerLine = lines.map((line, index) => ({
    line: index + 1,
    count: countEmojis(line),
    emojis: extractEmojis(line)
  })).filter(line => line.count > 0);

  // Check if emojis are concentrated in a few lines (good)
  // vs scattered throughout (bad)
  const linesWithEmojis = emojisPerLine.length;
  const totalLines = lines.filter(l => l.trim().length > 0).length;

  const scattered = linesWithEmojis > totalLines * 0.3; // More than 30% of lines

  return {
    appropriate: !scattered,
    linesWithEmojis,
    totalLines,
    scattered,
    emojisPerLine,
    message: scattered
      ? 'Emojis are scattered throughout (should be concentrated in Hook or Example)'
      : 'Emoji placement OK'
  };
}

module.exports = {
  countEmojis,
  extractEmojis,
  validateEmojiCount,
  analyzeEmojiPlacement
};
