import { useEffect, useRef } from 'react';
import { fromLonLat } from 'ol/proj';
import { Polygon } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import type { LonLat, PointFeature, IncidentType } from '../types/domain';
import { saveIncident } from '../services/incidentApi';

type UseAnimationProps = {
  running: boolean;
  points: LonLat[];
  delayMs: number;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  carFeatureRef: React.RefObject<PointFeature | null>;
  trackPolygon: Polygon | null;
};

export const useAnimation = ({
  running,
  points,
  delayMs,
  currentIndex,
  setCurrentIndex,
  carFeatureRef,
  trackPolygon
}: UseAnimationProps) => {
  
  const animTimer = useRef<number | null>(null);

  useEffect(() => {
    const carFeature = carFeatureRef.current;
    
    if (!running || points.length === 0 || !carFeature) {
      if (animTimer.current) window.clearTimeout(animTimer.current);
      return;
    }

    const idx = currentIndex % points.length;
    const nextIdx = (idx + 1) % points.length;

    const start = points[idx];
    const end = points[nextIdx];

    carFeature.getGeometry()!.setCoordinates(fromLonLat(start));

    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const angle = Math.atan2(-dy, dx); 
    const style = carFeature.getStyle() as Style;
    const icon = style.getImage() as Icon;
    icon.setRotation(angle);

    if (trackPolygon) {
      const isInside = trackPolygon.intersectsCoordinate(fromLonLat(start));
      const type: IncidentType = isInside ? 'Inside' : 'Outside';
      
      saveIncident(start, type);

      if (!isInside) {
         console.warn(`Wykryto zjechanie z toru (Punkt ${idx})`);
      }
    }

    animTimer.current = window.setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % points.length);
    }, delayMs);

    return () => {
      if (animTimer.current) window.clearTimeout(animTimer.current);
    };

  }, [running, currentIndex, points, trackPolygon, delayMs, carFeatureRef, setCurrentIndex]);
};