/**
 * Unit Tests for wordCountValidator.js
 *
 * Tests word counting and validation functionality
 * Target Coverage: 100%
 */

const {
  countWords,
  validateWordCount
} = require('../../automation/validators/wordCountValidator');
const { createMockPost } = require('../helpers/testUtils');

describe('countWords', () => {
  // TC-WORD-001
  it('should count words correctly in plain text', () => {
    const text = 'Hello world this is a test';
    expect(countWords(text)).toBe(6);
  });

  // TC-WORD-002
  it('should ignore markdown formatting', () => {
    const text = '**Bold** and *italic* and __underlined__ text';
    expect(countWords(text)).toBe(6); // Bold, and, italic, and, underlined, text
  });

  // TC-WORD-003
  it('should ignore code blocks', () => {
    const text = 'Text before ```code block content``` text after';
    const count = countWords(text);
    expect(count).toBe(4); // "Text before text after"
  });

  // TC-WORD-004
  it('should ignore hashtags', () => {
    const text = 'Post content here #AI #Automation #DevOps';
    const count = countWords(text);
    expect(count).toBe(3); // Only "Post content here"
  });

  // TC-WORD-005
  it('should handle empty string', () => {
    expect(countWords('')).toBe(0);
  });

  // TC-WORD-006
  it('should handle null/undefined', () => {
    expect(countWords(null)).toBe(0);
    expect(countWords(undefined)).toBe(0);
  });

  // TC-WORD-007
  it('should handle multiple spaces', () => {
    const text = 'Word1    Word2     Word3';
    expect(countWords(text)).toBe(3);
  });

  // TC-WORD-008
  it('should handle newlines as word separators', () => {
    const text = 'Line1\nLine2\nLine3';
    expect(countWords(text)).toBe(3);
  });

  // TC-WORD-009
  it('should handle tabs as word separators', () => {
    const text = 'Tab1\tTab2\tTab3';
    expect(countWords(text)).toBe(3);
  });

  // TC-WORD-010
  it('should handle mixed whitespace', () => {
    const text = '  Word1  \n\n  Word2  \t\t  Word3  ';
    expect(countWords(text)).toBe(3);
  });
});

describe('validateWordCount', () => {
  // TC-WORD-011
  it('should pass for 120-180 word count', () => {
    const text = createMockPost(150);
    const result = validateWordCount(text);

    expect(result.valid).toBe(true);
    expect(result.count).toBe(150);
    expect(result.error).toBeNull();
  });

  // TC-WORD-012
  it('should fail for posts under 120 words', () => {
    const text = createMockPost(100);
    const result = validateWordCount(text);

    expect(result.valid).toBe(false);
    expect(result.count).toBe(100);
    expect(result.error).toContain('Too short');
    expect(result.error).toContain('100');
    expect(result.error).toContain('120');
  });

  // TC-WORD-013
  it('should fail for posts over 180 words', () => {
    const text = createMockPost(200);
    const result = validateWordCount(text);

    expect(result.valid).toBe(false);
    expect(result.count).toBe(200);
    expect(result.error).toContain('Too long');
    expect(result.error).toContain('200');
    expect(result.error).toContain('180');
  });

  // TC-WORD-014
  it('should allow custom min/max thresholds', () => {
    const text = createMockPost(100);
    const result = validateWordCount(text, { min: 50, max: 150 });

    expect(result.valid).toBe(true);
    expect(result.min).toBe(50);
    expect(result.max).toBe(150);
  });

  // TC-WORD-015
  it('should return detailed validation result', () => {
    const text = createMockPost(150);
    const result = validateWordCount(text);

    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('min');
    expect(result).toHaveProperty('max');
    expect(result).toHaveProperty('error');
    expect(result).toHaveProperty('message');
  });

  // TC-WORD-016
  it('should pass for exactly 120 words (lower boundary)', () => {
    const text = createMockPost(120);
    const result = validateWordCount(text);

    expect(result.valid).toBe(true);
    expect(result.count).toBe(120);
  });

  // TC-WORD-017
  it('should pass for exactly 180 words (upper boundary)', () => {
    const text = createMockPost(180);
    const result = validateWordCount(text);

    expect(result.valid).toBe(true);
    expect(result.count).toBe(180);
  });

  // TC-WORD-018
  it('should fail for 119 words (just under minimum)', () => {
    const text = createMockPost(119);
    const result = validateWordCount(text);

    expect(result.valid).toBe(false);
    expect(result.count).toBe(119);
  });

  // TC-WORD-019
  it('should fail for 181 words (just over maximum)', () => {
    const text = createMockPost(181);
    const result = validateWordCount(text);

    expect(result.valid).toBe(false);
    expect(result.count).toBe(181);
  });

  // TC-WORD-020
  it('should provide helpful success message', () => {
    const text = createMockPost(150);
    const result = validateWordCount(text);

    expect(result.message).toContain('Word count OK');
    expect(result.message).toContain('150');
  });

  // TC-WORD-021
  it('should handle post with hashtags correctly', () => {
    const text = createMockPost(150) + '\n\n#AI #Automation #DevOps #Tech';
    const result = validateWordCount(text);

    // Hashtags should be ignored
    expect(result.count).toBe(150);
    expect(result.valid).toBe(true);
  });

  // TC-WORD-022
  it('should handle post with markdown formatting', () => {
    let text = createMockPost(75);
    text = `**${text}** and *more text here* to reach count`;
    const result = validateWordCount(text);

    // Should count words, ignoring markdown symbols
    expect(result.count).toBeGreaterThan(70);
  });
});

describe('Edge Cases', () => {
  // TC-WORD-023
  it('should handle empty post', () => {
    const result = validateWordCount('');

    expect(result.valid).toBe(false);
    expect(result.count).toBe(0);
  });

  // TC-WORD-024
  it('should handle post with only whitespace', () => {
    const result = validateWordCount('   \n\n\t\t   ');

    expect(result.valid).toBe(false);
    expect(result.count).toBe(0);
  });

  // TC-WORD-025
  it('should handle post with only hashtags', () => {
    const result = validateWordCount('#AI #Automation #DevOps #Tech');

    expect(result.valid).toBe(false);
    expect(result.count).toBe(0);
  });

  // TC-WORD-026
  it('should handle very long single word', () => {
    const longWord = 'a'.repeat(500);
    const text = longWord + ' ' + createMockPost(150);
    const result = validateWordCount(text);

    expect(result.count).toBe(151);
  });
});
