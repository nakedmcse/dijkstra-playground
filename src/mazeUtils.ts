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