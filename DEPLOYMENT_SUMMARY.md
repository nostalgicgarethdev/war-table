# War Table AI Debate System - Deployment Summary

## ✅ Current Production Site (Recommended)
The primary deployed experience is the polished **React + Vite** frontend:

- ✅ Fully self-contained (runs beautifully on GitHub Pages, Netlify, Vercel, etc. with no backend)
- ✅ Rich client-side simulation of all 5 models across 3 debate rounds
- ✅ Professional UI, animations, copyable transcripts, example questions
- ✅ Automatically built + deployed via GitHub Actions on every push to `main`
- ✅ Live: https://wartable.qzz.io/ (or https://nostalgicgarethdev.github.io/war-table/)

## 📦 How Deployment Works
- Workflow: `.github/workflows/deploy.yml`
- Builds `frontend/` → deploys `frontend/dist` to the `gh-pages` branch
- Uses correct subpath (`/war-table/`) for GitHub Pages

## 🛠 Local Development
```bash
# Frontend only (self-contained demo)
cd frontend && npm run dev

# Full stack (with backend)
cd backend && npm run dev   # Terminal 1
cd frontend && npm run dev  # Terminal 2
```

## Legacy / Historical
- `static-site/index.html` — previous pure Tailwind CDN demo (still functional)
- `simple-site/` — old stub

The modern React frontend is the one you should use and improve.

## 🎯 Site Features
When deployed, users will experience:
- **Beautiful UI**: Gradient backgrounds, animations, glassmorphism effects
- **Interactive Debate**: Enter any question and watch 5 AI models debate in real-time
- **Realistic Personalities**: Each model has distinct response styles:
  - Claude: Careful, evidence-based, balanced
  - GPT-5: Comprehensive, structured, multi-faceted
  - Gemini: Analytical, detail-oriented, logical
  - Qwen: Efficient, practical, solution-focused
  - Grok: Direct, unconventional, bold perspectives
- **Three-Round Process**: Opening statements → Rebuttals → Synthesis & Verdict
- **Final Verdict**: With confidence score, agreement/disagreement points
- **Fully Responsive**: Works on all device sizes

## 📱 Sample Questions to Try
- "What is the meaning of life?"
- "Should we fear artificial intelligence?"
- "Is free will real or an illusion?"
- "What's the best approach to climate change?"
- "Will cryptocurrencies replace traditional currency?"

## 💡 Technical Notes
- The site uses Tailwind CSS and Font Awesome from CDNs
- No build process required - pure HTML/CSS/JS
- Works in offline mode once loaded
- Compatible with all modern browsers
- Zero dependencies - just open and use

---
*Created with ❤️ for showcasing the War Table AI debate concept*
