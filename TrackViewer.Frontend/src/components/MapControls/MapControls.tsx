import React from 'react';
import './MapControls.scss';

interface MapControlsProps {
  delayMs: number;
  running: boolean;
  onDelayChange: (value: number) => void;
  onToggleRun: () => void;
  onFileLoad: (file: File) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  delayMs,
  running,
  onDelayChange,
  onToggleRun,
  onFileLoad
}) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      onFileLoad(f);
    }
  };

  return (
    <div className="map-controls">
      <label>
        Opóźnienie (ms):
        <input
          type="number"
          value={delayMs}
          onChange={e => onDelayChange(Number(e.target.value) || 0)}
          disabled={running}
        />
      </label>

      <button onClick={onToggleRun} className={running ? 'stop' : 'start'}>
        {running ? 'Stop' : 'Start'}
      </button>

      <label className="file-label">
        Importuj GeoJSON
        <input
          type="file"
          accept=".json,.geojson"
          onChange={handleFileChange}
          className="file-input"
          disabled={running}
        />
      </label>
    </div>
  );
};