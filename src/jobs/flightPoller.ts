import cron from 'node-cron';
import { supabase } from '../config/supabase';
import { getArrivalsAtAirport } from '../services/aviationstack';
import { sendFboArrivalNotification } from '../services/emailService';

// NOTE: Free tier = 100 requests/month. To avoid burning through them,
// polling is set to every 60 minutes. Increase frequency on a paid plan.
export const startFlightPolling = () => {
  console.log('Flight poller started — checking every 60 minutes (free tier rate limit)');

  cron.schedule('0 * * * *', async () => {
    console.log('[poller] Polling flight arrivals...');
    try {
      const { data: fbos, error } = await supabase.from('fbos').select('*');
      if (error || !fbos) return;

      const { data: configs } = await supabase.from('org_airline_configs').select('*');
      if (!configs) return;

      for (const config of configs) {
        const orgFbos = fbos.filter((f) => f.org_id === config.org_id);

        for (const fbo of orgFbos) {
          const arrivals = await getArrivalsAtAirport(fbo.airport_iata, config.airline_iata);

          for (const flight of arrivals) {
            if (['scheduled', 'active'].includes(flight.flight_status)) {
              await sendFboArrivalNotification({
                to: fbo.email,
                fboName: fbo.name,
                flightNumber: flight.flight.iata,
                airline: flight.airline.name,
                origin: flight.departure.iata,
                destination: flight.arrival.iata,
                scheduledArrival: flight.arrival.scheduled,
                estimatedArrival: flight.arrival.estimated || flight.arrival.scheduled,
                status: flight.flight_status,
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('[poller] Error:', err);
    }
  });
};
