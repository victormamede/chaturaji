import { Ctx } from "boardgame.io";
import { Vector, vectorAdd } from "../util/vector";
import { G } from "./game";

export default function getValidMoves(
  cell: Vector,
  state: G,
  ctx: Ctx
): Vector[] {
  const focusedPiece = state.cells[cell.x][cell.y];

  if (focusedPiece == null) return [];
  if (focusedPiece.team !== ctx.currentPlayer) return [];

  switch (focusedPiece.type) {
    case "T":
      return [];
    case "N":
      return [];
    case "B":
      return [];
    case "K":
      return [];
    case "P":
      return getValidPawnMoves(cell, state, ctx);
  }
}

function getValidPawnMoves(cell: Vector, state: G, ctx: Ctx): Vector[] {
  const pawnDirections: { [key: string]: Vector } = {
    "0": { x: 0, y: -1 },
    "1": { x: 1, y: 0 },
    "2": { x: 0, y: 1 },
    "3": { x: -1, y: 0 },
  };

  const direction = pawnDirections[ctx.currentPlayer];
  const forwardMove = vectorAdd(cell, direction);

  const availableMoves: Vector[] = [];

  if (state.cells[forwardMove.x][forwardMove.y] != null) return [];

  return availableMoves;
}
