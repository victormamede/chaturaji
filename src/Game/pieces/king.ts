import { Vector, vectorAdd } from "../../util/vector";
import { G } from "../game";
import { isInsideBoard } from "./util";

export function getValidKingMoves(
  cell: Vector,
  state: G,
  currentPlayer: string
): Vector[] {
  const directions: Vector[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
  ];

  const availableMoves: Vector[] = [];

  for (const direction of directions) {
    const currentCell = vectorAdd(cell, direction);

    if (isInsideBoard(currentCell)) {
      const currentCellValue = state.cells[currentCell.x][currentCell.y];

      if (currentCellValue != null) {
        if (currentCellValue.team != currentPlayer)
          availableMoves.push(currentCell);
      } else {
        availableMoves.push(currentCell);
      }
    }
  }

  return availableMoves;
}
