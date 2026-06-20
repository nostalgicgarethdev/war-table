# War Table

**5 AIs. One Decision.**

A beautiful, self-contained demo where Claude, GPT-5, Gemini, Qwen, and Grok debate your toughest questions in three structured rounds — and deliver a single, thoughtful verdict.

**Live demo (quick):** [https://nostalgicgarethdev.github.io/war-table/](https://nostalgicgarethdev.github.io/war-table/)

Custom domain (wartable.qzz.io) coming soon once DNS settles.

![WARTABLE AGENTS poster background](frontend/src/assets/wartable-agents-bg.jpg)

## Custom Domain (coming soon)

Your site is set up for `wartable.qzz.io` (use the GitHub URL above for now).

### Quick explanations
- **Name Server (NS):** The "brain" that manages your domain's DNS records. For qzz.io subdomains it's handled in the DigitalPlat dashboard (or Cloudflare if you set custom nameservers). You rarely change this.
- **CNAME:** A DNS "alias" record. It makes `wartable.qzz.io` point to GitHub Pages (`nostalgicgarethdev.github.io`).

### DNS Configuration

**If you can add records directly:**
- Log into Digiplat (or your DNS provider).
- Add a **CNAME** record:
  - **Name / Host**: `@` (or leave blank / `wartable`)
  - **Target / Value**: `nostalgicgarethdev.github.io`
  - TTL: 300

**If you only see the Nameserver option (common with qzz.io):**
You must delegate DNS to Cloudflare (free & recommended).

1. Go to [cloudflare.com](https://dash.cloudflare.com) and log in (create free account if needed).
2. Click **Add a Site** → enter `wartable.qzz.io` → Continue.
3. Cloudflare will show 2 nameservers (e.g. `ada.ns.cloudflare.com` and another).
4. Copy them.
5. Back in Digiplat dashboard for `wartable.qzz.io`:
   - Find the **Nameserver** section.
   - Add / set the two Cloudflare nameservers.
   - Save.
6. Wait for Cloudflare to say "Active" (check email or dashboard, can take minutes to hours).
7. In Cloudflare → DNS tab for the site:
   - Add record:
     - Type: **CNAME**
     - Name: `@`
     - Target: `nostalgicgarethdev.github.io`
     - **Proxy status: DNS only** (turn the orange cloud off)
   - Save.

If using Porkbun instead:
- Use the "Github" quick config button if available, or manually add the CNAME as above.

### GitHub Pages Configuration
1. Go to your repo → **Settings → Pages**
2. Under **Custom domain**, enter: `wartable.qzz.io`
3. Click Save.
4. Once the check passes, enable **Enforce HTTPS**.

The `site/CNAME` file already contains `wartable.qzz.io` and gets deployed automatically.

Both URLs will work:
Use the GitHub URL for now: https://nostalgicgarethdev.github.io/war-table/

(Custom domain setup is ready but DNS propagation is still settling.)

They serve the exact same content. The github.io URL will keep working even after the custom domain is live.

### Note on Porkbun
If you're setting up a new domain on Porkbun instead:
- Add the CNAME as described.
- Then tell me the exact domain name and I'll update all files here.

### Troubleshooting
- "DNS probe failed", NXDOMAIN, or doesn't resolve?
  1. Go to GitHub repo **Settings → Pages** and enter `wartable.qzz.io` in Custom domain, then Save. This triggers GitHub's check.
  2. In Cloudflare DNS: confirm CNAME record exists with **Name: @**, Target `nostalgicgarethdev.github.io`, and **Proxy: DNS only** (gray cloud, not orange).
  3. In Digiplat: confirm nameservers are exactly the two from Cloudflare.
  4. Wait 5-30 minutes (sometimes longer). Use `dig wartable.qzz.io` or https://dnschecker.org to test.
- GitHub DNS check still failing after that? The `site/CNAME` file must exactly match the domain you entered (it does). Re-save in GitHub.
- Still seeing old GitHub URL? DNS not fully propagated yet. Hard refresh or use incognito.

## ✨ Features

- **Fully standalone** — No backend or API keys required. Everything runs beautifully in the browser.
- **Rich simulation** — Each model has a distinct personality and argues across Opening Statements → Rebuttals → Synthesis.
- **Interactive & configurable** — Choose number of rounds and which models participate.
- **Stunning UI** — Professional dark cyber theme with the official WARTABLE AGENTS poster as a dramatic full-screen background, glassmorphic panels, and smooth animations.
- **Deployed via GitHub Actions** — Clean static site on GitHub Pages.

## 🚀 Quick Start

```bash
git clone https://github.com/nostalgicgarethdev/war-table.git
cd war-table/frontend
npm install
npm run dev
```

Open http://localhost:5173 — enter any question and watch the agents debate.

## 🛠️ Project Structure (Frontend-focused)

```
war-table/
├── frontend/              # The beautiful React demo (the star of the show)
│   ├── src/
│   │   ├── App.tsx        # Main app + debate simulator
│   │   ├── App.css        # Professional dark + glassmorphic styles
│   │   └── assets/        # WARTABLE AGENTS background
│   ├── public/
│   └── vite.config.ts
├── backend/               # (Optional) Future real model integrations
├── .github/workflows/deploy.yml  # Official GitHub Pages deployment
└── README.md
```

## 📦 Deployment

The site is automatically deployed to GitHub Pages using the official Actions workflow.

1. Push to `main`.
2. GitHub Actions builds the frontend and deploys the `dist` folder.
3. Settings → Pages must be set to **GitHub Actions**.

The WARTABLE AGENTS background image is included and will display beautifully.

## 🧹 Repo Cleanup

- Proper `.gitignore` (no node_modules, builds, or dist committed)
- Legacy static demos cleaned up
- Frontend is now the primary, polished experience
- Image assets properly managed via Vite

## 🎨 Design Notes

- Dark professional theme with cyber accents
- The official poster serves as a fixed, dramatic background
- Glassmorphic surfaces for depth and elegance
- Fully responsive and accessible

---

Made with ❤️ for great AI debates. The frontend looks really nice. 

(Backend exists for future real API calls if you want to extend it.)
```env
PORT=3001
NODE_ENV=development

# Optional: API keys for real AI model access
# ANTHROPIC_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
# GOOGLE_API_KEY=your_key_here
# XAI_API_KEY=your_key_here
# QWEN_API_KEY=your_key_here
```

> **Note**: The system works perfectly in mock mode without API keys for testing and development!

### Running Locally
```bash
# Start backend development server
cd backend
npm run dev
# Server runs on http://localhost:3001

# In a new terminal, start frontend development server  
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build
# Output in ./dist directory

# Build backend
cd backend
npm run build
# Output in ./build directory
```

## 🧪 Testing

```bash
# Run backend tests (if implemented)
cd backend
npm test

# Run frontend tests (if implemented)  
cd frontend
npm test

# Linting
npm run lint  # Runs both frontend and backend linting
```

## 🚀 Deployment

### Frontend (GitHub Pages) — Recommended
The beautiful, fully self-contained React frontend is automatically built and deployed using the official GitHub Pages action:

- Push to `main` (or manual dispatch) → GitHub Actions builds the React app and deploys the `dist/` folder
- Live site: https://nostalgicgarethdev.github.io/war-table/
- 100% static — works instantly with rich simulated debates (no backend required)
- Workflow: `.github/workflows/deploy.yml`

**Important:** In your repo, go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions** (not "Deploy from a branch").

To deploy locally for testing:
```bash
cd frontend
npm run build
# Open the dist/ folder or use any static host (Netlify, Vercel, Pages, Surge, etc.)
```

### Full Stack (Local Development)
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Backend (Optional Production Hosting)
If you want real AI model calls, deploy the backend separately (Render, Railway, Fly.io, etc.) and update the frontend to point at it.

### Legacy
Old pure-HTML demos live in `static-site/` and `simple-site/` (mostly historical).

## 📖 API Reference

### Start a Debate
```
POST /api/debate/start
Body: { "question": "string", "config": { "rounds": number, "models": string[] } }
Response: { "sessionId": "string", "message": "string" }
```

### Get Debate Details
```
GET /api/debate/:sessionId
Response: Full debate session object
```

### Get All Debates
```
GET /api/debate/
Response: Array of debate session summaries
```

### Get Debate Results/Verdict
```
GET /api/debate/:sessionId/results
Response: { sessionId, question, verdict, rounds, completedAt }
```
Returns 400 if debate not completed.

## 🤖 AI Model Personalities

Each model has a distinct response style in mock mode:

- **Claude**: Careful, evidence-based reasoning with balanced analysis
- **GPT-5**: Comprehensive, structured, multi-faceted perspectives  
- **Gemini**: Analytical, detail-oriented with strong logical flow
- **Qwen**: Efficient, practical, solution-focused approach
- **Grok**: Direct, unconventional thinking with bold perspectives

## ⚙️ Configuration

Debate settings can be customized when starting a session:
- `rounds`: Number of debate rounds (default: 3)
- `models`: Array of model IDs to include (default: all 5)
- Future enhancements: temperature, maxTokens, custom prompts

## 🔬 How It Works

1. **Question Submission**: User enters a question through the frontend
2. **Session Creation**: Backend creates unique debate session with ID
3. **Round Processing**: 
   - Orchestrator sends prompts to each model per round
   - Context from previous rounds is preserved and included
   - Models generate responses based on their personalities
4. **Consensus Generation**: After final round, consensus engine analyzes responses
5. **Result Delivery**: Complete debate transcript and verdict returned to user
6. **Visualization**: Frontend displays real-time progress and final results

## 📚 Extending the System

### Adding a New Debate Round
1. Create round handler in `backend/src/debate/rounds/` (e.g., `crossExamination.ts`)
2. Implement round-specific prompting and response logic
3. Register the round type in `backend/src/debate/orchestrator.ts`
4. Update debate flow configuration
5. Add corresponding UI components if needed
6. Write unit tests

### Integrating a New AI Model
1. Add API client wrapper in `backend/src/models/` following base interface
2. Configure model-specific parameters (token limits, preferences)
3. Add model to registry in `backend/src/models/provider.ts`
4. Implement response normalization if needed
5. Update model configurations and rate limits
6. Test with sample prompts
7. Document characteristics

### Modifying Consensus Algorithm
1. Locate consensus logic in `backend/src/consensus/`
2. Implement new algorithm (weighted scoring, iterative refinement, etc.)
3. Create comprehensive test cases
4. Benchmark with sample debates
5. Update documentation
6. Consider A/B testing framework

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by multi-agent AI systems and debate methodologies
- Built with modern web technologies: React, Vite, Node.js, TypeScript
- Thanks to the open-source AI community for advancing LLM capabilities

---
*Created with ❤️ by Gareth Lee. Let the AI models debate your toughest questions!*

## 🐳 Node.js Compatibility

This project is compatible with Node.js 18+. The GitHub Actions workflow uses Node.js 18 to avoid deprecation warnings. If you need to use Node.js 20 locally, ensure you have the appropriate version installed.

