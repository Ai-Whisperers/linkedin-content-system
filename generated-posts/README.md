# Generated Posts - AI-Whisperers

**Purpose:** Storage for all generated post batches

---

## Overview

This directory contains batches of 100 auto-generated LinkedIn posts based on context from `context/` directory.

Each batch is generated from:
- LinkedIn pages (`context/pages/`)
- Repositories (`context/repos/`)
- Projects & case studies (`context/projects/`)
- Team profiles (`context/team/`)

---

## Directory Structure

```
generated-posts/
├── batch-001/              # First batch (100 posts)
│   ├── 001-050/           # Posts 1-50
│   ├── 051-100/           # Posts 51-100
│   ├── BATCH_SUMMARY.md   # Overview of all posts in batch
│   └── FILTER_REPORT.md   # Quality filter results
├── batch-002/              # Second batch (future)
├── batch-003/              # Third batch (future)
└── README.md               # This file
```

---

## Batch Naming Convention

**Batch Folder:** `batch-XXX` (zero-padded, e.g., batch-001, batch-002)

**Post Files:** `XXX-[type]-[topic-slug].md`

Examples:
- `001-how-to-build-triage-agent.md`
- `002-case-study-repo-health-monitoring.md`
- `003-opinion-ai-sop-theater.md`
- `004-framework-trust-layers.md`
- `005-carousel-agentized-triage.md`

---

## Batch Contents

### Per Batch (100 Posts)

**Content Type Distribution:**
- 25 How-To Posts (practical guides)
- 25 Case Study Posts (results + metrics)
- 25 Opinion Posts (contrarian takes)
- 15 Framework Posts (reusable models)
- 10 Carousel Outlines (visual storytelling)

**Audience Distribution:**
- 35 posts → Operations Managers
- 35 posts → DevOps/Engineering Leads
- 30 posts → Founders/CTOs

**Channel Distribution:**
- 70 posts → Personal-style page (casual)
- 30 posts → Company page (professional)

**Leader Voice Distribution:**
- 50 posts → Kyrian (Operations)
- 30 posts → Ivan (DevOps)
- 20 posts → Jonathan (Architecture)

---

## Batch Files

### BATCH_SUMMARY.md

Contains:
- Batch metadata (date generated, context sources used)
- List of all 100 posts with:
  - Post number
  - Title/topic
  - Content type
  - Target audience
  - Channel
  - Leader voice
  - Key metrics mentioned
- Generation statistics

### FILTER_REPORT.md

Contains:
- Quality filter results (after manual review)
- Posts tagged: APPROVED / NEEDS_REVISION / REJECTED
- Approval rate (% approved)
- Common issues found
- Recommendations for next batch

### Individual Post Files

Each post includes:
- Full metadata (from POST_TEMPLATE.md)
- Complete post text (120-180 words)
- Hashtags and formatting
- Quality checklist auto-check results
- Engagement strategy notes
- Follow-up content ideas

---

## Generation Log

| Batch | Date Generated | Context Files Used | Posts Generated | Approved | Rejected |
|-------|----------------|-------------------|-----------------|----------|----------|
| 001   | [Pending]      | [Pending]         | 0               | 0        | 0        |

---

## Workflow

### 1. Generate Batch

**Trigger:** You have 10+ context files ready

**Process:**
- System reads all context files
- Generates 100 posts following templates
- Outputs to `generated-posts/batch-XXX/`
- Creates BATCH_SUMMARY.md

**Output:** 100 structured posts + summary

---

### 2. Review & Filter

**Process:**
- Read BATCH_SUMMARY.md for overview
- Review each post individually
- Tag with: APPROVED / NEEDS_REVISION / REJECTED
- Update FILTER_REPORT.md

**Expected Approval Rate:** 20-30% (20-30 posts)

---

### 3. Revise & Approve

**Process:**
- Edit posts tagged NEEDS_REVISION
- Re-check against QUALITY_CHECKLIST.md
- Move to APPROVED status

**Goal:** 20-30 publish-ready posts per batch

---

### 4. Move to Publishing Queue

**Process:**
- Copy approved posts to `approved-posts/YYYY-MM/`
- Assign publish dates
- Add to content calendar

**Frequency:** 3-4 posts per week = 12-16 posts per month

**Result:** 1 batch (20-30 approved posts) lasts 6-8 weeks

---

## Quality Standards

### Auto-Checks (Applied During Generation)

Every post is automatically verified for:
- ✓ Length: 120-180 words
- ✓ Structure: Hook → Insight → Example → Takeaway → CTA
- ✓ Hashtags: Exactly 4 (2 broad + 2 niche)
- ✓ Emojis: Maximum 2
- ✓ No buzzwords
- ✓ Metrics format correct

### Manual Checks (You Apply During Review)

Review each post for:
- ✓ Value to reader
- ✓ Authentic voice
- ✓ Accurate metrics
- ✓ Audience relevance
- ✓ Actionable takeaway

---

## Post Status Definitions

**APPROVED**
- Ready to publish immediately
- Passes all quality checks
- No edits needed

**NEEDS_REVISION**
- Good concept, weak execution
- Requires minor edits
- Will be approved after revision

**REJECTED**
- Does not meet quality standards
- Off-brand or inaccurate
- Will not be published

---

## Best Practices

### During Review

1. **Read BATCH_SUMMARY.md first** - Get overview before diving into individual posts
2. **Review in batches of 20** - Don't try to review all 100 at once
3. **Use QUALITY_CHECKLIST.md** - Consistent evaluation criteria
4. **Mark as you go** - Tag posts immediately (don't defer decisions)
5. **Take notes** - Document common issues for next batch

### After Review

1. **Update FILTER_REPORT.md** - Record approval rate and findings
2. **Move approved posts** - Copy to `approved-posts/` immediately
3. **Archive rejected posts** - Keep for reference but remove from active queue
4. **Revise "needs revision"** - Edit and move to approved
5. **Analyze patterns** - What types of posts perform best? What fails?

---

## Expected Timeline

**Batch Generation:** Instant (automated)

**Batch Review:** 2-3 hours (manual)
- 100 posts × 1-2 minutes each = 100-200 minutes

**Batch Revision:** 1-2 hours (manual)
- 20-30 posts needing edits × 3-5 minutes each

**Total Time per Batch:** 3-5 hours (one-time investment)

**Publishing from Batch:** 6-8 weeks
- 20-30 approved posts ÷ 3-4 posts/week = 5-7 weeks

---

## Next Steps

### To Generate Your First Batch:

1. **Add context** - Create 10+ files in `context/`
2. **Review templates** - Ensure POST_TEMPLATE.md is up to date
3. **Trigger generation** - Run content generation process
4. **Review BATCH_SUMMARY.md** - Understand what was generated
5. **Filter posts** - Tag APPROVED / NEEDS_REVISION / REJECTED
6. **Complete FILTER_REPORT.md** - Document results
7. **Move approved posts** - Copy to `approved-posts/`

### After First Batch:

1. **Monitor performance** - Track engagement on published posts
2. **Identify patterns** - What content types perform best?
3. **Update context** - Add new projects, repos, learnings
4. **Generate next batch** - When you're down to 5-10 approved posts remaining

---

## Archive Policy

**Keep:**
- All BATCH_SUMMARY.md files (permanent record)
- All FILTER_REPORT.md files (learning)
- All APPROVED posts (publishing queue)

**Archive after 6 months:**
- REJECTED posts (move to archive folder)
- NEEDS_REVISION posts that weren't revised

**Delete never:**
- Don't delete any generated content (storage is cheap, regeneration is expensive)

---

## Questions

**How long does one batch last?**
6-8 weeks (if publishing 3-4 posts/week)

**When should I generate the next batch?**
When you have fewer than 10 approved posts remaining, or when you have significant new context to add.

**Can I regenerate a batch if I don't like it?**
Yes, but better to just filter and approve the good ones. Even a "bad" batch usually has 20-30 usable posts.

**What if I approve too many posts?**
Great problem to have! You'll have a longer publishing runway. Adjust your posting frequency (e.g., 4-5 posts/week instead of 3-4).

**What if I approve too few posts?**
Add more context and generate a new batch. Or lower your standards slightly (but never below QUALITY_CHECKLIST.md minimums).

---

**Last Updated:** 2025-10-21
**Version:** 1.0
**Status:** Ready for first batch
