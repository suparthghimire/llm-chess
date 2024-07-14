"use client";
import ChessBoard from "@/components/chess/chess-board";
import { Button } from "@/components/ui/button";
import { Chess, type Square } from "chess.js";
import { useMemo, useState } from "react";
import { IconChess, IconInfoCircle, IconReload } from "@tabler/icons-react";
export default function Home() {
  const chess = useMemo(() => new Chess(), []);

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
      <div>{chess.fen()}</div>
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
    </div>
  );
}
