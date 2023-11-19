import { G, Team } from "../game";
import { createTree, growTree } from "./node";
import { calculateBranchScore, getBestMove } from "./score";

onmessage = (e) => {
  const data = e.data as { G: G; currentPlayer: Team };

  const tree = createTree(data.G, data.currentPlayer);

  for (let i = 0; i < 5; i++) {
    growTree(tree);
    calculateBranchScore(tree, data.currentPlayer);
    postMessage({ move: getBestMove(tree), depth: i });
  }
};
