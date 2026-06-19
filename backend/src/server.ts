import { Hono } from 'hono';
import debateRoutes from './api/debate.js';

const app = new Hono()

// Register API routes
app.route('/api/debate', debateRoutes);

app.get('/', (c) => {
  return c.text('War Table API is running!')
})

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
