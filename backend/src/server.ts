import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

// Routes - Explicit extensions for modern ESM/Node v25
import barbers from './routes/barbers.ts';
import services from './routes/services.ts';
import slots from './routes/slots.ts';
import reservations from './routes/reservations.ts';

// Bot - Ensure the bot starts with the server
import './bot/telegramBot.ts';

const app = Fastify({
  logger: true // Provides helpful request logs in your terminal
});

// Middleware
app.register(cors, { 
  origin: true 
});

app.register(rateLimit, { 
  max: 20, 
  timeWindow: '1 minute' 
});

// Register Routes
app.register(barbers);
app.register(services);
app.register(slots);
app.register(reservations);

// Graceful Shutdown
const start = async () => {
  try {
    const address = await app.listen({ port: 3001, host: '0.0.0.0' });
    console.log(`
🚀 Barbershop API is live!
📡 URL: ${address}
🤖 Telegram Bot: Active
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();