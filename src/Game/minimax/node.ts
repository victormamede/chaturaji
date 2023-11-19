import { Vector } from "../../util/vector";
import { G, PlayerState, Team, getNextPlayer, playMove } from "../game";
import getValidMoves from "../getValidMoves";

export type Node = {
  gameState: G;
  currentPlayer: Team;
  children: Node[];
  move: { from: Vector; to: Vector } | null;
  depth: number;
};

export function getNode(
  gameState: G,
  currentPlayer: Team,
  move: { from: Vector; to: Vector } | null = null,
  depth: number = 0,
  maxDepth: number = 4
): Node {
  const children: Node[] = [];

  if (depth < maxDepth && !gameState.ended) {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const cell = gameState.cells[x][y];
        if (cell == null) continue;
        if (cell.team != currentPlayer) continue;

        const availableMoves = getValidMoves(
          { x, y },
          gameState,
          currentPlayer
        );

        for (const move of availableMoves) {
          const newBoard = cloneBoard(gameState);
          playMove(newBoard, currentPlayer, { x, y }, move, false);

          children.push(
            getNode(
              newBoard,
              getNextPlayer(newBoard, currentPlayer).nextPlayer,
              { from: { x, y }, to: move },
              depth + 1
            )
          );
        }
      }
    }
  }

  return {
    children,
    depth,
    currentPlayer,
    gameState,
    move,
  };
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
