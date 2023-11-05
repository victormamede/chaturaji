import { Vector, vectorAdd } from "../util/vector";
import { G } from "./game";

export default function getValidMoves(
  cell: Vector,
  state: G,
  currentPlayer: string
): Vector[] {
  const focusedPiece = state.cells[cell.x][cell.y];

  if (focusedPiece == null) return [];

  switch (focusedPiece.type) {
    case "T":
      break;
    case "N":
      break;
    case "B":
      break;
    case "K":
      break;
    case "P":
      return getValidPawnMoves(cell, state, currentPlayer);
  }

  return [];
}

function getValidPawnMoves(
  cell: Vector,
  state: G,
  currentPlayer: string
): Vector[] {
  const pawnDirections: { [key: string]: Vector } = {
    "0": { x: 0, y: 1 },
    "1": { x: 1, y: 0 },
    "2": { x: 0, y: -1 },
    "3": { x: -1, y: 0 },
  };

  const direction = pawnDirections[currentPlayer];

  return [vectorAdd(cell, direction)];
}
