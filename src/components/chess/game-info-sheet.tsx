import { ChessUtils } from "@/lib/chess/chess.util";
import type { Chess } from "chess.js";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Separator } from "../ui/separator";
import { twMerge } from "tailwind-merge";

function GameInfoSheet({
  chess,
  sheetProps,
}: {
  chess: Chess;
  sheetProps?: DialogProps;
}) {
  const pgn = chess.pgn();
  const splitPgn = ChessUtils.splitPgn(pgn);
  return (
    <Sheet {...sheetProps} modal={false}>
      <SheetContent
        onPointerDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Game Info</SheetTitle>
          <SheetDescription className="grid gap-3 break-all">
            <div className="grid gap-1">
              <h1 className="text-lg text-white font-bold">FEN</h1>
              <p className="break-words">{chess.fen()}</p>
            </div>
            <Separator />
            <div className="grid gap-1">
              <h1 className="text-lg text-white font-bold">PGN</h1>
              <ul className="grid gap-1 max-h-[40vh] overflow-auto">
                {splitPgn.map((pgn, index) => (
                  <li
                    className={twMerge(
                      "text-sm p-3 font-medium text-white rounded-lg",
                      index % 2 === 0 ? "bg-gray-500" : "bg-gray-700"
                    )}
                    key={`${pgn}-${index.toString()}`}
                  >
                    {pgn}
                  </li>
                ))}
              </ul>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default GameInfoSheet;
