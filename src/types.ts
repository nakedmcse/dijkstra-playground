export type Point = { x: number, y: number };
export type Node = { point: Point, cost: number, length: number };
export type Weight = { up: number; down: number; left: number; right: number };
export type PathStats = { cost: number, length: number };
export type CompletedPath = { grid: string[], stats: PathStats };