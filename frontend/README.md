# War Table Frontend

The beautiful, self-contained frontend for War Table — where five leading AI models debate your questions.

**Live:** [https://war-table.is-a.dev/](https://war-table.is-a.dev/) (GitHub: https://nostalgicgarethdev.github.io/war-table/)

![WARTABLE AGENTS](src/assets/wartable-agents-bg.jpg)

## ✨ What makes it nice

- **Fully standalone** — Rich client-side simulation. No backend or keys needed.
- **Professional dark theme** — Cyber-inspired but refined, with the official WARTABLE AGENTS poster as a dramatic full-screen background.
- **Glassmorphic UI** — Elegant frosted panels with backdrop blur.
- **Configurable debates** — Pick rounds and which models join.
- **Smooth & polished** — Thoughtful animations, great typography, excellent mobile support.

## 🛠️ Tech

- React 19 + TypeScript
- Vite
- Custom CSS (design tokens + glassmorphism)
- No external UI libs — everything hand-crafted for this experience

## 🚀 Run locally

```bash
cd frontend
npm install
npm run dev
```

## 📦 Build & Deploy

```bash
npm run build
npm run preview
```

Deploys automatically via GitHub Actions to GitHub Pages (official `actions/deploy-pages`).

## 🖼️ The Background

The WARTABLE AGENTS poster lives in `src/assets/wartable-agents-bg.jpg` and is used as a fixed, high-impact background. The UI layers professional glass surfaces over it.

## 📁 Key Files

- `src/App.tsx` — The entire experience (setup + simulation + UI)
- `src/App.css` — Professional dark theme + glass effects
- `vite.config.ts` — `base: '/war-table/'` for GitHub Pages

## 🎯 Model Colors

- Claude — Deep blue
- GPT-5 — Emerald
- Gemini — Amber
- Qwen — Violet
- Grok — Red

## 🔄 How the demo works

1. You enter a question + choose config.
2. Pure JS simulation runs 3 rounds (or however many you picked).
3. Models respond with distinct personalities.
4. Final verdict with agreements/disagreements.
5. Copy full transcript.

Everything is instant and works offline after load.

## 🧹 Repo notes

This frontend is the main deliverable. The `backend/` folder is kept for future real-model integration.

---

*Polished, professional, and proud to show the official WARTABLE AGENTS artwork.* 

Made by Gareth Lee.
