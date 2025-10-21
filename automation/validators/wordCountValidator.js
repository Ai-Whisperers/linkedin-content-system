/**
 * Word Count Validator
 *
 * Validates LinkedIn posts have 120-180 words per brand guidelines
 */

/**
 * Count words in text
 * @param {string} text - Text to count
 * @returns {number} Word count
 */
function countWords(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  // Remove markdown formatting
  const cleaned = text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/#+\s/g, '') // Remove headers
    .replace(/\*\*/g, '') // Remove bold
    .replace(/__/g, '') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/#\w+/g, ''); // Remove hashtags

  // Split on whitespace and filter empty strings
  const words = cleaned
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);

  return words.length;
}

/**
 * Validate word count is within acceptable range
 * @param {string} text - Post content to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum word count (default: 120)
 * @param {number} options.max - Maximum word count (default: 180)
 * @returns {Object} Validation result
 */
function validateWordCount(text, options = {}) {
  const min = options.min || 120;
  const max = options.max || 180;

  const count = countWords(text);

  const valid = count >= min && count <= max;

  let error = null;
  if (count < min) {
    error = `Too short: ${count} words (minimum: ${min})`;
  } else if (count > max) {
    error = `Too long: ${count} words (maximum: ${max})`;
  }

  return {
    valid,
    count,
    min,
    max,
    error,
    message: valid
      ? `Word count OK: ${count} words`
      : error
  };
}

module.exports = {
  countWords,
  validateWordCount
};
