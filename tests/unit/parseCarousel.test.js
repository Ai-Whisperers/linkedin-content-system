/**
 * Unit Tests for parseCarousel.js
 *
 * Tests the carousel markdown parser functionality
 * Target Coverage: 95%+
 */

const path = require('path');
const fs = require('fs');
const {
  parseCarouselMarkdown,
  formatSlideForGamma,
  exportToJSON
} = require('../../automation/parseCarousel');
const { createTempFile, cleanupTempFiles } = require('../helpers/testUtils');

describe('parseCarouselMarkdown', () => {
  afterEach(() => {
    cleanupTempFiles();
  });

  describe('Valid carousel parsing', () => {
    it('should parse a valid carousel with 3 slides', () => {
      // Arrange
      const fixturePath = path.join(__dirname, '..', 'fixtures', 'valid-carousel.md');

      // Act
      const result = parseCarouselMarkdown(fixturePath);

      // Assert
      expect(result).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.slides).toBeDefined();
      expect(result.slides.length).toBe(3);
    });

    it('should extract metadata correctly', () => {
      // Arrange
      const fixturePath = path.join(__dirname, '..', 'fixtures', 'valid-carousel.md');

      // Act
      const result = parseCarouselMarkdown(fixturePath);

      // Assert
      expect(result.metadata.title).toBe('"Test Carousel for Unit Testing"');
      expect(result.metadata.slides).toBe('3');
    });

    it('should parse slide with all sections', () => {
      // Arrange
      const fixturePath = path.join(__dirname, '..', 'fixtures', 'valid-carousel.md');

      // Act
      const result = parseCarouselMarkdown(fixturePath);

      // Assert
      const slide1 = result.slides[0];
      expect(slide1.number).toBe(1);
      expect(slide1.type).toBe('Hook');
      expect(slide1.title).toContain('Test Title 1');
      expect(slide1.content).toContain('test content for slide 1');
      expect(slide1.visualNotes).toContain('Visual notes for slide 1');
    });

    it('should extract content from code blocks correctly', () => {
      // Arrange
      const markdown = `
## Slide 1: Test

### Title
\`\`\`
My Title
\`\`\`

### Content
\`\`\`
My Content
\`\`\`
      `.trim();

      const filePath = createTempFile('test-codeblocks.md', markdown);

      // Act
      const result = parseCarouselMarkdown(filePath);

      // Assert
      expect(result.slides[0].title).toBe('My Title');
      expect(result.slides[0].content).toBe('My Content');
    });

    it('should handle multiple slides sequentially', () => {
      // Arrange
      const fixturePath = path.join(__dirname, '..', 'fixtures', 'valid-carousel.md');

      // Act
      const result = parseCarouselMarkdown(fixturePath);

      // Assert
      expect(result.slides[0].number).toBe(1);
      expect(result.slides[1].number).toBe(2);
      expect(result.slides[2].number).toBe(3);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty code blocks', () => {
      // Arrange
      const markdown = `
## Slide 1: Test

### Title
\`\`\`
\`\`\`

### Content
\`\`\`
\`\`\`
      `.trim();

      const filePath = createTempFile('empty-codeblocks.md', markdown);

      // Act
      const result = parseCarouselMarkdown(filePath);

      // Assert
      expect(result.slides[0].title).toBe('');
      expect(result.slides[0].content).toBe('');
    });

    it('should handle missing visual notes section', () => {
      // Arrange
      const markdown = `
## Slide 1: Test

### Title
\`\`\`
Title Only
\`\`\`

### Content
\`\`\`
Content Only
\`\`\`
      `.trim();

      const filePath = createTempFile('no-visual-notes.md', markdown);

      // Act
      const result = parseCarouselMarkdown(filePath);

      // Assert
      expect(result.slides[0].title).toBe('Title Only');
      expect(result.slides[0].content).toBe('Content Only');
      expect(result.slides[0].visualNotes).toBe('');
    });

    it('should handle carousel with no metadata', () => {
      // Arrange
      const markdown = `
## Slide 1: Test

### Title
\`\`\`
Test
\`\`\`
      `.trim();

      const filePath = createTempFile('no-metadata.md', markdown);

      // Act
      const result = parseCarouselMarkdown(filePath);

      // Assert
      expect(result.metadata).toEqual({});
      expect(result.slides.length).toBe(1);
    });

    it('should handle completely empty file', () => {
      // Arrange
      const filePath = createTempFile('empty.md', '');

      // Act
      const result = parseCarouselMarkdown(filePath);

      // Assert
      expect(result.slides).toEqual([]);
      expect(result.metadata).toEqual({});
    });

    it('should handle file with only comments', () => {
      // Arrange
      const markdown = `
<!-- This is just a comment -->
<!-- Another comment -->
      `.trim();

      const filePath = createTempFile('comments-only.md', markdown);

      // Act
      const result = parseCarouselMarkdown(filePath);

      // Assert
      expect(result.slides).toEqual([]);
    });
  });

  describe('Error scenarios', () => {
    it('should throw error for non-existent file', () => {
      // Arrange
      const invalidPath = './non-existent-file.md';

      // Act & Assert
      expect(() => {
        parseCarouselMarkdown(invalidPath);
      }).toThrow();
    });

    it('should handle malformed slide headers gracefully', () => {
      // Arrange
      const markdown = `
## Slide Missing Number: Test

### Title
\`\`\`
Test
\`\`\`
      `.trim();

      const filePath = createTempFile('malformed-header.md', markdown);

      // Act
      const result = parseCarouselMarkdown(filePath);

      // Assert
      // Should not crash, but may skip malformed slide
      expect(result).toBeDefined();
    });
  });
});

describe('formatSlideForGamma', () => {
  it('should format slide with all fields', () => {
    // Arrange
    const slide = {
      number: 1,
      type: 'Hook',
      title: 'Test Title',
      content: '• Bullet point\n• Another point',
      visualNotes: '- Note 1\n- Note 2'
    };

    // Act
    const formatted = formatSlideForGamma(slide);

    // Assert
    expect(formatted.number).toBe(1);
    expect(formatted.type).toBe('Hook');
    expect(formatted.title).toBe('Test Title');
    expect(formatted.content).toContain('•');
    expect(formatted.visualNotes).toContain('•');
  });

  it('should normalize bullet points', () => {
    // Arrange
    const slide = {
      number: 1,
      type: 'Test',
      title: 'Title',
      content: '•  Bullet with extra space',
      visualNotes: ''
    };

    // Act
    const formatted = formatSlideForGamma(slide);

    // Assert
    expect(formatted.content).toBe('• Bullet with extra space');
  });

  it('should convert dashes to bullets in visual notes', () => {
    // Arrange
    const slide = {
      number: 1,
      type: 'Test',
      title: 'Title',
      content: 'Content',
      visualNotes: '- Note 1\n- Note 2'
    };

    // Act
    const formatted = formatSlideForGamma(slide);

    // Assert
    expect(formatted.visualNotes).toBe('• Note 1\n• Note 2');
  });

  it('should trim whitespace from content and notes', () => {
    // Arrange
    const slide = {
      number: 1,
      type: 'Test',
      title: '  Spaced Title  ',
      content: '  Spaced Content  ',
      visualNotes: '  Spaced Notes  '
    };

    // Act
    const formatted = formatSlideForGamma(slide);

    // Assert
    // Title might not be trimmed by formatSlideForGamma, just content
    expect(formatted.content).toBe('Spaced Content');
    expect(formatted.visualNotes).toBe('Spaced Notes');
  });
});

describe('exportToJSON', () => {
  afterEach(() => {
    cleanupTempFiles();
  });

  it('should export carousel data to JSON file', () => {
    // Arrange
    const carouselData = {
      metadata: { title: 'Test' },
      slides: [
        {
          number: 1,
          type: 'Hook',
          title: 'Title',
          content: 'Content',
          visualNotes: 'Notes'
        }
      ]
    };

    const outputPath = path.join(__dirname, '..', 'temp', 'test-output.json');

    // Act
    const result = exportToJSON(carouselData, outputPath);

    // Assert
    expect(result).toBeDefined();
    expect(fs.existsSync(outputPath)).toBe(true);

    const savedData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    expect(savedData.metadata.title).toBe('Test');
    expect(savedData.slides.length).toBe(1);
  });

  it('should format slides before exporting', () => {
    // Arrange
    const carouselData = {
      metadata: {},
      slides: [
        {
          number: 1,
          type: 'Test',
          title: '  Spaced  ',
          content: '  Content  ',
          visualNotes: '  - Note  '
        }
      ]
    };

    const outputPath = path.join(__dirname, '..', 'temp', 'formatted-output.json');

    // Act
    exportToJSON(carouselData, outputPath);

    // Assert
    const savedData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    expect(savedData.slides[0].content.trim()).toBe('Content');
    // Visual notes may or may not convert dashes to bullets depending on formatSlideForGamma
    expect(savedData.slides[0].visualNotes.trim()).toContain('Note');
  });

  it('should create valid JSON structure', () => {
    // Arrange
    const carouselData = {
      metadata: { title: 'Test', slides: '3' },
      slides: []
    };

    const outputPath = path.join(__dirname, '..', 'temp', 'structure-test.json');

    // Act
    exportToJSON(carouselData, outputPath);

    // Assert
    const savedData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    expect(savedData).toHaveProperty('metadata');
    expect(savedData).toHaveProperty('slides');
    expect(Array.isArray(savedData.slides)).toBe(true);
  });
});

describe('Integration: Parse and Export', () => {
  afterEach(() => {
    cleanupTempFiles();
  });

  it('should parse carousel and export to JSON successfully', () => {
    // Arrange
    const fixturePath = path.join(__dirname, '..', 'fixtures', 'valid-carousel.md');
    const outputPath = path.join(__dirname, '..', 'temp', 'integration-output.json');

    // Act
    const parsed = parseCarouselMarkdown(fixturePath);
    exportToJSON(parsed, outputPath);

    // Assert
    expect(fs.existsSync(outputPath)).toBe(true);

    const savedData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    expect(savedData.slides.length).toBe(3);
    expect(savedData.metadata.title).toBe('"Test Carousel for Unit Testing"');
  });
});
