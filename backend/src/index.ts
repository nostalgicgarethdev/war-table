import app from './server.js';
import { serve } from '@hono/node-server';

const port = Number(process.env.PORT) || 3001;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
