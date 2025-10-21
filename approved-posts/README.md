# Approved Posts - Publishing Queue

**Purpose:** Storage for approved, publish-ready LinkedIn posts

---

## Overview

This directory contains posts that have:
- ✓ Passed quality filter review
- ✓ Been approved by founder
- ✓ Ready to publish immediately
- ✓ Scheduled with publish dates

---

## Directory Structure

```
approved-posts/
├── 2025-10/           # October 2025 posts
├── 2025-11/           # November 2025 posts
├── 2025-12/           # December 2025 posts
├── 2026-01/           # January 2026 posts
└── README.md          # This file
```

---

## File Naming Convention

**Format:** `YYYY-MM-DD-[type]-[topic-slug].md`

Examples:
- `2025-10-21-how-to-build-triage-agent.md`
- `2025-10-23-case-study-repo-health-18-percent.md`
- `2025-10-25-opinion-ai-sop-theater.md`
- `2025-10-28-framework-4-lane-triage-model.md`
- `2025-10-30-carousel-ticket-triage-20-minutes.md`

---

## Post Metadata

Each approved post includes:

```markdown
# [Post Title]

**Post Number:** XXX
**Scheduled Publish Date:** YYYY-MM-DD
**Day of Week:** Monday/Wednesday/Friday
**Content Type:** How-To / Case Study / Opinion / Framework / Carousel
**Target Audience:** Operations Managers / DevOps Leads / Founders / General
**Channel:** Personal-Style Page / Company Page / Both
**Status:** APPROVED
**Source:** Batch-XXX or Manual Draft

---

## Post Content (120-180 words)

[Full post text here]

---

## Publishing Checklist

- [ ] Founder approved
- [ ] Passes quality checklist
- [ ] Scheduled date assigned
- [ ] Channel assigned
- [ ] Hashtags verified (4 total)
- [ ] Emojis counted (max 2)
- [ ] Metrics validated or labeled
- [ ] CTA is conversational
- [ ] No typos or formatting errors

---

## Engagement Strategy

[How to engage with commenters]

## Follow-up Content Ideas

[Related posts or topics to explore]
```

---

## Publishing Schedule

### Standard Cadence

| Day | Channel | Content Type | Time |
|-----|---------|--------------|------|
| **Monday** | Personal-style page | How-To / Educational | 9:00 AM local |
| **Wednesday** | Personal-style page | Case Study / Metrics | 9:00 AM local |
| **Friday** | Personal-style page | Carousel / Opinion | 9:00 AM local |
| **Bi-weekly** | Company page | Major case study / Framework | 10:00 AM local |

### Posting Frequency

- **Personal-style page:** 3-4 posts/week
- **Company page:** 1-2 posts/week (major content only)
- **Total:** 4-5 posts/week combined

---

## Monthly Organization

### Structure per Month

Each `YYYY-MM/` folder contains:

- **12-16 approved posts** (enough for 1 month at 3-4 posts/week)
- **PUBLISHING_CALENDAR.md** - Calendar view of scheduled posts
- **PERFORMANCE_TRACKER.md** - Engagement metrics for published posts

---

## Publishing Workflow

### 1. Move from Generated Posts

```bash
# Copy approved posts from generated-posts/ to approved-posts/
cp generated-posts/batch-001/XXX-post-name.md approved-posts/2025-10/2025-10-21-post-name.md
```

### 2. Assign Publish Date

- Follow Monday/Wednesday/Friday schedule
- Don't publish two similar topics back-to-back
- Space out case studies vs. how-to posts
- Reserve Friday for high-engagement content (carousels, opinions)

### 3. Verify Quality

- [ ] Founder review completed
- [ ] Quality checklist passed
- [ ] Metadata complete
- [ ] Ready to copy-paste into LinkedIn

### 4. Publish to LinkedIn

- Log in to appropriate LinkedIn page
- Create new post
- Copy-paste content
- Verify formatting
- Upload carousel images (if applicable)
- Publish (or schedule via LinkedIn)

### 5. Track Engagement

- Log URL in `PERFORMANCE_TRACKER.md`
- Monitor comments within 1 hour
- Respond to all comments within 24 hours
- Update metrics 24 hours and 7 days after publishing

---

## Quality Gate

Before a post moves to `approved-posts/`:

### Required Approvals

- ✓ **Quality Checklist** - All items passed
- ✓ **Founder Review** - Kyrian approved
- ✓ **Brand Alignment** - Matches BRAND_BRIEF.md
- ✓ **Metrics Validation** - Numbers traceable or labeled "anecdotal"

### Red Flags (Do Not Approve)

- ❌ Contains buzzwords
- ❌ Vague claims without proof
- ❌ Off-brand tone
- ❌ Salesy language
- ❌ Typos or formatting errors

---

## Publishing Calendar Template

Each month folder includes `PUBLISHING_CALENDAR.md`:

```markdown
# Publishing Calendar - [Month YYYY]

## Week 1

| Date | Day | Channel | Type | Topic | Status |
|------|-----|---------|------|-------|--------|
| 2025-10-21 | Mon | Personal | How-To | Build triage agent | Scheduled |
| 2025-10-23 | Wed | Personal | Case Study | Repo health 18% | Scheduled |
| 2025-10-25 | Fri | Personal | Carousel | Ticket triage | Scheduled |

## Week 2

[...]

## Week 3

[...]

## Week 4

[...]

## Summary

- Total posts scheduled: 12
- Personal-style page: 10
- Company page: 2
- Content mix: 4 how-to, 4 case study, 2 opinion, 2 carousel
```

---

## Performance Tracking Template

Each month folder includes `PERFORMANCE_TRACKER.md`:

```markdown
# Performance Tracker - [Month YYYY]

## Posts Published

| Date | Topic | Channel | Impressions | Likes | Comments | Shares | Engagement Rate |
|------|-------|---------|-------------|-------|----------|--------|-----------------|
| 10-21 | Triage agent | Personal | 1,250 | 42 | 8 | 3 | 4.2% |
| 10-23 | Repo health | Personal | 980 | 35 | 5 | 2 | 4.3% |
| 10-25 | Carousel | Personal | 1,500 | 68 | 12 | 7 | 5.8% |

## Top Performers (by Engagement Rate)

1. [Post topic] - X% engagement
2. [Post topic] - Y% engagement
3. [Post topic] - Z% engagement

## Bottom Performers

1. [Post topic] - X% engagement
2. [Post topic] - Y% engagement

## Insights

- What content types performed best?
- Which audiences engaged most?
- What topics resonated?
- Any trends or patterns?

## Adjustments for Next Month

- [Action item 1]
- [Action item 2]
- [Action item 3]
```

---

## Content Mix Guidelines

### By Content Type (Monthly)

- **How-To:** 30-35% (4-5 posts)
- **Case Study:** 30-35% (4-5 posts)
- **Opinion:** 20-25% (3-4 posts)
- **Framework:** 10-15% (1-2 posts)
- **Carousel:** 10-15% (1-2 posts)

### By Audience (Monthly)

- **Operations Managers:** 35% (4-5 posts)
- **DevOps Leads:** 35% (4-5 posts)
- **Founders/CTOs:** 30% (3-4 posts)

### By Channel (Monthly)

- **Personal-style page:** 75% (9-12 posts)
- **Company page:** 25% (3-4 posts)

---

## Best Practices

### Scheduling

1. **Space out similar topics** - Don't publish 3 how-to posts in a row
2. **Balance metrics vs. philosophy** - Mix case studies with opinion posts
3. **Reserve Friday for high-engagement** - Carousels and controversial opinions
4. **Bi-weekly company posts** - Major announcements only

### Publishing

1. **Publish consistently** - Same days/times each week
2. **Review before posting** - Always check formatting in LinkedIn preview
3. **Engage immediately** - Reply to first comments within 1 hour
4. **Monitor for 48 hours** - Active engagement in first 2 days

### Tracking

1. **Log metrics promptly** - Capture 24-hour and 7-day metrics
2. **Analyze monthly** - Review performance trends
3. **Adjust strategy** - Double down on what works, cut what doesn't
4. **Share learnings** - Update content strategy based on data

---

## Archive Policy

**Keep in approved-posts/ for:**
- Current month + next 2 months (rolling 3-month window)

**Archive after publishing:**
- Move to `published-archive/YYYY/` after 3 months

**Rationale:**
- Keep upcoming posts easily accessible
- Archive published posts for reference
- Reduce clutter in active publishing queue

---

## Next Steps

### To Populate approved-posts/:

1. **Generate first batch** - Create 100 posts in `generated-posts/batch-001/`
2. **Filter and approve** - Select 20-30 best posts
3. **Assign dates** - Schedule posts for next 6-8 weeks
4. **Copy to approved-posts/** - Move to appropriate month folder
5. **Create publishing calendar** - Document schedule
6. **Begin publishing** - Follow schedule and track performance

---

## Current Status

**Posts Approved:** 0
**Posts Scheduled:** 0
**Next Publish Date:** [TBD]

**Publishing Runway:** 0 weeks
- ⚠️ Need to approve posts to start publishing

---

**Last Updated:** 2025-10-21
**Version:** 1.0
**Status:** Ready for approved posts
