export type Vector = { x: number; y: number };

export function vectorCompare(a: Vector, b: Vector): boolean {
  return a.x === b.x && a.y === b.y;
}

export function vectorAdd(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}
