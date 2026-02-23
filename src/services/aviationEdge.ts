import axios from 'axios';

const BASE_URL = process.env.AVIATION_EDGE_BASE_URL;
const API_KEY = process.env.AVIATION_EDGE_API_KEY;

export interface FlightArrival {
  flight: { iataNumber: string; icaoNumber: string };
  airline: { name: string; iataCode: string; icaoCode: string };
  arrival: {
    iataCode: string;
    scheduledTime: string;
    estimatedTime: string;
    actualTime: string;
    terminal: string;
    gate: string;
  };
  departure: {
    iataCode: string;
    scheduledTime: string;
  };
  status: string; // scheduled | active | landed | cancelled | diverted
}

// Get all arriving flights for a given airport, optionally filtered by airline
export const getArrivalsAtAirport = async (
  airportIata: string,
  airlineIata?: string
): Promise<FlightArrival[]> => {
  const params: Record<string, string> = {
    key: API_KEY!,
    iataCode: airportIata,
    type: 'arrival',
  };

  if (airlineIata) params['airline_iata'] = airlineIata;

  const response = await axios.get(`${BASE_URL}/timetable`, { params });
  return response.data;
};

// Get live flight tracker data filtered by airline
export const getLiveFlightsByAirline = async (
  airlineIata: string
): Promise<any[]> => {
  const response = await axios.get(`${BASE_URL}/flights`, {
    params: {
      key: API_KEY!,
      airlineIata,
    },
  });
  return response.data;
};
