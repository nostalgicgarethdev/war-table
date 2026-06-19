import { Hono } from 'hono';
import { DebateOrchestrator } from '../debate/orchestrator.js';

const app = new Hono();
const orchestrator = new DebateOrchestrator();

// Start a new debate
app.post('/start', async (c) => {
  try {
    const { question, config } = await c.req.json();
    
    if (!question || typeof question !== 'string') {
      return c.json({ error: 'Question is required and must be a string' }, 400);
    }
    
    const sessionId = await orchestrator.startDebate(question, config);
    return c.json({ sessionId, message: 'Debate started successfully' });
  } catch (error) {
    console.error('Error starting debate:', error);
    return c.json({ error: 'Failed to start debate' }, 500);
  }
});

// Get debate session details
app.get('/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  const session = orchestrator.getSession(sessionId);
  
  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  return c.json(session);
});

// List all debate sessions
app.get('/', async (c) => {
  const sessions = orchestrator.listSessions();
  return c.json(sessions);
});

// Get debate results/verdict
app.get('/:sessionId/results', async (c) => {
  const sessionId = c.req.param('sessionId');
  const session = orchestrator.getSession(sessionId);
  
  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  if (session.status !== 'completed') {
    return c.json({ 
      error: 'Debate not yet completed', 
      status: session.status 
    }, 400);
  }
  
  return c.json({ 
    sessionId: session.id,
    question: session.question,
    verdict: session.verdict,
    rounds: session.rounds,
    completedAt: session.updatedAt
  });
});

export default app;
