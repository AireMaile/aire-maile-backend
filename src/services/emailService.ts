import { resend } from '../config/resend';

export interface FboNotificationPayload {
  to: string;
  fboName: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  scheduledArrival: string;
  estimatedArrival: string;
  status: string;
}

export const sendFboArrivalNotification = async (
  payload: FboNotificationPayload
) => {
  const { to, fboName, flightNumber, airline, origin, destination, scheduledArrival, estimatedArrival, status } = payload;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `Flight Update: ${flightNumber} arriving at ${destination}`,
    html: `
      <h2>Flight Arrival Update</h2>
      <p>Dear ${fboName},</p>
      <p>Here is the latest update for the following flight:</p>
      <table>
        <tr><td><strong>Flight</strong></td><td>${flightNumber} (${airline})</td></tr>
        <tr><td><strong>Origin</strong></td><td>${origin}</td></tr>
        <tr><td><strong>Destination</strong></td><td>${destination}</td></tr>
        <tr><td><strong>Scheduled Arrival</strong></td><td>${scheduledArrival}</td></tr>
        <tr><td><strong>Estimated Arrival</strong></td><td>${estimatedArrival}</td></tr>
        <tr><td><strong>Status</strong></td><td>${status.toUpperCase()}</td></tr>
      </table>
      <p>This is an automated notification from AireMaile.</p>
    `,
  });
};
