import React from 'react';
import 'ol/ol.css';
import './MapView.scss';

interface MapViewProps {
  mapRef: React.RefObject<HTMLDivElement | null>;
}

export const MapView: React.FC<MapViewProps> = ({ mapRef }) => {
  return <div ref={mapRef} className="map-view-container" />;
};