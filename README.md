# AI-Whisperers Content Generator

**Transform your work into LinkedIn content automatically**

**Version:** 2.0
**Status:** Production Ready
**Last Updated:** 2025-11-05

---

## What This Does

Turns your **GitHub repositories, projects, and team info** into **100 structured LinkedIn posts** using AI.

### The Workflow

```
📝 Document repos       ⚙️ Run AI generator      ✅ Review & approve      📱 Publish to LinkedIn
(30 min each)    →     (5 min automated)    →    (30-45 min batch)   →    (5 min per post)
```

**Result:** 20-30 approved posts = 6-10 weeks of LinkedIn content

---

## Quick Start (5 Minutes)

### 1. Read the Getting Started Guide

```bash
open guides/01-GETTING_STARTED.md
```

**Learn:**
- How the system works
- What you need to prepare
- Expected timeline and results

---

### 2. Document Your First Repository

**Pick one from Priority 1:**
- meeting-ai-agent
- analysis-engine
- claude-portable-improving-system
- audio-to-text
- chatbot-rag-rbac
- customer-feedback-app

**Use template:**
```bash
cp context/repos/_TEMPLATE.md context/repos/repo-meeting-ai-agent.md
# Fill in the template (30-40 minutes)
```

**See:** `guides/02-ADDING_CONTEXT.md` for detailed instructions

---

### 3. Run the Generator (When You Have 3-5 Repos Documented)

**Execute n8n workflow:**
- Import `workflows/content-generator-linkedin.json` to n8n
- Configure credentials (Claude API + SMTP)
- Execute workflow manually
- Wait 5-15 minutes

**Output:** ~15-25 posts generated automatically

**See:** `guides/03-RUNNING_GENERATOR.md` for step-by-step instructions

---

### 4. Review & Approve Posts

**Review generated posts:**
```bash
cd generated-posts/batch-YYYYMMDD/approved/
```

**Approve 6-10 best posts** (30-45 min review time)

**See:** `guides/04-REVIEWING_POSTS.md` for quality checklist

---

### 5. Publish to LinkedIn

**Schedule:** 3 posts/week (Mon/Wed/Fri at 9-10 AM)

**Process:**
1. Copy post content
2. Paste to LinkedIn
3. Publish
4. Engage with comments for 1 hour

**See:** `guides/05-PUBLISHING.md` for publishing workflow

---

## Repository Structure

```
contentCreator/
│
├── 📖 README.md (you are here)
│
├── 📥 INPUT
│   ├── context/                    # Document your work here
│   │   ├── repos/ (_TEMPLATE.md)  # GitHub repositories
│   │   ├── projects/ (_TEMPLATE.md)  # Case studies
│   │   ├── team/ (_TEMPLATE.md)   # Team member profiles
│   │   └── pages/ (_TEMPLATE.md)  # LinkedIn pages
│   │
│   └── brand-docs/                 # Brand guidelines
│       ├── BRAND_BRIEF.md
│       ├── QUALITY_CHECKLIST.md
│       └── PUBLISHING_WORKFLOW.md
│
├── ⚙️ AUTOMATION
│   └── workflows/                  # n8n content generator
│       └── content-generator-linkedin.json
│
├── 📤 OUTPUT
│   ├── generated-posts/            # AI-generated content
│   │   └── batch-YYYYMMDD/
│   │       ├── approved/
│   │       ├── needs-revision/
│   │       └── rejected/
│   │
│   └── approved-posts/             # Ready to publish
│       └── YYYY-MM/
│
├── 📚 GUIDES (Start here!)
│   ├── 01-GETTING_STARTED.md      # System overview
│   ├── 02-ADDING_CONTEXT.md       # Document repositories
│   ├── 03-RUNNING_GENERATOR.md    # Execute workflow
│   ├── 04-REVIEWING_POSTS.md      # Quality review
│   ├── 05-PUBLISHING.md           # Post to LinkedIn
│   └── CONTENT_PRIORITY_REPOS.md  # Which repos to document
│
├── 📊 REFERENCE
│   ├── strategy/                   # Strategy documents
│   ├── archive/                    # Historical docs
│   └── REPOSITORY_LIST.md         # All 25 AI-Whisperers repos
│
└── 📋 PROJECT_STATUS.md           # Current state snapshot
```

---

## Current Status

### ✅ What's Complete

- **System:** Fully designed and documented
- **Workflows:** n8n content generator ready
- **Brand Guidelines:** Complete brand brief
- **Templates:** Context file templates for all types
- **Guides:** 5 step-by-step guides written
- **Structure:** Clean, organized repository

### 📝 Context Files (16 total)

**Repositories (3):**
- agentic-schemas
- company-information
- work-hours-automated-reports

**Projects (2):**
- wpg-amenities
- wpg-software

**Team (3):**
- kyrian-weiss
- ivan-weiss
- jonathan-verdun

**Other (8):**
- LinkedIn profiles, company info, events, webpage

**Content Pipeline:** 2-3 weeks (need more repos documented!)

---

### ⏳ Next Actions

**Priority 1: Document 6 More Repos** (This Week)
1. meeting-ai-agent
2. analysis-engine
3. claude-portable-improving-system
4. audio-to-text
5. chatbot-rag-rbac
6. customer-feedback-app

**See:** `guides/CONTENT_PRIORITY_REPOS.md` for why these repos

**Time investment:** 3-4 hours total
**Result:** 2-3 months of content pipeline

---

**Priority 2: Run Content Generator** (After documenting 3+ repos)
- Import workflow to n8n
- Configure credentials
- Execute and review
- Approve 6-10 posts

**See:** `guides/03-RUNNING_GENERATOR.md`

---

**Priority 3: Start Publishing** (Next Week)
- Schedule first 3 posts
- Publish Mon/Wed/Fri
- Engage with audience
- Track metrics

**See:** `guides/05-PUBLISHING.md`

---

## Success Metrics

### Week 1
- [ ] 3 new repos documented
- [ ] Workflow executed successfully
- [ ] 5-8 posts approved
- [ ] Publishing calendar created

### Month 1
- [ ] 6 Priority 1 repos documented
- [ ] 12 posts published (3/week)
- [ ] Engagement rate >2%
- [ ] 20-40 new followers

### Month 3
- [ ] 12 repos documented
- [ ] 36 posts published
- [ ] Engagement trending up
- [ ] 100-150 new followers
- [ ] 1-2 inbound leads

---

## Key Documents

### Essential Reading (In Order)
1. **This README** - Overview and quick start
2. **guides/01-GETTING_STARTED.md** - Detailed system intro
3. **guides/02-ADDING_CONTEXT.md** - How to document repos
4. **guides/CONTENT_PRIORITY_REPOS.md** - Which repos to document first

### Reference Materials
- **brand-docs/BRAND_BRIEF.md** - Voice, tone, values
- **workflows/README.md** - n8n workflow setup
- **reference/REPOSITORY_LIST.md** - All 25 AI-Whisperers repos

### Status & Planning
- **PROJECT_STATUS.md** - Current snapshot
- **reference/strategy/** - Strategy documents

---

## Support

### Getting Help

**Documentation:**
- Check `guides/` for how-to instructions
- See `reference/` for background info
- Review `workflows/README.md` for technical setup

**Common Issues:**
- Workflow not importing: Try `website-uptime-monitor-simple.json` first
- Low approval rate: Enhance context files with more specifics
- No posts generated: Check context files exist and are readable

---

## Philosophy

**This system is designed to be:**

✅ **Sustainable** - 3-4 hours/week, not 20+
✅ **Measurable** - Track what works, improve over time
✅ **Quality-first** - Generate volume, curate excellence
✅ **Authentic** - Your work, your voice, AI-assisted

**Not:**
- ❌ Full automation (AI generates, you curate)
- ❌ Generic content (based on YOUR actual work)
- ❌ Hype-driven (metrics and honesty)

---

## The Vision

**30 days from now:**
- 12 posts published
- Consistent 3/week cadence
- Growing engaged audience
- Content pipeline = 4-6 weeks ahead
- You spend 3-4 hours/week total

**90 days from now:**
- 36 posts published
- Strong engagement patterns identified
- 100-150 new followers
- Inbound opportunities emerging
- System runs smoothly with minimal effort

---

## Get Started Now

### Next 60 Minutes

1. **Read:** `guides/01-GETTING_STARTED.md` (10 min)
2. **Read:** `guides/CONTENT_PRIORITY_REPOS.md` (5 min)
3. **Pick:** Your first Priority 1 repo (2 min)
4. **Copy:** `context/repos/_TEMPLATE.md` (1 min)
5. **Document:** Fill in the template (40 min)

**Result:** First context file complete, ready to generate content!

---

## Contact

**Project:** AI-Whisperers Content Generator
**Owners:** Kyrian Weiss & Ivan Weiss
**Company:** AI-Whisperers
**LinkedIn:** https://www.linkedin.com/company/109482114/

---

**Start with Guide 01 → Document 3 repos → Run generator → Publish first posts → Track performance → Scale smart** 🚀
