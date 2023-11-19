import { Ctx } from "boardgame.io";
import { Vector, vectorAdd } from "../../util/vector";
import { G } from "../game";
import { isInsideBoard } from "./util";

export function getValidPawnMoves(cell: Vector, state: G, ctx: Ctx): Vector[] {
  const pawnDirections: { [key: string]: Vector } = {
    "0": { x: 0, y: -1 },
    "1": { x: 1, y: 0 },
    "2": { x: 0, y: 1 },
    "3": { x: -1, y: 0 },
  };

  const direction = pawnDirections[ctx.currentPlayer];
  const forwardMove = vectorAdd(cell, direction);

  const availableMoves: Vector[] = [];

  if (
    isInsideBoard(forwardMove) &&
    state.cells[forwardMove.x][forwardMove.y] == null
  ) {
    availableMoves.push(forwardMove);
  }

  const diagonals: { [key: string]: Vector[] } = {
    "0": [
      { x: 1, y: -1 },
      { x: -1, y: -1 },
    ],
    "1": [
      { x: 1, y: 1 },
      { x: 1, y: -1 },
    ],
    "2": [
      { x: 1, y: 1 },
      { x: -1, y: 1 },
    ],
    "3": [
      { x: -1, y: 1 },
      { x: -1, y: -1 },
    ],
  };

  for (const diagonal of diagonals[ctx.currentPlayer]) {
    const captureMove = vectorAdd(cell, diagonal);
    if (isInsideBoard(captureMove)) {
      const targetCell = state.cells[captureMove.x][captureMove.y];
      if (targetCell != null && targetCell.team != ctx.currentPlayer)
        availableMoves.push(captureMove);
    }
  }

  return availableMoves;
}
