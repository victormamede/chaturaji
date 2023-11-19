import { Ctx } from "boardgame.io";
import { Vector, vectorAdd } from "../../util/vector";
import { G } from "../game";
import { isInsideBoard } from "./util";

export function getValidKnightMoves(
  cell: Vector,
  state: G,
  ctx: Ctx
): Vector[] {
  const directions: Vector[] = [
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: 1 },
    { x: -2, y: -1 },
    { x: 1, y: 2 },
    { x: 1, y: -2 },
    { x: -1, y: 2 },
    { x: -1, y: -2 },
  ];

  const availableMoves: Vector[] = [];

  for (const direction of directions) {
    const currentCell = vectorAdd(cell, direction);

    if (isInsideBoard(currentCell)) {
      const currentCellValue = state.cells[currentCell.x][currentCell.y];

      if (currentCellValue != null) {
        if (currentCellValue.team != ctx.currentPlayer)
          availableMoves.push(currentCell);
      } else {
        availableMoves.push(currentCell);
      }
    }
  }

  return availableMoves;
}
