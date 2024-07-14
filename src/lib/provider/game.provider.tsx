import type { Chess, Square } from "chess.js";
import React, {
  type PropsWithChildren,
  createContext,
  useContext,
} from "react";
import type { T_GameState } from "../chess/chess.types";

type T_GameContext = {
  chess: Chess;
  gameState: T_GameState;
  setGameState: (value: T_GameState) => void;
  resetGame: () => void;
  rerenderBoard: boolean;
  setRerenderBoard: (value: boolean) => void;
  moveFromTo: (args: { from: Square; to: Square }) => void;
  playRandomMove: () => void;

  handleGameOver: () => void;
};

const GameContext = createContext<T_GameContext>({} as T_GameContext);

function GameProvider({
  chess,
  children,
}: PropsWithChildren<{ chess: Chess }>) {
  const [gameState, setGameState] = React.useState<T_GameState>({
    status: "playing",
  });
  const [rerenderBoard, setRerenderBoard] = React.useState<boolean>(false);

  function moveFromTo({ from, to }: { from: Square; to: Square }) {
    try {
      chess.move({
        from,
        to,
        promotion: "q",
      });
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
    const moves = chess.moves();
    const move = moves[Math.floor(Math.random() * moves.length)];
    chess.move(move);
    setRerenderBoard((pv) => !pv);
  }

  function handleGameOver() {
    chess.reset();
    setGameState({ status: "playing" });
    setRerenderBoard((pv) => !pv);
  }

  return (
    <GameContext.Provider
      value={{
        handleGameOver,
        chess,
        moveFromTo,
        playRandomMove,
        rerenderBoard,
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
