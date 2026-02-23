import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getArrivalsAtAirport, getLiveFlightsByAirline } from '../services/aviationEdge';

const router = Router();

// GET /api/flights/arrivals?airport=KDAL&airline=AA
router.get('/arrivals', authenticate, async (req: AuthRequest, res) => {
  try {
    const { airport, airline } = req.query as { airport: string; airline?: string };
    if (!airport) return res.status(400).json({ error: 'airport query param is required' });

    const flights = await getArrivalsAtAirport(airport, airline);
    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch arrivals' });
  }
});

// GET /api/flights/live?airline=AA
router.get('/live', authenticate, async (req: AuthRequest, res) => {
  try {
    const { airline } = req.query as { airline: string };
    if (!airline) return res.status(400).json({ error: 'airline query param is required' });

    const flights = await getLiveFlightsByAirline(airline);
    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch live flights' });
  }
});

export default router;
