# Context Repository - AI-Whisperers Content Creator

**Purpose:** Central repository of all context used to generate marketing content

---

## Directory Structure

```
context/
├── pages/          # LinkedIn pages, social profiles, bios
├── repos/          # Other GitHub repositories and codebases
├── projects/       # Active projects, case studies, pilots
├── team/           # Team members, roles, expertise
└── README.md       # This file
```

---

## How to Add Context

### 1. LinkedIn Pages (`context/pages/`)

Create a file for each LinkedIn page or social profile:

**Template: `page-[name].md`**

```markdown
# [Page Name]

**URL:** https://www.linkedin.com/...
**Type:** [Personal Profile / Company Page / Personal-Style Company Profile]
**Status:** [Active / Draft / Archived]

## Current Bio/About

[Copy full bio/about section]

## Recent Posts (Last 5)

### Post 1
**Date:** YYYY-MM-DD
**Content:**
[Full post text]
**Performance:** X likes, Y comments, Z shares

[Repeat for 5 posts]

## Key Messaging

- Bullet points of core themes
- Recurring topics
- Unique angles

## Notes

- Any specific observations
- Content gaps
- Opportunities
```

---

### 2. Other Repositories (`context/repos/`)

Create a file for each relevant repository:

**Template: `repo-[name].md`**

```markdown
# Repository: [Name]

**URL:** https://github.com/...
**Status:** [Active / Archived / In Development]
**Primary Language:** [JavaScript / Python / etc.]

## Purpose

[What does this repo do?]

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Technical Highlights

[Interesting technical decisions, architecture, patterns]

## Content Opportunities

- What blog posts could we write?
- What case studies does this enable?
- What proof points does it provide?

## Metrics/Results

- [Any measurable outcomes]
- [Performance data]
- [User feedback]

## Notes

[Additional context]
```

---

### 3. Projects & Case Studies (`context/projects/`)

Create a file for each project or client engagement:

**Template: `project-[name].md`**

```markdown
# Project: [Name]

**Client/Context:** [Company name or internal project]
**Date:** [Start - End or Ongoing]
**Status:** [Pilot / Production / Completed / On Hold]

## Problem Statement

[What problem were you solving?]

## Solution

[What did you build/implement?]

## Technical Details

- Architecture: [Multi-agent / Single agent / Other]
- Tools/Stack: [Playwright, OpenAI, etc.]
- Integration: [How does it fit into existing systems?]

## Results/Metrics

- **Metric 1:** X% improvement in Y
- **Metric 2:** Saved Z hours/week
- **Metric 3:** [Other measurable outcomes]

**Validation Status:** [Validated / Pilot Data / Anecdotal]

## Lessons Learned

- What worked well
- What didn't work
- What would you do differently

## Content Angles

- How-to posts we could write
- Case studies we could publish
- Frameworks we could share
- Opinions/insights this project sparked

## Quotes/Soundbites

- [Memorable phrases from team discussions]
- [Client feedback quotes]
- [Aha moments]

## Notes

[Additional context]
```

---

### 4. Team Members (`context/team/`)

Create a file for each team member:

**Template: `team-[name].md`**

```markdown
# Team Member: [Name]

**Role:** [Co-Founder / CTO / Engineer / etc.]
**LinkedIn:** https://www.linkedin.com/in/...
**Primary Focus:** [Operations / DevOps / Architecture / etc.]

## Expertise

- Area 1
- Area 2
- Area 3

## Target Audiences

- Audience 1 (e.g., Operations Managers)
- Audience 2 (e.g., DevOps Leads)

## Topics to Cover

- Topic 1
- Topic 2
- Topic 3

## Personal Story/Angle

[Unique perspective, origin story, key philosophy]

## Key Quote/Philosophy

"[Memorable quote]"

## Recent Work

- Project 1
- Project 2
- Project 3

## Content Ideas

- Posts they should write
- Topics they're passionate about
- Frameworks they've developed

## Notes

[Additional context]
```

---

## How Context Gets Used

### Content Generation Flow

```
[Context Files]
    ↓
[Content Generator]
    ↓
[100 Structured Posts in generated-posts/]
    ↓
[Quality Filter - Manual Review]
    ↓
[Approved Posts → Publishing Queue]
```

### What Gets Generated

From your context, the system will generate:

- **25 How-To Posts** (practical guides)
- **25 Case Study Posts** (results + metrics)
- **25 Opinion Posts** (contrarian takes, insights)
- **15 Framework Posts** (reusable models)
- **10 Carousel Outlines** (visual storytelling)

All following:
- `POST_TEMPLATE.md` structure
- `QUALITY_CHECKLIST.md` standards
- `BRAND_BRIEF.md` voice and tone

---

## Getting Started

### Step 1: Add LinkedIn Page Context

```bash
# Create file for each LinkedIn page
context/pages/page-ai-whisperers-personal-style.md
context/pages/page-ai-whisperers-company.md
context/pages/page-kyrian-weiss.md
context/pages/page-ivan-weiss.md
context/pages/page-jonathan-verdun.md
```

### Step 2: Add Repository Context

```bash
# Create file for each relevant repo
context/repos/repo-[your-repo-name].md
```

### Step 3: Add Project Context

```bash
# Create file for each project/case study
context/projects/project-ticket-triage-agent.md
context/projects/project-repo-health-monitor.md
context/projects/project-[other].md
```

### Step 4: Add Team Context

```bash
# Create file for each team member
context/team/team-kyrian-weiss.md
context/team/team-ivan-weiss.md
context/team/team-jonathan-verdun.md
```

---

## Best Practices

1. **Be Specific:** Include exact metrics, dates, and technical details
2. **Update Regularly:** Add new projects, posts, and learnings as they happen
3. **Link Related Context:** Reference other context files when relevant
4. **Mark Validation Status:** Always note if metrics are validated vs. anecdotal
5. **Capture Quotes:** Save memorable phrases and soundbites for posts
6. **Document Lessons:** Both successes and failures are valuable content

---

## Context File Checklist

Before generating posts, ensure you have:

- [ ] All LinkedIn page bios and recent posts documented
- [ ] At least 3-5 repositories documented
- [ ] At least 3-5 projects/case studies documented
- [ ] All team members documented
- [ ] Key metrics validated and marked
- [ ] Lessons learned captured
- [ ] Content angles identified

---

## Questions?

This context repository will be the foundation for generating 100+ high-quality posts. The more detailed and comprehensive your context, the better the generated content will be.

**Next Steps:**
1. Start adding context files using the templates above
2. Review existing drafts for context that should be extracted
3. Run content generation once you have 10+ context files
4. Review and filter generated posts through quality checklist

---

**Last Updated:** 2025-10-21
**Version:** 1.0
