import { Game } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { Vector, vectorCompare } from "../util/vector";
import getValidMoves from "./getValidMoves";

/* 
Pawns: P
Knights: N
Kings: K
Bishops: B
Boats: R
*/

const initialBoard = {
  pieces: `
RP..KBNR
NP..PPPP
BP......
KP......
......PK
......PB
PPPP..PN
RNBK..PR
`
    .trim()
    .replace(/(\r\n|\n|\r)/gm, ""),

  teams: `
11..2222
11..2222
11......
11......
......33
......33
0000..33
0000..33
`
    .trim()
    .replace(/(\r\n|\n|\r)/gm, ""),
};

export type Team = "0" | "1" | "2" | "3";
export type PieceType = "R" | "N" | "B" | "K" | "P";
export type Piece = {
  type: PieceType;
  team: Team;
};
export type PlayerState = {
  captures: Piece[];
  points: number;
  alive: boolean;
};

export type G = {
  cells: (Piece | null)[][];
  playerStates: {
    [team: string]: PlayerState;
  };
  ended: boolean;
};

export const piecePoints = {
  R: 5,
  B: 5,
  N: 3,
  K: 3,
  P: 1,
};

export const playMove = (
  G: G,
  currentPlayer: string,
  from: Vector,
  to: Vector,
  validate: boolean = true
) => {
  if (validate) {
    const validMoves = getValidMoves(from, G, currentPlayer);
    if (!validMoves.some((move) => vectorCompare(move, to)))
      return INVALID_MOVE;
  }

  const targetCell = G.cells[to.x][to.y];
  if (targetCell != null) {
    G.playerStates[currentPlayer].captures.push(targetCell);

    if (G.playerStates[targetCell.team].alive) {
      G.playerStates[currentPlayer].points += piecePoints[targetCell.type];
    }

    if (targetCell.type == "K") {
      G.playerStates[targetCell.team].alive = false;
    }
  }

  G.cells[to.x][to.y] = G.cells[from.x][from.y];
  G.cells[from.x][from.y] = null;
  G.ended = gameEnded(G);
};

export const getNextPlayer = (G: G, currentPlayer: string) => {
  const players = ["0", "1", "2", "3"];

  let nextPos = (players.findIndex((v) => v === currentPlayer) + 1) % 4;
  while (!G.playerStates[players[nextPos]].alive) {
    nextPos = (nextPos + 1) % 4;
  }

  return { nextPos, nextPlayer: players[nextPos] as Team };
};

export const gameEnded = (G: G) => {
  let deadPlayers = 0;
  for (const playerState of Object.values(G.playerStates)) {
    if (!playerState.alive) deadPlayers++;
  }
  return deadPlayers >= 3;
};

const game: Game<G> = {
  setup: () => {
    const cells: G["cells"] = [];

    for (let x = 0; x < 8; x++) {
      const row = [];
      for (let y = 0; y < 8; y++) {
        const index = x + 8 * y;

        if (initialBoard.pieces[index] == ".") {
          row.push(null);
        } else {
          row.push({
            type: initialBoard.pieces[index],
            team: initialBoard.teams[index],
          } as Piece);
        }
      }
      cells.push(row);
    }

    return {
      cells,
      playerStates: {
        "0": { captures: [], alive: true, points: 0 },
        "1": { captures: [], alive: true, points: 0 },
        "2": { captures: [], alive: true, points: 0 },
        "3": { captures: [], alive: true, points: 0 },
      },
      ended: false,
    };
  },

  minPlayers: 4,
  maxPlayers: 4,
  turn: {
    maxMoves: 1,
    minMoves: 1,
    order: {
      first: () => 0,

      // Get the next value of playOrderPos at the end of each turn.
      next: ({ G, ctx }) => getNextPlayer(G, ctx.currentPlayer).nextPos,
    },
  },

  moves: {
    movePiece: ({ G, ctx }, from: Vector, to: Vector) =>
      playMove(G, ctx.currentPlayer, from, to),
  },

  endIf: ({ G }) => {
    if (!G.ended) return;
    const playerStates = Object.entries(G.playerStates);
    playerStates.sort((a, b) => b[1].points - a[1].points);

    return { rank: playerStates };
  },
};

export default game;
