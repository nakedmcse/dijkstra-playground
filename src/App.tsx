import React from 'react';
import RenderMap from './RenderMap';
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-9">
          {RenderMap()}
        </div>
        <div className="col-md-3">
          <p>Buttons etc go here</p>
        </div>
      </div>

    </div>
  );
}

export default App;
