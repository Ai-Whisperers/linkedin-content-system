# Guide 03: Running the Content Generator

**Time:** 5-10 minutes (after initial setup)
**Goal:** Execute n8n workflow to generate LinkedIn posts from your context files

---

## Prerequisites

Before running the generator, ensure you have:

- ✅ **Context files created** - At least 3-5 repos/projects documented
- ✅ **n8n installed** - Workflow automation platform running
- ✅ **Workflow imported** - `content-generator-linkedin.json` in n8n
- ✅ **Credentials configured** - Claude API + SMTP email

**If not done yet:** See `workflows/README.md` for setup instructions

---

## Step-by-Step Execution

### Step 1: Open n8n

```bash
# If using Docker
docker ps | grep n8n

# If n8n is running, open browser
http://localhost:5678
```

---

### Step 2: Find the Workflow

1. Click **"Workflows"** in left sidebar
2. Find: **"AI-Whisperers Content Generator"**
3. Click to open

**You should see:**
- 15 nodes connected in a flow
- Schedule trigger (every 2 weeks)
- File processing nodes
- Claude AI generation
- Quality validation
- Output routing

---

### Step 3: Manual Execution (Recommended First Time)

**Before activating schedule, test manually:**

1. Click **"Execute Workflow"** button (top right)
2. Watch nodes light up as they process
3. Check each node's output
4. Wait for completion (~5-15 minutes depending on context files)

**What's happening:**
```
Finding context files...
→ Reading file contents...
→ Processing and extracting key info...
→ Sending to Claude AI...
→ Generating 5 post variations...
→ Validating quality...
→ Routing to folders...
→ Sending email report...
```

---

### Step 4: Check the Output

#### Email Report

You'll receive an email with:
- **Total posts generated:** ~[5 × number of context files]
- **Approved:** Posts scoring 80+/100
- **Needs Revision:** Posts scoring 50-79/100
- **Rejected:** Posts scoring <50/100
- **Top issues:** Common quality problems
- **Next steps:** What to review

#### File System

Check these folders:

```bash
generated-posts/
└── batch-YYYYMMDD/
    ├── approved/           # ✅ Ready to publish
    │   └── *.md
    ├── needs-revision/     # ⚠️ Good but needs edits
    │   └── *.md
    └── rejected/           # ❌ Quality too low
        └── *.md
```

**Each post file includes:**
- Full post text (copy-paste ready)
- Quality score
- Issues found
- Source context file
- Metadata (variation type, word count, hashtags)

---

### Step 5: Review Generated Posts

Navigate to the approved folder:

```bash
cd generated-posts/batch-YYYYMMDD/approved/
ls -l
```

**Open 3-5 posts and check:**
- [ ] Hook is engaging?
- [ ] Body has specific details?
- [ ] CTA is clear?
- [ ] Hashtags relevant?
- [ ] No buzzwords?
- [ ] Sounds like your voice?

**See:** `guides/04-REVIEWING_POSTS.md` for detailed review process

---

## Workflow Schedule

### Automatic Execution (After Testing)

Once you're happy with the results:

1. **Activate the workflow:**
   - Toggle "Active" switch (top right in n8n)
   - Workflow will run every 2 weeks automatically

2. **Schedule:**
   - Default: Every 2 weeks (bi-weekly)
   - Recommended: Keep this frequency
   - Can adjust in Schedule Trigger node

3. **Notifications:**
   - Email report sent after each run
   - Check spam folder first time

---

## What Gets Generated

### Per Context File

Each documented repo/project generates **5 post variations**:

1. **How-To** - "How we built [feature]"
2. **Case Study** - "[Metric]% improvement in [area]"
3. **Opinion** - "Why [contrarian take]"
4. **Framework** - "The [X]-step approach to [problem]"
5. **Metric-Driven** - "[Number] and what it means"

### Example Output

**If you have 10 context files:**
- Posts generated: 50
- Approved (20-30%): 10-15
- Weeks of content: 3-5 weeks (at 3 posts/week)

**If you have 15 context files:**
- Posts generated: 75
- Approved (20-30%): 15-22
- Weeks of content: 5-7 weeks

---

## Quality Validation

### Automatic Checks

The workflow validates each post for:

**✅ Word Count**
- Target: 120-180 words
- Flags if outside range

**✅ Hashtag Count**
- Requirement: Exactly 4 hashtags
- Flags if more or less

**✅ Buzzword Detection**
- Scans for: "revolutionary", "game-changing", "disruptive", etc.
- Flags posts containing buzzwords

**✅ Emoji Count**
- Maximum: 2 emojis per post
- Flags excessive use

**✅ Quality Scoring**
- Combines all checks
- Scores 0-100
- Routes by score:
  - 80-100: Approved
  - 50-79: Needs Revision
  - 0-49: Rejected

---

## Troubleshooting

### Workflow Not Starting

**Check:**
1. Is n8n running? `docker ps`
2. Is workflow activated? (toggle switch ON)
3. Are credentials configured?

**Fix:**
- Restart n8n if needed
- Execute manually first
- Check n8n logs: `docker logs n8n`

---

### No Posts Generated

**Possible causes:**
1. No context files found
   - Check files exist in `context/repos/`
   - Ensure files end in `.md`
   - Exclude `README.md`

2. Claude API error
   - Check API key is valid
   - Verify credit balance
   - Check n8n credentials

3. File read permissions
   - Ensure n8n can read context files
   - Check Docker volume mounts

**Debug:**
- Execute workflow manually
- Check output of each node
- Look for error messages in red

---

### Low Approval Rate (<15%)

**If most posts are rejected:**

**Possible causes:**
1. Context files too generic
   - Add more specific details
   - Include actual metrics
   - Add challenges/learnings

2. Context files too technical
   - Add business context
   - Explain the "why"
   - Include user impact

3. Missing key information
   - Add use cases
   - Include results
   - Describe the problem solved

**Fix:**
- Review approved posts to see patterns
- Update context files with missing elements
- Re-run generator

---

### Posts Don't Match Brand Voice

**If posts sound off:**

1. **Check brand guidelines:**
   - Review `brand-docs/BRAND_BRIEF.md`
   - Verify context files reflect brand values
   - Add voice examples to context

2. **Update context files:**
   - Include tone preferences
   - Add examples of good phrasing
   - Reference brand positioning

3. **Adjust Claude prompt** (advanced):
   - Edit workflow in n8n
   - Find "Claude: Generate Posts" node
   - Refine prompt with brand voice examples

---

## Best Practices

### 📅 Timing

**Run generator:**
- After documenting 3-5 new repos
- Bi-weekly (automatic schedule)
- Before content pipeline runs low (<5 approved posts)

**Don't run:**
- With only 1-2 context files (not enough variety)
- Too frequently (context won't change much)

---

### 📊 Batch Size

**Optimal:** 10-15 context files per generation
- Generates: 50-75 posts
- Approved: 10-22 posts
- Content pipeline: 3-7 weeks

**Too small:** <5 context files
- Not enough variety
- Low content volume

**Too large:** >20 context files
- Takes longer to process
- Harder to review
- May hit Claude API limits

---

### 🔄 Iteration

**After first generation:**

1. **Review approval patterns**
   - Which repos generated best posts?
   - Which variation types worked best?
   - Common issues across posts?

2. **Improve context files**
   - Add missing elements to low-performing repos
   - Enhance metrics/results sections
   - Include more specific challenges

3. **Re-run generator**
   - Better context = better posts
   - Approval rate should improve

---

## Expected Workflow Timeline

### First Run
**Time:** 5-15 minutes
**Output:** 50-75 posts
**Next step:** Review posts (1-2 hours)

### Subsequent Runs
**Time:** 5 minutes (automated)
**Output:** Consistent batch
**Next step:** Quick review (30-45 minutes)

### Long-term Pattern
**Frequency:** Every 2 weeks
**Input:** 1-2 new context files per week
**Output:** Fresh posts continuously
**Maintenance:** 1-2 hours every 2 weeks

---

## Success Indicators

**✅ Good generation run:**
- Workflow completes without errors
- 20-30% approval rate
- Posts sound authentic
- Diverse content angles
- Clear next steps in email

**⚠️ Needs improvement:**
- <15% approval rate
- Many duplicate angles
- Generic/buzzword-heavy posts
- Technical errors

**❌ Something's wrong:**
- Workflow fails mid-execution
- 0% approval rate
- Posts are gibberish
- API errors

---

## Next Guide

After generating posts, move to:
**→ Guide 04: Reviewing Posts**

This will show you how to efficiently review and approve generated content for publication.

---

**Tip:** The first generation is always the slowest (learning + reviewing). By your 3rd run, you'll have the process down to 30 minutes total! 🚀
