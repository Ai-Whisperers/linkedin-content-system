# AI-Whisperers Content Creator - Claude Context

## Project Overview

**Project Name**: AI-Whisperers Content Generation System
**Version**: 2.0.0
**Purpose**: Transform context into structured LinkedIn posts using deterministic, validated content generation
**Status**: Active (Workflow v2.0 with daily generation)

## System Identity

This is an AI-native content generation system for **AI-Whisperers**, a 3-month-old automation startup from Paraguay specializing in multi-agent systems. The system generates professional LinkedIn posts based on verified company context.

### Key Characteristics
- **Deterministic**: All context sources defined in `context/manifest.json`
- **Validated**: Hard validation before content storage (no silent failures)
- **Transparent**: Full provenance tracking with version IDs
- **Evidence-based**: No hype, only verifiable claims or labeled "anecdotal"

## Directory Structure

```
contentCreator/
├── context/                      # Source of truth for content generation
│   ├── manifest.json            # Deterministic list of all context sources
│   ├── services/                # Service offerings
│   ├── brand/                   # Brand voice and rules
│   ├── team/                    # Team member profiles
│   ├── repos/                   # GitHub repository documentation
│   ├── projects/                # Client projects and case studies
│   └── pages/                   # LinkedIn page context
├── workflows/                    # n8n automation workflows
│   ├── content-generator-daily.json     # v2.0
│   └── content-generator-linkedin.json  # v2.0
├── generated-posts/              # Generated content output
│   └── batch-YYYYMMDD/
│       ├── approved/
│       └── needs-revision/
├── brand-docs/                   # Brand standards and guidelines
│   ├── BRAND_BRIEF.md
│   ├── QUALITY_CHECKLIST.md
│   └── PUBLISHING_WORKFLOW.md
├── guides/                       # User guides
└── reference/                    # Architecture and analysis docs
```

## Workflow Versioning Rules

**IMPORTANT**: When updating workflows, modify the existing file and increment the internal version number. Do NOT create new files with version suffixes.

### Correct Approach ✅
- Keep filename: `content-generator-daily.json`
- Update internal version field: `"version": "2.0"` → `"version": "3.0"`
- Commit with message: "Update content-generator-daily to v3.0: [changes]"

### Incorrect Approach ❌
- Do NOT create: `content-generator-daily-v2.json`
- Do NOT create: `content-generator-daily-v3.json`
- Do NOT create: `content-generator-daily-new.json`

### Rationale
- Single source of truth per workflow
- Version history tracked in git
- No confusion about which workflow is active
- Easier to reference in documentation
- Simpler deployment and activation

## Core Architecture (v2.0)

### Workflow Sequence
```
1. Load Context Manifest (deterministic)
2. Split Sources
3. Read + Normalize + Validate (combined)
4. Merge All Contexts
5. Pre-Model Guardrails (token limits, sanitization)
6. Claude Generate (single API call)
7. Hard Validator (BEFORE branching - fail fast)
8. Branch By Status (approved vs needs-revision)
9. Normalize (unified function)
10. Write Files (versioned paths)
```

### Critical Principles
1. **Determinism**: Hardcoded manifest prevents drift
2. **Validation Sequence**: Validate BEFORE branching to storage
3. **Batching Position**: Merge ALL contexts first, then single model call
4. **Unified Normalization**: Same code for both branches
5. **Versioning**: Every post has `v{manifest_version}-{run_id}-{post_index}`
6. **Cadence Separation**: Bi-weekly archive vs daily active generation

## Brand Voice & Standards

### Core Values
- **Measurable**: Every claim backed by data or labeled "anecdotal"
- **Transparent**: Clear guardrails, documented decisions
- **Human-centered**: AI assists, doesn't replace judgment
- **Iterative**: Start small, measure early, improve continuously

### Tone
- Professional yet approachable
- Evidence-based (no hype)
- Builder-focused (makers talking to makers)
- Pragmatic (results over promises)

### Forbidden Words (NEVER USE)
- "revolutionary" / "game-changing" / "disruptive"
- "transform your [business/workflow/etc]"
- "paradigm shift" / "synergy"
- "industry-leading" (company is 3 months old)
- "proven track record" (only 2 client testimonials)
- "years of experience" (founded July 2025)

### Content Standards
- **Length**: 120-180 words
- **Hashtags**: Exactly 4 (2 broad + 2 niche)
- **Emojis**: Maximum 2
- **Structure**: Hook → Insight → Example → Takeaway → CTA
- **Validation**: Minimum quality score 70/100

## Verified Proof Points (USE THESE)

### Technical Achievements
- 20 documented agentic patterns (public GitHub)
- 6 GitHub repositories (all public)
- 32 commits on work hours automation
- Hexagonal architecture implementation
- Production Docker deployments
- Multi-format reporting (Excel, PDF, HTML, JSON)

### Business Achievements
- 2 B2B clients with testimonials (WPG Software, WPG Amenities)
- Client quote: "Professional, fast, and innovative" (WPG Amenities)
- Client quote: "Great collaboration with tangible results" (WPG Software)
- 3 AI courses on LMS
- Founded July 22, 2025 (3 months old)

### Team Achievements
- **Ivan Weiss**: NASA Space Apps Challenge 2023 winner (Galactic Problem Solver)
- **Ivan Weiss**: 4.2/5.0 GPA, Computer Science Engineering student
- **Kyrian Weiss**: Working at AI-native company
- **Jonathan Verdun**: CTO, Computer Science Engineering student
- Multiple certifications (AI, Selenium, Microsoft, Hexawise)

## Content Generation Rules

### Content Distribution
- **60% Services Focus**: Custom AI, automation, real client work
- **40% Educational Focus**: Agentic patterns, tutorials, lessons learned

### Variation Types
- **service-showcase**: Highlight specific offering (15%)
- **tool-tutorial**: Teach how to use/build something (25%)
- **concept-explained**: Demystify technical concept (20%)
- **case-study**: Real project or client story (10%)
- **how-to**: Step-by-step guide or framework (10%)

### Validation Requirements
Every post must include:
1. **Specific proof point** (commits, testimonials, numbers)
2. **Clear value** (what reader learns or gains)
3. **Honest framing** (no exaggeration or hype)
4. **Actionable insight** (reader can apply something)

### Quality Scoring (min 70/100)
- **Authenticity** (30 pts): Verifiable claims, no forbidden words
- **Clarity** (25 pts): Jargon-free, specific examples, active voice
- **Value** (25 pts): Actionable insight, teaches something
- **Format** (20 pts): Proper structure, word count, hashtags

## Context Manifest (v2.0.0)

All content sources are defined in `context/manifest.json`:

### Required Sources (priority 1)
- `context/services/custom-ai.md` - Custom AI solutions
- `context/services/automation.md` - Automation capabilities
- `context/brand/voice.md` - Brand voice guidelines
- `context/brand/rules.md` - Content rules and constraints

### Generation Config
```json
{
  "variations_per_batch": 5,
  "word_count_min": 120,
  "word_count_max": 180,
  "hashtag_count": 4,
  "emoji_max": 2,
  "forbidden_words": ["revolutionary", "game-changing", "disruptive", ...]
}
```

## Workflow Operations

### Daily Generation
- **Workflow**: `content-generator-daily.json`
- **Schedule**: Every day at 9 AM
- **Output**: `generated-posts/batch-YYYYMMDD/`

### Bi-Weekly Archive
- **Workflow**: `content-generator-linkedin.json`
- **Schedule**: Every 2 weeks
- **Purpose**: Archive/batch cycle

### Post Versioning
```
Format: v{manifest_version}-{run_id}-{post_index}
Example: v2.0.0-20250106-0
```

## File Naming Convention

```
{YYYY-MM-DD}-{variation}-v{version}.md

Examples:
- 2025-11-07-service-showcase-v2.0.0-20251107-0.md
- 2025-11-07-tool-tutorial-v2.0.0-20251107-1.md
```

## Common Tasks

### Adding New Context
1. Create markdown file in appropriate `context/` subdirectory
2. Add entry to `context/manifest.json`
3. Increment `manifest.version`
4. All future runs will use new context

### Modifying Content Rules
1. Edit `context/brand/rules.md` for content constraints
2. Edit `context/brand/voice.md` for tone guidelines
3. Update `context/manifest.json` version
4. Test generation with new rules

### Reviewing Generated Posts
1. Check `generated-posts/batch-YYYYMMDD/approved/`
2. Verify quality score ≥ 70
3. Check for forbidden words
4. Validate proof points are accurate
5. Confirm company correlation is clear

### Publishing Posts
1. Select approved posts from batch
2. Review against `QUALITY_CHECKLIST.md`
3. Copy to LinkedIn (manual posting)
4. Track engagement in post metadata
5. Archive published posts

## Integration Points

### n8n Workflows
- **Trigger**: Schedule or manual execution
- **Context Loading**: Reads `manifest.json` for source list
- **Claude API**: Single call with merged context
- **Validation**: Hard validator before storage
- **Output**: Markdown files with frontmatter

### Claude API
- **Model**: Specified in workflow configuration
- **Prompt**: Structured system prompt with JSON schema
- **Context**: Full merged context from manifest sources
- **Output**: JSON with variation, hook, body, CTA, hashtags

## Governance & Quality

### Provenance Tracking
Every post includes:
- Manifest version
- Run ID (date-based)
- Generation timestamp
- Validation results
- Quality score

### Error Handling
- **Pre-Model Guardrails**: Prevent bad input
- **Hard Validator**: Block invalid output before storage
- **Fail Fast**: Throw errors immediately, no silent failures

### Success Metrics
- **Approval Rate**: Target 80%+ posts with quality ≥ 70
- **Company Correlation**: 100% posts mention verified work
- **Zero Fake Metrics**: All claims verifiable or labeled
- **Educational Value**: Clear takeaway in every post

## Key Files to Reference

### Brand & Standards
- `brand-docs/BRAND_BRIEF.md` - Complete brand guide
- `brand-docs/QUALITY_CHECKLIST.md` - Pre-publish criteria
- `context/brand/voice.md` - Tone and style
- `context/brand/rules.md` - Hard constraints

### Architecture
- `WORKFLOW_ARCHITECTURE.md` - Complete v2.0 architecture
- `CLAUDE_ACTION_PLAN.md` - Implementation plan
- `workflows/*.json` - n8n automation definitions

### Context
- `context/manifest.json` - Source of truth for all inputs
- `context/README.md` - How to add context
- `context/ACCURATE_COMPANY_CONTEXT.md` - Verified facts

### Guides
- `guides/01-GETTING_STARTED.md` - Setup instructions
- `guides/02-ADDING_CONTEXT.md` - Context documentation
- `guides/03-RUNNING_GENERATOR.md` - Execution guide
- `guides/04-REVIEWING_POSTS.md` - Quality review
- `guides/05-PUBLISHING.md` - Publishing workflow

## Important Notes

### What This System Does
- Generates structured LinkedIn posts from verified context
- Validates all content against strict quality criteria
- Tracks full provenance for governance
- Maintains brand voice consistency
- Prevents fake metrics and hype language

### What This System Does NOT Do
- Automatically publish to LinkedIn (manual publishing required)
- Generate content outside defined context
- Make unverifiable claims
- Use hype or buzzwords
- Exaggerate company achievements

### Philosophy
"No hype, no fake metrics. Evidence-based content that teaches while showcasing real work. Small agents, big impact."

## Getting Help

### For Content Issues
- Review `brand-docs/QUALITY_CHECKLIST.md`
- Check forbidden words in `context/brand/rules.md`
- Verify proof points in context files

### For Technical Issues
- Review workflow execution logs in n8n
- Check `context/manifest.json` for correct paths
- Validate context files are readable
- Verify Claude API credentials

### For Architecture Questions
- See `WORKFLOW_ARCHITECTURE.md` for full system design
- See `CLAUDE_ACTION_PLAN.md` for implementation details

---

**Last Updated**: 2025-11-07
**Manifest Version**: 2.0.0
**System Status**: Active - Daily generation enabled
