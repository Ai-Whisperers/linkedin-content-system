/**
 * Buzzword Detector
 *
 * Detects banned buzzwords in LinkedIn posts per brand guidelines
 */

/**
 * Banned buzzwords from BRAND_BRIEF.md and QUALITY_CHECKLIST.md
 */
const BANNED_BUZZWORDS = [
  'AI magic',
  'revolutionary',
  'game-changing',
  'game changer',
  'disruptive',
  'synergy',
  'paradigm shift',
  'cutting-edge',
  'bleeding-edge',
  'next-generation',
  'world-class',
  'best-in-class',
  'industry-leading',
  'transformative',
  'innovative' // Use sparingly, often overused
];

/**
 * Vague qualifiers that should be replaced with metrics
 */
const VAGUE_QUALIFIERS = [
  'dramatically',
  'significantly',
  'substantially',
  'massively',
  'greatly',
  'amazing',
  'incredible',
  'awesome',
  'fantastic',
  'tremendous'
];

/**
 * Over-promotional phrases
 */
const PROMOTIONAL_PHRASES = [
  'contact us',
  'visit our website',
  'learn more at',
  'our solution',
  'our platform',
  'our product',
  'we offer',
  'we provide'
];

/**
 * Detect buzzwords in text
 * @param {string} text - Text to check
 * @param {Object} options - Detection options
 * @param {string[]} options.customBuzzwords - Additional buzzwords to check
 * @param {boolean} options.includeVague - Include vague qualifiers (default: true)
 * @param {boolean} options.includePromotional - Include promotional phrases (default: false)
 * @returns {Object} Detection result
 */
function detectBuzzwords(text, options = {}) {
  if (!text || typeof text !== 'string') {
    return {
      valid: true,
      found: [],
      buzzwords: [],
      vague: [],
      promotional: [],
      message: 'No text to check'
    };
  }

  const lowerText = text.toLowerCase();

  // Build buzzword list
  let allBuzzwords = [...BANNED_BUZZWORDS];
  if (options.customBuzzwords) {
    allBuzzwords = allBuzzwords.concat(options.customBuzzwords);
  }

  // Check for buzzwords
  const foundBuzzwords = allBuzzwords.filter(word =>
    lowerText.includes(word.toLowerCase())
  );

  // Check for vague qualifiers (optional)
  const foundVague = options.includeVague !== false
    ? VAGUE_QUALIFIERS.filter(word => lowerText.includes(word.toLowerCase()))
    : [];

  // Check for promotional phrases (optional)
  const foundPromotional = options.includePromotional === true
    ? PROMOTIONAL_PHRASES.filter(phrase => lowerText.includes(phrase.toLowerCase()))
    : [];

  const allFound = [...foundBuzzwords, ...foundVague, ...foundPromotional];
  const valid = allFound.length === 0;

  return {
    valid,
    found: allFound,
    buzzwords: foundBuzzwords,
    vague: foundVague,
    promotional: foundPromotional,
    message: valid
      ? 'No buzzwords detected'
      : `Found buzzwords: ${allFound.join(', ')}`
  };
}

/**
 * Get suggestions to replace buzzwords
 * @param {string} buzzword - Buzzword to replace
 * @returns {string[]} Suggested replacements
 */
function getSuggestions(buzzword) {
  const suggestions = {
    'AI magic': ['AI triage agent', 'automated classifier', 'specific metric'],
    'revolutionary': ['improved', 'optimized', 'built'],
    'game-changing': ['measurable impact', 'specific improvement', '30% faster'],
    'disruptive': ['efficient', 'pragmatic', 'results-driven'],
    'dramatically': ['by X%', 'by [metric]', 'measurably'],
    'significantly': ['by 30%', 'from X to Y', 'measurably'],
    'amazing': ['measured', 'specific', 'concrete'],
    'contact us': ['DM me for playbook', 'ask in comments', 'follow for more'],
    'our solution': ['we built', 'our approach', 'the system']
  };

  const lowerBuzzword = buzzword.toLowerCase();
  return suggestions[lowerBuzzword] || ['Use specific metrics instead'];
}

/**
 * Analyze text and provide buzzword report
 * @param {string} text - Text to analyze
 * @returns {Object} Detailed report
 */
function analyzeBuzzwords(text) {
  const detection = detectBuzzwords(text, {
    includeVague: true,
    includePromotional: true
  });

  const suggestions = detection.found.map(buzzword => ({
    buzzword,
    suggestions: getSuggestions(buzzword)
  }));

  return {
    ...detection,
    suggestions,
    severity: detection.found.length === 0
      ? 'none'
      : detection.found.length <= 2
        ? 'low'
        : detection.found.length <= 4
          ? 'medium'
          : 'high'
  };
}

module.exports = {
  detectBuzzwords,
  getSuggestions,
  analyzeBuzzwords,
  BANNED_BUZZWORDS,
  VAGUE_QUALIFIERS,
  PROMOTIONAL_PHRASES
};
