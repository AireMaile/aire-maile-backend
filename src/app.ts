import express from 'express';
import cors from 'cors';
import flightRoutes from './routes/flights';
import notificationRoutes from './routes/notifications';
import fboRoutes from './routes/fbos';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'aire-maile-backend' });
});

// Routes
app.use('/api/flights', flightRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/fbos', fboRoutes);

export default app;
