import { Ctx } from "boardgame.io";
import { Vector } from "../util/vector";
import { G } from "./game";
import { getValidPawnMoves } from "./pieces/pawn";
import { getValidBoatMoves } from "./pieces/boat";
import { getValidKnightMoves } from "./pieces/knight";
import { getValidBishopMoves } from "./pieces/bishop";
import { getValidKingMoves } from "./pieces/king";

export default function getValidMoves(
  cell: Vector,
  state: G,
  ctx: Ctx
): Vector[] {
  const focusedPiece = state.cells[cell.x][cell.y];

  if (focusedPiece == null) return [];
  if (focusedPiece.team !== ctx.currentPlayer) return [];

  switch (focusedPiece.type) {
    case "R":
      return getValidBoatMoves(cell, state, ctx);
    case "N":
      return getValidKnightMoves(cell, state, ctx);
    case "B":
      return getValidBishopMoves(cell, state, ctx);
    case "K":
      return getValidKingMoves(cell, state, ctx);
    case "P":
      return getValidPawnMoves(cell, state, ctx);
  }
}
