import { Vector } from "../../util/vector";

export function isInsideBoard(position: Vector) {
  return position.x >= 0 && position.x < 8 && position.y >= 0 && position.y < 8;
}
