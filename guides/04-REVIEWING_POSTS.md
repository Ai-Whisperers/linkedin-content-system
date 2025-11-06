# Guide 04: Reviewing Generated Posts

**Time:** 1-2 hours for first batch, 30-45 minutes for subsequent batches
**Goal:** Efficiently review and approve AI-generated LinkedIn posts

---

## Quick Start

### Step 1: Open the Approved Folder

```bash
cd generated-posts/batch-YYYYMMDD/approved/
ls -l
```

**You'll see:**
- Multiple `.md` files (one per approved post)
- Each named: `[source]-[variation]-[timestamp].md`

---

### Step 2: Review Process

**For each post (5-10 minutes):**

1. **Read the full post** (copy-paste ready section)
2. **Check quality score** (should be 80+/100)
3. **Verify against checklist** (see below)
4. **Make decision:** Approve / Edit / Reject

---

## Review Checklist

### ✅ Content Quality

**Hook (First Sentence)**
- [ ] Grabs attention immediately?
- [ ] Includes a number or strong claim?
- [ ] Makes you want to read more?

**Body (Main Content)**
- [ ] Includes specific details (not generic)?
- [ ] Has at least one metric or example?
- [ ] Explains the "why" not just "what"?
- [ ] Flows logically?

**CTA (Call to Action)**
- [ ] Clear next step for reader?
- [ ] Encourages engagement (comment, share, DM)?
- [ ] Not too salesy?

---

### ✅ Brand Alignment

**Voice Check:**
- [ ] Sounds like AI-Whisperers? (pragmatic, builder-focused)
- [ ] Professional yet approachable?
- [ ] Evidence-based (metrics over hype)?

**Avoid:**
- [ ] No buzzwords ("revolutionary", "game-changing", "disruptive")
- [ ] No excessive hype or promises
- [ ] No AI jargon without explanation

**Values Check:**
- [ ] Measurable - includes specific numbers?
- [ ] Transparent - honest about limitations?
- [ ] Human-centered - AI assists, doesn't replace?
- [ ] Iterative - emphasis on testing and refinement?

---

### ✅ Technical Accuracy

**Facts:**
- [ ] All metrics are accurate?
- [ ] Technical details are correct?
- [ ] No exaggerations or false claims?

**Context:**
- [ ] Post accurately represents the source repo/project?
- [ ] Doesn't overclaim capabilities?
- [ ] Challenges/learnings are authentic?

---

### ✅ Format Standards

**Length:**
- [ ] 120-180 words? (view word_count in metadata)

**Hashtags:**
- [ ] Exactly 4 hashtags?
- [ ] Mix of broad (2) + niche (2)?
- [ ] Relevant to content?

**Emojis:**
- [ ] Maximum 2 emojis total?
- [ ] Used purposefully (not decorative)?

**Structure:**
- [ ] Hook → Body → CTA format?
- [ ] Paragraph breaks for readability?
- [ ] Not a wall of text?

---

## Rating System

### 🟢 Approve (Publish As-Is)

**Criteria:**
- Quality score: 85+/100
- Passes all checklist items
- Authentic voice
- Compelling story
- No edits needed

**Action:**
```bash
# Move to approved-posts with publish date
mv [post-file].md ../../approved-posts/2025-11/2025-11-18-post-title.md
```

---

### 🟡 Edit (Minor Tweaks Needed)

**Criteria:**
- Quality score: 70-84/100
- Good concept, needs refinement
- 1-2 issues to fix
- Would take <10 minutes to improve

**Common edits:**
- Adjust hook to be more compelling
- Add one specific metric
- Refine CTA
- Replace buzzword with specific term

**Action:**
1. Copy post to text editor
2. Make quick edits
3. Save to `approved-posts/` when ready

---

### 🔴 Reject (Don't Use)

**Criteria:**
- Quality score: <70/100
- Too generic or off-brand
- Missing key elements
- Would take >15 minutes to fix

**Action:**
- Leave in rejected folder
- Note why it failed (for improving context)
- Move on to next post

---

## Efficient Review Workflow

### Batch Review Method (30-45 minutes for 20 posts)

**Round 1: Quick Scan (10 min)**
1. Open 5-10 posts
2. Read just the hook
3. Star the ones with great hooks
4. Close the rest

**Round 2: Deep Review (20 min)**
5. Review only starred posts
6. Check full content
7. Apply checklist
8. Make approve/edit/reject decision

**Round 3: Final Selection (10 min)**
9. Choose top 6-10 posts
10. Make minor edits if needed
11. Move to `approved-posts/`

**Result:** 6-10 publish-ready posts from 20 generated

---

## Decision Tree

```
Read Post
   ↓
Hook catches attention?
   ├─ No → REJECT
   ↓
   Yes → Continue
   ↓
Has specific metrics/examples?
   ├─ No → EDIT or REJECT
   ↓
   Yes → Continue
   ↓
Sounds like AI-Whisperers brand?
   ├─ No → EDIT or REJECT
   ↓
   Yes → Continue
   ↓
Any buzzwords or hype?
   ├─ Yes → EDIT
   ↓
   No → Continue
   ↓
Quality score 80+?
   ├─ Yes → APPROVE
   └─ No → EDIT
```

---

## Common Issues & Quick Fixes

### Issue: Too Generic

**Original:**
> "AI can help your business improve efficiency and reduce costs."

**Fixed:**
> "We reduced ticket handle time by 30% using an AI triage agent. Here's the 4-lane model we built in 20 minutes."

**Fix:** Add specific numbers and concrete examples

---

### Issue: Too Technical

**Original:**
> "Our implementation uses async/await patterns with Redis pub/sub for real-time WebSocket event propagation."

**Fixed:**
> "We built a real-time meeting assistant that transcribes speech with under 2 seconds of lag. Here's how we did it."

**Fix:** Lead with benefit, then tech details if needed

---

### Issue: Weak CTA

**Original:**
> "Let me know what you think!"

**Fixed:**
> "What's one workflow you'd automate if you could start small? Drop it in the comments."

**Fix:** Ask specific, engaging question

---

### Issue: Contains Buzzwords

**Original:**
> "Our revolutionary AI solution transforms the game-changing landscape of disruptive automation."

**Fixed:**
> "We automated ticket triage in 20 minutes. Cut handle time by 30%. Here's the playbook."

**Fix:** Replace buzzwords with specific outcomes

---

## Approval Rate Expectations

### Normal Distribution

**Typical batch:**
- **20-30% Approved** - Publish as-is (4-6 posts from 20)
- **40-50% Needs Revision** - Good concept, needs work
- **20-30% Rejected** - Not usable

**This is healthy!** AI generates volume, you curate quality.

---

### If Approval Rate is Low (<15%)

**Diagnose:**
1. Check context files - too generic?
2. Review brand brief - posts matching voice?
3. Check source repos - compelling stories?

**Fix:**
1. Enhance context files with more specifics
2. Add metrics and challenges
3. Include use cases and outcomes
4. Re-run generator

---

### If Approval Rate is High (>40%)

**Great!** Your context files are excellent.

**Leverage:**
- Document more repos (same quality)
- Increase generation frequency
- Build larger content pipeline

---

## Organizing Approved Posts

### File Naming Convention

```
YYYY-MM-DD-topic-keyword.md
```

**Examples:**
- `2025-11-18-triage-agent-30-percent.md`
- `2025-11-20-claude-token-optimization.md`
- `2025-11-22-meeting-ai-real-time.md`

**Why:** Easy to sort chronologically and find by topic

---

### Folder Organization

```
approved-posts/
├── 2025-11/              # Organized by month
│   ├── 2025-11-18-*.md
│   ├── 2025-11-20-*.md
│   └── 2025-11-22-*.md
├── 2025-12/
│   └── ...
└── PUBLISHING_CALENDAR.md
```

---

## Tracking & Learning

### After Each Review Session

**Update tracking:**
1. How many posts reviewed?
2. How many approved?
3. Common issues found?
4. Which repos generated best content?

**Use insights to:**
- Prioritize documenting similar repos
- Enhance low-performing context files
- Adjust Claude prompt if needed (advanced)

---

## Time Investment

### First Batch (Learning)
- Review: 1.5-2 hours
- Approve: 6-10 posts
- Learn: What makes good posts

### Second Batch (Getting Faster)
- Review: 1 hour
- Approve: 8-12 posts
- Confidence: Growing

### Third+ Batches (Efficient)
- Review: 30-45 minutes
- Approve: 10-15 posts
- Process: Dialed in

**You get faster with practice!**

---

## Quality Over Quantity

### Remember:

**❌ Don't:**
- Approve everything to save time
- Publish mediocre posts
- Lower standards for volume

**✅ Do:**
- Maintain high quality bar
- Build trust with audience
- Publish best work only

**Better:** 10 great posts than 30 mediocre ones

---

## Next Guide

After approving posts, move to:
**→ Guide 05: Publishing to LinkedIn**

This will show you how to schedule and publish your approved content.

---

## Quick Reference

**Approval Decision in 60 Seconds:**

1. Read hook (10 sec) - Engaging?
2. Scan for metrics (10 sec) - Specific?
3. Check brand voice (20 sec) - Sounds like us?
4. Review CTA (10 sec) - Clear ask?
5. Final gut check (10 sec) - Would I share this?

**If 4/5 are "yes" → Approve!**

---

**Remember:** The generator creates volume. You curate quality. That's the system working as designed! ✅
