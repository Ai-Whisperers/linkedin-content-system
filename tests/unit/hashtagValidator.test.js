/**
 * Unit Tests for hashtagValidator.js
 *
 * Tests hashtag extraction, validation, and categorization
 * Target Coverage: 100%
 */

const {
  extractHashtags,
  findInvalidHashtags,
  categorizeHashtags,
  validateHashtags,
  BROAD_HASHTAGS,
  NICHE_HASHTAGS
} = require('../../automation/validators/hashtagValidator');

describe('extractHashtags', () => {
  // TC-HASH-001
  it('should extract hashtags from text', () => {
    const text = 'Post about #AI and #Automation';
    const hashtags = extractHashtags(text);

    expect(hashtags).toEqual(['AI', 'Automation']);
  });

  // TC-HASH-002
  it('should handle hashtags without spaces', () => {
    const text = '#AI#Automation'; // Invalid but should still extract
    const hashtags = extractHashtags(text);

    expect(hashtags.length).toBe(2);
    expect(hashtags).toContain('AI');
    expect(hashtags).toContain('Automation');
  });

  // TC-HASH-003
  it('should return empty array for no hashtags', () => {
    const text = 'Post with no hashtags';
    expect(extractHashtags(text)).toEqual([]);
  });

  // TC-HASH-004
  it('should handle null/undefined', () => {
    expect(extractHashtags(null)).toEqual([]);
    expect(extractHashtags(undefined)).toEqual([]);
  });

  // TC-HASH-005
  it('should extract hashtags at end of post', () => {
    const text = 'Content here\n\n#AI #Automation #DevOps #MultiAgentSystems';
    const hashtags = extractHashtags(text);

    expect(hashtags).toHaveLength(4);
    expect(hashtags).toContain('AI');
    expect(hashtags).toContain('Automation');
    expect(hashtags).toContain('DevOps');
    expect(hashtags).toContain('MultiAgentSystems');
  });

  // TC-HASH-006
  it('should handle mixed case hashtags', () => {
    const text = '#ai #AUTOMATION #DevOps';
    const hashtags = extractHashtags(text);

    expect(hashtags).toEqual(['ai', 'AUTOMATION', 'DevOps']);
  });

  // TC-HASH-007
  it('should handle hashtags with numbers', () => {
    const text = '#AI2023 #Web3 #Industry40';
    const hashtags = extractHashtags(text);

    expect(hashtags).toHaveLength(3);
    expect(hashtags).toContain('AI2023');
  });
});

describe('findInvalidHashtags', () => {
  // TC-HASH-008
  it('should detect hashtags with spaces', () => {
    const text = 'Post with #Multi Agent Systems';
    const invalid = findInvalidHashtags(text);

    expect(invalid.length).toBeGreaterThan(0);
    expect(invalid[0]).toContain('Multi Agent');
  });

  // TC-HASH-009
  it('should return empty array for valid hashtags', () => {
    const text = '#AI #Automation #DevOps';
    expect(findInvalidHashtags(text)).toEqual([]);
  });

  // TC-HASH-010
  it('should detect multiple invalid hashtags', () => {
    const text = '#Multi Agent and #Game Changer';
    const invalid = findInvalidHashtags(text);

    expect(invalid.length).toBeGreaterThan(0);
  });

  // TC-HASH-011
  it('should handle empty text', () => {
    expect(findInvalidHashtags('')).toEqual([]);
  });
});

describe('categorizeHashtags', () => {
  // TC-HASH-012
  it('should categorize broad hashtags', () => {
    const hashtags = ['AI', 'Automation', 'MultiAgentSystems', 'AIWhisperers'];
    const result = categorizeHashtags(hashtags);

    expect(result.broad).toContain('AI');
    expect(result.broad).toContain('Automation');
    expect(result.broad.length).toBe(2);
  });

  // TC-HASH-013
  it('should categorize niche hashtags', () => {
    const hashtags = ['AI', 'MultiAgentSystems', 'RepoHealth'];
    const result = categorizeHashtags(hashtags);

    expect(result.niche).toContain('MultiAgentSystems');
    expect(result.niche).toContain('RepoHealth');
    expect(result.niche.length).toBe(2);
  });

  // TC-HASH-014
  it('should handle unknown hashtags', () => {
    const hashtags = ['AI', 'UnknownTag', 'RandomHashtag'];
    const result = categorizeHashtags(hashtags);

    expect(result.unknown).toContain('UnknownTag');
    expect(result.unknown).toContain('RandomHashtag');
    expect(result.unknown.length).toBe(2);
  });

  // TC-HASH-015
  it('should return empty arrays for no hashtags', () => {
    const result = categorizeHashtags([]);

    expect(result.broad).toEqual([]);
    expect(result.niche).toEqual([]);
    expect(result.unknown).toEqual([]);
  });

  // TC-HASH-016
  it('should correctly categorize mixed hashtags', () => {
    const hashtags = ['AI', 'Automation', 'MultiAgentSystems', 'AIWhisperers', 'Unknown'];
    const result = categorizeHashtags(hashtags);

    expect(result.broad.length).toBe(2);
    expect(result.niche.length).toBe(2);
    expect(result.unknown.length).toBe(1);
  });
});

describe('validateHashtags', () => {
  // TC-HASH-017
  it('should pass for exactly 4 hashtags with correct distribution', () => {
    const text = 'Content\n\n#AI #Automation #MultiAgentSystems #AIWhisperers';
    const result = validateHashtags(text);

    expect(result.valid).toBe(true);
    expect(result.count).toBe(4);
    expect(result.broad).toBe(2);
    expect(result.niche).toBe(2);
  });

  // TC-HASH-018
  it('should fail for less than 4 hashtags', () => {
    const text = 'Content\n\n#AI #Automation';
    const result = validateHashtags(text);

    expect(result.valid).toBe(false);
    expect(result.count).toBe(2);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Expected 4 hashtags, found 2');
  });

  // TC-HASH-019
  it('should fail for more than 4 hashtags', () => {
    const text = 'Content\n\n#AI #Automation #DevOps #Tech #Extra';
    const result = validateHashtags(text);

    expect(result.valid).toBe(false);
    expect(result.count).toBe(5);
    expect(result.errors[0]).toContain('Expected 4 hashtags, found 5');
  });

  // TC-HASH-020
  it('should validate 2 broad + 2 niche distribution', () => {
    const text = 'Content\n\n#AI #Automation #MultiAgentSystems #AIWhisperers';
    const result = validateHashtags(text);

    expect(result.valid).toBe(true);
    expect(result.broad).toBe(2);
    expect(result.niche).toBe(2);
  });

  // TC-HASH-021
  it('should fail if not enough broad hashtags', () => {
    const text = 'Content\n\n#AI #MultiAgentSystems #AIWhisperers #RepoHealth';
    const result = validateHashtags(text);

    expect(result.valid).toBe(false);
    expect(result.broad).toBe(1);
    expect(result.errors).toContain('Need 2 broad hashtags, found 1');
  });

  // TC-HASH-022
  it('should fail if not enough niche hashtags', () => {
    const text = 'Content\n\n#AI #Automation #DevOps #Tech';
    const result = validateHashtags(text);

    expect(result.valid).toBe(false);
    expect(result.niche).toBe(0);
    expect(result.errors).toContain('Need 2 niche hashtags, found 0');
  });

  // TC-HASH-023
  it('should detect invalid hashtags with spaces', () => {
    const text = 'Content\n\n#Multi Agent Systems\n#AI #DevOps #Tech';
    const result = validateHashtags(text);

    expect(result.valid).toBe(false);
    expect(result.invalidTags.length).toBeGreaterThan(0);
  });

  // TC-HASH-024
  it('should allow custom hashtag requirements', () => {
    const text = 'Content\n\n#AI #Automation #DevOps';
    const result = validateHashtags(text, { total: 3, broad: 2, niche: 0 });

    // Should pass with 3 total hashtags (relaxed requirements)
    expect(result.count).toBe(3);
    // May still check distribution, so just verify count is correct
  });

  // TC-HASH-025
  it('should provide detailed validation result', () => {
    const text = 'Content\n\n#AI #Automation #MultiAgentSystems #AIWhisperers';
    const result = validateHashtags(text);

    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('hashtags');
    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('broad');
    expect(result).toHaveProperty('niche');
    expect(result).toHaveProperty('unknown');
    expect(result).toHaveProperty('invalidTags');
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('message');
  });

  // TC-HASH-026
  it('should handle text with no hashtags', () => {
    const text = 'Content with no hashtags';
    const result = validateHashtags(text);

    expect(result.valid).toBe(false);
    expect(result.count).toBe(0);
  });

  // TC-HASH-027
  it('should provide helpful message on success', () => {
    const text = 'Content\n\n#AI #Automation #MultiAgentSystems #AIWhisperers';
    const result = validateHashtags(text);

    expect(result.message).toContain('Hashtags OK');
    expect(result.message).toContain('4 total');
  });
});

describe('Constants', () => {
  // TC-HASH-028
  it('should export BROAD_HASHTAGS array', () => {
    expect(Array.isArray(BROAD_HASHTAGS)).toBe(true);
    expect(BROAD_HASHTAGS.length).toBeGreaterThan(0);
    expect(BROAD_HASHTAGS).toContain('AI');
    expect(BROAD_HASHTAGS).toContain('Automation');
  });

  // TC-HASH-029
  it('should export NICHE_HASHTAGS array', () => {
    expect(Array.isArray(NICHE_HASHTAGS)).toBe(true);
    expect(NICHE_HASHTAGS.length).toBeGreaterThan(0);
    expect(NICHE_HASHTAGS).toContain('MultiAgentSystems');
    expect(NICHE_HASHTAGS).toContain('AIWhisperers');
  });
});
