"use client";
import { Chess } from "chess.js";
import { useMemo } from "react";
import GameProvider from "@/lib/provider/game.provider";
import ChessGameVsAI from "@/components/chess/chess-game-vs-ai";

export default function Home() {
  const chess = useMemo(() => new Chess(), []);
  return (
    <GameProvider chess={chess}>
      <ChessGameVsAI />
    </GameProvider>
  );
}
