import React, { useRef, useState, useEffect } from 'react';
import './MapPage.scss';
import type { LonLat } from '../types/domain';
import { useMap } from '../hooks/useMap';
import { useFileLoader } from '../hooks/useFileLoader';
import { useAnimation } from '../hooks/useAnimation';
import { MapControls } from '../components/MapControls/MapControls';
import { MapView } from '../components/MapView/MapView';

export const MapPage: React.FC = () => {
  const [delayMs, setDelayMs] = useState<number>(20);
  const [running, setRunning] = useState(false);
  const [points, setPoints] = useState<LonLat[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mapElementRef = useRef<HTMLDivElement>(null);

  const { 
    pointsSourceRef,
    trackPolygon,
    carFeatureRef,
    manageCarLayer
  } = useMap(mapElementRef);

  const { handleGeoJSONFile } = useFileLoader({
    mapElementRef: mapElementRef,
    pointsLayerSourceRef: pointsSourceRef, 
    onPointsLoaded: (loadedPoints) => {
      setPoints(loadedPoints);
      setRunning(false); 
      setCurrentIndex(0); 
    }
  });

  useEffect(() => {
    manageCarLayer(running, points);
    
    if (!running) {
      setCurrentIndex(0); 
    }
  }, [running, points, manageCarLayer]);

  useAnimation({
    running,
    points,
    delayMs,
    currentIndex,
    setCurrentIndex,
    carFeatureRef: carFeatureRef,
    trackPolygon
  });

  const handleToggleRun = () => {
    if (points.length === 0) {
      alert('Najpierw załaduj plik GeoJSON z trasą');
      return;
    }
    setRunning(s => !s);
  };

  const handleDelayChange = (value: number) => {
    setDelayMs(Math.max(0, value));
  };

  return (
    <div className="map-page-layout">
      <MapControls
        delayMs={delayMs}
        running={running}
        onDelayChange={handleDelayChange}
        onToggleRun={handleToggleRun}
        onFileLoad={handleGeoJSONFile}
      />
      <div className="map-wrapper">
        <MapView mapRef={mapElementRef} />
      </div>
    </div>
  );
};