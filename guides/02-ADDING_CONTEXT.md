# Guide 02: Adding Context Files

**Time:** 30-40 minutes per repository
**Goal:** Document your repositories to fuel LinkedIn content generation

---

## Quick Start

### Step 1: Choose a Repository

Pick from **Priority 1 list** (highest content value):

1. **meeting-ai-agent** - AI meeting assistant
2. **analysis-engine** - Data analysis automation
3. **claude-portable-improving-system** - Token optimization
4. **audio-to-text** - Free transcription
5. **chatbot-rag-rbac** - Secure RAG chatbot
6. **customer-feedback-app** - Feedback tool

**See:** `guides/CONTENT_PRIORITY_REPOS.md` for full prioritization

---

### Step 2: Copy the Template

```bash
# Navigate to repos folder
cd context/repos/

# Copy template
cp _TEMPLATE.md repo-meeting-ai-agent.md

# Open in your editor
code repo-meeting-ai-agent.md
```

---

### Step 3: Fill in the Template

**Required sections** (must fill):
1. Overview - What problem it solves
2. Key Features - 3-5 main capabilities
3. Tech Stack - Primary technologies
4. Metrics & Results - Numbers and impact

**Optional but valuable**:
5. Challenges & Solutions - Problems you solved
6. Use Cases - Who uses it and why
7. Future Plans - What's next

**Time breakdown:**
- Overview: 5 minutes
- Key Features: 10 minutes
- Tech Stack: 5 minutes
- Metrics: 10 minutes
- Challenges: 10 minutes

**Total: 30-40 minutes**

---

## Tips for Great Context Files

### ✅ Do This

**1. Be Specific with Metrics**
- ❌ "Much faster"
- ✅ "Processes 100K rows in 30 seconds (10x faster)"

**2. Include Real Numbers**
- ❌ "Saves time"
- ✅ "Saves 10 hours/week of manual work"

**3. Tell the Story**
- ❌ "We built a chatbot"
- ✅ "We built a RAG chatbot after clients asked for document search"

**4. Highlight Challenges**
- ❌ "It works great"
- ✅ "We tried 3 different approaches before finding the right architecture"

**5. Connect to Business Impact**
- ❌ "Uses Claude API"
- ✅ "Uses Claude API to reduce token costs by 60% ($500/month savings)"

---

### ❌ Avoid This

**1. Generic Descriptions**
- "This is a great tool that does many things"
- → Be specific about what it does

**2. Too Technical Without Context**
- "Implements async/await with Redis pub/sub"
- → Explain WHY you chose that approach

**3. No Metrics**
- "Users love it"
- → How many users? What engagement rate?

**4. Missing the "Why"**
- "Built with Python and FastAPI"
- → WHY Python? WHY FastAPI? What problem did it solve?

---

## Information Sources

### Where to Get Information

**1. README.md in the repository**
- Copy overview and features
- Extract tech stack
- Find installation/usage instructions

**2. Recent commits**
- Show activity and evolution
- Identify key features added
- Demonstrate ongoing development

**3. Issues & Pull Requests**
- Challenges faced and solved
- User feedback
- Common questions

**4. Your memory**
- Why you built it
- Problems encountered
- Lessons learned
- Client feedback

**5. Analytics (if available)**
- Usage stats
- Performance metrics
- User engagement

---

## Template Sections Explained

### Overview (Required)
**What to write:**
- Name of repository
- Primary programming language
- One-sentence purpose
- Current status (Active/Production/Maintenance)

**Example:**
```
Repository: meeting-ai-agent
Language: TypeScript
Purpose: Provides real-time AI assistance during meetings
Status: Active Development
```

---

### Key Features (Required)
**What to write:**
- 3-5 main capabilities
- What makes it unique
- User-facing benefits

**Example:**
```
1. Real-time transcription - Live speech-to-text during meetings
2. Action item extraction - Automatically identifies tasks and decisions
3. Context awareness - Remembers previous meetings and projects
4. Multi-language support - Works in English and Spanish
```

---

### Tech Stack (Required)
**What to write:**
- Primary language
- Major frameworks/libraries
- Infrastructure/hosting
- Key integrations

**Example:**
```
Primary Language: TypeScript

Key Technologies:
- Next.js - Web framework for real-time UI
- OpenAI Whisper - Speech-to-text transcription
- Claude API - Meeting analysis and summarization

Infrastructure:
- Vercel - Hosting and deployment
- PostgreSQL - Meeting history storage
```

---

### Metrics & Results (Required)
**What to write:**
- Performance numbers (speed, volume, etc.)
- Business impact (time saved, cost reduced)
- User adoption stats

**Example:**
```
Performance:
- Transcribes speech with <2 second latency
- Processes 60-minute meetings in real-time

Business Impact:
- Saves 15 minutes per meeting in note-taking
- Team uses it in 80% of client meetings
- Reduces post-meeting follow-up time by 40%
```

---

### Challenges & Solutions (Highly Recommended)
**What to write:**
- Technical problems you faced
- How you solved them
- Key learnings

**Why important:** Shows expertise and problem-solving ability

**Example:**
```
Challenge 1: Real-time transcription lag
Solution: Implemented streaming WebSocket architecture
Learning: Batch processing isn't appropriate for live meetings

Challenge 2: Accuracy with technical jargon
Solution: Custom vocabulary training for AI/tech terms
Learning: Domain-specific tuning is essential
```

---

## Example: Completed Context File

See existing files for reference:
- `context/repos/repo-agentic-schemas.md`
- `context/repos/repo-work-hours-automated-reports.md`
- `context/projects/project-wpg-amenities.md`

---

## Quality Checklist

Before saving, verify you have:

- [ ] Clear one-sentence purpose
- [ ] 3-5 specific key features
- [ ] Complete tech stack
- [ ] At least 2-3 metrics with numbers
- [ ] 1-2 challenges with solutions
- [ ] Use case with target audience
- [ ] No buzzwords ("revolutionary", "game-changing")
- [ ] Specific numbers (not "many", "lots", "significant")

---

## After Creating Context File

### Next Steps

1. **Save the file** in `context/repos/`

2. **Add to git:**
   ```bash
   git add context/repos/repo-[name].md
   git commit -m "Add context for [repo-name]"
   ```

3. **Track progress:**
   - Update `context/CONTEXT_COLLECTION_CHECKLIST.md`
   - Mark repo as documented

4. **When you have 3-5 new context files:**
   - Run the content generator workflow (n8n)
   - Review generated posts
   - Approve best ones

---

## Common Questions

**Q: How detailed should I be?**
A: Include enough detail for someone unfamiliar to understand the value. Aim for 400-600 words total.

**Q: What if I don't have metrics?**
A: Estimate based on usage, or use technical metrics (processing time, data volume, API calls).

**Q: Should I include failures?**
A: Yes! Challenges and learnings make the best LinkedIn content.

**Q: Can I document a work-in-progress repo?**
A: Yes! Just mark status as "Active Development" and note it's evolving.

**Q: How often should I update context files?**
A: Update when major features are added or metrics change significantly (quarterly works well).

---

## Time Savings

**First repo:** 40 minutes (learning the template)
**Second repo:** 30 minutes (familiar with format)
**Third+ repos:** 20-25 minutes (you're fast now!)

**ROI per context file:**
- Input: 30 minutes of documentation
- Output: 5 LinkedIn posts generated
- Approved: 1-2 quality posts
- Content pipeline: 1-2 weeks

**30 minutes of work = 2 weeks of content!**

---

## Next Guide

After documenting 3-5 repos, move to:
**→ Guide 03: Running the Generator**

This will show you how to execute the n8n workflow and generate posts from your context files.

---

**Need help?** See examples in `context/repos/` or check `README.md` in the main folder.
