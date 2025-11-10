# Content Generation Rules and Constraints

## Hard Constraints

### Word Count
- **Minimum**: 120 words
- **Maximum**: 180 words
- **Target**: 140-160 words (sweet spot for LinkedIn)

### Hashtags
- **Exactly 4 hashtags** per post
- Mix of industry, technology, and niche tags
- No generic hashtags (#success, #business)

### Emojis
- **Maximum 2 emojis** per post
- Use sparingly and purposefully
- Avoid emoji strings

### Forbidden Words (Never Use)
- "revolutionary"
- "game-changing"
- "disruptive"
- "transform your"
- "paradigm shift"
- "synergy"
- "cutting-edge" (unless specific tech reference)
- "industry-leading" (we're 3 months old)
- "proven track record" (only 2 testimonials)
- "years of experience" (founded July 2025)

## Content Distribution

### 60% Services Focus
Posts about our actual offerings and implementations:
- Custom AI solutions
- Automation & integration projects
- Real client work
- Technical implementations
- Product features

### 40% Educational Focus
Posts that teach and share knowledge:
- Agentic design patterns (20 patterns available)
- Technical tutorials and breakdowns
- Lessons learned from building
- Industry insights and frameworks
- Best practices and methodologies

## Required Elements

### Every Post Must Include:
1. **Specific proof point** (commits, testimonials, numbers)
2. **Clear value** (what reader learns or gains)
3. **Honest framing** (no exaggeration or hype)
4. **Actionable insight** (reader can apply something)

### Preferred Structure:
1. **Hook** (1-2 sentences): Grab attention with specific claim
2. **Body** (2-3 short paragraphs): Explain with details and proof
3. **CTA** (1 sentence): Clear next step or question

## Proof Points (Use These)

### Technical Proof Points
- 6 GitHub repositories (all public)
- 32 commits on work hours automation
- 47 commits on infrastructure hub (12 PRs)
- 20 documented agentic patterns
- Hexagonal architecture implementation
- Multi-format reporting (Excel, PDF, HTML, JSON)
- Production Docker deployments
- Web dashboards in production

### Business Proof Points
- 2 B2B clients (WPG Software, WPG Amenities)
- Client testimonials (use verbatim):
  - "Professional, fast, and innovative" (WPG Amenities)
  - "Great collaboration with tangible results" (WPG Software)
- 3 AI courses offered
- Founded July 22, 2025 (3 months old)
- 6 projects in 3 months

### Team Proof Points
- NASA Space Apps Challenge 2023 winner (Ivan - Galactic Problem Solver)
- Computer Science Engineering students (Ivan, Jonathan)
- 4.2/5.0 GPA (Ivan)
- Multiple certifications (AI, Selenium, Microsoft, Hexawise)
- International exchange experience (Ivan, USA 2023)
- Quality engineering at Canadian company (Ivan at Stoic Finch)
- Working at AI-native company (Kyrian)

## Topic Categories

### Primary Topics (60% of posts)

#### 1. Custom AI Solutions (15%)
- Client success stories
- Technical implementations
- Fast deployment methodology
- Clean architecture approach

#### 2. Automation Projects (25%)
- Work hours automation case study
- Infrastructure hub features
- Integration implementations
- Real workflow solutions

#### 3. Real Client Work (10%)
- WPG testimonials breakdown
- Project delivery stories
- Fast deployment examples
- Tangible results

#### 4. Technical Stack (10%)
- Architecture decisions
- Technology choices
- Implementation details
- Code quality practices

### Educational Topics (40% of posts)

#### 1. Agentic Patterns (20%)
- One post per pattern (20 total available)
- Pattern selection guides
- Trade-off analysis
- Implementation examples

#### 2. Building in Public (10%)
- Progress updates
- Challenges and solutions
- Lessons learned
- Transparent journey

#### 3. Thought Leadership (5%)
- AI adoption strategies
- Trust models and governance
- SOP-to-Agent transformation
- Measurement frameworks

#### 4. Team Stories (5%)
- Founder journeys
- Student advantage
- Paraguay positioning
- Certifications and achievements

## Content Quality Standards

### Minimum Quality Score: 70/100

#### Scoring Breakdown:
- **Authenticity** (30 pts): All claims verifiable, no forbidden words
- **Clarity** (25 pts): Jargon-free, specific examples, active voice
- **Value** (25 pts): Actionable insight, teaches something
- **Format** (20 pts): Proper structure, word count, hashtags

### Auto-Reject Criteria (Score < 70)
- Contains forbidden words
- Word count outside 120-180 range
- More than 2 emojis
- Not exactly 4 hashtags
- No proof points included
- Vague or generic claims
- Exaggerated credentials

## Validation Rules

### Pre-Publish Checklist

✅ **Authenticity Check**:
- [ ] All claims are verifiable (commits, testimonials, numbers)
- [ ] No forbidden words used
- [ ] Honest about stage (3 months old, students)
- [ ] No fake metrics or made-up results

✅ **Content Check**:
- [ ] Word count: 120-180 words
- [ ] Exactly 4 hashtags
- [ ] Max 2 emojis
- [ ] Specific proof point included
- [ ] Clear value for reader

✅ **Brand Check**:
- [ ] Professional yet approachable tone
- [ ] Evidence-based (not hype-driven)
- [ ] Builder-focused (practical, not theoretical)
- [ ] Pragmatic (results over promises)

✅ **Format Check**:
- [ ] Hook (1-2 sentences)
- [ ] Body (2-3 short paragraphs)
- [ ] CTA (1 sentence)
- [ ] Scannable (white space, bullets if needed)

## Post Variations

### Required Variation Types
- **service-showcase**: Highlight specific service or offering
- **tool-tutorial**: Teach how to use or build something
- **concept-explained**: Demystify technical concept
- **case-study**: Real project or client story
- **how-to**: Step-by-step guide or framework

### Ensure Mix
No more than 2 consecutive posts of same variation type

## Hashtag Rotation Strategy

### Mix These Categories:

**Industry (Pick 1)**:
- #AI
- #Automation
- #DevOps
- #AIOps
- #MLOps

**Technology (Pick 1)**:
- #Python
- #TypeScript
- #FastAPI
- #Docker
- #NestJS

**Concept (Pick 1)**:
- #BuildInPublic
- #MultiAgentSystems
- #AgenticAI
- #CleanArchitecture
- #HexagonalArchitecture

**Niche (Pick 1)**:
- #TimeTracking
- #WorkflowAutomation
- #ProcessOptimization
- #SOPAutomation
- #AIAdoption

### Avoid Repetition
Don't use exact same 4 hashtags in consecutive posts

## Content Cadence Rules

### Frequency
- **LinkedIn workflow**: Every 3 days (approximately 2 posts/week)
- **Daily workflow**: Every day at 9 AM

### Batch Size
- Generate 5 variations per run
- Approve posts with quality score ≥ 70
- Flag posts with score < 70 for revision

### Topic Rotation
Within each batch of 5:
- At least 3 different variation types
- Mix of services (60%) and educational (40%)
- No duplicate topics
- Variety in proof points used

## Output Schema (Strict)

```json
{
  "variation": "service-showcase | tool-tutorial | concept-explained | case-study | how-to",
  "hook": "1-2 sentence attention grabber with specific claim",
  "body": "2-3 short paragraphs with details and proof points",
  "cta": "Clear next step or engagement question",
  "hashtags": ["exactly", "four", "hashtags", "here"],
  "word_count": 120-180,
  "emoji_count": 0-2,
  "quality_score": 0-100,
  "proof_points_used": ["list", "of", "evidence"],
  "validation_passed": true/false
}
```

## Links and CTAs

### Approved Links
- GitHub repositories: https://github.com/Ai-Whisperers
- Website: https://ai-whisperers-portfolio-website.vercel.app/
- LinkedIn profiles (Kyrian, Ivan, Jonathan)
- Specific repos (work-hours, company-information, agentic-schemas)

### CTA Patterns
- "What's your experience with [X]?"
- "Follow for more [specific topic]"
- "See our code on GitHub"
- "Check out the full framework"
- "Thoughts on [specific question]?"

### Avoid
- "DM me" (too salesy)
- "Click here now" (too pushy)
- "Limited time" (not authentic)
- "Don't miss out" (FOMO tactics)

## Special Considerations

### Transparency Requirements
- Always acknowledge we're 3 months old when relevant
- Frame as students building real products (not fake experts)
- Link to public GitHub code when discussing technical work
- Use client quotes verbatim (never paraphrase testimonials)
- Label anecdotal claims as such

### Paraguay Positioning
- Mention geography when relevant to story
- Frame as unique advantage (bridging LATAM and global)
- No apologizing for location (it's a differentiator)
- Connect to international achievements (NASA, USA exchange)

### Student Framing
- Present as advantage (fresh perspectives, modern tech)
- Emphasize active learning + real building
- Highlight academic achievements (4.2 GPA, certifications)
- Show results speak louder than credentials

## Error Prevention

### Common Mistakes to Avoid
1. ❌ Using forbidden words (game-changing, revolutionary, etc.)
2. ❌ Exceeding word count (>180 words)
3. ❌ Too many hashtags (>4) or too few (<4)
4. ❌ Excessive emojis (>2)
5. ❌ No proof points (everything must be verifiable)
6. ❌ Vague claims without specifics
7. ❌ Fake metrics or made-up numbers
8. ❌ Exaggerating experience or credentials
9. ❌ Overpromising without evidence
10. ❌ Copying content from others without attribution

### Quality Gates
1. **Hard Validation**: Schema compliance (word count, hashtags, structure)
2. **Soft Validation**: Quality score ≥ 70 (authenticity, clarity, value, format)
3. **Human Review**: Flagged posts reviewed before publication

## Content Freshness

### Avoid Repetition
- Track recent topics to prevent duplicates
- Vary proof points across posts
- Rotate hashtag combinations
- Mix variation types in each batch

### Stay Current
- Reference recent commits and updates
- Mention latest milestones (Ivan full-time, new projects)
- Update context as company grows
- Refresh proof points regularly

## Version Control

**Manifest Version**: 2.0.0
**Last Updated**: November 7, 2025
**Next Review**: Monthly or when company milestones change

### Change Log
- **2.0.0**: Initial content generation rules and constraints document
