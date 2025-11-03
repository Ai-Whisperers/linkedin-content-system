# ChatGPT Post Generation System - AI-Whisperers

**Purpose:** Automate LinkedIn post creation using ChatGPT with your webpage content and context files

**Website:** https://ai-whisperers-portfolio-website.vercel.app/

---

## 🎯 System Overview

```
Your Webpage Content
     +
Context Files
     +
ChatGPT Prompts
     ↓
Generated Posts (Review & Approve)
     ↓
LinkedIn Publishing
```

---

## 📋 Step 1: Prepare Your Content Sources

### **Source 1: Your Webpage**

**URL:** https://ai-whisperers-portfolio-website.vercel.app/

**What to Extract:**
1. **Homepage content** (tagline, main message)
2. **About section** (company description)
3. **Services offered** (what you provide)
4. **Team section** (co-founders info)
5. **Projects/Portfolio** (client work)
6. **Testimonials** (WPG quotes)
7. **Contact/CTA** (how to reach you)

**How to Extract:**
```
1. Visit your webpage
2. Copy each section's text
3. Save to: context/webpage/webpage-content.md
```

### **Source 2: Context Files (Already Have)**
- ✅ `context/team/` (3 team members)
- ✅ `context/repos/` (3 repositories)
- ✅ `context/projects/` (2 client projects)

### **Source 3: Events & Updates**
Create: `context/events/events-log.md`

Track:
- Product launches
- Client wins
- Team milestones (Ivan going full-time Oct 27!)
- GitHub releases
- Course updates
- Partnership announcements

---

## 🤖 Step 2: ChatGPT Prompt Templates

### **Master Prompt (Use This First)**

```
I'm creating LinkedIn posts for AI-Whisperers, an AI automation company.

COMPANY CONTEXT:
- Founded: July 22, 2025 (3 months old)
- Location: Paraguay
- Team: 3 co-founders (Kyrian, Ivan, Jonathan)
- Website: https://ai-whisperers-portfolio-website.vercel.app/

CORE VALUES:
- Measurable (real results, no fake metrics)
- Transparent (clear processes, no black boxes)
- Human-centered (AI assists, doesn't replace)
- Iterative (start small, measure early)

VOICE & TONE:
- Professional yet approachable
- Builder-focused ("We built..." not "We offer...")
- Pragmatic over hype
- Honest about being early-stage

POST REQUIREMENTS:
- 120-180 words
- Structure: Hook → Insight → Example → Takeaway → CTA
- 4 hashtags (2 broad: #Automation #AI, 2 niche: #MultiAgentSystems #AgenticAI)
- Max 2 emojis (or 0)
- No buzzwords: "revolutionary," "game-changing," "AI magic"
- Real examples only (no fabricated metrics)

FORBIDDEN:
- ❌ Fake metrics (30% reduction, 18% fewer, etc.)
- ❌ Vague claims without evidence
- ❌ Buzzwords and hype language
- ❌ Claims we can't prove

I'll provide you with content from our webpage, context files, or events. Generate posts following this format.

Ready?
```

---

## 📝 Step 3: Generation Prompts (By Type)

### **Template 1: Webpage-Based Posts**

```
CONTEXT FROM WEBPAGE:
[Paste section from your webpage]

TOPIC: [Specific angle, e.g., "Our services offering"]

Generate a LinkedIn post that:
1. Explains what AI-Whisperers does (from webpage)
2. Uses real information only
3. Shows our pragmatic approach
4. Includes specific services/offerings
5. Ends with invitation to visit website

Format: Hook → Insight → Example → Takeaway → CTA
Length: 120-180 words
Hashtags: #Automation #AI #MultiAgentSystems #AgenticAI
```

**Example Input:**
```
CONTEXT FROM WEBPAGE:
"Enterprise-grade AI solutions that save you time, money, and energy"

Services:
- Custom AI Solutions
- AI Automation & Integration
- AI Education & Training (3 courses: Intro to AI, Agentic Architectures, AI in Business)
- Consulting & Portfolio Development

TOPIC: "Our AI education offering"

[ChatGPT generates post about the 3 courses]
```

---

### **Template 2: Event-Based Posts**

```
EVENT INFORMATION:
[Describe the event/milestone/update]

SIGNIFICANCE:
[Why this matters]

Generate a LinkedIn post that:
1. Announces the event/milestone
2. Provides context
3. Shares what we learned or what it means
4. Invites engagement

Format: Hook → Insight → Example → Takeaway → CTA
Length: 120-180 words
Tone: Building in public, honest, excited but not hype
```

**Example Input:**
```
EVENT INFORMATION:
Ivan Weiss is going full-time with AI-Whisperers starting October 27, 2025. He's leaving his QA Engineer role at Stoic Finch (Canada) to focus completely on building multi-agent automation systems.

SIGNIFICANCE:
Shows commitment to the company, milestone for 3-month-old startup, demonstrates growth

[ChatGPT generates announcement post]
```

---

### **Template 3: Service/Offering Posts**

```
SERVICE FROM WEBPAGE:
[Copy service description from website]

TARGET AUDIENCE:
[Who needs this service]

PAIN POINT:
[What problem it solves]

Generate a LinkedIn post that:
1. Identifies the pain point
2. Explains our approach to solving it
3. Uses real project examples if available
4. Clear CTA (visit website or DM)

No fake metrics - use approach and philosophy instead.
```

---

### **Template 4: Client Work / Testimonial Posts**

```
CLIENT: [Client name]
TESTIMONIAL: [Exact quote]
PROJECT TYPE: [What you delivered]

CONTEXT FROM PROJECTS:
[Paste from context/projects/ file]

Generate a LinkedIn post that:
1. Features the testimonial prominently
2. Explains what we delivered
3. Shows our delivery approach
4. Emphasizes the words in the testimonial
5. CTA: Similar project needs

Use client quote verbatim. No exaggeration.
```

**Example:**
```
CLIENT: WPG Amenities
TESTIMONIAL: "Professional, fast, and innovative"
PROJECT TYPE: Real estate portfolio website

[ChatGPT generates post highlighting these 3 words]
```

---

### **Template 5: Technical Deep-Dive Posts**

```
TECHNICAL TOPIC:
[From repos or projects]

SOURCE CONTEXT:
[Paste from context/repos/ file]

TARGET AUDIENCE: DevOps leads, engineering managers, CTOs

Generate a LinkedIn post that:
1. Explains the technical approach
2. Shares lessons learned
3. Provides actionable insights
4. Avoids jargon unless necessary
5. Shows pragmatic decision-making

Focus on "why" not just "what"
```

---

## 🔄 Step 4: Batch Generation Workflow

### **Option A: One-by-One (Recommended First)**

1. Open ChatGPT
2. Paste **Master Prompt** (establishes context)
3. For each post, use appropriate template
4. Review ChatGPT output
5. Apply quality checklist
6. Save to `generated-posts/batch-001/`

**Time:** ~5 minutes per post (including review)

---

### **Option B: Batch Generation**

```
I need to generate 10 LinkedIn posts. Here's the master context:

[Paste Master Prompt]

Here are the 10 topics:

1. TOPIC: Agentic Pattern #2 - Routing
   SOURCE: [Paste pattern info from agentic-schemas]

2. TOPIC: Ivan going full-time Oct 27
   EVENT: [Paste event details]

3. TOPIC: Our AI Education courses
   WEBPAGE: [Paste courses info from website]

... (continue for all 10)

Generate all 10 posts, numbered 001-010, following the format.
Each post should be 120-180 words, include 4 hashtags.
```

**Time:** ~10-15 minutes for 10 posts (then review each)

---

## 📊 Step 5: Quality Review Process

### **After ChatGPT Generates Post:**

1. **Copy to File**
   - Save as: `generated-posts/batch-001/XXX-[topic].md`

2. **Run Quality Checks:**
   ```
   - [ ] 120-180 words (count them)
   - [ ] No fake metrics
   - [ ] Real examples or webpage content
   - [ ] 4 hashtags present
   - [ ] Conversational CTA
   - [ ] Matches brand voice
   - [ ] No buzzwords
   ```

3. **Edit if Needed:**
   - Fix word count
   - Adjust tone
   - Remove any hype language
   - Verify factual accuracy

4. **Approve or Revise:**
   - ✅ Move to `approved/` folder
   - ⚠️ Keep in `needs-revision/`
   - ❌ Move to `rejected/`

---

## 📁 Step 6: Set Up Additional Context

### **Create: `context/webpage/webpage-content.md`**

```markdown
# AI-Whisperers Webpage Content

**URL:** https://ai-whisperers-portfolio-website.vercel.app/
**Last Updated:** [Date you extract this]

---

## Tagline

[Copy from homepage]

## Main Headline

[Copy from homepage]

## Services Offered

### Custom AI Solutions
[Description]

### AI Automation & Integration
[Description]

### AI Education & Training
[Description]

Courses:
1. Intro to AI - [description]
2. Agentic Architectures - [description]
3. AI in Business - [description]

### Consulting & Portfolio Development
[Description]

## About Section

[Full about text]

## Team

### Kyrian Weiss
[Info from website]

### Ivan Weiss
[Info from website]

### Jonathan Verdun
[Info from website]

## Testimonials

**WPG Software:**
"Great collaboration with tangible results"

**WPG Amenities:**
"Professional, fast, and innovative"

## Contact/CTA

[How to reach you from website]

## Featured Projects/Work

[Any projects showcased]

---

Use this content as source material for LinkedIn posts.
```

---

### **Create: `context/events/events-log.md`**

```markdown
# Events & Milestones Log - AI-Whisperers

Track company updates, milestones, launches, and events for content generation.

---

## October 2025

### Ivan Going Full-Time (Oct 27, 2025) ⭐
**Event:** Ivan Weiss leaving QA role at Stoic Finch to go full-time with AI-Whisperers
**Significance:** Major milestone, shows commitment, 3-month-old company
**Content Angle:** Building in public, team growth, commitment to vision

### Company Founded (July 22, 2025)
**Event:** AI-Whisperers officially founded
**Significance:** Origin story
**Content Angle:** "3 months in" updates

### WPG Amenities Completed (Sept 30, 2025)
**Event:** Real estate portfolio project delivered
**Testimonial:** "Professional, fast, and innovative"
**Content Angle:** Client success, fast delivery

## November 2025 (Upcoming)

### [Add as events happen]

## December 2025 (Upcoming)

### [Add as events happen]

---

## Content Ideas from Events

1. "Going full-time: Ivan's transition" (Oct 27 announcement)
2. "3 months into AI-Whisperers: lessons learned"
3. "From side project to full-time: our journey"
4. Client delivery milestones
5. Product/course launches
6. GitHub repository milestones
7. Partnership announcements

---

Update this log weekly with new events and milestones.
```

---

## 🎯 Step 7: Sample ChatGPT Session

### **Complete Example: Generating 3 Posts**

**You send to ChatGPT:**

```
I'm creating LinkedIn posts for AI-Whisperers, an AI automation company.

[Paste entire Master Prompt from Step 2]

Ready? Let me give you the first topic.
```

**ChatGPT responds:** "Ready! I understand the context..."

**You send:**

```
TOPIC 1: AI Education Courses

CONTEXT FROM WEBPAGE:
AI-Whisperers offers 3 AI courses via LMS platform:
1. Intro to AI - Foundation and basics
2. Agentic Architectures - Building intelligent systems
3. AI in Business - B2B adoption strategies

TARGET AUDIENCE: Professionals wanting to learn AI

Generate post explaining our educational mission and these 3 courses.
```

**ChatGPT generates post** → You review → Copy to file

**You send:**

```
TOPIC 2: Ivan Going Full-Time

EVENT: Ivan Weiss is going full-time with AI-Whisperers on October 27, 2025. He's leaving his QA Engineer role at Stoic Finch (Canada) to focus completely on building multi-agent automation. This is a major milestone for our 3-month-old company.

IVAN'S BACKGROUND:
- NASA Space Apps Challenge winner (2023)
- QA Engineer at Stoic Finch
- Computer Science Engineering student (4.2/5.0 GPA)
- Philosophy: "If you have to do it more than once, automate it."

Generate announcement post. Tone: Excited but honest, building in public.
```

**ChatGPT generates post** → You review → Copy to file

**Continue for more posts...**

---

## 📈 Expected Output Quality

### **ChatGPT Will Generate:**

```markdown
Three months in, and we're doubling down 🚀

Ivan Weiss is going full-time with AI-Whisperers starting October 27. He's leaving his QA Engineer role at Stoic Finch to focus completely on building transparent multi-agent automation.

This isn't just a career move—it's validation. We started in July with a simple idea: automation should be transparent, pragmatic, and measurable. No hype, no black boxes.

Ivan brings more than credentials (NASA Space Apps winner, 4.2 GPA). He brings a philosophy: "If you have to do it more than once, automate it."

That principle drives everything we build—from our internal tools to client projects to the 20 agentic patterns we've documented.

Building in public means sharing the real journey. This is ours. October 27: Day 1 of full-time.

Follow along as we build automation that actually ships.

#Automation #BuildingInPublic #MultiAgentSystems #AI
```

**Your review:**
- ✅ 149 words (within range)
- ✅ Real event, no fake metrics
- ✅ Honest tone
- ✅ 4 hashtags
- ✅ Good CTA

**Action:** Approve and save!

---

## 🚀 Quick Start Checklist

### **Setup (30 minutes, one-time)**

- [ ] Visit your webpage, copy all content
- [ ] Create `context/webpage/webpage-content.md`
- [ ] Create `context/events/events-log.md`
- [ ] Add current events (Ivan Oct 27, company founding, etc.)
- [ ] Save Master Prompt somewhere accessible

### **Generation Session (10-20 posts in 1 hour)**

- [ ] Open ChatGPT (GPT-4 recommended)
- [ ] Paste Master Prompt
- [ ] Generate 10 posts using templates
- [ ] Review each for quality
- [ ] Save approved posts
- [ ] Schedule Week 1 posts

### **Weekly Routine (15 minutes)**

- [ ] Update events-log.md with new milestones
- [ ] Generate 3-4 posts for next week
- [ ] Review and approve
- [ ] Schedule

---

## 💡 Pro Tips

1. **Keep ChatGPT Context Active**
   - Once you paste Master Prompt, keep that conversation
   - Generate multiple posts in same session
   - ChatGPT remembers the context

2. **Fact-Check Everything**
   - ChatGPT might embellish or assume
   - Verify all claims against your context files
   - Remove anything not factual

3. **Edit for Voice**
   - ChatGPT gets 80% there
   - Tweak to match your exact voice
   - Add personal touches

4. **Track What Works**
   - Note which ChatGPT prompts generate best posts
   - Refine templates based on results
   - Share successful prompts in team

5. **Update Master Prompt**
   - Add new proof points as they happen
   - Update "Founded X months ago"
   - Keep it current

---

## 📊 Expected Efficiency

**Manual (Before):**
- 10 posts = 3-4 hours

**ChatGPT-Assisted (Now):**
- 10 posts = 1 hour (30 min generation + 30 min review)

**Quality Maintained:**
- Human review on every post
- Factual accuracy checked
- Brand voice adjusted
- Authenticity preserved

---

## 🎯 Next Steps

1. **Extract Webpage Content** (15 min)
   - Visit website, copy all sections
   - Save to `context/webpage/webpage-content.md`

2. **Create Events Log** (10 min)
   - Document Ivan's Oct 27 milestone
   - Add other recent events
   - Save to `context/events/events-log.md`

3. **Test ChatGPT Generation** (30 min)
   - Generate first 3 posts
   - Review quality
   - Adjust prompts if needed

4. **Batch Generate** (1 hour)
   - Create 10-20 posts
   - Review and approve best ones
   - Schedule Week 1

---

**Status:** System designed and ready to implement

**Time to First Generated Post:** 30 minutes (setup) + 5 minutes (generate)

**Recommended:** Start with 3 test posts to refine prompts, then batch generate 20.

---

Would you like me to:
1. ✅ Create the webpage-content.md file structure?
2. ✅ Create the events-log.md with Ivan's milestone?
3. ✅ Generate first 3 example posts using ChatGPT format?

