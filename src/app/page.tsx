"use client";
import { Chess } from "chess.js";
import { useMemo } from "react";
import GameProvider from "@/lib/provider/game.provider";
import ChessGame from "@/components/chess/chess-game";

export default function Home() {
  const chess = useMemo(() => new Chess(), []);
  return (
    <GameProvider chess={chess}>
      <ChessGame />
    </GameProvider>
  );
}
