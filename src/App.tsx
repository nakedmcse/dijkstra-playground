import React from 'react';
import RenderMap from './RenderMap';
import Controls from './Controls';
import './App.css';

function App() {
  const [map, setMap] = React.useState<string[]>([]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-9">
          <RenderMap map={map} setMap={setMap}/>
        </div>
        <div className="col-md-3">
            <Controls map={map} setMap={setMap}/>
        </div>
      </div>

    </div>
  );
}

export default App;
