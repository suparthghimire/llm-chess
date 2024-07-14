"use client";
import ChessBoard from "@/components/chess/chess-board";
import { Button } from "@/components/ui/button";
import { Chess } from "chess.js";
import { useMemo } from "react";
import { IconChess, IconInfoCircle, IconReload } from "@tabler/icons-react";
export default function Home() {
  const chess = useMemo(() => new Chess(), []);
  return (
    <div className="w-full grid place-items-center gap-3">
      <div className="flex w-full items-center gap-5">
        <Button type="button" variant="default">
          <IconChess />
          Play Random Move
        </Button>
        <Button type="button" variant="outline">
          <IconInfoCircle />
          Game Info
        </Button>
        <Button type="button" variant="destructive">
          <IconReload />
          Restart Game
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
        chess={chess}
      />
    </div>
  );
}
