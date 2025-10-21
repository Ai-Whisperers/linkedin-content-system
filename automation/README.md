# Gamma Carousel Automation for LinkedIn

**Automated presentation creation using Playwright and Gamma.app**

Transform your carousel markdown outlines into professional LinkedIn presentations with automated slide creation, theme application, and export.

---

## 🎯 What This Does

This automation tool:
1. **Parses** carousel outline markdown files
2. **Extracts** slide content, titles, and metadata
3. **Launches** Gamma.app in a browser
4. **Creates** slides automatically with your content
5. **Applies** professional themes and formatting
6. **Exports** presentations as PDF for LinkedIn

**Time saved:** ~20-30 minutes per carousel (from manual creation)

---

## 📋 Prerequisites

- **Node.js** 18+ installed
- **npm** package manager
- **Gamma.app account** (free or paid)
- Internet connection

---

## 🚀 Quick Start

### 1. Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
npx playwright install chromium
```

### 2. Run the Automation

**Option A: Full automation (recommended)**
```bash
npm run carousel drafts/carousel-ticket-triage-outline.md
```

**Option B: Step-by-step**
```bash
# Step 1: Parse the markdown file
npm run parse drafts/carousel-ticket-triage-outline.md carousel-data.json

# Step 2: Run Gamma automation
npm run gamma carousel-data.json
```

### 3. During Automation

The script will:
1. Open a browser window to Gamma.app
2. Prompt you to **log in** (first time only)
3. Create slides automatically
4. Pause for manual theme selection
5. Export the presentation

**Important:** Watch the terminal for prompts and press ENTER when instructed.

---

## 📁 File Structure

```
contentCreator/
├── automation/
│   ├── README.md              # This file
│   ├── config.json            # Configuration settings
│   ├── runCarousel.js         # Main runner script
│   ├── parseCarousel.js       # Markdown parser
│   ├── gammaAutomation.js     # Playwright automation
│   ├── carousel-data.json     # Parsed slide data (generated)
│   └── screenshots/           # Debug screenshots (generated)
├── drafts/
│   └── carousel-ticket-triage-outline.md  # Your carousel outlines
└── outputs/
    └── carousels/             # Exported presentations
```

---

## ⚙️ Configuration

Edit `automation/config.json` to customize:

```json
{
  "gamma": {
    "theme": "Professional",      // Gamma theme name
    "slideRatio": "16:9",         // LinkedIn standard
    "fontFamily": "Inter",
    "colorPalette": "neutral"
  },
  "automation": {
    "headless": false,            // Set to true for no browser window
    "slowMo": 300,                // Delay between actions (ms)
    "timeout": 60000,             // Max wait time (ms)
    "screenshotsEnabled": true
  },
  "export": {
    "format": "PDF",              // Export format
    "outputDir": "./outputs/carousels"
  }
}
```

---

## 📝 Carousel Markdown Format

Your carousel outlines should follow this structure:

```markdown
# Gamma Carousel: [Title]

**Title:** "Your Carousel Title"
**Slides:** 7
**Target Audience:** Your audience

---

## Slide 1: Hook

### Title
```
Your slide title here
```

### Content
```
Your slide content here
• Bullet points supported
• Multi-line content
```

### Visual Notes
- Design notes for manual refinement
- Icon suggestions
- Color preferences
```

---

## 🎨 Customization

### Theme Selection

During automation, you'll be prompted to select a theme. Recommended themes:
- **Professional** - Clean, minimal (best for B2B)
- **Modern** - Contemporary design
- **Bold** - High contrast

### Manual Adjustments

After automation completes, you can:
1. Adjust colors and fonts in Gamma
2. Add images or icons
3. Refine spacing and layout
4. Add your logo

---

## 🔧 Troubleshooting

### Browser doesn't open
```bash
# Reinstall Playwright browsers
npx playwright install chromium
```

### Login issues
- Ensure you have a Gamma.app account
- Try logging in manually first at https://gamma.app
- Check your internet connection

### Slides not creating
- The automation uses keyboard shortcuts (Enter, Tab)
- If it fails, you'll be prompted to continue manually
- Screenshots are saved to `automation/screenshots/` for debugging

### Parser errors
```bash
# Validate your markdown format
npm run parse drafts/your-carousel.md test-output.json
# Check test-output.json for accuracy
```

---

## 📊 Usage Examples

### Example 1: Basic usage
```bash
npm run carousel drafts/carousel-ticket-triage-outline.md
```

### Example 2: Headless mode (faster)
```bash
node automation/runCarousel.js drafts/carousel-ticket-triage-outline.md --headless
```

### Example 3: Slow mode (for debugging)
```bash
node automation/runCarousel.js drafts/carousel-ticket-triage-outline.md --slowMo=1000
```

### Example 4: Just parse (no automation)
```bash
npm run parse drafts/carousel-ticket-triage-outline.md preview.json
cat preview.json  # Review parsed data
```

---

## 🔄 Publishing Workflow

1. **Create outline** using `drafts/POST_TEMPLATE.md` as guide
2. **Run automation** with `npm run carousel`
3. **Review in Gamma** - adjust theme, colors, fonts
4. **Export as PDF** from Gamma
5. **Upload to LinkedIn** as carousel post
6. **Add caption** from your carousel outline
7. **Track engagement** in `outputs/ENGAGEMENT_TRACKER.md`

---

## 🎯 Tips for Better Results

### Content Tips
- **Keep text minimal** - 2-3 lines per slide max
- **Use bullet points** - More scannable than paragraphs
- **Bold key metrics** - Put numbers in titles
- **Clear CTAs** - Direct, actionable final slide

### Design Tips
- **Consistent fonts** - Use 1-2 font families max
- **High contrast** - Dark text on light backgrounds
- **Logo placement** - Bottom-right corner (subtle)
- **White space** - Don't overcrowd slides

### LinkedIn Tips
- **16:9 ratio** - Best for LinkedIn carousels
- **Max 20 slides** - Optimal engagement at 7-10 slides
- **Export as PDF** - Better quality than images
- **First slide hooks** - Lead with your best metric

---

## 📈 Performance

Typical automation times:
- **Parser:** < 1 second
- **7-slide carousel:** 5-10 minutes (with manual steps)
- **Export:** 1-2 minutes

**Manual creation time saved:** 20-30 minutes per carousel

---

## 🔐 Security & Privacy

- **Local execution** - All automation runs on your machine
- **No data stored** - Carousel data is temporary
- **Gamma credentials** - You log in manually (secure)
- **Screenshots** - Saved locally for debugging only

---

## 🛠 Advanced Usage

### Custom Parsers

Modify `automation/parseCarousel.js` to support custom markdown formats:

```javascript
// Example: Add custom slide types
if (line.match(/^##\s+Slide\s+\d+:\s+CustomType/)) {
  currentSlide.customField = extractCustomData(line);
}
```

### Extending Automation

Add custom automation steps in `automation/gammaAutomation.js`:

```javascript
// Example: Auto-add logo to all slides
async addLogoToSlides() {
  for (let i = 0; i < this.totalSlides; i++) {
    await this.page.click('button:has-text("Insert")');
    await this.page.click('text=Image');
    // Upload logo...
  }
}
```

### Batch Processing

Process multiple carousels:

```bash
# Create a batch script
for file in drafts/carousel-*.md; do
  npm run carousel "$file"
done
```

---

## 📚 Related Documentation

- **Publishing Workflow:** `brand-docs/PUBLISHING_WORKFLOW.md`
- **Quality Checklist:** `brand-docs/QUALITY_CHECKLIST.md`
- **Content Calendar:** `outputs/CONTENT_CALENDAR.md`
- **Brand Brief:** `brand-docs/BRAND_BRIEF.md`

---

## 🐛 Known Limitations

1. **Manual login required** - Gamma doesn't support API automation
2. **Theme selection manual** - Visual preferences are subjective
3. **Browser-dependent** - Requires stable internet connection
4. **Gamma UI changes** - May need updates if Gamma changes interface

---

## 🔮 Future Enhancements

- [ ] Support for image/icon insertion
- [ ] Auto-logo placement on all slides
- [ ] Batch processing multiple carousels
- [ ] LinkedIn direct upload integration
- [ ] A/B testing different themes
- [ ] Analytics integration (track which carousels perform best)

---

## 💡 Examples

### Successful Carousels Created

1. **Agentized Ticket Triage** (7 slides)
   - Metric-driven hook (30% improvement)
   - Framework breakdown (4-lane model)
   - Real pilot results
   - **Result:** Ready for LinkedIn publication

---

## 🤝 Support

### Issues?
1. Check `automation/screenshots/` for debugging
2. Review terminal output for error messages
3. Validate markdown format with parser
4. Ensure Gamma.app is accessible

### Feedback
- Improve this automation: Submit issues to repo
- Suggest features: Add to README Future Enhancements

---

## 📜 License

Part of AI-Whisperers LinkedIn Content System
Internal use only

---

**Last Updated:** 2025-10-21
**Version:** 1.0
**Maintainer:** AI-Whisperers Content Team

---

## Quick Reference Commands

```bash
# Full automation (recommended)
npm run carousel drafts/carousel-ticket-triage-outline.md

# Parse only
npm run parse drafts/carousel-ticket-triage-outline.md output.json

# Gamma automation only
npm run gamma carousel-data.json

# Help
node automation/runCarousel.js --help
```

**Ready to create your first LinkedIn carousel? Start with:**
```bash
npm run carousel drafts/carousel-ticket-triage-outline.md
```
