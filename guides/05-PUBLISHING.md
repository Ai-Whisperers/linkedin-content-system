# Guide 05: Publishing to LinkedIn

**Time:** 5-10 minutes per post
**Goal:** Publish approved posts to LinkedIn and track performance

---

## Quick Start

### Step 1: Choose Your Post

```bash
cd approved-posts/2025-11/
ls -l

# Pick a post for today
```

**Selection criteria:**
- Matches today's content type (Mon: How-To, Wed: Case Study, Fri: Opinion)
- Timely and relevant
- High quality score

---

### Step 2: Copy Post Content

**Open the post file:**

```bash
# View post
cat 2025-11-18-triage-agent-30-percent.md
```

**Find section:** "Full Post (Copy-Paste Ready)"

**Copy everything in that section:**
- Hook
- Body
- CTA
- Hashtags

---

### Step 3: Publish on LinkedIn

#### For Personal Profile Posts

1. Go to LinkedIn: https://www.linkedin.com/
2. Click **"Start a post"**
3. Paste the post content
4. **Review formatting:**
   - Line breaks preserved?
   - Emojis display correctly?
   - Hashtags are blue/clickable?
5. **Preview** before posting
6. Click **"Post"**

#### For Company Page Posts

1. Go to LinkedIn Company Page
2. Switch to company mode (top of page)
3. Click **"Start a post"**
4. Paste content
5. Review and post

---

## Publishing Schedule

### Recommended Cadence

**3 posts per week:**
- **Monday (9-10 AM)** - How-To / Educational post
- **Wednesday (9-10 AM)** - Case Study / Metrics post
- **Friday (9-10 AM)** - Carousel / Opinion post

**Why this schedule:**
- Consistent presence
- Manageable workload
- Monday/Wednesday/Friday = optimal engagement days
- Morning posts get more visibility

---

### Content Type Rotation

**Week 1:**
- Mon: How-To (from Priority 1 repo)
- Wed: Case Study (with metrics)
- Fri: Opinion (contrarian take)

**Week 2:**
- Mon: Framework (reusable model)
- Wed: How-To (different repo)
- Fri: Carousel (if available)

**Week 3:**
- Mon: Case Study (different project)
- Wed: Metric-Driven (impressive numbers)
- Fri: Opinion (industry perspective)

**Week 4:**
- Mon: How-To (another repo)
- Wed: Framework (step-by-step)
- Fri: Team Spotlight (if available)

---

## Pre-Publishing Checklist

Before clicking "Post," verify:

### ✅ Content
- [ ] Read through one final time
- [ ] No typos or grammatical errors
- [ ] Links work (if any)
- [ ] Metrics are accurate
- [ ] Facts are current

### ✅ Format
- [ ] Line breaks create visual white space
- [ ] Emojis display correctly
- [ ] Hashtags are at the end
- [ ] Not a wall of text

### ✅ Brand
- [ ] Sounds like AI-Whisperers voice
- [ ] No buzzwords snuck in
- [ ] Professional tone maintained
- [ ] Aligns with brand values

### ✅ Strategy
- [ ] Fits content calendar
- [ ] Right day for this post type
- [ ] Doesn't duplicate recent posts
- [ ] Timing is appropriate

---

## After Publishing

### Immediate (Within 1 Hour)

1. **Monitor initial engagement**
   - First 1 hour is critical
   - Respond to any comments quickly
   - Like and reply to shares

2. **Share with team**
   - Notify team members to engage
   - Ask co-founders to share
   - Personal profiles boost company posts

3. **Track in calendar**
   - Update `approved-posts/PUBLISHING_CALENDAR.md`
   - Mark post as published
   - Note publish date/time

---

### First 24 Hours

**Engagement Goals:**
- 10-20 reactions (minimum)
- 2-5 comments
- 2-3 shares

**Your actions:**
- Respond to every comment (within 2-4 hours)
- Thank people who share
- Continue conversation in comments
- Ask follow-up questions

**Why critical:** LinkedIn algorithm favors posts with early engagement

---

### Day 2-7

**Monitor metrics:**
- Total impressions
- Engagement rate (reactions + comments + shares / impressions)
- New followers gained
- Profile views spike

**Track in:** `outputs/ENGAGEMENT_TRACKER.md` (if exists) or create your own

---

## Engagement Best Practices

### Responding to Comments

**✅ Do:**
- Respond within 24 hours (sooner is better)
- Add value in your response (don't just say "thanks")
- Ask follow-up questions
- Tag relevant people when appropriate

**❌ Don't:**
- Generic responses ("Thanks for sharing!")
- Ignore negative comments
- Get defensive about criticism
- Over-promote in comments

---

### Example Response Templates

**To positive comment:**
> "Thanks [Name]! We saw the same pattern when working with [specific example]. Have you tried [related approach]?"

**To question:**
> "Great question! The key is [specific answer]. We learned that [learning]. Happy to share more details if helpful."

**To disagreement:**
> "That's a fair point, [Name]. In our case, [context that explains]. What's been your experience with [related topic]?"

---

## Performance Tracking

### Key Metrics to Track

**Per Post:**
- Impressions
- Engagement rate (%)
- Comments
- Shares
- New followers from post
- Profile views spike

**Monthly:**
- Total impressions
- Average engagement rate
- Follower growth
- Top 3 performing posts
- Bottom 3 performing posts

---

### What Good Looks Like

**Benchmarks for B2B LinkedIn:**
- **Engagement rate:** 2-5% (good), 5%+ (excellent)
- **Comments:** 2-5 per post (healthy discussion)
- **Shares:** 1-3 per post (content resonates)
- **Follower growth:** 10-20 per week (organic)

**Your posts should:**
- Meet or exceed 2% engagement rate
- Generate 2+ meaningful comments
- Occasional shares (not every post)

---

## Content Calendar Management

### Scheduling Ahead

**Ideal state:** 2-3 weeks of posts scheduled

**Process:**
1. After approving 6-10 posts
2. Assign publish dates
3. Update `PUBLISHING_CALENDAR.md`
4. Set reminders

**Benefits:**
- Less last-minute stress
- Consistent posting cadence
- Time to refine if needed

---

### Calendar Template

```markdown
# November 2025

| Date | Day | Post Title | Type | Status |
|------|-----|------------|------|--------|
| 11-18 | Mon | Triage Agent 30% | How-To | ✅ Published |
| 11-20 | Wed | Analysis Engine | Case Study | 📅 Scheduled |
| 11-22 | Fri | Claude Token Optimization | Metric | 📅 Scheduled |
| 11-25 | Mon | Meeting AI Real-Time | How-To | ⏳ Approved |
```

---

## Repurposing Content

### High-Performing Posts

**If a post gets >100 reactions or >10 comments:**

1. **Expand into article** - Write longer LinkedIn article
2. **Create carousel** - Turn into 5-7 slide visual
3. **Record video** - Short-form video explaining concept
4. **Tweet thread** - Adapt for Twitter
5. **Newsletter snippet** - Include in email newsletter

**Why:** Maximize ROI from winning content

---

## A/B Testing

### Test Different Angles

**For the same repo, try:**
- Week 1: How-To angle → Track engagement
- Week 3: Case Study angle → Compare performance
- Week 5: Opinion angle → Find what resonates

**Learn:** Which content type your audience prefers

### Test Different Formats

- Short posts (120-140 words) vs longer (160-180)
- Questions in hook vs statements
- Lists vs narratives
- Technical depth vs business focus

**Track:** What drives better engagement

---

## Common Mistakes to Avoid

### ❌ Posting Too Much
- More than 5 posts/week = spam
- Audience gets fatigued
- Quality suffers

**Fix:** Stick to 3 posts/week maximum

---

### ❌ Ignoring Engagement
- Publishing and forgetting
- Not responding to comments
- Missing conversation opportunities

**Fix:** Set aside 15 min after each post to engage

---

### ❌ Not Tracking Performance
- Can't tell what works
- Repeat mistakes
- Miss opportunities

**Fix:** Simple spreadsheet or use ENGAGEMENT_TRACKER.md

---

### ❌ Posting at Wrong Times
- Late night when audience is sleeping
- Weekends (lower B2B engagement)
- During major events/holidays

**Fix:** Monday/Wednesday/Friday 9-10 AM local time

---

## Advanced: Automation

### Future Enhancement

**When ready, automate publishing:**

1. **LinkedIn API** - Schedule posts programmatically
2. **Buffer/Hootsuite** - Use scheduling tool
3. **n8n workflow** - Auto-publish approved posts
   - See future workflow ideas in main docs

**Current:** Manual publishing is fine for 3 posts/week

---

## Success Criteria

### After 1 Month (12 posts)

- [ ] Consistent 3/week cadence maintained
- [ ] Engagement rate >2%
- [ ] 20-40 new followers
- [ ] 1-3 meaningful business conversations started
- [ ] Know which content types work best

### After 3 Months (36 posts)

- [ ] Engagement trending upward
- [ ] 100-150 new followers
- [ ] Regular comments from target audience
- [ ] 1-2 inbound leads or collaboration requests
- [ ] Clear top-performing topics identified

---

## Next Steps

### You've Completed All 5 Guides! 🎉

**Content Generation Workflow:**
1. ✅ Getting Started - Understand the system
2. ✅ Adding Context - Document repositories
3. ✅ Running Generator - Execute n8n workflow
4. ✅ Reviewing Posts - Quality curation
5. ✅ Publishing - Go live on LinkedIn

**Now:**
- Start documenting Priority 1 repos (Guide 02)
- Run generator when you have 3-5 context files (Guide 03)
- Review and approve posts (Guide 04)
- Publish on schedule (Guide 05)

---

## Quick Reference Card

**Weekly Workflow:**

**Sunday:** Review week ahead, confirm posts scheduled
**Monday 9 AM:** Publish How-To post, engage 1 hour
**Wednesday 9 AM:** Publish Case Study, engage 1 hour
**Friday 9 AM:** Publish Opinion/Carousel, engage 1 hour
**Sunday PM:** Review week's performance, plan next week

**Total time:** ~3 hours/week for consistent LinkedIn presence

---

**Remember:** Consistency beats perfection. 3 good posts/week published regularly will outperform 10 perfect posts published sporadically! 🚀
