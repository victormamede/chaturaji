import { max, min } from "../../util/array";
import { Vector } from "../../util/vector";
import { G, Team, piecePoints } from "../game";
import { Node, getNode } from "./node";

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

export function getBranchScore(node: Node, calculatingPlayer: Team): number {
  if (node.children.length == 0)
    return getScore(node.gameState, calculatingPlayer);

  if (node.currentPlayer == calculatingPlayer)
    return max(node.children, (node) =>
      getBranchScore(node, calculatingPlayer)
    )[1];
  else
    return min(node.children, (node) =>
      getBranchScore(node, calculatingPlayer)
    )[1];
}

export function getBestMove(
  state: G,
  team: Team
): { from: Vector; to: Vector } | null {
  const rootNode = getNode(state, team);
  console.log(rootNode);
  if (rootNode.children.length == 0) return null;

  const maxNode = max(rootNode.children, (child) =>
    getBranchScore(child, team)
  );
  console.log(maxNode);

  if (maxNode[0] == null) return null;

  return maxNode[0].move;
}
