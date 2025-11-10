# Claude Content Generation System - Action Plan

## Executive Summary

**Goal:** Generate 2 company-worthy LinkedIn posts per week using Claude AI with n8n automation.

**Current Status:** Workflows exist but have critical errors preventing proper operation.

**Timeline:** 1 week to full operation

---

## Critical Issues to Fix

### 🔴 Priority 1: Immediate Fixes (Day 1)

#### 1.1 Fix Content Generator Schedule
**File:** `workflows/content-generator-linkedin.json`  
**Line:** 8-11  
**Issue:** Currently runs every 2 WEEKS, need 2 posts per WEEK

**Current:**
```json
"weeksInterval": 2  // Every 2 weeks = 26 posts/year
```

**Fix to:**
```json
{
  "rule": {
    "interval": [
      {
        "field": "cronExpression",
        "cronExpression": "0 9 * * 1,4"  // Monday and Thursday at 9 AM
      }
    ]
  }
}
```

**Result:** 2 posts per week = 104 posts per year

---

#### 1.2 Fix GitHub Monitor Node References
**File:** `workflows/github-org-health-monitor.json`  
**Lines:** 84, 90, 130, 301, 311  
**Issue:** Node names don't match connections

**Fix Option A - Update Node Names:**
```json
Line 90: "name": "Check: portfolio-website"
Line 130: "name": "Check: contentCreator"
```

**Fix Option B - Update Repository URLs:**
```json
Line 84: "url": "https://api.github.com/repos/Ai-Whisperers/ai-whisperers-portfolio-website"
Line 124: "url": "https://api.github.com/repos/Ai-Whisperers/contentCreator"
```

---

#### 1.3 Complete or Remove Daily Workflow
**File:** `workflows/content-generator-daily.json`  
**Issue:** Incomplete workflow (stops at line 97, missing Claude call + validation + output)

**Options:**
- **A) Complete it:** Add Claude Generate → Validator → File Write nodes
- **B) Remove it:** Delete file, use only LinkedIn workflow

**Recommendation:** Remove it (use LinkedIn workflow only with corrected schedule)

---

### 🟡 Priority 2: Content Quality Setup (Day 2-3)

#### 2.1 Verify Context Files Exist
**Critical:** Claude needs verified company information to generate quality content.

**Check these folders:**
```bash
context/team/
context/repos/
context/projects/
context/services/
context/brand/
```

**Required files (minimum):**
```
✅ context/ACCURATE_COMPANY_CONTEXT.md
✅ context/team/team-kyrian-weiss.md
✅ context/team/team-ivan-weiss.md
✅ context/team/team-jonathan-verdun.md
✅ context/repos/repo-work-hours-automated-reports.md
✅ context/repos/repo-company-information.md
✅ context/repos/repo-agentic-schemas.md
✅ context/projects/project-wpg-amenities.md
✅ context/projects/project-wpg-software.md
✅ context/services/custom-ai.md
✅ context/services/automation.md
✅ context/brand/voice.md
✅ context/brand/rules.md
```

**Action:** If missing, create using template from ACCURATE_COMPANY_CONTEXT.md

---

#### 2.2 Create/Verify Context Manifest
**File:** `context/manifest.json`  
**Purpose:** Defines which context files Claude reads

**Required structure:**
```json
{
  "version": "2.0.0",
  "sources": [
    {
      "path": "C:/Users/kyrian/Documents/contentCreator/context/services/custom-ai.md",
      "category": "services",
      "priority": 1,
      "required": true,
      "description": "Custom AI solutions offering"
    },
    {
      "path": "C:/Users/kyrian/Documents/contentCreator/context/services/automation.md",
      "category": "services",
      "priority": 1,
      "required": true,
      "description": "Automation services"
    },
    {
      "path": "C:/Users/kyrian/Documents/contentCreator/context/brand/voice.md",
      "category": "brand",
      "priority": 1,
      "required": true,
      "description": "Brand voice and tone"
    },
    {
      "path": "C:/Users/kyrian/Documents/contentCreator/context/brand/rules.md",
      "category": "brand",
      "priority": 1,
      "required": true,
      "description": "Content rules and forbidden words"
    },
    {
      "path": "C:/Users/kyrian/Documents/contentCreator/context/team/team-kyrian-weiss.md",
      "category": "team",
      "priority": 2,
      "required": false,
      "description": "Kyrian's background and expertise"
    },
    {
      "path": "C:/Users/kyrian/Documents/contentCreator/context/team/team-ivan-weiss.md",
      "category": "team",
      "priority": 2,
      "required": false,
      "description": "Ivan's background and achievements"
    },
    {
      "path": "C:/Users/kyrian/Documents/contentCreator/context/team/team-jonathan-verdun.md",
      "category": "team",
      "priority": 2,
      "required": false,
      "description": "Jonathan's background and expertise"
    },
    {
      "path": "C:/Users/kyrian/Documents/contentCreator/context/repos/repo-agentic-schemas.md",
      "category": "repos",
      "priority": 2,
      "required": false,
      "description": "20 agentic design patterns"
    }
  ],
  "generation_config": {
    "variations_per_batch": 2,
    "word_count_min": 120,
    "word_count_max": 180,
    "hashtag_count": 4,
    "emoji_max": 2,
    "forbidden_words": ["revolutionary", "game-changing", "disruptive", "transform your business", "industry leader"]
  },
  "content_distribution": {
    "service_showcase": "40%",
    "tool_tutorial": "20%",
    "concept_explained": "20%",
    "case_study": "10%",
    "how_to": "10%"
  },
  "validation_thresholds": {
    "min_quality_score": 70,
    "max_context_words": 50000,
    "min_context_words": 100,
    "approval_rate_target": 0.8
  }
}
```

**Action:** Create this file if missing

---

#### 2.3 Enhance Claude Validation Rules
**File:** `workflows/content-generator-linkedin.json`  
**Node:** "Hard Validator" (line 112)

**Add these validation checks:**

```javascript
// 1. Company Correlation Check
const companyMentions = [
  'AI-Whisperers',
  'Paraguay',
  'multi-agent',
  'agentic patterns',
  'WPG Amenities',
  'WPG Software'
];

const hasCompanyContext = companyMentions.some(term =>
  fullText.toLowerCase().includes(term.toLowerCase())
);

if (!hasCompanyContext) {
  issues.push('No clear company correlation - must mention AI-Whisperers work');
}

// 2. Fake Metrics Detection
const fakeMetricPatterns = [
  /\d+% (increase|improvement|growth) in/i,
  /saved \$\d+/i,
  /\d+ clients/i,
  /proven track record/i,
  /industry leader/i
];

for (const pattern of fakeMetricPatterns) {
  if (pattern.test(fullText)) {
    issues.push('Contains unverified metric or claim');
    break;
  }
}

// 3. Educational Value Check
const educationalIndicators = [
  'how to',
  'pattern',
  'learned',
  'approach',
  'building in public',
  'here\'s what',
  'lesson'
];

const hasEducationalValue = educationalIndicators.some(term =>
  fullText.toLowerCase().includes(term)
);

if (!hasEducationalValue) {
  issues.push('Lacks clear educational value or takeaway');
}
```

---

### 🟢 Priority 3: Output and Storage (Day 4)

#### 3.1 Fix File Paths
**Issue:** Hard-coded Windows paths won't work on other machines

**Current:**
```javascript
const filePath = `C:/Users/kyrian/Documents/contentCreator/generated-posts/batch-${batchDate}/${subdir}/${post.post_id}.md`;
```

**Fix to:**
```javascript
// Use environment variable or relative path
const basePath = process.env.CONTENT_BASE_PATH || './';
const filePath = `${basePath}approved-posts/${post.post_id}.md`;
```

**Better structure:**
```
approved-posts/
├── 2025-11-04-service-showcase-v2.0.0-20251104-0.md
├── 2025-11-07-tool-tutorial-v2.0.0-20251107-0.md
└── 2025-11-11-concept-explained-v2.0.0-20251111-0.md
```

---

#### 3.2 Create Output Directory Structure
```bash
mkdir -p approved-posts
mkdir -p drafts/needs-revision
mkdir -p archive
```

---

#### 3.3 Enhance File Format for Manual Publishing

**Current format is good, but add:**

```markdown
---
post_id: service-showcase-v2.0.0-20251104-0
version: v2.0.0-20251104-0
variation: service-showcase
status: APPROVED
quality_score: 95
generated_at: 2025-11-04T09:00:00Z
published: false
published_at: null
published_by: null
linkedin_url: null
---

# Service Showcase: Custom AI Solutions

## Hook
[Hook text here]

## Body
[Body text here]

## CTA
[CTA text here]

## Hashtags
#AI #MultiAgent #Paraguay #BuildingInPublic

---

## READY TO POST

[Full formatted post here]

---

## Publishing Checklist

- [ ] Review for typos
- [ ] Verify company correlation
- [ ] Check timing appropriate
- [ ] Post to Company Page
- [ ] Share to Personal Profiles (Kyrian, Ivan, Jonathan)
- [ ] Team amplification plan
- [ ] Mark as published (update frontmatter)

## Performance Tracking

Impressions: _______
Engagement rate: _______
Comments: _______
Shares: _______
Best performing content: _______
```

---

### 🔵 Priority 4: Testing and Validation (Day 5-6)

#### 4.1 Test Workflow End-to-End

**Test Plan:**
```bash
# 1. Manual trigger test
1. Open n8n UI
2. Open "content-generator-linkedin" workflow
3. Click "Execute Workflow"
4. Wait for completion
5. Check approved-posts/ folder
6. Review generated post quality

# 2. Verify validation works
Expected: 2 posts generated
Expected: Both should be APPROVED (quality > 70)
Expected: No fake metrics
Expected: Clear company correlation
Expected: Educational value

# 3. Check file output
Verify files created:
- approved-posts/YYYY-MM-DD-variation-vX.X.X-YYYYMMDD-0.md
- approved-posts/YYYY-MM-DD-variation-vX.X.X-YYYYMMDD-1.md

# 4. Review content quality
Read generated posts:
- Make sense? ✓
- Company-worthy? ✓
- No fake claims? ✓
- Proper formatting? ✓
```

---

#### 4.2 Quality Criteria Checklist

Every generated post must pass:

```
✅ Company Correlation
   - Mentions AI-Whisperers or specific work
   - References real projects (WPG Amenities/Software) or repos
   - Team member context included

✅ Factual Accuracy
   - No unverified metrics
   - Only real achievements (Ivan's NASA award, 20 patterns)
   - Honest about company age (3 months)

✅ Educational Value
   - Teaches something useful
   - Clear takeaway for reader
   - Pattern, lesson, or insight shared

✅ Professional Quality
   - 120-180 words
   - 4 relevant hashtags
   - Max 2 emojis
   - Proper grammar
   - Clear structure (hook/body/CTA)

✅ Brand Voice
   - Pragmatic, not hype
   - "We're building" not "we built"
   - Transparent about being startup
   - Evidence-based claims only
```

---

#### 4.3 Approval Rate Target

**Goal:** 80%+ approval rate

**If below 80%:**
1. Review validation rules (too strict?)
2. Improve context files (more information?)
3. Adjust Claude prompt (clearer instructions?)
4. Check forbidden words list (too restrictive?)

---

### 🟣 Priority 5: Deployment and Monitoring (Day 7)

#### 5.1 Activate Workflow

```bash
# 1. In n8n UI
1. Open "content-generator-linkedin" workflow
2. Toggle "Active" switch to ON
3. Verify schedule: Monday & Thursday 9 AM

# 2. Monitor first week
Mon Nov 4: Check approved-posts/ folder at 9:30 AM
Thu Nov 7: Check approved-posts/ folder at 9:30 AM
Mon Nov 11: Check approved-posts/ folder at 9:30 AM
```

---

#### 5.2 Publishing Workflow (Manual)

**Monday & Thursday routine:**

```
9:00 AM: n8n generates posts
9:30 AM: Review generated posts in approved-posts/
10:00 AM: Select best post, make final edits
10:30 AM: Publish to LinkedIn Company Page
11:00 AM: Share to personal profiles (Kyrian, Ivan, Jonathan)
11:30 AM: Update post file (mark published, add URL)
End of day: Check engagement, respond to comments
```

---

#### 5.3 Track Metrics

**Weekly review (every Friday):**

```
Metrics to track:
- Posts generated: 2
- Approval rate: X%
- Posts published: X
- Average quality score: X/100
- Impressions: X
- Engagement rate: X%
- Comments: X
- Shares: X

Issues encountered:
- False positives in validation?
- Content too generic?
- Missing context?
- Need more variety?
```

---

## Implementation Checklist

### Week 1: Setup and Fix

**Day 1: Fix Critical Errors**
- [ ] Fix content generator schedule (2 weeks → 2/week)
- [ ] Fix GitHub monitor node references
- [ ] Remove incomplete daily workflow
- [ ] Test workflows individually

**Day 2: Context Files**
- [ ] Verify all context files exist (13 minimum)
- [ ] Create missing context files
- [ ] Create/verify context manifest.json
- [ ] Review ACCURATE_COMPANY_CONTEXT.md

**Day 3: Validation**
- [ ] Add company correlation check
- [ ] Add fake metrics detection
- [ ] Add educational value check
- [ ] Test validation rules

**Day 4: Output Setup**
- [ ] Fix hard-coded file paths
- [ ] Create output directories
- [ ] Test file writing
- [ ] Verify file format

**Day 5-6: Testing**
- [ ] Run end-to-end test
- [ ] Review generated content quality
- [ ] Adjust validation if needed
- [ ] Document issues found

**Day 7: Deploy**
- [ ] Activate workflow
- [ ] Monitor first execution
- [ ] Publish first posts
- [ ] Track initial metrics

---

## Success Criteria

### Technical Success
✅ Workflow executes every Monday & Thursday at 9 AM  
✅ 2 posts generated per execution  
✅ 80%+ approval rate  
✅ No fake metrics in approved posts  
✅ Clear company correlation in all posts  
✅ Files saved to approved-posts/ correctly

### Content Quality Success
✅ Posts are company-worthy (would publish confidently)  
✅ Factually accurate (only verified information)  
✅ Educational value (readers learn something)  
✅ Proper formatting (ready to copy-paste to LinkedIn)  
✅ Brand voice consistent (pragmatic, transparent, builder-focused)

### Operational Success
✅ Manual publishing workflow < 30 minutes  
✅ Zero false negatives (no good posts rejected)  
✅ < 5% false positives (bad posts approved)  
✅ Team knows how to use system  
✅ Metrics tracked weekly

---

## Rollback Plan

If system doesn't work:

**Week 1 Issues:**
1. Revert to manual content creation
2. Fix issues identified
3. Re-test before re-deploying

**Week 2+ Issues:**
1. Deactivate workflow
2. Analyze failure patterns
3. Adjust validation/prompts
4. Test thoroughly
5. Re-activate

---

## Long-Term Optimization (Month 2+)

### Phase 2 Enhancements
- [ ] A/B test different content variations
- [ ] Track which types perform best
- [ ] Adjust content distribution based on data
- [ ] Add more context files (expand knowledge base)
- [ ] Create content calendar integration

### Phase 3: Full Automation
- [ ] Add LinkedIn API publishing (if get API access)
- [ ] Automated performance tracking
- [ ] AI-powered optimization suggestions
- [ ] Automatic schedule adjustments based on engagement

---

## Support and Resources

**Documentation:**
- BRAND_BRIEF.md - Voice and tone
- QUALITY_CHECKLIST.md - Pre-publish criteria
- ACCURATE_COMPANY_CONTEXT.md - Verified facts only
- workflows/content-generator-linkedin.json - Main workflow

**Troubleshooting:**
- Check n8n execution logs
- Review approved-posts/ and needs-revision/ folders
- Verify context files are readable
- Check Claude API credits/limits

**Contact:**
- Internal: Team discussion
- n8n: https://community.n8n.io
- Claude: https://docs.anthropic.com

---

## Next Actions (Start Now)

### Immediate (Today):
1. ✅ Fix schedule in content-generator-linkedin.json
2. ✅ Fix GitHub monitor node references
3. ✅ Delete content-generator-daily.json (incomplete)
4. ✅ Verify context files exist

### This Week:
5. ✅ Create manifest.json
6. ✅ Add enhanced validation rules
7. ✅ Test end-to-end
8. ✅ Activate workflow

### Next Week:
9. ✅ Publish first 2 posts
10. ✅ Track metrics
11. ✅ Iterate based on learnings

---

**Status:** Ready to implement  
**Estimated Time:** 7 days to full operation  
**Risk Level:** Low (can revert to manual if needed)  
**ROI:** 2 quality posts per week = 104/year (vs 0 currently)

---

*Created: 2025-11-03*  
*Owner: AI-Whisperers Team*  
*System: Claude + n8n Content Generation*

