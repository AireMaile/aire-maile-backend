import 'dotenv/config';
import app from './app';
import { startFlightPolling } from './jobs/flightPoller';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AireMaile API running on port ${PORT}`);
  startFlightPolling();
});
