# Quick Start: Gamma Carousel Automation

**Get your first LinkedIn carousel created in 5 minutes**

---

## ⚡ Fast Track

```bash
# 1. Run the automation
npm run carousel drafts/carousel-ticket-triage-outline.md

# 2. When browser opens, log in to Gamma.app

# 3. Press ENTER in terminal when logged in

# 4. Watch as slides are created automatically

# 5. Manually select theme when prompted

# 6. Export as PDF when complete

# Done! Your carousel is ready for LinkedIn.
```

---

## 🎬 First Time Setup

### Install (if needed)
```bash
npm install
npx playwright install chromium
```

**That's it!** You're ready to go.

---

## 📸 What to Expect

### Step 1: Browser Opens
- Chromium browser window appears
- Navigates to gamma.app
- Wait for login screen

### Step 2: Login
```
⚠️  MANUAL STEP REQUIRED:
Please log in to your Gamma account in the browser window.
Press ENTER in this terminal once you are logged in...
```

**Action:** Log in with your Gamma credentials, then press ENTER in terminal.

### Step 3: Automation Runs
```
📄 Creating new presentation...
✓ New presentation created

📝 Adding Slide 1: Hook
   Title: 30% Faster Ticket Resolution...
   Content: Here's how we built a triage agent...
✓ Slide 1 added

📝 Adding Slide 2: Problem
...
```

**Action:** Watch the terminal output. If prompted, press ENTER to continue.

### Step 4: Theme Selection
```
🎨 Applying theme: Professional
⚠️  Please manually select the theme and press ENTER to continue...
```

**Action:**
1. Click "Theme" or "Design" in Gamma
2. Select "Professional" (or your preferred theme)
3. Press ENTER in terminal

### Step 5: Export
```
📥 Exporting presentation as PDF...
⚠️  Please manually select "PDF" export format
Complete the export, then press ENTER to finish...
```

**Action:**
1. Click "Export" or "Download" in Gamma
2. Select "PDF" format
3. Save to `outputs/carousels/`
4. Press ENTER in terminal

### Step 6: Complete
```
✅ Automation complete!
Your presentation is ready for LinkedIn publishing.

Press ENTER to close the browser...
```

**Action:** Press ENTER to close browser and finish.

---

## 🎯 Next Steps After Automation

1. **Review Presentation**
   - Open your exported PDF
   - Check all slides for accuracy
   - Verify formatting looks good

2. **Make Manual Adjustments** (optional)
   - Adjust colors in Gamma
   - Add brand logo
   - Insert icons or images
   - Refine spacing

3. **Publish to LinkedIn**
   - Go to LinkedIn
   - Create new post
   - Upload PDF as carousel
   - Copy caption from carousel outline
   - Add hashtags
   - Publish!

4. **Track Performance**
   - Log in `outputs/ENGAGEMENT_TRACKER.md`
   - Monitor impressions and engagement
   - Note what worked well

---

## 💡 Pro Tips

### Before Running
- **Review your markdown** - Ensure slide content is finalized
- **Have Gamma login ready** - Save time by having credentials handy
- **Choose a theme** - Know which Gamma theme you want

### During Automation
- **Watch the terminal** - It will prompt you when input is needed
- **Don't close browser** - Let automation complete
- **Take screenshots** - Gamma auto-saves, but screenshots help

### After Automation
- **Export immediately** - Don't lose your work
- **Save to outputs/carousels/** - Keep organized
- **Keep Gamma link** - Easy to edit later

---

## 🚨 Common Issues

### "File not found" error
```bash
# Use correct path relative to project root
npm run carousel drafts/carousel-ticket-triage-outline.md
# Not: carousel-ticket-triage-outline.md
```

### Browser doesn't open
```bash
# Reinstall Playwright browsers
npx playwright install chromium
```

### Slides not creating
- Automation will prompt you to continue manually
- Add slides yourself and press ENTER when ready
- Automation will continue with next slide

### Can't find export button
- Look for "Share" → "Export" in Gamma
- Or "Download" button in top-right
- Manual export is fine - just press ENTER in terminal when done

---

## 📋 Pre-Flight Checklist

Before running automation:

- [ ] Carousel markdown file is complete
- [ ] `npm install` has been run
- [ ] Playwright browsers installed
- [ ] Gamma.app account exists (free is fine)
- [ ] Internet connection is stable
- [ ] Terminal is ready for prompts

**All checked?** Run: `npm run carousel drafts/carousel-ticket-triage-outline.md`

---

## ⏱ Time Breakdown

| Step | Time | Notes |
|------|------|-------|
| Setup (first time) | 2-3 min | Install dependencies |
| Login | 30 sec | Manual step |
| Automation | 3-5 min | 7 slides created |
| Theme selection | 1 min | Manual step |
| Export | 1 min | Manual step |
| **Total** | **5-10 min** | vs. 20-30 min manual |

**Time saved:** 15-20 minutes per carousel

---

## 🎓 Learning Mode

Want to understand what's happening?

```bash
# Run with slower speed to watch
node automation/runCarousel.js drafts/carousel-ticket-triage-outline.md --slowMo=1000

# Check debug screenshots
ls automation/screenshots/

# Review parsed data
npm run parse drafts/carousel-ticket-triage-outline.md test.json
cat test.json
```

---

## 🔄 Create Your Own Carousel

1. **Copy template**
   ```bash
   cp drafts/carousel-ticket-triage-outline.md drafts/carousel-my-new-topic.md
   ```

2. **Edit content**
   - Update title and metadata
   - Write 7 slide outlines
   - Follow same format

3. **Run automation**
   ```bash
   npm run carousel drafts/carousel-my-new-topic.md
   ```

4. **Publish!**

---

## 📞 Need Help?

1. **Read full docs:** `automation/README.md`
2. **Check screenshots:** `automation/screenshots/`
3. **Review terminal output:** Look for error messages
4. **Test parser:** `npm run parse your-file.md output.json`

---

## ✅ Success!

You've created your first automated LinkedIn carousel!

**Next:**
- Create more carousels from your content calendar
- Experiment with different themes
- Track which carousels perform best
- Refine your process

**Remember:** The automation handles the repetitive work. You focus on creating great content.

---

**Ready? Run this now:**
```bash
npm run carousel drafts/carousel-ticket-triage-outline.md
```

🚀 Let's go!
