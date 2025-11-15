import { useEffect } from 'react';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import type { LapData, LonLat } from '../types/domain';

type UseFileLoaderProps = {
  mapElementRef: React.RefObject<HTMLDivElement | null>;
  pointsLayerSourceRef: React.RefObject<VectorSource | null>;
  onPointsLoaded: (points: LonLat[]) => void;
};

export const useFileLoader = ({
  mapElementRef,
  pointsLayerSourceRef,
  onPointsLoaded
}: UseFileLoaderProps) => {
  
  const handleGeoJSONFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string) as LapData;

        const format = new GeoJSON();
        const features = format.readFeatures(json, {
          featureProjection: 'EPSG:3857'
        });
        
        if (pointsLayerSourceRef.current) {
          pointsLayerSourceRef.current.clear();
          pointsLayerSourceRef.current.addFeatures(features);
        }

        const rawCoords = json.features
          .map((f) => f.geometry.coordinates as LonLat);

        onPointsLoaded(rawCoords || []);

      } catch (err) {
        console.error(err);
        alert("Błąd parsowania GeoJSON");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const el = mapElementRef.current;
    if (!el) return;

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      el.classList.remove('drag-over');
      if (e.dataTransfer?.files?.length) {
        handleGeoJSONFile(e.dataTransfer.files[0]);
      }
    };
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      el.classList.add('drag-over');
    };
    const onDragLeave = () => {
       el.classList.remove('drag-over');
    };

    el.addEventListener('drop', onDrop);
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    
    return () => {
      el.removeEventListener('drop', onDrop);
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
    };
  }, [mapElementRef, pointsLayerSourceRef, onPointsLoaded]);

  return { handleGeoJSONFile };
};