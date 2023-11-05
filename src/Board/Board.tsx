import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { useState } from "react";
import { G } from "../Game/game";
import { Vector, vectorCompare } from "../util/vector";
import { Box, Center, Image, Table, Tbody, Td } from "@chakra-ui/react";

import rook from "../assets/pieces/rook.svg";
import knight from "../assets/pieces/knight.svg";
import bishop from "../assets/pieces/bishop.svg";
import king from "../assets/pieces/king.svg";
import pawn from "../assets/pieces/pawn.svg";

const teamColors = {
  "0": "red",
  "1": "blue",
  "2": "yellow",
  "3": "green",
};

const pieceToSVG = {
  T: rook,
  N: knight,
  B: bishop,
  K: king,
  P: pawn,
};

export default function Board({ G, moves }: BoardProps<G>) {
  const [focusedCell, setFocusedCell] = useState<Vector | null>(null);

  const tbody = [];
  for (let y = 0; y < 8; y++) {
    const cells = [];
    for (let x = 0; x < 8; x++) {
      const id = x + 8 * y;
      const space = G.cells[x][y];

      const onClickCell = () => {
        if (focusedCell == null) {
          setFocusedCell({ x, y });
          return;
        }
        setFocusedCell(null);

        if (vectorCompare(focusedCell, { x, y })) {
          return;
        }

        moves.movePiece(focusedCell, { x, y });
      };

      cells.push(
        <Td
          w={16}
          h={16}
          bg={
            focusedCell && vectorCompare(focusedCell, { x, y })
              ? "red.200"
              : (x + y) % 2 == 0
              ? "gray.200"
              : "gray.50"
          }
          color={space ? teamColors[space.team] + ".500" : undefined}
          p={0}
          key={id}
          onClick={onClickCell}
          borderWidth={1}
        >
          <Center>
            {space ? (
              <Box>
                <Image
                  w={16}
                  h={16}
                  src={space ? pieceToSVG[space.type] : undefined}
                />
              </Box>
            ) : (
              <Box></Box>
            )}
          </Center>
        </Td>
      );
    }

    tbody.push(<tr key={y}>{cells}</tr>);
  }

  return (
    <Center h="100vh">
      <Box>
        <Table>
          <Tbody>{tbody}</Tbody>
        </Table>
      </Box>
    </Center>
  );
}
