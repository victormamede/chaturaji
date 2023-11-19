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
  currentPlayer: string
): Vector[] {
  const focusedPiece = state.cells[cell.x][cell.y];

  if (focusedPiece == null) return [];
  if (focusedPiece.team != currentPlayer) return [];

  switch (focusedPiece.type) {
    case "R":
      return getValidBoatMoves(cell, state, currentPlayer);
    case "N":
      return getValidKnightMoves(cell, state, currentPlayer);
    case "B":
      return getValidBishopMoves(cell, state, currentPlayer);
    case "K":
      return getValidKingMoves(cell, state, currentPlayer);
    case "P":
      return getValidPawnMoves(cell, state, currentPlayer);
  }
}
