# War Table Frontend

The frontend component of the War Table AI Debate System - a React/Vite application that provides an interactive interface for users to engage with AI model debates.

## 🎨 Features

- **Real-time Debate Visualization**: Watch as AI models debate across three structured rounds
- **Model-Specific Styling**: Each AI model has distinct visual identity (colors, avatars)
- **Progress Tracking**: Real-time updates on debate status and current round
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Controls**: Start new debates, cancel ongoing sessions, view complete transcripts
- **Verdict Presentation**: Clear display of final consensus with confidence scores and supporting models

## 🛠️ Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and production builds
- **Styling**: Custom CSS with CSS variables and responsive design
- **State Management**: React hooks (useState, useEffect, useRef)
- **HTTP Client**: Fetch API for communicating with backend

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components (if any)
│   ├── App.tsx         # Main application component
│   ├── App.css         # Styling for the application
│   ├── index.css       # Global styles
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## 🔧 Development

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
# Runs at http://localhost:5173
```

### Production Build
```bash
npm run build
# Outputs to ./dist directory
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 🖥️ UI Components

### Main Views
- **Debate Setup**: Input field for questions and start button
- **Debate View**: Real-time display of debate progress, model responses, and final verdict
- **Debate Waiting**: Loading states during debate processing
- **Debate Actions**: Controls to start new debates or cancel ongoing sessions

### Visual Elements
- **Model Indicators**: Color-coded dots representing each AI model in the header
- **Progress Bar**: Visual indicator of debate round completion
- **Model Response Cards**: Individual responses from each AI model with distinct left-border colors
- **Verdict Section**: Well-formatted display of the final consensus opinion

## 🎯 Model Color Coding

Each AI model is represented by a specific color throughout the interface:

- **Claude**: `#1e3c72` (Deep Blue)
- **GPT-5**: `#10b981` (Emerald Green)
- **Gemini**: `#f59e0b` (Amber Yellow)
- **Qwen**: `#8b5cf6` (Violet Purple)
- **Grok**: `#ef4444` (Red)

## 🔄 Data Flow

1. User submits question through input form
2. Frontend sends POST request to `/api/debate/start` on backend
3. Backend returns session ID
4. Frontend begins polling `/api/debate/:sessionId` every 3 seconds
5. Backend returns updated debate status including new responses
6. Frontend updates UI in real-time as data arrives
7. When debate completes, final verdict is displayed
8. User can start new debate or view history

## 🌐 Deployment

This frontend is configured for automatic deployment to GitHub Pages via GitHub Actions:

- **Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: Pushes to `main` branch
- **Build Command**: `npm run build`
- **Publish Directory**: `./frontend/dist`
- **Published URL**: `https://nostalgicgarethdev.github.io/war-table/`

### Environment
The frontend is configured to use different base paths:
- Development: `/` (root)
- Production: `/war-table/` (for GitHub Pages project site)

This is handled in `vite.config.ts`:
```typescript
base: process.env.NODE_ENV === 'production' ? '/war-table/' : '/',
```

## 🧪 Testing

While this project doesn't currently include automated tests, you can manually test:

1. **UI Interactions**: 
   - Enter various types of questions (simple, complex, controversial)
   - Test Enter key submission
   - Test button disabled states during loading

2. **Debate Flow**:
   - Verify all 5 models respond in each round
   - Check that context is properly maintained between rounds
   - Confirm three-round structure completes properly
   - Validate final verdict generation

3. **Responsive Design**:
   - Test on different screen sizes (mobile, tablet, desktop)
   - Verify layout adapts appropriately
   - Check touch targets and readability

## 📱 Browser Support

The frontend targets modern browsers that support:
- ES6+ features
- CSS Flexbox and Grid
- Fetch API
- React 19

Compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Common Issues

**1. Cannot connect to backend**
- Ensure backend is running on `http://localhost:3001`
- Check network connectivity and CORS settings
- Verify backend health endpoint: `http://localhost:3001/health`

**2. Stuck on loading/waiting states**
- Check browser console for fetch errors
- Verify backend is processing the debate correctly
- Try refreshing the page and starting a new debate

**3. Layout issues on mobile**
- Ensure viewport meta tag is present in HTML
- Check CSS media queries in App.css
- Verify flexible units (%, vw, vh) are used appropriately

## 📄 License

This frontend is part of the War Table AI Debate System and is licensed under the MIT License.

## 🙏 Acknowledgements

- Built with [React](https://reactjs.org/)
- Powered by [Vite](https://vitejs.dev/)
- Inspired by multi-agent AI debate systems
- Thanks to the open-source web development community

---
*Frontend component of War Table AI Debate System • Created by Gareth Lee*
