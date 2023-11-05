import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { useMemo, useState } from "react";
import { G } from "../Game/game";
import { Vector, vectorCompare } from "../util/vector";
import { Box, Center, Table, Tbody, Td } from "@chakra-ui/react";
import getValidMoves from "../Game/getValidMoves";

import Rook from "../assets/pieces/rook.svg?react";
import Knight from "../assets/pieces/knight.svg?react";
import Bishop from "../assets/pieces/bishop.svg?react";
import King from "../assets/pieces/king.svg?react";
import Pawn from "../assets/pieces/pawn.svg?react";

const teamColors = {
  "0": "red",
  "1": "blue",
  "2": "yellow",
  "3": "green",
};

const pieceToSVG = {
  T: <Rook />,
  N: <Knight />,
  B: <Bishop />,
  K: <King />,
  P: <Pawn />,
};

export default function Board({ G, moves, ctx }: BoardProps<G>) {
  const [focusedCell, setFocusedCell] = useState<Vector | null>(null);
  const validMoves = useMemo(() => {
    if (focusedCell == null) return [];

    return getValidMoves(focusedCell, G, ctx);
  }, [focusedCell, G, ctx]);

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
          <Center position={"relative"}>
            {space ? (
              <Box>{space ? pieceToSVG[space.type] : undefined}</Box>
            ) : (
              <Box></Box>
            )}
            {validMoves.some((move) => vectorCompare(move, { x, y })) ? (
              <Center
                position={"absolute"}
                left={0}
                right={0}
                top={0}
                bottom={0}
              >
                <Box
                  w={8}
                  h={8}
                  borderRadius={"full"}
                  bg="black"
                  opacity={0.2}
                ></Box>
              </Center>
            ) : null}
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
