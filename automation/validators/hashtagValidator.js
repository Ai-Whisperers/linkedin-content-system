/**
 * Hashtag Validator
 *
 * Validates LinkedIn posts have exactly 4 hashtags (2 broad + 2 niche)
 * per brand guidelines
 */

/**
 * Extract hashtags from text
 * @param {string} text - Post content
 * @returns {string[]} Array of hashtags (without #)
 */
function extractHashtags(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Match hashtags (# followed by word characters, no spaces)
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;

  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }

  return hashtags;
}

/**
 * Check if hashtag contains spaces (invalid)
 * @param {string} text - Post content
 * @returns {string[]} Invalid hashtags found
 */
function findInvalidHashtags(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Match # followed by text with spaces until line end
  const invalidHashtagRegex = /#([A-Za-z0-9\s]+?)(?:\n|$)/g;
  const invalid = [];
  let match;

  while ((match = invalidHashtagRegex.exec(text)) !== null) {
    const tag = match[1].trim();
    if (tag.includes(' ')) {
      invalid.push(`#${tag}`);
    }
  }

  return invalid;
}

/**
 * Broad hashtags (commonly used)
 */
const BROAD_HASHTAGS = [
  'AI',
  'Automation',
  'DevOps',
  'Operations',
  'Productivity',
  'Tech',
  'SoftwareEngineering',
  'EngineeringLeadership',
  'TechLeadership'
];

/**
 * Niche hashtags (specific to brand)
 */
const NICHE_HASHTAGS = [
  'MultiAgentSystems',
  'AIWhisperers',
  'RepoHealth',
  'AgentizedWorkflows',
  'SOPAutomation',
  'TechDebtManagement'
];

/**
 * Categorize hashtags into broad and niche
 * @param {string[]} hashtags - Array of hashtags
 * @returns {Object} Categorized hashtags
 */
function categorizeHashtags(hashtags) {
  const broad = [];
  const niche = [];
  const unknown = [];

  hashtags.forEach(tag => {
    if (BROAD_HASHTAGS.includes(tag)) {
      broad.push(tag);
    } else if (NICHE_HASHTAGS.includes(tag)) {
      niche.push(tag);
    } else {
      unknown.push(tag);
    }
  });

  return { broad, niche, unknown };
}

/**
 * Validate hashtags in post
 * @param {string} text - Post content
 * @param {Object} options - Validation options
 * @param {number} options.total - Total hashtags required (default: 4)
 * @param {number} options.broad - Broad hashtags required (default: 2)
 * @param {number} options.niche - Niche hashtags required (default: 2)
 * @returns {Object} Validation result
 */
function validateHashtags(text, options = {}) {
  const requiredTotal = options.total || 4;
  const requiredBroad = options.broad || 2;
  const requiredNiche = options.niche || 2;

  const hashtags = extractHashtags(text);
  const invalidTags = findInvalidHashtags(text);
  const { broad, niche, unknown } = categorizeHashtags(hashtags);

  const errors = [];

  // Check for invalid hashtags with spaces
  if (invalidTags.length > 0) {
    errors.push(`Invalid hashtags with spaces: ${invalidTags.join(', ')}`);
  }

  // Check total count
  if (hashtags.length !== requiredTotal) {
    errors.push(`Expected ${requiredTotal} hashtags, found ${hashtags.length}`);
  }

  // Check broad/niche distribution (only if we have the right total)
  if (hashtags.length === requiredTotal) {
    if (broad.length < requiredBroad) {
      errors.push(`Need ${requiredBroad} broad hashtags, found ${broad.length}`);
    }

    if (niche.length < requiredNiche) {
      errors.push(`Need ${requiredNiche} niche hashtags, found ${niche.length}`);
    }
  }

  const valid = errors.length === 0 && invalidTags.length === 0;

  return {
    valid,
    hashtags,
    count: hashtags.length,
    broad: broad.length,
    niche: niche.length,
    unknown: unknown.length,
    invalidTags,
    errors,
    message: valid
      ? `Hashtags OK: ${hashtags.length} total (${broad.length} broad, ${niche.length} niche)`
      : errors.join('; ')
  };
}

module.exports = {
  extractHashtags,
  findInvalidHashtags,
  categorizeHashtags,
  validateHashtags,
  BROAD_HASHTAGS,
  NICHE_HASHTAGS
};
