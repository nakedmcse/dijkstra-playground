import {Node, Point, Weight, CompletedPath, PathStats} from "./types";
import {MinPriorityQueue} from "@datastructures-js/priority-queue";

export function findGiven(grid: string[], g: string): Point {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === g) return {x:x, y:y};
        }
    }
    return {x:-1, y:-1};
}
export function cell(g: string[], x: number, y: number, c: string): void {
    g[y] = g[y].substring(0,x) + c + g[y].substring(x+1);
}

export function dijkstra(grid: string[], weights: Weight, start: Point, end: Point, showAll: boolean): CompletedPath {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    let finalStats: PathStats = { cost: 0, length: 0, path: [] };

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

    pq.push({ point: start, cost: 0, length: 0, path: [start] });
    costs[start.y][start.x] = 0;

    while (!pq.isEmpty()) {
        // Extract node with smallest cost
        const { point, cost, length, path } = pq.dequeue() ?? { point: {x:-1,y:-1}, cost: Infinity, length: Infinity, path: [] };
        const { x, y } = point;

        if (visited[y][x]) continue; // Skip if already processed
        visited[y][x] = true;

        // If we reached the end
        if (x === end.x && y === end.y) {
            finalStats = {cost: cost, length: length, path: [...path]};
            break;
        }

        // Mark map
        if ((x !== start.x || y !== start.y) && showAll) cell(grid, x, y, 'P');

        // Explore neighbors
        for (const dir of directions) {
            const nx = x + dir.x;
            const ny = y + dir.y;

            if (isValid(nx, ny) && !visited[ny][nx]) {
                const newCost = cost + getWeight(weights, dir.d);
                const newLength = length + 1;
                if (newCost < costs[ny][nx]) {
                    costs[ny][nx] = newCost;
                    path.push({x: nx, y: ny});
                    pq.push({ point: { x: nx, y: ny }, cost: newCost, length: newLength, path: [...path]});
                }
            }
        }
    }
    if(!showAll) {
        for(const p of finalStats.path) {
            if(grid[p.y][p.x] === ' ') cell(grid, p.x, p.y, 'P');
        }
    }
    return { grid:grid, stats: finalStats };
}

export function getWeight(w: Weight, d: string): number {
    switch(d) {
        case 'u':
            return w.up;
        case 'd':
            return w.down;
        case 'l':
            return w.left;
        case 'r':
            return w.right;
        default:
            return 0;
    }
}

export function newMaze(width: number, height: number): string[] {
    // Stack DFS maze generator

    // Find neighboring movement options
    function neighbors(g: string[], p: Point, v: boolean[][]): Point[] {
        const retval:Point[] = [];
        const directions = [
            { x: 0, y: 2 },
            { x: 0, y: -2 },
            { x: 2, y: 0 },
            { x: -2, y: 0 }
        ];
        const isValid = (x: number, y: number): boolean =>
            x > 0 && y > 0 && x < g[0].length-1 && y < g.length-1 && (g[y][x] === '#') && !v[y][x];

        for (const d of directions) {
            if(isValid(p.x + d.x, p.y + d.y)) retval.push({x:d.x, y:d.y});
        }
        return retval;
    }

    // Create filled grid and add start/end
    const grid = Array.from({ length: height }, () => "#".repeat(width));
    cell(grid, 1, 1, 'S');  // Start at 1,1
    let current: Point = {x:1,y:1};
    const visited: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));
    visited[1][1] = true;
    const q: Point[] = [];
    q.push(current);

    // DFS from start point
    try {
        while (q.length > 0) {
            current = q.pop() ?? {x:0,y:0};
            const n = neighbors(grid, current, visited);
            if(n.length > 0) {
                q.push(current);
                const i = Math.floor(Math.random() * n.length);
                cell(grid, current.x+n[i].x, current.y+n[i].y, ' ');  // open target
                cell(grid, current.x+(n[i].x/2), current.y+(n[i].y/2), ' ');  // open corridor
                visited[current.y+n[i].y][current.x+n[i].x] = true;
                q.push({x:current.x+n[i].x, y:current.y+n[i].y});
            }
        }
    }
    catch (e) {
        console.error(e);
        cell(grid, width-2, height-2, 'E');  // End at width-1,height-1
        return grid;
    }

    cell(grid, width-2, height-2, 'E');  // End at width-1,height-1
    return grid;
}