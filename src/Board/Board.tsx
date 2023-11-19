import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { Fragment, useMemo, useState } from "react";
import { G, PlayerState, Team } from "../Game/game";
import { Vector, vectorCompare } from "../util/vector";
import {
  Box,
  BoxProps,
  Center,
  Fade,
  Grid,
  GridItem,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
} from "@chakra-ui/react";
import getValidMoves from "../Game/getValidMoves";

import Rook from "../assets/pieces/rook.svg?react";
import Knight from "../assets/pieces/knight.svg?react";
import Bishop from "../assets/pieces/bishop.svg?react";
import King from "../assets/pieces/king.svg?react";
import Pawn from "../assets/pieces/pawn.svg?react";
import { Ctx } from "boardgame.io";

const teamColors = {
  "0": "red",
  "1": "blue",
  "2": "yellow",
  "3": "green",
};

const pieceToSVG = {
  R: <Rook />,
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
        if (ctx.gameover) return;

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
          color={
            space
              ? G.playerStates[space.team].alive
                ? teamColors[space.team] + ".500"
                : "gray.500"
              : undefined
          }
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
      <Box position={"relative"}>
        <Fade in={!!ctx.gameover}>
          {ctx.gameover ? (
            <Center position={"absolute"} left={0} right={0} top={0} bottom={0}>
              <Grid
                zIndex={10}
                bg="white"
                templateColumns={"repeat(2, 1fr)"}
                gap={3}
                alignItems={"center"}
                p={3}
              >
                <GridItem colSpan={2}>
                  <Heading>Game Over!</Heading>
                </GridItem>
                {(ctx.gameover.rank as [Team, PlayerState][]).map(
                  ([player, state]) => (
                    <Fragment key={player}>
                      <GridItem>
                        <Box w={16} h={16} color={teamColors[player] + ".500"}>
                          {pieceToSVG.K}
                        </Box>
                      </GridItem>
                      <GridItem>
                        <Text fontSize={"xl"} textAlign={"center"}>
                          {state.points}
                        </Text>
                      </GridItem>
                    </Fragment>
                  )
                )}
              </Grid>
            </Center>
          ) : null}
        </Fade>
        <Table>
          <Tbody>{tbody}</Tbody>
        </Table>
        <Box
          position={"absolute"}
          left={0}
          bottom={0}
          transform={"auto-gpu"}
          translateY={"100%"}
        >
          <CaptureList ctx={ctx} G={G} flexDir={"row"} team="0" p={1} />
        </Box>
        <Box
          position={"absolute"}
          left={0}
          top={0}
          transform={"auto-gpu"}
          translateX={"-100%"}
        >
          <CaptureList ctx={ctx} G={G} flexDir={"column"} team="1" p={1} />
        </Box>
        <Box
          position={"absolute"}
          right={0}
          top={0}
          transform={"auto-gpu"}
          translateY={"-100%"}
        >
          <CaptureList ctx={ctx} G={G} flexDir={"row"} team="2" p={1} />
        </Box>
        <Box
          position={"absolute"}
          right={0}
          bottom={0}
          transform={"auto-gpu"}
          translateX={"100%"}
        >
          <CaptureList ctx={ctx} G={G} flexDir={"column"} team="3" p={1} />
        </Box>
      </Box>
    </Center>
  );
}

type CaptureListProps = BoxProps & { G: G; ctx: Ctx; team: Team };
function CaptureList({ G, team, ctx, ...props }: CaptureListProps) {
  const playerState = G.playerStates[team];
  return (
    <Stack spacing={0} {...props}>
      <Text
        textAlign={"center"}
        bg={team == ctx.currentPlayer ? teamColors[team] + ".700" : undefined}
        color={team == ctx.currentPlayer ? "white" : undefined}
        py={1}
        px={2}
      >
        {playerState.points}p
      </Text>
      {playerState.captures.map((piece, index) => (
        <Box key={index} h={8} w={8} color={teamColors[piece.team] + ".500"}>
          {pieceToSVG[piece.type]}
        </Box>
      ))}
    </Stack>
  );
}
