import React from 'react';
import {MinPriorityQueue} from "@datastructures-js/priority-queue";
import {Point, Node, PathStats, Weight} from './types'
import './App.css';

function Controls( {map, setMap, stats, setStats, weight, setWeight }: {
    map: string[], setMap: React.Dispatch<React.SetStateAction<string[]>>,
    stats: PathStats, setStats: React.Dispatch<React.SetStateAction<PathStats>>,
    weight: Weight, setWeight: React.Dispatch<React.SetStateAction<Weight>>
}) {

    function clearPath(): undefined {
        setMap(prev => prev.map(line => line.replace(/P/g, ' ')));
        setStats({ cost: 0, length: 0});
        return undefined;
    }

    function findGiven(g: string): Point {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === g) return {x:x, y:y};
            }
        }
        return {x:-1, y:-1};
    }

    function getWeight(d: string): number {
        switch(d) {
            case 'u':
                return weight.up;
            case 'd':
                return weight.down;
            case 'l':
                return weight.left;
            case 'r':
                return weight.right;
            default:
                return 0;
        }
    }

    function dijkstra(start: Point, end: Point) {
        const grid = map.slice();
        const rows = grid.length;
        const cols = grid[0]?.length ?? 0;

        // Directions for moving up, down, left, right
        const directions = [
            { x: 0, y: 1, d: 'd' },
            { x: 0, y: -1, d: 'u' },
            { x: 1, y: 0, d: 'r' },
            { x: -1, y: 0, d: 'l' }
        ];

        const isValid = (x: number, y: number): boolean =>
            x >= 0 && y >= 0 && x < cols && y < rows && grid[y][x] !== '#';

        // Priority queue to manage nodes to process, ordered by cost
        const pq = new MinPriorityQueue<Node>(r => r.cost);
        const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
        const costs: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

        pq.push({ point: start, cost: 0, length: 0 });
        costs[start.y][start.x] = 0;

        while (!pq.isEmpty()) {
            // Extract node with smallest cost
            const { point, cost, length } = pq.dequeue() ?? { point: {x:-1,y:-1}, cost: Infinity, length: Infinity };
            const { x, y } = point;

            if (visited[y][x]) continue; // Skip if already processed
            visited[y][x] = true;

            // If we reached the end
            if (x === end.x && y === end.y) {
                setStats({cost: cost, length: length});
                break;
            }

            // Mark map
            if (x !== start.x || y !== start.y) grid[y] = grid[y].substring(0,x) + "P" + grid[y].substring(x+1);

            // Explore neighbors
            for (const dir of directions) {
                const nx = x + dir.x;
                const ny = y + dir.y;

                if (isValid(nx, ny) && !visited[ny][nx]) {
                    const newCost = cost + getWeight(dir.d);
                    const newLength = length + 1;
                    if (newCost < costs[ny][nx]) {
                        costs[ny][nx] = newCost;
                        pq.push({ point: { x: nx, y: ny }, cost: newCost, length: newLength });
                    }
                }
            }
        }
        setMap(grid.slice());
    }

    function generatePath(): undefined {
        const sPoint = findGiven('S');
        const ePoint = findGiven('E');
        if(sPoint.x === -1 && sPoint.y === -1) return;  // cant find start
        for (let line of map) {
            if(line.includes('P')) return;  // already path
        }
        dijkstra(sPoint, ePoint);
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

    return (
        <div className="controls">
            <div className="h-100 p-3 text-bg-dark rounded-3 border border-danger-subtle bg-body-tertiary">
                <h3>Dijkstras Playground</h3>
                <div className="row mb-2">
                    <div className="col-3">Up Cost:</div>
                    <div className="col-2"><input className="form-control" type="text" data-cost="up" value={weight.up} onChange={handleWeightSet}/></div>
                    <div className="col-3">Down Cost:</div>
                    <div className="col-2"><input className="form-control" type="text" data-cost="down" value={weight.down} onChange={handleWeightSet}/></div>
                </div>
                <div className="row mb-2">
                    <div className="col-3">Right Cost:</div>
                    <div className="col-2"><input className="form-control" type="text" data-cost="right" value={weight.right} onChange={handleWeightSet}/></div>
                    <div className="col-3">Left Cost:</div>
                    <div className="col-2"><input className="form-control" type="text" data-cost="left" value={weight.left} onChange={handleWeightSet}/></div>
                </div>
                <div className="row mb-2">
                    <div className="col-4">Path Cost: {stats.cost}</div>
                    <div className="col-4">Path Length: {stats.length}</div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <button type="button" className="btn btn-primary" onClick={generatePath}>Generate</button>
                    </div>
                    <div className="col-3">
                        <button type="button" className="btn btn-secondary" onClick={clearPath}>Clear</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Controls;