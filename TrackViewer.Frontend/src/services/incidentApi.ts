import type { IncidentPayload, IncidentType, LonLat } from "../types/domain";

const API_URL = 'https://localhost:7058/api/trackevents';

export const saveIncident = async (coord: LonLat, type: IncidentType): Promise<void> => {
  const payload: IncidentPayload = {
    latitude: coord[1],
    longitude: coord[0],
    incidentType: type
  };

  console.log('Incydent:', payload);

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error('Nie udało się połączyć z API', e);
  }
};