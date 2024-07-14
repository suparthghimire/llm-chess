import type { Chess, Square } from "chess.js";
import React, {
  type PropsWithChildren,
  createContext,
  useContext,
} from "react";
import type { T_GameState, T_MoveType } from "../chess/chess.types";
import { ChessUtils } from "../chess/chess.util";

type T_GameContext = {
  chess: Chess;
  gameState: T_GameState;
  setGameState: (value: T_GameState) => void;
  resetGame: () => void;
  rerenderBoard: boolean;
  setRerenderBoard: (value: boolean) => void;
  moveFromTo: (args: { from: Square; to: Square }) => void;
  playRandomMove: () => void;
  playSound: (type: T_MoveType) => void;
  handleGameOver: () => void;
  handleForceDraw: () => void;
};

const GameContext = createContext<T_GameContext>({} as T_GameContext);

const sounds = {
  move: new Audio("/assets/chess/sounds/move.mp3"),
  capture: new Audio("/assets/chess/sounds/capture.mp3"),
  check: new Audio("/assets/chess/sounds/check.mp3"),
  castle: new Audio("/assets/chess/sounds/castle.mp3"),
  win: new Audio("/assets/chess/sounds/win.mp3"),
  draw: new Audio("/assets/chess/sounds/draw.mp3"),
  loose: new Audio("/assets/chess/sounds/loose.mp3"),
};

function GameProvider({
  chess,
  children,
}: PropsWithChildren<{ chess: Chess }>) {
  const [gameState, setGameState] = React.useState<T_GameState>({
    status: "playing",
  });

  const [rerenderBoard, setRerenderBoard] = React.useState<boolean>(false);

  function playSound(type: T_MoveType) {
    switch (type) {
      case "WIN":
        sounds.win.play();
        break;
      case "DRAW":
        sounds.draw.play();
        break;
      case "CHECK":
        sounds.check.play();
        break;
      case "CASTLE":
        sounds.castle.play();
        break;
      case "CAPTURE":
        sounds.capture.play();
        break;
      case "LOOSE":
        sounds.loose.play();
        break;
      default:
        sounds.move.play();
        break;
    }
  }

  function moveFromTo({ from, to }: { from: Square; to: Square }) {
    try {
      chess.move({
        from,
        to,
        promotion: "q",
      });
      const moveType = ChessUtils.getMoveType(chess);
      playSound(moveType);
      setRerenderBoard((pv) => !pv);
    } catch (error) {
      console.log("ERROR");
    }
  }

  function resetGame() {
    chess.reset();
    setRerenderBoard((pv) => !pv);
  }

  function playRandomMove() {
    chess.move(ChessUtils.getRandomMove(chess));
    const moveType = ChessUtils.getMoveType(chess);
    playSound(moveType);
    setRerenderBoard((pv) => !pv);
  }

  function handleGameOver() {
    chess.reset();
    setGameState({ status: "playing" });
    setRerenderBoard((pv) => !pv);
  }

  function handleForceDraw() {
    chess.reset();
    playSound("DRAW");
    setGameState({ status: "draw" });
    setRerenderBoard((pv) => !pv);
  }
  return (
    <GameContext.Provider
      value={{
        handleGameOver,
        chess,
        moveFromTo,
        playRandomMove,
        handleForceDraw,
        rerenderBoard,
        playSound,
        setRerenderBoard,
        resetGame,
        gameState,
        setGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;

export function useChessContext() {
  const gameContext = useContext(GameContext);
  if (!gameContext) {
    throw new Error("useChessContext must be used within a GameProvider");
  }
  return gameContext;
}
