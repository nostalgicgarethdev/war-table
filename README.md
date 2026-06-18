# War Table: AI Debate Arena

A platform where five AI models (Claude, GPT-5, Gemini, Qwen, and Grok) debate users' toughest questions across three rounds to deliver a single verdict.

## Features

- **Multi-Model Debates**: Watch five different AI models discuss and debate your questions
- **Three-Round Structure**:
  * Round 1: Opening Statements
  * Round 2: Rebuttals  
  * Round 3: Synthesis & Verdict Formation
- **Real-Time Updates**: See the debate unfold as it happens
- **Consensus Engine**: Intelligent verdict generation based on debate outcomes
- **Model-Specific Perspectives**: Each model brings its unique reasoning style

## Architecture

### Backend (Node.js/TypeScript)
- **Hono.js** web framework for lightweight, fast API
- **Debate Orchestrator**: Manages the three-round debate flow
- **Model Provider**: Abstracted interface for different AI APIs (currently mock implementations)
- **Consensus Engine**: Generates final verdict from debate rounds
- **RESTful API**: Endpoints for starting debates, retrieving status, and getting results

### Frontend (React/TypeScript/Vite)
- **Real-time Interface**: Polls backend for debate updates
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Distinction**: Each AI model has a unique color and styling
- **Debate Visualization**: Clear separation of rounds and model responses
- **Verdict Presentation**: Final consensus with agreement/disagreement points

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd war-table

# Install dependencies for both frontend and backend
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Running the Application
```bash
# Start backend server (from war-table/backend)
npm run dev

# Start frontend server (from war-table/frontend)  
npm run dev
```

The backend will run on http://localhost:3001
The frontend will run on http://localhost:5173

### API Endpoints
- `POST /api/debate/start` - Start a new debate with a question
- `GET /api/debate/:sessionId` - Get debate session details
- `GET /api/debate/:sessionId/results` - Get debate results/verdict
- `GET /api/debate` - List all debate sessions

## Model Perspectives (Mock Implementations)

Each AI model has a distinct response style to simulate their characteristic approaches:

- **Claude**: Careful, evidence-based reasoning with balanced analysis
- **GPT-5**: Comprehensive, structured analysis with broad knowledge integration
- **Gemini**: Analytical, multi-faceted approach with strong logical reasoning
- **Qwen**: Efficient, practical solutions with clear explanations
- **Grok**: Direct, unconventional thinking with real-world applicability

## Future Enhancements

1. **Real API Integration**: Connect to actual AI model APIs (Anthropic, OpenAI, Google, etc.)
2. **Advanced Consensus Algorithms**: More sophisticated verdict generation using voting systems or semantic analysis
3. **User Authentication**: Allow users to save and track their debate history
4. **Debate Sharing**: Export debates as shareable links or documents
5. **Customizable Rounds**: Adjust number of rounds or debate structure
6. **Topic-Specific Models**: Specialized models for different domains (science, ethics, technology, etc.)
7. **Real-time Streaming**: Use WebSockets for live updates instead of polling
8. **Error Handling & Retry Logic**: Robust error handling for API failures
9. **Rate Limiting**: Prevent abuse and manage API costs
10. **Accessibility Improvements**: Better screen reader support and keyboard navigation

## License

MIT License - feel free to use, modify, and distribute this project!
