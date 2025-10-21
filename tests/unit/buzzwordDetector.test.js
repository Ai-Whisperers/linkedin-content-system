/**
 * Unit Tests for buzzwordDetector.js
 *
 * Tests buzzword detection and analysis functionality
 * Target Coverage: 100%
 */

const {
  detectBuzzwords,
  getSuggestions,
  analyzeBuzzwords,
  BANNED_BUZZWORDS,
  VAGUE_QUALIFIERS,
  PROMOTIONAL_PHRASES
} = require('../../automation/validators/buzzwordDetector');

describe('detectBuzzwords', () => {
  // TC-BUZZ-001
  it('should detect banned buzzwords', () => {
    const text = 'Our revolutionary AI magic will transform everything';
    const result = detectBuzzwords(text);

    expect(result.valid).toBe(false);
    expect(result.found).toContain('revolutionary');
    expect(result.found).toContain('AI magic');
  });

  // TC-BUZZ-002
  it('should be case-insensitive', () => {
    const text = 'REVOLUTIONARY and Game-Changing solutions';
    const result = detectBuzzwords(text);

    expect(result.found.length).toBeGreaterThan(0);
    expect(result.valid).toBe(false);
  });

  // TC-BUZZ-003
  it('should detect multiple buzzwords', () => {
    const text = 'Revolutionary, game-changing, disruptive innovation';
    const result = detectBuzzwords(text);

    expect(result.found.length).toBeGreaterThanOrEqual(3);
    expect(result.buzzwords.length).toBeGreaterThan(0);
  });

  // TC-BUZZ-004
  it('should pass for clean text', () => {
    const text = 'We built an AI agent that improved efficiency by 30%';
    const result = detectBuzzwords(text);

    expect(result.valid).toBe(true);
    expect(result.found).toEqual([]);
  });

  // TC-BUZZ-005
  it('should optionally detect vague qualifiers', () => {
    const text = 'Dramatically improved and significantly better';
    const result = detectBuzzwords(text, { includeVague: true });

    expect(result.vague).toContain('dramatically');
    expect(result.vague).toContain('significantly');
  });

  // TC-BUZZ-006
  it('should not detect vague qualifiers when disabled', () => {
    const text = 'Dramatically improved';
    const result = detectBuzzwords(text, { includeVague: false });

    expect(result.vague).toEqual([]);
  });

  // TC-BUZZ-007
  it('should optionally detect promotional phrases', () => {
    const text = 'Contact us to learn more about our solution';
    const result = detectBuzzwords(text, { includePromotional: true });

    expect(result.promotional.length).toBeGreaterThan(0);
  });

  // TC-BUZZ-008
  it('should handle empty text', () => {
    const result = detectBuzzwords('');

    expect(result.valid).toBe(true);
    expect(result.found).toEqual([]);
  });

  // TC-BUZZ-009
  it('should handle null/undefined', () => {
    expect(detectBuzzwords(null).valid).toBe(true);
    expect(detectBuzzwords(undefined).valid).toBe(true);
  });

  // TC-BUZZ-010
  it('should allow custom buzzwords', () => {
    const text = 'Custom bad word here';
    const result = detectBuzzwords(text, {
      customBuzzwords: ['custom bad word']
    });

    expect(result.found).toContain('custom bad word');
  });

  // TC-BUZZ-011
  it('should detect all common buzzwords', () => {
    const text = 'Revolutionary game-changing disruptive synergy paradigm shift';
    const result = detectBuzzwords(text);

    expect(result.found.length).toBeGreaterThan(3);
  });

  // TC-BUZZ-012
  it('should return detailed result object', () => {
    const text = 'Test text';
    const result = detectBuzzwords(text);

    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('found');
    expect(result).toHaveProperty('buzzwords');
    expect(result).toHaveProperty('vague');
    expect(result).toHaveProperty('promotional');
    expect(result).toHaveProperty('message');
  });
});

describe('getSuggestions', () => {
  // TC-BUZZ-013
  it('should return suggestions for known buzzwords', () => {
    const suggestions = getSuggestions('revolutionary');

    expect(suggestions).toBeDefined();
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions).toContain('improved');
  });

  // TC-BUZZ-014
  it('should return generic suggestion for unknown buzzword', () => {
    const suggestions = getSuggestions('unknown-buzzword');

    expect(suggestions).toEqual(['Use specific metrics instead']);
  });

  // TC-BUZZ-015
  it('should be case-insensitive', () => {
    const suggestions1 = getSuggestions('REVOLUTIONARY');
    const suggestions2 = getSuggestions('revolutionary');

    expect(suggestions1).toEqual(suggestions2);
  });

  // TC-BUZZ-016
  it('should provide multiple suggestions', () => {
    const suggestions = getSuggestions('AI magic');

    expect(suggestions.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(suggestions)).toBe(true);
  });

  // TC-BUZZ-017
  it('should provide actionable suggestions', () => {
    const suggestions = getSuggestions('dramatically');

    expect(suggestions).toContain('by X%');
  });
});

describe('analyzeBuzzwords', () => {
  // TC-BUZZ-018
  it('should provide detailed analysis with suggestions', () => {
    const text = 'Revolutionary AI magic';
    const result = analyzeBuzzwords(text);

    expect(result.suggestions).toBeDefined();
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.suggestions[0]).toHaveProperty('buzzword');
    expect(result.suggestions[0]).toHaveProperty('suggestions');
  });

  // TC-BUZZ-019
  it('should calculate severity correctly for clean text', () => {
    const cleanText = 'We built a system';
    const result = analyzeBuzzwords(cleanText);
    expect(result.severity).toBe('none');
  });

  // TC-BUZZ-020
  it('should calculate severity correctly for low buzzwords', () => {
    const lowBuzzwords = 'Revolutionary system';
    const result = analyzeBuzzwords(lowBuzzwords);
    expect(result.severity).toBe('low');
  });

  // TC-BUZZ-021
  it('should calculate severity correctly for medium buzzwords', () => {
    const mediumBuzzwords = 'Revolutionary game-changing disruptive';
    const result = analyzeBuzzwords(mediumBuzzwords);
    expect(result.severity).toBe('medium');
  });

  // TC-BUZZ-022
  it('should calculate severity correctly for high buzzwords', () => {
    const highBuzzwords = 'Revolutionary game-changing disruptive amazing incredible synergy';
    const result = analyzeBuzzwords(highBuzzwords);
    expect(result.severity).toBe('high');
  });

  // TC-BUZZ-023
  it('should include all detection results', () => {
    const text = 'Revolutionary system, contact us for dramatically better results';
    const result = analyzeBuzzwords(text);

    expect(result.buzzwords.length).toBeGreaterThan(0);
    expect(result.vague.length).toBeGreaterThan(0);
    expect(result.promotional.length).toBeGreaterThan(0);
  });
});

describe('Constants', () => {
  // TC-BUZZ-024
  it('should export BANNED_BUZZWORDS array', () => {
    expect(Array.isArray(BANNED_BUZZWORDS)).toBe(true);
    expect(BANNED_BUZZWORDS.length).toBeGreaterThan(0);
    expect(BANNED_BUZZWORDS).toContain('AI magic');
    expect(BANNED_BUZZWORDS).toContain('revolutionary');
  });

  // TC-BUZZ-025
  it('should export VAGUE_QUALIFIERS array', () => {
    expect(Array.isArray(VAGUE_QUALIFIERS)).toBe(true);
    expect(VAGUE_QUALIFIERS.length).toBeGreaterThan(0);
    expect(VAGUE_QUALIFIERS).toContain('dramatically');
    expect(VAGUE_QUALIFIERS).toContain('significantly');
  });

  // TC-BUZZ-026
  it('should export PROMOTIONAL_PHRASES array', () => {
    expect(Array.isArray(PROMOTIONAL_PHRASES)).toBe(true);
    expect(PROMOTIONAL_PHRASES.length).toBeGreaterThan(0);
    expect(PROMOTIONAL_PHRASES).toContain('contact us');
  });
});
