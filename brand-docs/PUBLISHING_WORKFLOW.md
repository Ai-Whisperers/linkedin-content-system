# AI-Whisperers LinkedIn Publishing Workflow

**Document Type:** Process Documentation
**Version:** 1.0
**Date:** 2025-10-20
**Status:** Active

---

## Workflow Overview

This document outlines the step-by-step process for creating, reviewing, approving, and publishing LinkedIn content for AI-Whisperers.

**Goal:** Ensure every post meets brand standards, delivers value, and drives engagement.

---

## Workflow Stages

### Stage 1: Draft
### Stage 2: Quality Check
### Stage 3: Review
### Stage 4: Polish
### Stage 5: Publish
### Stage 6: Engage
### Stage 7: Track

---

## Stage 1: Draft

**Objective:** Create initial post using standardized template

**Actions:**
1. Open `drafts/POST_TEMPLATE.md`
2. Fill in Post Metadata:
   - Post Number (sequential: 001, 002, 003...)
   - Date Created
   - Scheduled Publish Date
   - Content Type (How-To, Case Study, Opinion, Framework, Carousel)
   - Target Audience
   - Status (set to "Draft")

3. Write Post Content following structure:
   - **Hook** (1-2 sentences, grab attention)
   - **Insight** (2-3 sentences, share "why")
   - **Example** (2-4 sentences, concrete use case with numbers)
   - **Takeaway** (1-2 sentences, actionable principle)
   - **CTA** (1 sentence, invite engagement)

4. Add Hashtags:
   - 2 Broad (#Automation, #AI, #DevOps, etc.)
   - 2 Niche (#MultiAgentSystems, #AIWhisperers, #RepoHealth, etc.)

5. Save draft to `drafts/posts/XXX-[topic-slug].md`

**Time Estimate:** 30-45 minutes

**Output:** Draft post in markdown format

---

## Stage 2: Quality Check

**Objective:** Self-review against brand standards and quality checklist

**Actions:**
1. Open `brand-docs/QUALITY_CHECKLIST.md` (or use checklist in POST_TEMPLATE.md)
2. Verify Content Standards:
   - [ ] Metric is specific and traceable (or labeled "anecdotal")
   - [ ] No buzzwords ("AI magic," "revolutionary," "game-changing")
   - [ ] Tone is pragmatic and builder-focused
   - [ ] Example is concrete, not vague
   - [ ] Takeaway is actionable

3. Verify Structure:
   - [ ] Hook grabs attention (metric, question, or contrarian statement)
   - [ ] Insight explains "why" or shares lesson
   - [ ] Example includes numbers or specific details
   - [ ] Takeaway is clear and reusable
   - [ ] CTA invites engagement or offers value

4. Verify Formatting:
   - [ ] 120-180 word count
   - [ ] Maximum 2 emojis
   - [ ] 4 hashtags (2 broad + 2 niche)
   - [ ] Line breaks for readability
   - [ ] No typos or grammatical errors

5. Verify Brand Alignment:
   - [ ] Matches AI-Whisperers tone (see `brand-docs/BRAND_BRIEF.md`)
   - [ ] "Builders talking to builders" empathy
   - [ ] Focus on clarity, utility, credibility

6. If any items fail, revise draft and re-check

**Time Estimate:** 10-15 minutes

**Output:** Draft passes quality checklist, ready for review

---

## Stage 3: Review

**Objective:** Founder (Kyrian) reviews and approves content

**Actions:**
1. **Writer:** Update post status to "Review" in metadata
2. **Writer:** Notify founder (via Slack, email, or comment in draft file)
3. **Founder:** Review draft against:
   - Brand voice alignment
   - Accuracy of metrics and claims
   - Messaging consistency with company positioning
   - Appropriateness for target audience

4. **Founder:** Provide feedback:
   - **Approve:** Mark as "Approved" in metadata, move to Stage 4
   - **Revise:** Leave comments/suggestions, writer revises and resubmits
   - **Reject:** Explain why, writer creates new draft or shelves topic

**Time Estimate:** 5-10 minutes per post

**Output:** Post marked "Approved" or sent back for revisions

---

## Stage 4: Polish

**Objective:** Incorporate feedback and finalize post copy

**Actions:**
1. **If feedback provided:** Revise post based on founder's comments
2. **Final formatting check:**
   - Ensure spacing and line breaks are LinkedIn-friendly
   - Verify hashtags are correctly formatted (no spaces: #MultiAgentSystems)
   - Double-check emoji count (max 2)
   - Proofread for typos one final time

3. **Copy final post text** to clipboard (ready to paste into LinkedIn)
4. **Update post status** to "Approved" in metadata
5. **Add publish date** if not already scheduled

**Time Estimate:** 5-10 minutes

**Output:** Final post copy ready to publish

---

## Stage 5: Publish

**Objective:** Post content to LinkedIn on scheduled date

**Actions:**
1. **Log in to LinkedIn** (founder profile or company page)
2. **Create new post:**
   - Paste final post copy from Stage 4
   - Verify formatting rendered correctly (line breaks, emojis, hashtags)
   - Add media if applicable (carousel, image, video)

3. **Review preview** before publishing:
   - Check for broken formatting
   - Ensure hashtags are clickable (LinkedIn auto-links)
   - Verify CTA is clear

4. **Publish post** (or schedule via LinkedIn native scheduler)
5. **Immediately after publishing:**
   - Pin first comment if needed (e.g., playbook link, additional context)
   - Share post from company page (if posting from founder profile)
   - Optionally tag relevant individuals/organizations

6. **Update post status** to "Published" in metadata
7. **Log publish date and post URL** in `outputs/ENGAGEMENT_TRACKER.md`

**Time Estimate:** 5 minutes

**Output:** Post live on LinkedIn

---

## Stage 6: Engage

**Objective:** Monitor and respond to comments, build relationships

**Actions:**
1. **Within 1 hour of publishing:** Check for early comments, reply quickly
2. **Throughout day of publish:**
   - Respond to all comments within 24 hours
   - Ask follow-up questions to encourage dialogue
   - Thank commenters for insights/questions

3. **Next 48 hours:**
   - Continue monitoring for late comments
   - Engage with posts from commenters (like, comment on their content)
   - Identify high-value commenters (target audience, thoughtful responses)

4. **If relevant:**
   - Invite engaged commenters to DM for playbooks/resources
   - Share additional resources in comments (e.g., "Here's the link to the full framework...")

5. **Do NOT:**
   - Ignore negative or critical comments (respond professionally)
   - Argue or get defensive (stay curious and open)
   - Spam commenters with sales pitches

**Time Estimate:** 15-30 minutes on publish day, 10-15 minutes days 2-3

**Output:** Active engagement, relationship-building

---

## Stage 7: Track

**Objective:** Log metrics and analyze performance

**Actions:**
1. **24 hours after publishing:** Log initial metrics in `outputs/ENGAGEMENT_TRACKER.md`:
   - Impressions
   - Likes
   - Comments
   - Shares
   - Click-throughs (if link included)
   - Engagement rate (likes + comments / impressions)

2. **7 days after publishing:** Update with final metrics (LinkedIn analytics)

3. **Monthly review (end of each month):**
   - Identify top 3 performing posts (by engagement rate)
   - Analyze what worked: Topic? Format? Hashtags? Day of week?
   - Identify low performers: What didn't resonate?
   - Adjust content calendar based on insights

4. **Track qualitative feedback:**
   - Note recurring questions (signals next content topics)
   - Document praise or testimonials (use as social proof)
   - Log any inbound leads or collaboration requests

**Time Estimate:** 5 minutes per post (initial), 10 minutes monthly review

**Output:** Data-driven insights for content optimization

---

## Approval Criteria (Ready to Publish)

A post is ready to publish when:

- [x] Content passes all items in Quality Checklist
- [x] Founder has approved (marked "Approved" in metadata)
- [x] Post is 120-180 words
- [x] Hashtags and emojis within limits (4 hashtags, 2 emojis)
- [x] Scheduled publish date is set
- [x] No typos or formatting errors

**If any criteria fail, post is NOT ready to publish.**

---

## Roles & Responsibilities

### Writer/Content Creator
- Draft posts using POST_TEMPLATE.md
- Run self-review via Quality Checklist
- Submit for founder review
- Incorporate feedback and polish
- Publish to LinkedIn on schedule
- Monitor and respond to engagement

### Founder (Kyrian Weiss)
- Review drafts for brand alignment and accuracy
- Approve or request revisions
- Provide strategic direction on topics
- Engage with high-value commenters
- Review monthly performance metrics

---

## Exception Handling

### Scenario 1: Negative Comment or Criticism
**Response:**
- Acknowledge quickly (within 24 hours)
- Stay professional and factual
- Offer to continue conversation offline if sensitive
- Never delete comments unless spam/abusive

**Example Response:**
> "Thanks for the feedback. We've definitely seen cases where [acknowledge their point]. In our pilot, [share specific context]. Happy to discuss offline if you'd like more details."

---

### Scenario 2: Low Engagement on Post
**Response:**
- Don't panic (early posts often have low reach)
- Review post against Quality Checklist (did it miss on value?)
- Engage proactively: share in relevant groups, comment on related posts
- Consider repurposing into different format (post → carousel, etc.)
- Log in ENGAGEMENT_TRACKER.md and analyze at month-end

---

### Scenario 3: High Engagement, Overwhelming Comments
**Response:**
- Prioritize responses: high-value commenters first (target audience, thoughtful questions)
- Batch similar questions into one response thread
- Create follow-up content to address recurring questions
- Consider this a signal to expand on the topic (carousel, long-form article)

---

### Scenario 4: Urgent Post Needed (Company News, Event)
**Process:**
- Skip formal review if time-sensitive (founder drafts directly)
- Still use Quality Checklist for quick self-review
- Publish immediately
- Document in ENGAGEMENT_TRACKER.md as "Urgent/Unscheduled"

---

## Tools & Resources

### Required Tools
- **LinkedIn:** Native post editor and analytics
- **Markdown Editor:** For drafting posts (VS Code, Notion, etc.)
- **Gamma:** For carousel creation (https://gamma.app)

### Reference Documents
- **POST_TEMPLATE.md:** Standardized post structure
- **BRAND_BRIEF.md:** Tone, values, proof points
- **QUALITY_CHECKLIST.md:** Pre-publish review criteria
- **CONTENT_CALENDAR.md:** 30-day topic schedule
- **ENGAGEMENT_TRACKER.md:** Metrics logging

### Optional Tools
- **Grammarly:** Proofread for typos (free version sufficient)
- **Hemingway Editor:** Check readability (aim for Grade 8-10)
- **LinkedIn Scheduler:** Schedule posts in advance (native LinkedIn feature)

---

## Workflow Diagram (Text Format)

```
[Draft] → [Quality Check] → [Review] → [Polish] → [Publish] → [Engage] → [Track]
   ↓             ↓              ↓          ↓           ↓           ↓          ↓
Writer      Writer         Founder    Writer      Writer      Writer     Writer
30-45m      10-15m         5-10m      5-10m       5m          15-30m     5m
```

---

## Continuous Improvement

### Weekly Review (Every Friday)
- Check upcoming week's content calendar
- Ensure next 3 posts are drafted or in progress
- Review engagement on this week's posts
- Adjust next week's topics if needed

### Monthly Review (End of Month)
- Analyze top 3 and bottom 3 posts (by engagement rate)
- Update content calendar based on performance
- Identify new topics from audience questions
- Celebrate wins (e.g., first 100 followers, high-engagement post)

### Quarterly Review (Every 3 Months)
- Assess brand voice consistency
- Review follower growth and engagement trends
- Update BRAND_BRIEF.md if positioning shifts
- Consider new content formats (video, long-form articles, webinars)

---

## Version History

| Version | Date | Changes | Approver |
|---------|------|---------|----------|
| 1.0 | 2025-10-20 | Initial workflow based on LINKEDINCONTEXT.md | Pending |

---

## Next Steps

1. **Familiarize with Workflow:** Read through all 7 stages
2. **Test with First Post:** Use post 001 (How-To triage agent) to walk through process
3. **Refine Based on Learnings:** Update workflow after first 3-5 posts
4. **Train Any Future Writers:** Use this doc as onboarding guide

---

**Document Owner:** AI-Whisperers Content Team
**Status:** Active
**Last Updated:** 2025-10-20

*This workflow ensures consistent quality, brand alignment, and measurable outcomes for all AI-Whisperers LinkedIn content.*
