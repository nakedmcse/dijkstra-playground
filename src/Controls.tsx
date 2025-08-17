import React from 'react';
import {MinPriorityQueue} from "@datastructures-js/priority-queue";
import {Point, Node} from './types'
import './App.css';

function Controls( {map, setMap }: { map: string[], setMap: React.Dispatch<React.SetStateAction<string[]>> }) {

    function clearPath(): undefined {
        setMap(prev => prev.map(line => line.replace(/P/g, ' ')));
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

    function dijkstra(start: Point, end: Point) {
        const grid = map.slice();
        const rows = grid.length;
        const cols = grid[0]?.length ?? 0;

        // Directions for moving up, down, left, right
        const directions = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 }
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
            console.log(pq.size());
            // Extract node with smallest cost
            const { point, cost, length } = pq.dequeue() ?? { point: {x:-1,y:-1}, cost: Infinity, length: Infinity };
            const { x, y } = point;

            if (visited[y][x]) continue; // Skip if already processed
            visited[y][x] = true;

            // If we reached the end
            if (x === end.x && y === end.y) break;

            // Mark map
            if (x !== start.x || y !== start.y) grid[y] = grid[y].substring(0,x) + "P" + grid[y].substring(x+1);

            // Explore neighbors
            for (const dir of directions) {
                const nx = x + dir.x;
                const ny = y + dir.y;

                if (isValid(nx, ny) && !visited[ny][nx]) {
                    const newCost = cost + 1; // Increment cost by 1 for valid moves
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

    return (
        <div className="controls">
            <div className="h-100 p-3 text-bg-dark rounded-3 border border-danger-subtle bg-body-tertiary">
                <h3>Dijkstras Playground</h3>
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