import { Game, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { Vector } from "../util/vector";

/* 
Pawns: P
Knights: N
Kings: K
Bishops: B
Boats: T
*/

const initialBoard = {
  pieces: `
TP..KBNT
NP..PPPP
BP......
KP......
......PK
......PB
PPPP..PN
TNBK..PT
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

export type G = {
  cells: (Piece | null)[][];
};

export type Piece = {
  type: "T" | "N" | "B" | "K" | "P";
  team: "0" | "1" | "2" | "3";
};

const movePiece: Move<G> = ({ G, playerID }, from: Vector, to: Vector) => {
  const fromPiece = G.cells[from.x][from.y];

  const toPiece = G.cells[to.x][to.y];

  if (fromPiece == null) return INVALID_MOVE;
  if (fromPiece.team !== playerID) return INVALID_MOVE;
  if (toPiece?.team === playerID) return INVALID_MOVE;

  G.cells[to.x][to.y] = G.cells[from.x][from.y];
  G.cells[from.x][from.y] = null;
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
    };
  },

  minPlayers: 4,
  maxPlayers: 4,
  turn: {
    maxMoves: 1,
    minMoves: 1,
  },

  moves: {
    movePiece,
  },
};

export default game;
