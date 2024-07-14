"use client";
import ChessBoard from "@/components/chess/partials/chess-board";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IconEqual, IconInfoCircle, IconReload } from "@tabler/icons-react";
import GameInfoSheet from "@/components/chess/partials/game-info-sheet";
import { useChessContext } from "@/lib/provider/game.provider";

export default function ChessGameVsAI() {
  const [showGameInfo, setShowGameInfo] = useState(false);
  const { chess, resetGame, playSound, handleForceDraw } = useChessContext();

  useEffect(() => {
    const isCheckmate = chess.isCheckmate();
    const isDraw = chess.isDraw();
    const turn = chess.turn();

    if (isCheckmate) {
      if (turn === "b") playSound("WIN");
      else playSound("LOOSE");
    }

    if (isDraw) playSound("DRAW");
  }, [chess, playSound]);

  return (
    <div className="w-full grid place-items-center gap-3">
      <div className="flex w-full items-center gap-5">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowGameInfo((pv) => !pv)}
        >
          <IconInfoCircle />
          Game Info
        </Button>

        <Button type="button" variant="default" onClick={handleForceDraw}>
          <IconEqual />
          Draw Game
        </Button>
        <Button type="button" variant="destructive" onClick={resetGame}>
          <IconReload />
          Reset Game
        </Button>
      </div>
      <ChessBoard
        lightPlayer={{
          name: "You",
          avatar: "/assets/chess/human/default.png",
        }}
        darkPlayer={{
          name: "Google Gemini",
          avatar: "/assets/chess/ai/gemini.png",
        }}
      />
      <GameInfoSheet
        open={showGameInfo}
        onOpenChange={(open) => setShowGameInfo(open)}
      />
    </div>
  );
}
