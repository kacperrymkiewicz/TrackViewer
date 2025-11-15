import { Feature } from 'ol';
import { Point } from 'ol/geom';

export type LonLat = [number, number];

export type IncidentType = 'INSIDE' | 'OUTSIDE';

export interface IncidentPayload {
  latitude: number;
  longitude: number;
  type: IncidentType;
  timestamp: string;
}

export interface LapData {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: LonLat;
    };
    properties: any;
  }>;
}

export type PointFeature = Feature<Point>;