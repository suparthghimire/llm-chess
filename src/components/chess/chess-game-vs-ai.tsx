"use client";
import ChessBoard from "@/components/chess/partials/chess-board";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { IconEqual, IconInfoCircle, IconReload } from "@tabler/icons-react";
import GameInfoSheet from "@/components/chess/partials/game-info-sheet";
import { useChessContext } from "@/lib/provider/game.provider";
import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "@/lib/react-query/query-mutation-keys";
import { geminiMove } from "@/lib/api/endpoints";

export default function ChessGameVsAI() {
  const [showGameInfo, setShowGameInfo] = useState(false);

  const [hasBeenReset, setHasBeenReset] = useState(false);

  const { chess, setNewPgn, resetGame, playSound, handleForceDraw } =
    useChessContext();

  const mutation = useMutation({
    mutationKey: [mutationKeys.geminiMove],
    mutationFn: (pgn: string) => geminiMove(pgn),
    onSuccess: (data) => {
      console.log(data.data.pgn);
      if (hasBeenReset) {
        setHasBeenReset(false);
        return;
      }
      setNewPgn(data.data.pgn);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate } = mutation;

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
    <div className="w-full grid place-items-center gap-10">
      <ChessBoard
        makeAIMove={(pgn: string) => mutate(pgn)}
        lightPlayer={{
          name: "You",
          avatar: "/assets/chess/human/default.png",
        }}
        darkPlayer={{
          thinking: mutation.isPending,
          name: "Google Gemini",
          avatar: "/assets/chess/ai/gemini.png",
        }}
      />
      <div className="flex pb-3 max-w-screen overflow-auto w-full items-center gap-5 px-3">
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
        <Button
          type="button"
          variant="destructive"
          onClick={() => {
            setHasBeenReset(true);
            resetGame();
          }}
        >
          <IconReload />
          Reset Game
        </Button>
      </div>
      <GameInfoSheet
        open={showGameInfo}
        onOpenChange={(open) => setShowGameInfo(open)}
      />
    </div>
  );
}
