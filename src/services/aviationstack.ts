import axios from 'axios';

const BASE_URL = 'http://api.aviationstack.com/v1';
const ACCESS_KEY = process.env.AVIATIONSTACK_API_KEY;

// NOTE: Free tier only supports HTTP (not HTTPS) and 100 requests/month.
// Upgrade to a paid plan for HTTPS and higher request limits.

export interface FlightArrival {
  flight: {
    number: string;
    iata: string;
    icao: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  arrival: {
    airport: string;
    iata: string;
    icao: string;
    terminal: string | null;
    gate: string | null;
    scheduled: string;
    estimated: string | null;
    actual: string | null;
    delay: number | null;
  };
  departure: {
    airport: string;
    iata: string;
    icao: string;
    scheduled: string;
    estimated: string | null;
    actual: string | null;
    delay: number | null;
  };
  flight_status: string; // scheduled | active | landed | cancelled | diverted | incident
}

interface AviationstackResponse {
  pagination: { limit: number; offset: number; count: number; total: number };
  data: FlightArrival[];
}

// Get all arriving flights at a given airport, optionally filtered by airline
export const getArrivalsAtAirport = async (
  airportIata: string,
  airlineIata?: string
): Promise<FlightArrival[]> => {
  const params: Record<string, string> = {
    access_key: ACCESS_KEY!,
    arr_iata: airportIata,
    flight_status: 'scheduled,active,landed',
  };

  if (airlineIata) params['airline_iata'] = airlineIata;

  const response = await axios.get<AviationstackResponse>(`${BASE_URL}/flights`, { params });

  if (!Array.isArray(response.data?.data)) {
    throw new Error(`Unexpected response from Aviationstack: ${JSON.stringify(response.data)}`);
  }

  return response.data.data;
};

// Get all active/scheduled flights for a given airline
export const getLiveFlightsByAirline = async (
  airlineIata: string
): Promise<FlightArrival[]> => {
  const params: Record<string, string> = {
    access_key: ACCESS_KEY!,
    airline_iata: airlineIata,
    flight_status: 'active',
  };

  const response = await axios.get<AviationstackResponse>(`${BASE_URL}/flights`, { params });

  if (!Array.isArray(response.data?.data)) {
    throw new Error(`Unexpected response from Aviationstack: ${JSON.stringify(response.data)}`);
  }

  return response.data.data;
};
