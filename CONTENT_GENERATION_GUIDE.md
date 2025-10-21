# Content Generation Guide - AI-Whisperers

**Purpose:** Transform context into 100 structured LinkedIn posts for manual quality filtering

---

## Overview

This repository is now a **content generation engine** that:

1. **Collects comprehensive context** about AI-Whisperers
2. **Generates 100 structured posts** following brand standards
3. **Enables manual quality filtering** to select the best content
4. **Outputs publish-ready posts** for your LinkedIn pages

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTEXT LAYER                           │
│  context/pages/   context/repos/   context/projects/        │
│  context/team/                                              │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  GENERATION LAYER                           │
│  - 100 posts following POST_TEMPLATE.md                    │
│  - Mixed content types (how-to, case study, opinion, etc.) │
│  - Targeted to different audiences                         │
│  - Auto-tagged with metadata                               │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   QUALITY FILTER LAYER                      │
│  - Manual review against QUALITY_CHECKLIST.md              │
│  - Flag posts: APPROVED / NEEDS_REVISION / REJECTED        │
│  - Select 20-30 posts for publishing queue                 │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   PUBLISHING QUEUE                          │
│  - Approved posts ready for LinkedIn                       │
│  - Scheduled with dates and channels                       │
│  - Engagement tracking prepared                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
contentCreator/
│
├── context/                       # Input: All context files
│   ├── pages/                     # LinkedIn pages, bios, posts
│   ├── repos/                     # GitHub repositories
│   ├── projects/                  # Case studies, pilots
│   ├── team/                      # Team member profiles
│   └── README.md                  # How to add context
│
├── generated-posts/               # Output: Generated content
│   ├── batch-001/                 # First 100 posts
│   │   ├── 001-100 .md files     # Individual posts
│   │   ├── BATCH_SUMMARY.md      # Overview of batch
│   │   └── FILTER_REPORT.md      # Quality filter results
│   ├── batch-002/                 # Next 100 posts (future)
│   └── README.md                  # Generation log
│
├── approved-posts/                # Filtered: Ready to publish
│   ├── 2025-10/                   # By month
│   ├── 2025-11/
│   └── README.md                  # Publishing schedule
│
├── drafts/                        # Manual drafts (legacy)
│   ├── POST_TEMPLATE.md           # Template for all posts
│   ├── COMPANY_PAGE_POST_TEMPLATES.md
│   └── posts/                     # Manual drafts
│
├── brand-docs/                    # Brand standards
│   ├── BRAND_BRIEF.md             # Voice, tone, positioning
│   ├── QUALITY_CHECKLIST.md       # Quality standards
│   └── PUBLISHING_WORKFLOW.md     # Publishing process
│
├── docs/strategy/                 # Strategy documents
│
└── CONTENT_GENERATION_GUIDE.md    # This file
```

---

## Workflow: Context → Posts

### Phase 1: Collect Context (Manual - You do this)

**Goal:** Document everything about AI-Whisperers that could become content

**Tasks:**
1. Add LinkedIn page details to `context/pages/`
2. Document your repositories in `context/repos/`
3. Write up projects and case studies in `context/projects/`
4. Create team member profiles in `context/team/`

**Time Investment:** 2-4 hours (one-time setup)

**Minimum Required Context:**
- 2+ LinkedIn pages documented
- 3+ repositories documented
- 3+ projects/case studies documented
- 3+ team members documented

**See:** `context/README.md` for templates and examples

---

### Phase 2: Generate 100 Posts (Automated - System does this)

**Goal:** Create 100 structured posts from your context

**What Gets Generated:**

| Content Type | Quantity | Target Audience | Examples |
|--------------|----------|-----------------|----------|
| How-To Posts | 25 | Practitioners | "How to build a triage agent in 2 weeks" |
| Case Studies | 25 | Decision-makers | "18% fewer hotfixes with repo-health monitoring" |
| Opinion Posts | 25 | Thought leaders | "Why AI without SOPs is theater" |
| Framework Posts | 15 | All audiences | "4-Lane Triage Model for Support Teams" |
| Carousel Outlines | 10 | Visual learners | "Agentized Ticket Triage in 20 Minutes" |

**Generation Rules:**
- Every post follows `POST_TEMPLATE.md` structure
- Every post passes auto-checks from `QUALITY_CHECKLIST.md`
- Metrics are specific or labeled "anecdotal"
- Tone matches `BRAND_BRIEF.md`
- Posts distributed across audiences and topics

**Output Location:** `generated-posts/batch-001/`

**Time:** Instant (once context is ready)

---

### Phase 3: Filter & Approve (Manual - You do this)

**Goal:** Select 20-30 best posts from the 100 generated

**Process:**

1. **Review `BATCH_SUMMARY.md`** - Overview of all 100 posts
2. **Read each post** - Open individual .md files
3. **Apply quality filter** - Use `QUALITY_CHECKLIST.md`
4. **Tag each post:**
   - `APPROVED` - Ready to publish
   - `NEEDS_REVISION` - Good concept, needs tweaks
   - `REJECTED` - Doesn't meet standards

**Quality Filter Criteria:**

✅ **APPROVED if:**
- Passes all QUALITY_CHECKLIST.md items
- Metrics are specific or labeled clearly
- Tone matches brand voice
- Provides clear value to reader
- Actionable takeaway included

⚠️ **NEEDS_REVISION if:**
- Good concept but weak execution
- Metrics unclear or missing
- Tone slightly off-brand
- CTA too salesy or vague

❌ **REJECTED if:**
- Contains buzzwords (AI magic, revolutionary, etc.)
- Vague claims without proof
- Off-brand voice
- No clear value proposition
- Salesy or unprofessional

**Expected Approval Rate:** 20-30% (20-30 posts from 100)

**Time Investment:** 2-3 hours (thorough review)

---

### Phase 4: Schedule & Publish (Manual - You do this)

**Goal:** Move approved posts to publishing queue with dates

**Process:**

1. Copy approved posts to `approved-posts/YYYY-MM/`
2. Assign publish dates (Monday/Wednesday/Friday)
3. Assign channel (Personal-style page / Company page / Both)
4. Add to publishing calendar
5. Follow `PUBLISHING_WORKFLOW.md` for actual publishing

**Publishing Schedule:**

| Day | Channel | Content Type |
|-----|---------|--------------|
| Monday | Personal-style page | How-To / Educational |
| Wednesday | Personal-style page | Case Study / Metrics |
| Friday | Personal-style page | Carousel / Opinion |
| Every 2 weeks | Company page | Major case study / Framework |

**Time Investment:** 5-10 min per post (scheduling + publishing)

---

## Content Mix Strategy

### Target Distribution (100 Posts)

**By Content Type:**
- 25% How-To (practical guides)
- 25% Case Study (results + metrics)
- 25% Opinion (contrarian takes)
- 15% Framework (reusable models)
- 10% Carousel (visual storytelling)

**By Audience:**
- 35% Operations Managers
- 35% DevOps/Engineering Leads
- 30% Founders/CTOs

**By Proof Point:**
- 40% Ticket Triage Agent (30% handle time reduction)
- 40% Repo Health Monitor (18% fewer hotfixes)
- 20% General automation philosophy

**By Channel:**
- 70% Personal-style page (casual, conversational)
- 30% Company page (professional, authoritative)

**By Leader Voice:**
- 50% Kyrian (Operations focus)
- 30% Ivan (DevOps focus)
- 20% Jonathan (Architecture focus)

---

## Generation Prompts

When generating posts, use these guidelines:

### How-To Posts (25)
**Prompt:**
"Generate a How-To post (120-180 words) that teaches [audience] how to [specific action] using [tool/method]. Include specific steps, timeframes, and one measurable outcome. Follow POST_TEMPLATE.md structure."

**Example Topics:**
- How to build a triage agent in 2 weeks
- How to measure repo health with 3 metrics
- How to document an SOP for automation
- How to set up trust guardrails for AI agents

### Case Study Posts (25)
**Prompt:**
"Generate a Case Study post (120-180 words) about [project] that achieved [metric]. Describe the problem, solution, and results. Include before/after comparison. Follow POST_TEMPLATE.md structure."

**Example Topics:**
- 30% faster ticket resolution with AI triage
- 18% fewer hotfixes with repo health monitoring
- 520 hours saved annually with automated triage
- 6-week deployment of multi-agent system

### Opinion Posts (25)
**Prompt:**
"Generate an Opinion post (120-180 words) with a contrarian take on [topic]. Hook with a provocative question, share insight, provide example, conclude with actionable takeaway. Follow POST_TEMPLATE.md structure."

**Example Topics:**
- Why AI without SOPs is theater
- Why automation should start small, not enterprise-wide
- Why most AI pilots fail (and how to fix it)
- Why transparency matters more than accuracy in AI

### Framework Posts (15)
**Prompt:**
"Generate a Framework post (120-180 words) introducing [framework name] that helps [audience] solve [problem]. Explain the framework components, provide application example, include specific metric. Follow POST_TEMPLATE.md structure."

**Example Topics:**
- 4-Lane Triage Model for Support Teams
- Trust Layers Framework for AI Agents
- SOP-to-Agent Transformation Process
- Repo Health Scoring System

### Carousel Outlines (10)
**Prompt:**
"Generate a Carousel outline (5-7 slides) on [topic] for [audience]. Slide 1: Hook with metric/question. Slides 2-5: Key points with visuals. Slide 6: CTA. Include caption (500 words) following POST_TEMPLATE.md."

**Example Topics:**
- Agentized Ticket Triage in 20 Minutes
- Multi-Agent Architecture Explained
- From Manual to Autonomous: Trust Layers
- Repo Health: 3 Metrics That Matter

---

## Quality Assurance

### Auto-Checks (System Runs These)

Every generated post is automatically checked for:

- ✓ Length: 120-180 words
- ✓ Structure: Hook → Insight → Example → Takeaway → CTA
- ✓ Hashtags: Exactly 4 (2 broad + 2 niche)
- ✓ Emojis: Maximum 2
- ✓ No buzzwords: "AI magic," "revolutionary," "disruptive," "game-changing"
- ✓ Metrics format: Specific number OR "anecdotal" label
- ✓ CTA format: Question or invitation (not salesy)

### Manual Checks (You Run These)

Review each post for:

- ✓ **Value:** Does this teach, inspire, or inform the reader?
- ✓ **Authenticity:** Does this sound like us?
- ✓ **Accuracy:** Are metrics correct and traceable?
- ✓ **Relevance:** Is this timely and audience-appropriate?
- ✓ **Actionability:** Can the reader apply this insight?

---

## Batch Management

### Naming Convention

**Batch Folders:** `batch-XXX` (e.g., batch-001, batch-002)

**Post Files:** `XXX-[content-type]-[topic-slug].md`

Examples:
- `001-how-to-build-triage-agent.md`
- `002-case-study-repo-health-18-percent.md`
- `003-opinion-ai-sop-theater.md`
- `004-framework-4-lane-triage-model.md`
- `005-carousel-ticket-triage-20-minutes.md`

### Batch Tracking

Each batch includes:

- **BATCH_SUMMARY.md** - Overview of all 100 posts with metadata
- **FILTER_REPORT.md** - Quality filter results (approved/revision/rejected)
- **Individual post files** - 100 .md files

---

## Generation Checklist

Before generating a batch of 100 posts:

- [ ] Context documented (pages, repos, projects, team)
- [ ] At least 10 context files created
- [ ] Key metrics validated (30%, 18%, etc.)
- [ ] Brand voice reviewed (BRAND_BRIEF.md)
- [ ] Quality standards reviewed (QUALITY_CHECKLIST.md)
- [ ] Post template reviewed (POST_TEMPLATE.md)
- [ ] Output directory ready (generated-posts/batch-XXX/)

---

## Next Steps

### 1. Start Adding Context (Do This Now)

Create at least **10 context files** using templates in `context/README.md`:

**Priority Context Files:**
1. `context/pages/page-ai-whisperers-personal-style.md` - Main LinkedIn page
2. `context/pages/page-ai-whisperers-company.md` - Company page
3. `context/team/team-kyrian-weiss.md` - Co-founder profile
4. `context/team/team-ivan-weiss.md` - Co-founder profile
5. `context/team/team-jonathan-verdun.md` - CTO profile
6. `context/projects/project-ticket-triage-agent.md` - Main case study
7. `context/projects/project-repo-health-monitor.md` - Second case study
8. `context/repos/repo-[your-main-repo].md` - Your primary repository
9. `context/repos/repo-[second-repo].md` - Another repository
10. `context/repos/repo-[third-repo].md` - Another repository

### 2. Review Existing Drafts for Context

Extract useful context from:
- `drafts/posts/001-how-to-triage-agent.md`
- `drafts/posts/002-case-study-repo-health.md`
- `drafts/posts/003-opinion-ai-sop-theater.md`
- `docs/strategy/*.md`

### 3. Generate First Batch

Once you have 10+ context files, trigger first generation batch.

### 4. Filter & Approve

Review 100 posts, select 20-30 best ones.

### 5. Schedule Publishing

Add approved posts to calendar, start publishing 3-4x per week.

---

## Questions & Support

**How many posts should I generate at once?**
100 posts per batch. Expect to approve 20-30 per batch.

**How often should I generate new batches?**
Generate new batch every 2-3 months, or when you have significant new context (new projects, repos, metrics).

**Can I edit generated posts?**
Yes! Generated posts are starting points. You can (and should) revise before approving.

**What if a post is almost good but needs tweaks?**
Tag it `NEEDS_REVISION`, make edits, then move to `APPROVED`.

**How do I add new context after generating a batch?**
Add new context files anytime. Your next batch will include new content based on updated context.

---

## Success Metrics

**Context Collection (Phase 1):**
- ✓ 10+ context files created
- ✓ Key metrics documented and validated
- ✓ All LinkedIn pages documented
- ✓ All team members documented

**Content Generation (Phase 2):**
- ✓ 100 posts generated
- ✓ All posts follow template structure
- ✓ Mix of content types achieved
- ✓ All audiences covered

**Quality Filtering (Phase 3):**
- ✓ 20-30 posts approved (20-30% approval rate)
- ✓ All approved posts pass quality checklist
- ✓ No buzzwords or vague claims
- ✓ Clear value in every approved post

**Publishing (Phase 4):**
- ✓ 3-4 posts published per week
- ✓ Consistent engagement (3-5% rate)
- ✓ Growing follower base (50-100/month)
- ✓ Inbound leads tracked

---

**Last Updated:** 2025-10-21
**Version:** 1.0
**Status:** Ready for Context Collection
