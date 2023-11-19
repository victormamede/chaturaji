import { Vector, vectorAdd } from "../../util/vector";
import { G } from "../game";
import { isInsideBoard } from "./util";

export function getValidBoatMoves(
  cell: Vector,
  state: G,
  currentPlayer: string
): Vector[] {
  const directions: Vector[] = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  const availableMoves: Vector[] = [];

  for (const direction of directions) {
    let currentCell = vectorAdd(cell, direction);

    while (isInsideBoard(currentCell)) {
      const currentCellValue = state.cells[currentCell.x][currentCell.y];
      if (currentCellValue != null) {
        if (currentCellValue.team != currentPlayer) {
          availableMoves.push(currentCell);
        }
        break;
      } else {
        availableMoves.push(currentCell);
      }
      currentCell = vectorAdd(currentCell, direction);
    }
  }

  return availableMoves;
}
