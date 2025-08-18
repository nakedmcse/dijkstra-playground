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

export function dijkstra(grid: string[], weights: Weight, start: Point, end: Point): CompletedPath {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    let finalStats: PathStats = { cost: 0, length: 0 };

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
            finalStats = {cost: cost, length: length};
            break;
        }

        // Mark map
        if (x !== start.x || y !== start.y) grid[y] = grid[y].substring(0,x) + "P" + grid[y].substring(x+1);

        // Explore neighbors
        for (const dir of directions) {
            const nx = x + dir.x;
            const ny = y + dir.y;

            if (isValid(nx, ny) && !visited[ny][nx]) {
                const newCost = cost + getWeight(weights, dir.d);
                const newLength = length + 1;
                if (newCost < costs[ny][nx]) {
                    costs[ny][nx] = newCost;
                    pq.push({ point: { x: nx, y: ny }, cost: newCost, length: newLength });
                }
            }
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
    // Hunt and kill maze generator

    // Check if maze complete
    function complete(g: string[]): boolean {
        for (let y = 1; y < g.length; y += 2) {
            for (let x = 1; x < g[y].length; x += 2) {
                if(g[y][x] === '#') return false;
            }
        }
        return true;
    }

    // Find neighboring movement options
    function neighbors(g: string[], p: Point): Point[] {
        const retval:Point[] = [];
        const directions = [
            { x: 0, y: 2 },
            { x: 0, y: -2 },
            { x: 2, y: 0 },
            { x: -2, y: 0 }
        ];
        const isValid = (x: number, y: number): boolean =>
            x >= 0 && y >= 0 && x < g[0].length && y < g.length && g[y][x] === '#';

        for (const d of directions) {
            if(isValid(p.x + d.x, p.y + d.y)) retval.push({x:p.x + (d.x/2), y:p.y + (d.y/2)});
        }
        return retval;
    }

    // Find new start point when out of moves
    function newStart(g: string[]): Point | null {
        for (let y = 1; y < g.length; y += 2) {
            for (let x = 1; x < g[y].length; x += 2) {
                if(g[y][x] === '#') {
                    const n = neighbors(g, {x:x, y:y});
                    if (n.length > 0) return {x:x, y:y};
                }
            }
        }
        return null;
    }

    // Create filled grid and add start/end
    const grid = Array.from({ length: height }, () => "#".repeat(width));
    grid[1] = grid[1].substring(0,1) + "S" + grid[1].substring(2);  // Start at 1,1
    grid[height-2] = grid[height-2].substring(0,width-2) + "E" + grid[height-2].substring(width-1);  // End at width-1,height-1
    let current: Point = {x:1,y:1};

    // Hunt and kill
    try {
        while (!complete(grid)) {
            const n = neighbors(grid, current);
            if (n.length > 0) {
                // Choose random new direction and move
                const i = Math.floor(Math.random() * n.length);
                grid[n[i].y] = grid[n[i].y].substring(0, n[i].x) + " "
                    + grid[n[i].y].substring(n[i].x + 1);
                current.x += n[i].x;
                current.y += n[i].y;
            } else {
                // Find new start point
                const ns = newStart(grid);
                if (!ns) break;   // Out of moves
                grid[ns.y] = grid[ns.y].substring(0, ns.x) + " " + grid[ns.y].substring(ns.x + 1);
                current = ns;
            }
        }
    }
    catch (e) {
        console.error(e);
        return grid;
    }

    return grid;
}