import {CompletedPath, MazeAlgorithm, Node, PathStats, Point, Wall, Weight} from "./types";
import {MinHeap} from "./heap";
import React from "react";

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

export async function sleep(millis: number = 0) {
    return new Promise(resolve => setTimeout(resolve, millis));
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
    const pq = new MinHeap<Node>((a,b) => a.cost - b.cost);
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
    const costs: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

    pq.push({ point: start, cost: 0, length: 0, path: [start] });
    costs[start.y][start.x] = 0;

    while (!pq.isEmpty()) {
        // Extract node with smallest cost
        const { point, cost, length, path } = pq.extract() ?? { point: {x:-1,y:-1}, cost: Infinity, length: Infinity, path: [] };
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

export async function newMaze(width: number, height: number, type: MazeAlgorithm, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    switch (type) {
        case MazeAlgorithm.ENTOMBED:
            return newMazeEntombed(width, height, showBuild, setMap);
        case MazeAlgorithm.PRIMS:
            return newMazePrims(width, height, showBuild, setMap);
        case MazeAlgorithm.AOC:
            return newMazeAoC(width, height, showBuild, setMap);
        case MazeAlgorithm.BINARYTREE:
            return newMazeBinaryTree(width, height, showBuild, setMap);
        case MazeAlgorithm.SIDEWINDER:
            return newMazeSidewinder(width, height, showBuild, setMap);
        case MazeAlgorithm.HUNTANDKILL:
            return newMazeHuntAndKill(width, height, showBuild, setMap);
        case MazeAlgorithm.GROWINGTREE:
            return newMazeGrowingTree(width, height, showBuild, setMap);
        case MazeAlgorithm.STACKBFS:
            return newMazeDFS(width, height, showBuild, true, setMap);
        case MazeAlgorithm.RECURSIVEDIV:
            return newMazeRecursiveDivision(width, height, showBuild, setMap);
        case MazeAlgorithm.ELLERS:
            return newMazeEllers(width, height, showBuild, setMap);
        case MazeAlgorithm.CELLULAR:
            return newMazeCellular(width, height, showBuild, setMap);
        case MazeAlgorithm.STACKDFS:
        default:
            return newMazeDFS(width, height, showBuild, false, setMap);
    }
}

export async function newMazeAoC(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Advent of Code maze generator

    // Find if a given x/y is wall
    function isWall(x: number, y: number, base: number) {
        const hash = ((x*x) + (3*x) + (2*x*y) + y + (y*y) + base).toString(2);
        return hash.split('').filter(x => x === '1').length % 2 !== 0;
    }

    // Create filled grid and add start/end
    const grid = Array.from({ length: height }, () => "#".repeat(width));

    for (let y = 1; y < height-1; y++) {
        for (let x = 1; x < width-1; x++) {
            if(!isWall(x, y, 1358)) cell(grid, x, y, ' ');  // Remove destination if not wall
            if(showBuild) {
                await sleep(10);
                if(setMap) setMap(grid.slice());
            }
        }
    }

    cell(grid, 1, 1, 'S');  // Start at 1,1
    cell(grid, width-2, height-2, 'E');  // End at width-1,height-1
    return grid;
}

export async function newMazeGrowingTree(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Growing Tree maze generator

    const shuffle = <T>(array: T[]): T[] => {
        return array.sort(() => Math.random() - 0.5);
    }
    const isValid = (x:number, y:number): boolean => {
        return (x>0 && y>0 && x < width && y < height && grid[y][x] === '#');
    }
    // Create filled grid and add start/end
    const grid = Array.from({ length: height }, () => "#".repeat(width));
    const directions = [{x:0,y:2},{x:0,y:-2},{x:2,y:0},{x:-2,y:0}];

    const cellList = [];
    cellList.push({x:1,y:1});

    while(cellList.length > 0) {
        const {x, y} = cellList.pop() ?? {x:-1,y:-1};
        cell(grid, x, y, ' ');
        for(const d of shuffle(directions)) {
            const nx: number = x + d.x;
            const ny: number = y + d.y;
            if(isValid(nx,ny)) {
                cell(grid, nx, ny, ' ');
                cell(grid, x+(d.x/2), y+(d.y/2), ' ')
                if(showBuild) {
                    await sleep(10);
                    if(setMap) setMap(grid.slice());
                }
                cellList.push({x:nx,y:ny});
            }
        }
    }

    cell(grid, 1, 1, 'S');  // Start at 1,1
    cell(grid, width-2, height-2, 'E');  // End at width-1,height-1
    return grid;
}

export async function newMazeHuntAndKill(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Hunt and Kill maze generator

    // Create filled grid and add start/end
    const grid = Array.from({ length: height }, () => "#".repeat(width));

    const directions = [{x:0,y:2},{x:0,y:-2},{x:2,y:0},{x:-2,y:0}];

    async function walk(wx: number, wy: number): Promise<null | number[]> {
        const d = directions[Math.floor(Math.random() * directions.length)];
        const {nx, ny} = {nx:wx + d.x, ny:wy + d.y};
        if (nx < 1 || nx > width-2 || ny < 1 || ny > height-2 || grid[ny][nx] === ' ') return null;
        cell(grid, wx, wy, ' ');
        cell(grid, wx + (d.x/2), wy + (d.y/2), ' ');
        if(showBuild) {
            await sleep(10);
            if(setMap) setMap(grid.slice());
        }
        return [nx, ny];
    }

    function hunt(): null | number[] {
        for (let hy = 1; hy < height-1; hy += 2) {
            for (let hx = 1; hx < width - 1; hx += 2) {
                if(grid[hy][hx] === ' ') continue;
                const validMoves = [];
                if (hy+2 < height-1 && grid[hy+2][hx] === ' ') validMoves.push({x:0,y:1});
                if (hy-2 > 0 && grid[hy-2][hx] === ' ') validMoves.push({x:0,y:-1});
                if (hx+2 < width-1 && grid[hy][hx+2] === ' ') validMoves.push({x:1,y:0});
                if (hx-2 > 0 && grid[hy][hx-2] === ' ') validMoves.push({x:-1,y:0});
                if (validMoves.length === 0) continue;
                const d = validMoves[Math.floor(Math.random() * validMoves.length)];
                const {nx, ny} = {nx:hx+d.x, ny:hy+d.y};
                cell(grid, nx, ny, ' ');
                cell(grid, hx, hy, ' ');
                return [hx, hy];
            }
        }
        return null;
    }

    let current = [1,1];
    while (true) {
        let next = await walk(current[0], current[1]);
        if (next === null) next = hunt();
        if (next === null) break;
        current = next;
    }

    cell(grid, 1, 1, 'S');  // Start at 1,1
    cell(grid, width-2, height-2, 'E');  // End at width-1,height-1
    return grid;
}

export async function newMazeBinaryTree(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Binary Tree maze generator

    // Create filled grid and add start/end
    const grid = Array.from({ length: height }, () => "#".repeat(width));

    for (let y = 1; y < height-1; y += 2) {
        for (let x = 1; x < width-1; x += 2) {
            const dirs = [];
            if (y > 0 && y < height-2) dirs.push({ x: 0, y: 1 });
            if (x > 0 && x < width-2) dirs.push({ x: 1, y: 0 });
            if (dirs.length === 0) continue;
            const d = dirs[Math.floor(Math.random() * dirs.length)];
            cell(grid, x, y, ' ');
            cell(grid, x+d.x, y+d.y, ' ');
            if(showBuild) {
                await sleep(10);
                if(setMap) setMap(grid.slice());
            }
        }
    }

    cell(grid, 1, 1, 'S');  // Start at 1,1
    cell(grid, width-2, height-2, 'E');  // End at width-1,height-1
    return grid;
}

export async function newMazeSidewinder(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Sidewinder maze generator

    // Create filled grid and add start/end
    const grid = Array.from({ length: height }, () => "#".repeat(width));

    for (let y = 1; y < height-1; y += 2) {
        let runStart = 1;
        for (let x = 1; x < width-1; x += 2) {
            cell(grid, x, y, ' ');
            if (y > 1 && (x+2 >= width-1 || Math.random() < 0.5)) {
                const chosenX = runStart + 2 * Math.floor(Math.random() * (((x - runStart) / 2) + 1));
                cell(grid, chosenX, y-1, ' ');
                runStart = x + 2;
            }
            else if (x+1 < width-1) {
                cell(grid, x+1, y, ' ');
                cell(grid, x+2, y, ' ');
            }

            if(showBuild) {
                await sleep(10);
                if(setMap) setMap(grid.slice());
            }
        }
    }

    cell(grid, 1, 1, 'S');  // Start at 1,1
    cell(grid, width-2, height-2, 'E');  // End at width-1,height-1
    return grid;
}

export async function newMazeRecursiveDivision(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Recursive division maze generator

    // Create empty grid, carve cells and add start/end
    const grid = Array.from({ length: height }, (_, y) =>
        y === 0 || y === height - 1
            ? "#".repeat(width)
            : "#" + " ".repeat(width - 2) + "#"
    );

    function isVertical(w: number, h: number): boolean {
        const diff = w - h;
        if (diff > 0) return true;
        if (diff < 0) return false;
        return Math.random() > 0.5;
    }

    function randInRange(min: number, max: number, even: boolean): number {
        const retval = Math.floor(Math.random() * (max - min) + min);
        return retval % 2 === (even ? 0 : 1) ? retval :
            retval < max ? retval+1 : retval-1;
    }

    async function divide(x: number, y: number, w: number, h: number, vertical: boolean) {
        if (vertical && w < 3) return;
        if (!vertical && h < 3) return;

        if(showBuild) {
            await sleep(5);
            if(setMap) setMap(grid.slice());
        }

        // wall draw point
        const wx = vertical ? randInRange(x + 1, x + w - 2, true) : x;
        const wy = vertical ? y : randInRange(y + 1, y + h - 2, true);

        // passage through wall point
        const px = vertical ? wx : randInRange(x, x + w - 1, false);
        const py = vertical ? randInRange(y, y + h - 1, false) : wy;

        const [dx, dy] = vertical ? [0,1] : [1,0];
        const wlen = vertical ? h : w;

        // draw wall, except for passage
        let [cx, cy] = [wx, wy];
        for (let i = 0; i < wlen; i++) {
            if (cx !== px || cy !== py) cell(grid, cx, cy, '#');
            cx += dx;
            cy += dy;
        }

        // recurse into subdivisions
        const [uw, uh] = vertical ? [wx - x, h] : [w, wy - y];
        await divide(x, y, uw, uh, isVertical(uw, uh));

        const [nx, ny] = vertical ? [wx + 1, y] : [x, wy + 1];
        const [lw, lh] = vertical ? [x + w - nx, h] : [w, y + h - ny];
        await divide(nx, ny, lw, lh, isVertical(lw, lh));
    }

    await divide(0, 0, width, height, isVertical(width, height));

    cell(grid, 1, 1, 'S');  // Start at 1,1
    cell(grid, width-2, height-2, 'E');  // End at width-1,height-1
    return grid;
}

export async function newMazePrims(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Prims maze generator

    // Check valid target
    function isValid (x: number, y: number, g:string[], v:boolean[][]): boolean {
        return x > 0 && y > 0 && x < g[0].length - 1 && y < g.length - 1 && g[y][x] === '#' && !v[y][x];
    }

    // Find neighboring movement options
    function neighbors(g: string[], p: Point, v: boolean[][]): Point[] {
        const retval:Point[] = [];
        const directions = [
            { x: 0, y: 2 },
            { x: 0, y: -2 },
            { x: 2, y: 0 },
            { x: -2, y: 0 }
        ];

        for (const d of directions) {
            if(isValid(p.x + d.x, p.y + d.y, g, v)) retval.push({x:d.x, y:d.y});
        }

        return retval;
    }

    // Create filled grid and add start/end
    const grid = Array.from({ length: height }, () => "#".repeat(width));
    cell(grid, 1, 1, 'S');  // Start at 1,1

    const current: Point = {x:1,y:1};
    const visited: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));
    visited[1][1] = true;
    const walls: Wall[] = []
    for (const dest of neighbors(grid, current, visited)) walls.push({point: {x:current.x, y:current.y}, dest: {x:dest.x, y:dest.y}});

    // Run prims algorithm on walls
    while(walls.length > 0) {
        const i = Math.floor(Math.random() * walls.length);
        current.x = walls[i].point.x + walls[i].dest.x;
        current.y = walls[i].point.y + walls[i].dest.y;
        if(!isValid(current.x, current.y, grid, visited)) {
            walls.splice(i, 1);  // Check necessary because grid most likely has changed from when wall was added
            continue;
        }

        cell(grid, current.x, current.y, ' ');  // Remove destination
        cell(grid, walls[i].point.x+(walls[i].dest.x/2), walls[i].point.y+(walls[i].dest.y/2), ' ');  // Remove corridor

        if(showBuild) {
            await sleep(10);
            if(setMap) setMap(grid.slice());
        }

        visited[current.y][current.x] = true;
        walls.splice(i,1);
        for (const dest of neighbors(grid, current, visited)) walls.push({point: {x:current.x, y:current.y}, dest: {x:dest.x, y:dest.y}});
    }

    cell(grid, width-2, height-2, 'E');  // End at width-1,height-1
    return grid;
}

export async function newMazeEntombed(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Entombed maze generator

    // Generate lookup value
    function lookupval(g: string[], p: Point): number {
        const isValid = (x: number, y: number): boolean =>
            x >= 0 && y >= 0 && x < g[0].length && y < g.length && (g[y][x] === '#');
        const a: Point = {x: 0, y: -2};
        const b: Point = {x: 0, y: -1};
        const c: Point = {x: -1, y: -1};
        const d: Point = {x: -1, y: 0};
        const e: Point = {x: -1, y: 1};

        let retval = 0;
        if(isValid(p.x + a.x, p.y + a.y)) retval += 16;
        if(isValid(p.x + b.x, p.y + b.y)) retval += 8;
        if(isValid(p.y + c.y, p.y + c.y)) retval += 4;
        if(isValid(p.x + d.x, p.y + d.y)) retval += 2;
        if(isValid(p.x + e.x, p.y + e.y)) retval += 1;
        return retval;
    }

    // Build lookup table
    const l = Array.from({ length: 32 }, () => 'r');  // Fill all default random
    // Invariant 1 rules
    l[0] = '1'; l[1] = '1'; l[16] = '1'; l[17] = '1';
    l[14] = '0'; l[15] = '0'; l[30] = '0'; l[31] = '0';
    // Invariant 2 rules
    l[2] = '1'; l[10] = '1'; l[18] = '1'; l[24] = '1';
    l[5] = '0'; l[13] = '0'; l[29] = '0';
    l[10] = '1'; l[11] = '1'; l[20] = '0'; l[22] = '0'; l[23] = '0';
    // Invariant 3 rules
    l[9] = '0'; l[25] = '0';
    // Drunken Make It Work rule
    l[4] = '0';

    // Create filled grid and add start/end
    const grid = Array.from({ length: height }, () => "#".repeat(width));
    cell(grid, 1, 1, 'S');  // Start at 1,1
    cell(grid, width-2, height-2, 'E');  // End at width-1,height-1

    // Run entombed algorithm on every location
    for (let y = 1; y < height-1; y++) {
        for (let x = 1; x < width-1; x++) {
            switch (l[lookupval(grid, {x: x, y: y})]) {
                case '0':
                    if(grid[y][x]==='#') cell(grid, x, y,' ');
                    break;
                case '1':
                    if(grid[y][x]===' ') cell(grid, x, y, '#');
                    break;
                case 'r':
                    if(Math.random() > 0.5) {
                        if(grid[y][x]==='#') cell(grid, x, y,' ');
                    }
                    else {
                        if(grid[y][x]===' ') cell(grid, x, y, '#');
                    }
            }
            if(showBuild) {
                await sleep(10);
                if(setMap) setMap(grid.slice());
            }
        }
    }
    return grid;
}

export async function newMazeEllers(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Ellers maze generator

    const grid = Array.from({ length: height }, () => "#".repeat(width));

    let nextSet = 1;
    let sets = new Map<number, number>();

    const getSet = (x: number) => {
        if (!sets.has(x)) sets.set(x, nextSet++);
        return sets.get(x)!;
    };

    const mergeSets = (from: number, into: number) => {
        for (const [x, setId] of sets.entries()) {
            if (setId === from) sets.set(x, into);
        }
    };

    for (let y = 1; y < height - 1; y += 2) {
        const isLastRow = y >= height - 2;

        // Ensure every cell in this row has a set
        for (let x = 1; x < width - 1; x += 2) {
            getSet(x);
            cell(grid, x, y, " ");
        }

        // Randomly join adjacent cells horizontally
        for (let x = 1; x < width - 3; x += 2) {
            const currentSet = getSet(x);
            const rightSet = getSet(x + 2);

            const shouldJoin = isLastRow || Math.random() < 0.5;

            if (currentSet !== rightSet && shouldJoin) {
                cell(grid, x + 1, y, " ");
                mergeSets(rightSet, currentSet);
            }
        }

        if (showBuild) {
            await sleep(10);
            if (setMap) setMap(grid.slice());
        }

        if (isLastRow) break;

        // For each set, carve at least one vertical connection downward
        const setGroups = new Map<number, number[]>();

        for (let x = 1; x < width - 1; x += 2) {
            const setId = getSet(x);
            if (!setGroups.has(setId)) setGroups.set(setId, []);
            setGroups.get(setId)!.push(x);
        }

        const nextRowSets = new Map<number, number>();

        for (const [setId, xs] of setGroups.entries()) {
            let carvedDown = false;

            for (const x of xs) {
                const shouldCarveDown = Math.random() < 0.5;

                if (shouldCarveDown) {
                    cell(grid, x, y + 1, " ");
                    nextRowSets.set(x, setId);
                    carvedDown = true;
                }
            }

            if (showBuild) {
                await sleep(10);
                if (setMap) setMap(grid.slice());
            }

            // Ensure every set survives into the next row
            if (!carvedDown) {
                const x = xs[Math.floor(Math.random() * xs.length)];
                cell(grid, x, y + 1, " ");
                nextRowSets.set(x, setId);

                if (showBuild) {
                    await sleep(10);
                    if (setMap) setMap(grid.slice());
                }
            }
        }

        sets = nextRowSets;
    }

    cell(grid, 1, 1, "S");
    cell(grid, width - 2, height - 2, "E");

    return grid;
}

export async function newMazeCellular(width: number, height: number, showBuild: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
    // Cellular Automata maze generator
    // Cells with 3 neighbours are born; cells with 5 or greater die

    const evolutionsMax = 400;

    const directions = [
        { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 },
        { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }, { x: -1, y: 1 }
    ];

    function neighbours(g: string[], p: Point): number {
        const isValid = (x: number, y: number): boolean => {
            return x > 0 && y > 0 && x < g[0].length-1 && y < g.length-1 && g[y][x] === '#';
        }

        let count = 0;
        for (const d of directions) {
            if(isValid(p.x+d.x, p.y+d.y)) count++;
        }
        return count;
    }

    function randomPatch(g: string[], p: Point, w: number, h: number, probability: number) {
        const isValid = (x:number, y:number): boolean => {
            return x > 0 && y > 0 && x < g[0].length-1 && y < g.length-1 && g[y][x] !== '#';
        }

        for(let yr = p.y; yr < p.y + h; yr++) {
            for (let xr = p.x; xr < p.x + w; xr++) {
                if (isValid(xr,yr) && Math.random() < probability) cell(g, xr, yr, "#");
            }
        }
    }

    function connectSections(g: string[]) {
        const h = g.length;
        const w = g[0].length;

        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
        ];

        const isOpen = (c: string) => c === " " || c === "S" || c === "E";

        function labelRegions(): number[][] {
            const labels = Array.from({ length: h }, () => Array(w).fill(-1));
            let regionId = 0;

            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    if (!isOpen(g[y][x]) || labels[y][x] !== -1) continue;

                    const stack = [{ x, y }];
                    labels[y][x] = regionId;

                    while (stack.length > 0) {
                        const p = stack.pop()!;

                        for (const d of dirs) {
                            const nx = p.x + d.x;
                            const ny = p.y + d.y;

                            if (
                                nx > 0 && ny > 0 &&
                                nx < w - 1 && ny < h - 1 &&
                                isOpen(g[ny][nx]) &&
                                labels[ny][nx] === -1
                            ) {
                                labels[ny][nx] = regionId;
                                stack.push({ x: nx, y: ny });
                            }
                        }
                    }

                    regionId++;
                }
            }

            return labels;
        }

        function findStartEndRegions(labels: number[][]) {
            return {
                start: labels[1][1],
                end: labels[h - 2][w - 2],
            };
        }

        while (true) {
            const labels = labelRegions();
            const { start, end } = findStartEndRegions(labels);

            if (start !== -1 && start === end) return;

            const candidates: Point[] = [];

            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    if (g[y][x] !== "#") continue;

                    const touching = new Set<number>();

                    for (const d of dirs) {
                        const nx = x + d.x;
                        const ny = y + d.y;
                        const label = labels[ny][nx];

                        if (label !== -1) touching.add(label);
                    }

                    // This wall separates two or more open sections
                    if (touching.size >= 2) {
                        candidates.push({ x, y });
                    }
                }
            }

            if (candidates.length === 0) return;

            // Prefer candidates that touch the start region or end region
            const preferred = candidates.filter(p => {
                const touching = new Set<number>();

                for (const d of dirs) {
                    const label = labels[p.y + d.y][p.x + d.x];
                    if (label !== -1) touching.add(label);
                }

                return touching.has(start) || touching.has(end);
            });

            const pool = preferred.length > 0 ? preferred : candidates;
            const chosen = pool[Math.floor(Math.random() * pool.length)];

            cell(g, chosen.x, chosen.y, " ");
        }
    }

    // Create empty maze
    const grid = Array.from({ length: height }, (_, y) =>
        y === 0 || y === height - 1
            ? "#".repeat(width)
            : "#" + " ".repeat(width - 2) + "#"
    );

    // Initialize a random patch to start
    const pp: Point = {x:Math.floor(width / 2) - 10, y:Math.floor(height / 2) - 8};
    randomPatch(grid, pp, 20, 16, 0.25);

    // Evolve maze
    for (let i = 0; i < evolutionsMax; i++) {
        const previousGrid = grid.slice();
        for(let ye = 1; ye < height-1; ye++) {
            for (let xe = 1; xe < width-1; xe++) {
                const n = neighbours(previousGrid, {x:xe, y:ye});
                if (n === 3 && previousGrid[ye][xe] === ' ') {
                    // 3 cells surrounding empty => create new
                    cell(grid,xe,ye,"#");
                }
                else if (n > 4 && previousGrid[ye][xe] === '#') {
                    // more than 4 surrounding wall => destroy
                    cell(grid,xe,ye," ");
                }
            }
        }
        if(showBuild && i%10 === 0) {
            await sleep(5);
            if(setMap) setMap(grid.slice());
        }
    }

    // Make sure start and end are open
    cell(grid, 1, 1, "S");
    cell(grid, width - 2, height - 2, "E");
    connectSections(grid);
    cell(grid, 1, 1, "S");
    cell(grid, width - 2, height - 2, "E");

    return grid;
}

export async function newMazeDFS(width: number, height: number, showBuild: boolean, useBFS: boolean, setMap: React.Dispatch<React.SetStateAction<string[]>>|null): Promise<string[]> {
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
            current = (useBFS ? q.shift() : q.pop()) ?? {x:0,y:0};
            const n = neighbors(grid, current, visited);
            if(n.length > 0) {
                q.push(current);
                const i = Math.floor(Math.random() * n.length);
                cell(grid, current.x+n[i].x, current.y+n[i].y, ' ');  // open target
                cell(grid, current.x+(n[i].x/2), current.y+(n[i].y/2), ' ');  // open corridor
                if(showBuild) {
                    await sleep(5);
                    if(setMap) setMap(grid.slice());
                }
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