# n8n LinkedIn Automation - Workflow Diagrams

**Visual reference for understanding the automation architecture**

---

## Workflow 1: Basic Text Post Automation

### Visual Flow

```
┌─────────────────┐
│  Schedule       │  Mon/Wed/Fri at 9:00 AM
│  Trigger        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Read Content   │  From markdown file or Google Drive
│  Source         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Parse Content  │  Extract post text, metadata
│  (Code Node)    │  Count words, emojis, hashtags
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Quality Gate   │  Validate:
│  (IF Node)      │  • 120-180 words
│                 │  • Max 2 emojis
└────────┬────────┘  • Exactly 4 hashtags
         │            • No buzzwords
    ┌────┴────┐
    │         │
PASS│         │FAIL
    │         │
    ▼         ▼
┌────────┐  ┌──────────┐
│ Post   │  │ Send     │
│ to     │  │ Alert    │
│LinkedIn│  │ (Slack)  │
└───┬────┘  └──────────┘
    │
    ▼
┌────────────────┐
│ Log to         │  Record in Google Sheets:
│ Engagement     │  • Date, author, URL
│ Tracker        │  • Post type, status
└────────┬───────┘
         │
         ▼
┌─────────────────┐
│ Notify Team     │  Slack: "Post published!"
│ (Slack)         │
└─────────────────┘
```

**Execution Time:** ~30 seconds
**Runs:** 3x per week (Mon/Wed/Fri)

---

## Workflow 2: Multi-Author Routing

### Visual Flow

```
┌──────────────────┐
│  Content         │  Synced from Google Sheets
│  Calendar        │  Contains: date, author, post file
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Check Today's   │  Filter for today's posts
│  Posts           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Read Markdown   │  Load post from drafts/posts/
│  File            │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Parse & Validate│  Quality checks
│                  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Check Author    │  Route by author field
│  (Switch Node)   │
└────────┬─────────┘
         │
    ┌────┴──────┬────────┬────────┐
    │           │        │        │
    ▼           ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Kyrian  │ │ Ivan   │ │Jonathan│ │Company │
│Profile │ │Profile │ │Profile │ │  Page  │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │
    └──────────┴──────────┴──────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Post to         │
           │ LinkedIn        │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Cross-Promotion │  Notify other authors
           │ Alert           │  "Engage with new post!"
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Log Engagement  │
           └─────────────────┘
```

**Execution Time:** ~45 seconds
**Runs:** 4-5x per week (multi-author)

---

## Workflow 3: Approval Workflow

### Visual Flow

```
┌──────────────────┐
│  Draft Created   │  Writer finishes post
│  (Trigger)       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  AI Quality      │  OpenAI analyzes:
│  Check           │  • Brand voice
│  (OpenAI Node)   │  • Tone
└────────┬─────────┘  • Clarity
         │            • Buzzwords
         ▼
┌──────────────────┐
│  Send to Founder │  Slack message with:
│  for Approval    │  • Post preview
│  (Slack)         │  • AI feedback
└────────┬─────────┘  • Approve/Reject buttons
         │
         ▼
┌──────────────────┐
│  Wait for        │  Webhook waits for
│  Response        │  Slack reaction
│  (Webhook)       │  ✅ = Approve
└────────┬─────────┘  ❌ = Reject
         │
    ┌────┴────┐
    │         │
 ✅ │         │ ❌
    │         │
    ▼         ▼
┌────────┐  ┌──────────┐
│Schedule│  │ Move to  │
│to Queue│  │ Rejected │
└───┬────┘  │ Folder   │
    │       └──────────┘
    ▼
┌────────────────┐
│ Publish on     │  Scheduled trigger
│ Scheduled Date │  publishes at right time
└────────┬───────┘
         │
         ▼
┌─────────────────┐
│ Post to LinkedIn│
└─────────────────┘
```

**Execution Time:** Variable (waits for approval)
**Use Case:** Phase 2+ when quality control is critical

---

## Workflow 4: Engagement Metrics Automation

### Visual Flow

```
┌──────────────────┐
│  Daily Trigger   │  Runs at 9:00 AM daily
│  (Schedule)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Read Engagement │  Find posts published
│  Tracker         │  24 hours ago
│  (Google Sheets) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  For Each Post   │  Loop through posts
│  (Loop Node)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Fetch LinkedIn  │  Option A: LinkedIn Analytics API
│  Metrics         │  Option B: Web scraping (Playwright)
│                  │
└────────┬─────────┘  Get: impressions, likes,
         │            comments, shares, CTR
         ▼
┌──────────────────┐
│  Calculate       │  Engagement rate:
│  Engagement Rate │  (likes + comments) / impressions
│  (Code Node)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Update Google   │  Write metrics back
│  Sheets          │  to ENGAGEMENT_TRACKER
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Performance     │  IF engagement > baseline:
│  Analysis        │  Mark as "High Performer"
│  (IF Node)       │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
HIGH│         │LOW
    │         │
    ▼         ▼
┌────────┐  ┌──────────┐
│ Notify │  │ Log for  │
│ Success│  │ Review   │
│ (Slack)│  │          │
└────────┘  └──────────┘
```

**Execution Time:** ~2 minutes (for 10 posts)
**Runs:** Daily at 9:00 AM

---

## Workflow 5: Performance Reporting

### Visual Flow

```
┌──────────────────┐
│  Monthly Trigger │  First Monday of month
│  (Schedule)      │  at 9:00 AM
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Read All Posts  │  Get last 30 days from
│  from Tracker    │  Google Sheets
│  (Google Sheets) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Aggregate Data  │  Calculate:
│  (Code Node)     │  • Total posts
│                  │  • Avg engagement rate
└────────┬─────────┘  • Best performing topics
         │            • Optimal posting times
         ▼
┌──────────────────┐
│  Identify Top 3  │  Sort by engagement,
│  and Bottom 3    │  extract insights
│  (Code Node)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Generate Report │  Use template:
│  (Code Node)     │  • Summary stats
│                  │  • Top posts
└────────┬─────────┘  • Recommendations
         │
         ▼
┌──────────────────┐
│  Send Report     │  Slack or Email with:
│  to Team         │  • Performance overview
│  (Slack/Email)   │  • Actionable insights
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Update Content  │  Add insights to next
│  Strategy        │  month's calendar
│  (Google Sheets) │
└──────────────────┘
```

**Execution Time:** ~1 minute
**Runs:** Monthly (1st Monday)

---

## Data Flow Diagram

### Content Journey: Draft → Published → Analyzed

```
┌─────────────────────────────────────────────────────────┐
│                   CONTENT CREATION                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────┐
          │  Markdown File   │  drafts/posts/001-post.md
          │  (Draft)         │
          └────────┬─────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                  n8n WORKFLOW                            │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Parse   │→ │ Validate │→ │  Post    │              │
│  │          │  │          │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                    │                     │
└────────────────────────────────────┼─────────────────────┘
                                     │
                                     ▼
                          ┌─────────────────┐
                          │  LinkedIn API   │  Published!
                          └────────┬────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   ENGAGEMENT TRACKING    │
                    └────────┬─────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
        ┌─────────────┐ ┌─────────┐ ┌─────────┐
        │Google Sheets│ │LinkedIn │ │ Slack   │
        │   Tracker   │ │Analytics│ │Notif.   │
        └─────────────┘ └─────────┘ └─────────┘
```

---

## Integration Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────┐
│                      n8n Cloud                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 Workflow Engine                       │  │
│  │                                                       │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐ │  │
│  │  │Schedule │  │ Code    │  │ HTTP   │  │  IF    │ │  │
│  │  │ Trigger │  │ Node    │  │ Request│  │  Node  │ │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬───────────────────────────────┬───────────┘
                 │                               │
        ┌────────┴────────┐            ┌────────┴────────┐
        │                 │            │                 │
        ▼                 ▼            ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐
│   LinkedIn   │  │Google Sheets │  │  Slack   │  │ OpenAI   │
│     API      │  │     API      │  │   API    │  │   API    │
└──────┬───────┘  └──────┬───────┘  └──────────┘  └──────────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   Kyrian     │  │ ENGAGEMENT   │
│   Profile    │  │  TRACKER     │
├──────────────┤  │  Spreadsheet │
│   Ivan       │  └──────────────┘
│   Profile    │
├──────────────┤
│  Jonathan    │
│   Profile    │
├──────────────┤
│  Company     │
│   Page       │
└──────────────┘
```

---

## Error Handling Flow

### When Things Go Wrong

```
┌──────────────────┐
│  Workflow Step   │
└────────┬─────────┘
         │
         ▼
    ┌────────┐
    │Success?│
    └───┬────┘
        │
   ┌────┴────┐
   │         │
  YES        NO
   │         │
   │         ▼
   │    ┌─────────────────┐
   │    │ Log Error       │
   │    │ (Error Trigger) │
   │    └────────┬────────┘
   │             │
   │             ▼
   │    ┌─────────────────┐
   │    │ Check Error Type│
   │    │ (Switch Node)   │
   │    └────────┬────────┘
   │             │
   │        ┌────┴────┬────────────┐
   │        │         │            │
   │        ▼         ▼            ▼
   │    ┌────────┐ ┌──────┐  ┌──────────┐
   │    │API Auth│ │Rate  │  │ Other    │
   │    │Error   │ │Limit │  │ Error    │
   │    └───┬────┘ └──┬───┘  └────┬─────┘
   │        │         │           │
   │        ▼         ▼           ▼
   │    ┌────────────────────────────┐
   │    │  Retry Logic               │
   │    │  • Auth: Re-authenticate   │
   │    │  • Rate: Wait + retry      │
   │    │  • Other: Alert team       │
   │    └────────────────────────────┘
   │
   ▼
┌─────────────────┐
│ Continue to     │
│ Next Step       │
└─────────────────┘
```

---

## Deployment Stages

### Phased Rollout

```
┌────────────────────────────────────────────────────────┐
│  PHASE 1: Foundation (Weeks 1-2)                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │ • n8n setup                                      │ │
│  │ • LinkedIn API auth                              │ │
│  │ • Basic test workflow                            │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│  PHASE 2: Text Automation (Weeks 3-4)                  │
│  ┌──────────────────────────────────────────────────┐ │
│  │ • Quality gates                                  │ │
│  │ • Scheduled publishing                           │ │
│  │ • Engagement tracking                            │ │
│  │ • Test with 6 posts                              │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│  PHASE 3: Multi-Author (Weeks 5-6)                     │
│  ┌──────────────────────────────────────────────────┐ │
│  │ • Ivan + Jonathan authentication                 │ │
│  │ • Author routing logic                           │ │
│  │ • Approval workflow                              │ │
│  │ • Cross-promotion alerts                         │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│  PHASE 4: Advanced (Weeks 7-12)                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ • AI quality checker                             │ │
│  │ • Automated metrics fetch                        │ │
│  │ • Performance reporting                          │ │
│  │ • Continuous optimization                        │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## Monitoring Dashboard (Conceptual)

### What to Track

```
┌─────────────────────────────────────────────────────────┐
│           n8n WORKFLOW HEALTH DASHBOARD                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 Execution Stats (Last 30 Days)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Total Executions:     120                         │ │
│  │  Successful:           115  (95.8%)                │ │
│  │  Failed:               5    (4.2%)                 │ │
│  │  Avg Duration:         28 seconds                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ✅ Quality Gate Stats                                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Posts Validated:      120                         │ │
│  │  Passed:               112  (93.3%)                │ │
│  │  Failed:               8    (6.7%)                 │ │
│  │  Common Issues:                                    │ │
│  │    • Word count: 5                                 │ │
│  │    • Too many emojis: 2                            │ │
│  │    • Buzzwords: 1                                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📅 Publishing Stats                                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Posts Published:      115                         │ │
│  │  By Author:                                        │ │
│  │    • Kyrian:    75  (65%)                          │ │
│  │    • Ivan:      25  (22%)                          │ │
│  │    • Jonathan:  15  (13%)                          │ │
│  │  Avg Engagement:       3.2%                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ⚠️  Recent Errors                                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │  2025-10-20 09:15 - Rate limit (LinkedIn API)     │ │
│  │  2025-10-18 14:32 - OAuth token expired           │ │
│  │  2025-10-15 09:02 - Quality gate failed           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Summary: What Gets Automated

### ✅ Automated

1. **Publishing**
   - Post text to LinkedIn at scheduled times
   - Route to correct author profile
   - Format text (line breaks, hashtags)

2. **Quality Control**
   - Word count validation (120-180)
   - Emoji count (max 2)
   - Hashtag count (exactly 4)
   - Buzzword detection

3. **Tracking**
   - Log post metadata to Google Sheets
   - Fetch engagement metrics after 24 hours
   - Calculate engagement rates

4. **Reporting**
   - Weekly performance summaries
   - Monthly top/bottom performers
   - Trend analysis

5. **Coordination**
   - Multi-author routing
   - Cross-promotion reminders
   - Approval workflows

### ⚠️ Semi-Automated (Manual Step Required)

1. **Carousel Posts**
   - Gamma automation creates slides
   - Manual upload to LinkedIn (API limitation)

2. **Approvals**
   - Slack notification sent
   - Founder clicks approve/reject
   - Workflow proceeds based on choice

3. **Content Creation**
   - Drafts still written manually
   - n8n automates everything after draft is done

### ❌ Not Automated (Intentionally Manual)

1. **Strategic Decisions**
   - Topic selection
   - Brand voice
   - Messaging priorities

2. **Engagement**
   - Responding to comments
   - Building relationships
   - DM conversations

3. **Visual Assets**
   - Logo design
   - Banner creation
   - Custom graphics

---

**Document Version:** 1.0
**Last Updated:** 2025-10-21
**Maintainer:** AI-Whisperers Technical Team

*These diagrams are conceptual. Actual n8n workflows will have more detailed node configurations.*
