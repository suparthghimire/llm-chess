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
import { Separator } from "../../ui/separator";
import { twMerge } from "tailwind-merge";
import { useChessContext } from "@/lib/provider/game.provider";
import { Button } from "../../ui/button";
import {
  IconAlertSquare,
  IconCheck,
  IconCopy,
  IconLoader,
} from "@tabler/icons-react";
import useCopyToClipboard from "@/lib/hooks/app/useCopyText";
import { useMemo } from "react";

function GameInfoSheet(props: DialogProps) {
  const { chess } = useChessContext();

  const pgn = chess.pgn();
  const splitPgn = ChessUtils.splitPgn(pgn);

  return (
    <Sheet {...props} modal={false}>
      <SheetContent
        onPointerDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Game Info</SheetTitle>
          <Separator />
          <SheetDescription className="grid pt-4 gap-4 break-all">
            <div className="grid gap-1">
              <TitleWithCopyButton textToCopy={chess.fen()} title="FEN" />
              <p className="break-words">{chess.fen()}</p>
            </div>
            <Separator />
            <div className="grid gap-1">
              <TitleWithCopyButton textToCopy={pgn} title="PGN" />
              <ul className="grid gap-1 max-h-[40vh] overflow-auto">
                {splitPgn.length <= 0 && <p>Play a move to see game history</p>}
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

function TitleWithCopyButton({
  title,
  textToCopy,
}: {
  title: string;
  textToCopy: string;
}) {
  const { status, copyToClipboard } = useCopyToClipboard();

  const icon = useMemo(() => {
    switch (status) {
      case "loading":
        return <IconLoader className="text-white size-4" />;
      case "success":
        return <IconCheck className="text-green-500 size-4" />;
      case "error":
        return <IconAlertSquare className="text-red-500 size-4" />;
      default:
        return <IconCopy className="text-white size-4" />;
    }
  }, [status]);

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-md text-white font-bold">{title}</h1>

      <button
        type="button"
        disabled={status !== "idle"}
        className="size-8 p-0"
        onClick={() => copyToClipboard(textToCopy)}
      >
        {icon}
      </button>
    </div>
  );
}

export default GameInfoSheet;
