import React from 'react';
import RenderMap from './RenderMap';
import Controls from './Controls';
import {PathStats, Weight} from './types'
import './App.css';

function App() {
  const [map, setMap] = React.useState<string[]>([]);
  const [stats, setStats] = React.useState<PathStats>({cost: 0, length: 0, path: []});
  const [weight, setWeight] = React.useState<Weight>({up: 1, down: 1, left: 1, right: 1});
  const [showAllPaths, setShowAllPaths] = React.useState<boolean>(false);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
            <RenderMap map={map} setMap={setMap}/>
        </div>
        <div className="col-md-4">
            <Controls map={map} setMap={setMap} stats={stats} setStats={setStats} weight={weight} setWeight={setWeight} showAllPaths={showAllPaths} setShowAllPaths={setShowAllPaths}/>
        </div>
      </div>
    </div>
  );
}

export default App;
