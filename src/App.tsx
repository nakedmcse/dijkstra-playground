import React from 'react';
import RenderMap from './RenderMap';
import Controls from './Controls';
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-9">
          {RenderMap()}
        </div>
        <div className="col-md-3">
            {Controls()}
        </div>
      </div>

    </div>
  );
}

export default App;
