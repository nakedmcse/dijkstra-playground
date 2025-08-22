import React from 'react';
import RenderMap from './RenderMap';
import Controls from './Controls';
import {MazeAlgorithm, PathStats, Weight} from './types'
import './App.css';
import InfoModal from "./InfoModal";

function App() {
  const [map, setMap] = React.useState<string[]>([]);
  const [stats, setStats] = React.useState<PathStats>({cost: 0, length: 0, path: []});
  const [weight, setWeight] = React.useState<Weight>({up: 1, down: 1, left: 1, right: 1});
  const [showAllPaths, setShowAllPaths] = React.useState<boolean>(false);
  const [mazeAlgorithm, setMazeAlgorithm] = React.useState<MazeAlgorithm>(MazeAlgorithm.STACKDFS);

  return (
    <div className="container-fluid">
      <InfoModal />
      <div className="row">
        <div className="col-md-8">
            <RenderMap map={map} setMap={setMap}/>
        </div>
        <div className="col-md-4">
            <Controls map={map} setMap={setMap} stats={stats} setStats={setStats}
                      weight={weight} setWeight={setWeight} showAllPaths={showAllPaths} setShowAllPaths={setShowAllPaths}
                    mazeAlgorithm={mazeAlgorithm} setMazeAlgorithm={setMazeAlgorithm} />
        </div>
      </div>
    </div>
  );
}

export default App;
