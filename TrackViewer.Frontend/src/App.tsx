import './App.scss'
import { MapPage } from './pages/MapPage';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Track Viewer</h1>
      </header>
      <main>
        <MapPage />
      </main>
    </div>
  );
}

export default App;
