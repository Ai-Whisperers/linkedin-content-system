#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const PROJECT_ROOT = __dirname;
const CONTEXT_DIR = path.join(PROJECT_ROOT, 'context');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'generated-posts');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Brand voice and content rules
const CONTENT_PROMPT = `You are a LinkedIn content strategist for AI-Whisperers.

# BRAND VOICE
- Professional yet approachable
- Evidence-based (no hype)
- Builder-focused
- Pragmatic

# CONTENT FOCUS
- 60% Services (Custom AI, Automation, Education, Consulting)
- 40% Educational (Agentic patterns, tools, concepts in 60 seconds)

# RULES
- Word count: 120-180 words
- Maximum 2 emojis
- 4 hashtags
- NO buzzwords (revolutionary, game-changing, etc.)

# GENERATE 5 POSTS FROM:

FILE: {fileName}
CATEGORY: {category}

CONTENT:
{content}

# OUTPUT (Valid JSON only):

{
  "posts": [
    {
      "variation": "service-showcase",
      "hook": "First sentence",
      "body": "Main content",
      "cta": "Call to action",
      "hashtags": ["AI", "Automation", "MultiAgentSystems", "AIWhisperers"],
      "word_count": 150
    },
    {
      "variation": "tool-tutorial",
      "hook": "First sentence",
      "body": "Main content",
      "cta": "Call to action",
      "hashtags": ["DevOps", "TechTutorial", "AIEngineering", "LearnAI"],
      "word_count": 145
    },
    {
      "variation": "concept-explained",
      "hook": "First sentence",
      "body": "Main content",
      "cta": "Call to action",
      "hashtags": ["AgenticAI", "AIEducation", "TechExplained", "AI"],
      "word_count": 155
    },
    {
      "variation": "case-study",
      "hook": "First sentence",
      "body": "Main content",
      "cta": "Call to action",
      "hashtags": ["CaseStudy", "RealWorldAI", "BuildInPublic", "AIWhisperers"],
      "word_count": 160
    },
    {
      "variation": "how-to",
      "hook": "First sentence",
      "body": "Main content",
      "cta": "Call to action",
      "hashtags": ["HowTo", "AIAutomation", "TechGuide", "DevOps"],
      "word_count": 140
    }
  ]
}

Return ONLY valid JSON.`;

// Find all markdown files in context directory
function findContextFiles(dir, category = '') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findContextFiles(fullPath, entry.name));
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      files.push({
        path: fullPath,
        category: category || 'general',
        name: entry.name.replace('.md', '')
      });
    }
  }

  return files;
}

// Call Claude API
function callClaudeAPI(prompt) {
  return new Promise((resolve, reject) => {
    const requestBody = {
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    const data = JSON.stringify(requestBody);

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`API request failed with status ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Validate and score post
function validatePost(post) {
  const issues = [];

  if (post.word_count < 120 || post.word_count > 180) {
    issues.push('Word count outside range (120-180)');
  }

  if (!post.hashtags || post.hashtags.length !== 4) {
    issues.push('Must have exactly 4 hashtags');
  }

  const fullText = `${post.hook} ${post.body} ${post.cta}`.toLowerCase();
  const buzzwords = ['revolutionary', 'game-changing', 'disruptive', 'transform your'];
  const foundBuzzwords = buzzwords.filter(word => fullText.includes(word));

  if (foundBuzzwords.length > 0) {
    issues.push(`Buzzwords found: ${foundBuzzwords.join(', ')}`);
  }

  const qualityScore = 100 - (issues.length * 15);
  const status = qualityScore >= 70 ? 'APPROVED' : 'NEEDS_REVISION';

  return { issues, qualityScore, status };
}

// Save post to file
function savePost(post, sourceFile, sourceCategory, batchDate, status) {
  const timestamp = Date.now();
  const postId = `${sourceFile}-${post.variation}-${timestamp}`;

  const dirPath = path.join(OUTPUT_DIR, `batch-${batchDate}`, status === 'APPROVED' ? 'approved' : 'needs-revision');
  fs.mkdirSync(dirPath, { recursive: true });

  const filePath = path.join(dirPath, `${postId}.md`);

  let content;
  if (status === 'APPROVED') {
    const fullText = `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.map(tag => '#' + tag).join(' ')}`;
    content = `---
post_id: ${postId}
source: ${sourceFile}
category: ${sourceCategory}
variation: ${post.variation}
status: ${status}
score: ${post.qualityScore}
word_count: ${post.word_count}
generated: ${new Date().toISOString()}
---

# ${post.variation}

## Hook
${post.hook}

## Body
${post.body}

## CTA
${post.cta}

## Hashtags
${post.hashtags.map(tag => '#' + tag).join(' ')}

---

## READY TO POST

${fullText}
`;
  } else {
    content = `---
post_id: ${postId}
source: ${sourceFile}
category: ${sourceCategory}
variation: ${post.variation}
status: ${status}
score: ${post.qualityScore}
word_count: ${post.word_count}
---

# ⚠️ NEEDS REVISION

## Issues
${post.issues.map((issue, i) => `${i+1}. ${issue}`).join('\n')}

## Content

${post.hook}

${post.body}

${post.cta}

${post.hashtags.map(tag => '#' + tag).join(' ')}
`;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ Saved ${status === 'APPROVED' ? '✅' : '⚠️'} ${post.variation} (score: ${post.qualityScore})`);

  return { filePath, postId, status };
}

// Main function
async function main() {
  console.log('🚀 AI-Whisperers Content Generator\n');

  // Check API key
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable not set');
    console.error('   Set it with: export ANTHROPIC_API_KEY=your-key-here');
    process.exit(1);
  }

  // Find all context files
  console.log('📁 Finding context files...');
  const contextFiles = findContextFiles(CONTEXT_DIR);
  console.log(`   Found ${contextFiles.length} files\n`);

  const batchDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
  let totalPosts = 0;
  let approvedCount = 0;
  let revisionCount = 0;

  // Process each file
  for (let i = 0; i < contextFiles.length; i++) {
    const file = contextFiles[i];
    console.log(`\n[${i + 1}/${contextFiles.length}] Processing: ${file.name} (${file.category})`);

    // Read file content
    const content = fs.readFileSync(file.path, 'utf8');
    const paragraphs = content.split('\n\n').filter(p => p.length > 50);
    // Limit content to avoid JSON payload size issues (max ~8000 chars)
    const summary = paragraphs.slice(0, 3).join('\n\n').substring(0, 8000) || content.substring(0, 1000);

    // Generate prompt
    const prompt = CONTENT_PROMPT
      .replace('{fileName}', file.name)
      .replace('{category}', file.category)
      .replace('{content}', summary);

    try {
      // Call Claude API
      console.log('  ⏳ Generating posts...');
      const response = await callClaudeAPI(prompt);

      // Parse response
      let responseText = response.content[0].text;
      let postsData;

      try {
        postsData = JSON.parse(responseText);
      } catch (e) {
        // Try to extract JSON from markdown code block
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          postsData = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error('Could not parse response as JSON');
        }
      }

      // Validate and save each post
      for (const post of postsData.posts) {
        const validation = validatePost(post);
        Object.assign(post, validation);

        savePost(post, file.name, file.category, batchDate, validation.status);

        totalPosts++;
        if (validation.status === 'APPROVED') {
          approvedCount++;
        } else {
          revisionCount++;
        }
      }

      // Rate limiting - wait 1 second between requests
      if (i < contextFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error(`  ❌ Error processing ${file.name}:`, error.message);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Generation Summary');
  console.log('='.repeat(60));
  console.log(`Total posts generated: ${totalPosts}`);
  console.log(`✅ Approved: ${approvedCount}`);
  console.log(`⚠️  Needs revision: ${revisionCount}`);
  console.log(`\n📁 Output directory: ${path.join(OUTPUT_DIR, `batch-${batchDate}`)}`);
  console.log('='.repeat(60));
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
