import cron from 'node-cron';
import { supabase } from '../config/supabase';
import { getArrivalsAtAirport } from '../services/aviationEdge';
import { sendFboArrivalNotification } from '../services/emailService';

// Runs every 5 minutes
export const startFlightPolling = () => {
  console.log('Flight poller started — checking every 5 minutes');

  cron.schedule('*/5 * * * *', async () => {
    console.log('Polling flight arrivals...');
    try {
      // Fetch all active FBOs across all orgs
      const { data: fbos, error } = await supabase.from('fbos').select('*');
      if (error || !fbos) return;

      // Fetch all org airline configs
      const { data: configs } = await supabase.from('org_airline_configs').select('*');
      if (!configs) return;

      for (const config of configs) {
        const orgFbos = fbos.filter((f) => f.org_id === config.org_id);

        for (const fbo of orgFbos) {
          const arrivals = await getArrivalsAtAirport(fbo.airport_iata, config.airline_iata);

          for (const flight of arrivals) {
            if (['active', 'scheduled'].includes(flight.status)) {
              await sendFboArrivalNotification({
                to: fbo.email,
                fboName: fbo.name,
                flightNumber: flight.flight.iataNumber,
                airline: flight.airline.name,
                origin: flight.departure.iataCode,
                destination: flight.arrival.iataCode,
                scheduledArrival: flight.arrival.scheduledTime,
                estimatedArrival: flight.arrival.estimatedTime || flight.arrival.scheduledTime,
                status: flight.status,
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('Flight poller error:', err);
    }
  });
};
