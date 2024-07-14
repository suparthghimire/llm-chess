"use client";
import ChessBoard from "@/components/chess/chess-board";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import GameInfoSheet from "@/components/chess/game-info-sheet";

export default function ChessGame() {
  const [showGameInfo, setShowGameInfo] = useState(false);
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
