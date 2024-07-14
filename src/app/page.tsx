"use client";
import ChessBoard from "@/components/chess/chess-board";
import { Button } from "@/components/ui/button";
import { Chess, type Square } from "chess.js";
import { useMemo, useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import GameInfoSheet from "@/components/chess/game-info-sheet";
export default function Home() {
  const chess = useMemo(() => new Chess(), []);
  const [showGameInfo, setShowGameInfo] = useState(false);
  const handleFromToMove = ({ from, to }: { from: Square; to: Square }) => {
    try {
      chess.move({
        from,
        to,
        promotion: "q",
      });
    } catch (error) {
      console.log("ERROR");
    }
  };

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
        handleFromToMove={handleFromToMove}
        lightPlayer={{
          name: "You",
          avatar: "/assets/chess/human/default.png",
        }}
        darkPlayer={{
          name: "Google Gemini",
          avatar: "/assets/chess/ai/gemini.png",
        }}
        chess={chess}
      />
      <GameInfoSheet
        chess={chess}
        sheetProps={{
          open: showGameInfo,
          onOpenChange: (open) => setShowGameInfo(open),
        }}
      />
    </div>
  );
}
