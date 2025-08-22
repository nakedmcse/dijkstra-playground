import React from 'react';
import {PathStats, Weight, CompletedPath, MazeAlgorithm} from './types'
import {findGiven, dijkstra, newMaze} from "./mazeUtils";
import './App.css';
import {Modal} from 'bootstrap';

function Controls( {map, setMap, stats, setStats, weight, setWeight, showAllPaths, setShowAllPaths, mazeAlgorithm, setMazeAlgorithm }: {
    map: string[], setMap: React.Dispatch<React.SetStateAction<string[]>>,
    stats: PathStats, setStats: React.Dispatch<React.SetStateAction<PathStats>>,
    weight: Weight, setWeight: React.Dispatch<React.SetStateAction<Weight>>,
    showAllPaths: boolean, setShowAllPaths: React.Dispatch<React.SetStateAction<boolean>>,
    mazeAlgorithm: MazeAlgorithm, setMazeAlgorithm: React.Dispatch<React.SetStateAction<MazeAlgorithm>>,
}) {

    function clearPath(): undefined {
        setMap(prev => prev.map(line => line.replace(/P/g, ' ')));
        setStats({ cost: 0, length: 0, path: []});
        return undefined;
    }

    function genNewMaze(): undefined {
        setMap(newMaze(141,141, mazeAlgorithm).slice());
        setStats({ cost: 0, length: 0, path: []});
        return undefined;
    }

    function generatePath(): undefined {
        const sPoint = findGiven(map, 'S');
        const ePoint = findGiven(map, 'E');
        if(sPoint.x === -1 && sPoint.y === -1) return;  // cant find start
        for (let line of map) {
            if(line.includes('P')) return;  // already path
        }
        const finalPath = dijkstra(map.slice(), weight, sPoint, ePoint, showAllPaths);
        setMap(finalPath.grid.slice());
        setStats(finalPath.stats);
        return undefined;
    }

    function showInfo(): undefined {
        const modal = new Modal('#InfoModal');
        modal.show();
        return undefined;
    }

    function handleWeightSet(e: React.ChangeEvent<HTMLInputElement>) {
        let newWeight: Weight = { up: weight.up, down: weight.down, left: weight.left, right: weight.right };
        switch (e.target.dataset.cost) {
            case 'up':
                newWeight.up = parseInt(e.target.value, 10);
                if (isNaN(newWeight.up)) newWeight.up = 0;
                break;
            case 'down':
                newWeight.down = parseInt(e.target.value, 10);
                if (isNaN(newWeight.down)) newWeight.down = 0;
                break;
            case 'left':
                newWeight.left = parseInt(e.target.value, 10);
                if (isNaN(newWeight.left)) newWeight.left = 0;
                break;
            case 'right':
                newWeight.right = parseInt(e.target.value, 10);
                if (isNaN(newWeight.right)) newWeight.right = 0;
                break;
        }
        setWeight(newWeight);
    }

    function handleShowAllPaths(e: React.ChangeEvent<HTMLInputElement>): void {
        setShowAllPaths(e.target.checked);
    }

    function handleMazeAlgorithm(e: React.ChangeEvent<HTMLSelectElement>) {
        setMazeAlgorithm(e.target.value as MazeAlgorithm);
    }

    return (
        <div className="controls">
            <div className="h-100 p-3 text-bg-dark rounded-3 border border-danger-subtle bg-body-tertiary">
                <h3>Dijkstras Playground</h3>
                <div className="row mb-2 mt-4">
                    <div className="col-5"><h4>Path Cost: {stats.cost}</h4></div>
                    <div className="col-5"><h4>Path Length: {stats.length}</h4></div>
                </div>
                <div className="row mb-2">
                    <div className="col-3">Up Cost:</div>
                    <div className="col-2"><input className="form-control" type="text" data-cost="up" value={weight.up} onChange={handleWeightSet}/></div>
                    <div className="col-3">Down Cost:</div>
                    <div className="col-2"><input className="form-control" type="text" data-cost="down" value={weight.down} onChange={handleWeightSet}/></div>
                </div>
                <div className="row mb-4">
                    <div className="col-3">Right Cost:</div>
                    <div className="col-2"><input className="form-control" type="text" data-cost="right" value={weight.right} onChange={handleWeightSet}/></div>
                    <div className="col-3">Left Cost:</div>
                    <div className="col-2"><input className="form-control" type="text" data-cost="left" value={weight.left} onChange={handleWeightSet}/></div>
                </div>
                <div className="row mb-4">
                    <div className="col-7">
                        <label className="switch">
                            <input type="checkbox" id="showAll" onChange={handleShowAllPaths} />
                            <div className="slider round"></div>
                        </label>
                        <label className="slider-text">Show All Considered Paths</label>
                    </div>
                    <div className="col-1">Algo:</div>
                    <div className="col-3">
                        <select className="form-control" onChange={handleMazeAlgorithm}>
                            {Object.values(MazeAlgorithm).map(algorithm => (
                                <option key={algorithm} value={algorithm}>{algorithm}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <button type="button" className="btn btn-primary" onClick={generatePath}>Generate Path</button>
                        <button type="button" className="btn btn-secondary ms-4" onClick={clearPath}>Clear Path</button>
                        <button type="button" className="btn btn-danger ms-4" onClick={genNewMaze}>New Maze</button>
                        <button type="button" className="btn btn-secondary ms-4" onClick={showInfo}>Algorithm</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Controls;