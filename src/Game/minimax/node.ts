import { Vector } from "../../util/vector";
import { G, PlayerState, Team, getNextPlayer, playMove } from "../game";
import getValidMoves from "../getValidMoves";

export type Node = {
  gameState: G;
  currentPlayer: Team;
  children: Node[];
  move: { from: Vector; to: Vector } | null;
  isLeaf: boolean;
  depth: number;
  score: number;
};

export function createTree(gameState: G, currentPlayer: Team): Node {
  const root: Node = {
    children: [],
    depth: 0,
    currentPlayer,
    gameState,
    move: null,
    score: -1,
    isLeaf: true,
  };

  return root;
}

export function attachChildren(node: Node) {
  const children: Node[] = [];

  node.isLeaf = false;

  if (!node.gameState.ended) {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const cell = node.gameState.cells[x][y];
        if (cell == null) continue;
        if (cell.team != node.currentPlayer) continue;

        const availableMoves = getValidMoves(
          { x, y },
          node.gameState,
          node.currentPlayer
        );

        for (const move of availableMoves) {
          const newBoard = cloneBoard(node.gameState);
          playMove(newBoard, node.currentPlayer, { x, y }, move, false);

          const newNode: Node = {
            gameState: newBoard,
            children: [],
            currentPlayer: getNextPlayer(newBoard, node.currentPlayer)
              .nextPlayer,
            depth: node.depth + 1,
            move: { from: { x, y }, to: move },
            score: -1,
            isLeaf: true,
          };

          children.push(newNode);
        }
      }
    }
  }

  if (children.length > 0) {
    node.children = children;
  } else {
    node.isLeaf = true;
  }
}

export function growTree(node: Node, maxDepth: number = 20) {
  if (node.depth > maxDepth) return;

  if (!node.isLeaf) {
    node.children.forEach((child) => growTree(child));
    return;
  }

  attachChildren(node);
}

function cloneBoard(G: G): G {
  const cells = [...G.cells.map((row) => [...row])];

  const clonePlayerState: (team: string) => PlayerState = (team) => {
    const state = G.playerStates[team];

    return {
      ...state,
      captures: [...state.captures.map((piece) => ({ ...piece }))],
    };
  };

  const playerStates: { [team: string]: PlayerState } = {
    "0": clonePlayerState("0"),
    "1": clonePlayerState("1"),
    "2": clonePlayerState("2"),
    "3": clonePlayerState("3"),
  };

  return { cells, ended: G.ended, playerStates };
}
