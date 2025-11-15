import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import { Feature } from 'ol';
import { Point, Polygon } from 'ol/geom';
import { defaults as defaultControls } from 'ol/control';
import type { LonLat, PointFeature } from '../types/domain'; 

const trackStyle = new Style({
  stroke: new Stroke({ color: '#ff6600', width: 2 }),
  fill: new Fill({ color: 'rgba(255,102,0,0.1)' })
});

const pointsStyle = new Style({
  image: new CircleStyle({
    radius: 4,
    stroke: new Stroke({ color: '#000' }),
    fill: new Fill({ color: '#fff' })
  })
});

const createCarStyle = () => new Style({
  image: new Icon({
    src: '/fastRaceCar.svg',
    scale: 0.3,
    anchor: [0.5, 0.5],
    rotateWithView: true
  })
});

export const useMap = (mapElementRef: React.RefObject<HTMLDivElement | null>) => {
  const mapRef = useRef<Map | null>(null);
  const carFeatureRef = useRef<PointFeature | null>(null);
  const carLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const pointsSourceRef = useRef<VectorSource | null>(null);
  const [trackPolygon, setTrackPolygon] = useState<Polygon | null>(null);

  useEffect(() => {
    if (!mapElementRef.current) {
      return;
    }
    
    let map: Map; 

    const rasterLayer = new TileLayer({ source: new OSM() });
    const trackSource = new VectorSource();
    const trackLayer = new VectorLayer({ source: trackSource, style: trackStyle });
    const pointsSource = new VectorSource();
    pointsSourceRef.current = pointsSource;
    const pointsLayer = new VectorLayer({ source: pointsSource, style: pointsStyle });

    try {
      map = new Map({ 
        target: mapElementRef.current,
        layers: [rasterLayer, trackLayer, pointsLayer],
        view: new View({ center: fromLonLat([20.9279, 51.8799]), zoom: 17 }),
        controls: defaultControls({ attribution: false, rotate: false })
      });
      mapRef.current = map;
    } catch (e) {
      return;
    }
    
    fetch('/raceTrack.json')
      .then(r => {
        if (!r.ok) throw new Error(`Fetch status: ${r.status}`);
        return r.json();
      })
      .then(geojson => {
        const format = new GeoJSON();
        const features = format.readFeatures(geojson, {
          featureProjection: 'EPSG:3857'
        });
        trackSource.addFeatures(features);
        const geom = features[0].getGeometry() as Polygon;
        setTrackPolygon(geom);
        
        if (mapRef.current) { 
          mapRef.current.getView().fit(geom.getExtent(), { padding: [50, 50, 150, 50] });
        }
      })
      .catch(() => {
        alert('Błąd wczytywania raceTrack.json');
      });

    return () => {
      map.setTarget(undefined);
      mapRef.current = null; 
    };
  }, [mapElementRef]); 
  
  const manageCarLayer = (running: boolean, initialPoints: LonLat[]) => {
      if (running) {
        if (!carFeatureRef.current && mapRef.current && trackPolygon) {
          let initialCoord: LonLat = initialPoints.length > 0
            ? initialPoints[0]
            : toLonLat(trackPolygon.getInteriorPoint().getCoordinates()) as LonLat;

          const carFeature = new Feature({
            geometry: new Point(fromLonLat(initialCoord))
          });
          carFeature.setStyle(createCarStyle());
          carFeatureRef.current = carFeature;

          const carSource = new VectorSource({ features: [carFeature] });
          const carLayer = new VectorLayer({ source: carSource });
          carLayerRef.current = carLayer;
          mapRef.current.addLayer(carLayer);
        }
      } else {
        if (carLayerRef.current && mapRef.current) {
          mapRef.current.removeLayer(carLayerRef.current);
        }
        carLayerRef.current = null;
        carFeatureRef.current = null;
      }
  };

  return {
    map: mapRef.current,
    pointsSourceRef: pointsSourceRef,
    trackPolygon,
    carFeatureRef: carFeatureRef,
    manageCarLayer 
  };
};