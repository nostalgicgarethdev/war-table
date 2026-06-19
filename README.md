# War Table AI Debate System

A sophisticated AI debate platform where five distinct AI models (Claude, GPT-5, Gemini, Qwen, and Grok) engage in structured three-round debates to provide comprehensive perspectives on complex questions.

## 🎯 Overview

War Table facilitates multi-perspective AI debates where each model contributes according to structured debate rules:
- **Round 1: Opening Statements** - Each model presents initial position and reasoning
- **Round 2: Rebuttals** - Models respond to others' arguments and defend their positions  
- **Round 3: Synthesis** - Models collaborate to formulate a unified, balanced verdict

The system focuses on debate orchestration and model integration without blockchain dependencies.

## 🏗️ Architecture

```
User Question → Debate Orchestrator → 
├── Claude Agent (Anthropic)
├── GPT-5 Agent (OpenAI)  
├── Gemini Agent (Google)
├── Qwen Agent (Alibaba)
└── Grok Agent (xAI)
```

### Core Components

1. **Frontend** (`frontend/`)
   - React/Vite application with Tailwind CSS
   - Real-time debate visualization and progress tracking
   - Interactive interface for submitting questions and viewing debates
   - Model-specific styling and avatar representations

2. **Backend API** (`backend/`)
   - Node.js/Hono server handling debate orchestration
   - RESTful API for session management and debate flow
   - Round-based debate control with context preservation
   - Consensus engine for verdict generation
   - Mock AI implementations for testing without API keys

3. **Debate Engine**
   - Structures debates into 3 rounds with specific prompting
   - Manages conversation history and context windows
   - Implements lightweight consensus algorithms for final verdict
   - Tracks token usage and timing for each model response

4. **Model Integrations**
   - Abstracted API clients for each AI provider
   - Unified interface for sending prompts and receiving responses
   - Distinct response personalities for each model
   - Error handling and fallback mechanisms

## 📁 Project Structure

```
war-table/
├── backend/                 # Node.js/TypeScript API server
│   ├── src/
│   │   ├── api/             # API routes (Hono)
│   │   ├── debate/          # Debate orchestration logic
│   │   ├── models/          # AI model providers
│   │   ├── consensus/       # Verdict generation
│   │   └── types/           # TypeScript type definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── frontend/                # React/Vite/TypeScript client
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── App.tsx          # Main application component
│   │   └── App.css          # Styling
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .github/                 # GitHub Actions workflows
│   └── workflows/
│       └── deploy.yml       # Frontend deployment to GitHub Pages
├── README.md                # This file
└── package.json             # Root package (workspace)
```

## 🔧 Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/nostalgicgarethdev/war-table.git
cd war-table

# Install dependencies for both frontend and backend
npm install
# Or if using workspaces:
# npm run install:all
```

### Environment Variables
Create a `.env` file in the backend directory (optional for mock mode):
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

