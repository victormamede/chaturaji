import { max, min } from "../../util/array";
import { Vector } from "../../util/vector";
import { G, Team, piecePoints } from "../game";
import { Node } from "./node";

export function getScore(g: G, team: Team) {
  if (!g.playerStates[team].alive) return -Infinity;

  let boardScore = 0;

  for (const cell of g.cells.flat()) {
    if (cell == null) continue;
    if (cell.team != team) continue;

    boardScore += piecePoints[cell.type];
  }

  return g.playerStates[team].points + boardScore;
}

export function calculateBranchScore(
  node: Node,
  calculatingPlayer: Team
): void {
  if (node.children.length == 0) {
    node.score = getScore(node.gameState, calculatingPlayer);
    return;
  }

  node.children.forEach((child) =>
    calculateBranchScore(child, calculatingPlayer)
  );
  if (node.currentPlayer == calculatingPlayer) {
    const score = max(node.children, (child) => child.score)[1];
    node.score = score;
  } else {
    const score = min(node.children, (child) => child.score)[1];
    node.score = score;
  }
}

export function getBestMove(tree: Node): { from: Vector; to: Vector } | null {
  if (tree.children.length == 0) return null;

  const maxNode = max(tree.children, (child) => child.score);

  if (maxNode[0] == null) return null;

  return maxNode[0].move;
}
