import { Client } from "boardgame.io/react";
import game from "./Game/game";
import Board from "./Board/Board";

const App = Client({ game, board: Board, numPlayers: 4 });

export default App;
