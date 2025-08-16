import React from 'react';
import './App.css';

function Controls( {map, setMap }: { map: string[], setMap: React.Dispatch<React.SetStateAction<string[]>> }) {

    function clearPath(): undefined {
        for (let line of map) {
            line = line.replace('P',' ');
        }
        return undefined;
    }

    return (
        <div className="controls">
            <div className="h-100 p-5 text-bg-dark rounded-3 border border-danger-subtle bg-body-tertiary">
                <h2>Dijkstras Playground</h2>
                <div className="row">
                    <div className="col-6">
                        <button type="button" className="btn btn-primary">Generate</button>
                    </div>
                    <div className="col-6">
                        <button type="button" className="btn btn-secondary" onClick={clearPath()}>Clear</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Controls;