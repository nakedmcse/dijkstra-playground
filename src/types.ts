export type Point = { x: number, y: number };
export type Node = { point: Point, cost: number, length: number, path: Point[] };
export type Wall = { point: Point, dest: Point };
export type Weight = { up: number; down: number; left: number; right: number };
export type PathStats = { cost: number, length: number, path: Point[] };
export type CompletedPath = { grid: string[], stats: PathStats };

export enum MazeAlgorithm {
    STACKDFS = 'Stack DFS',
    ENTOMBED = 'Entombed',
    PRIMS = 'Prims'
}