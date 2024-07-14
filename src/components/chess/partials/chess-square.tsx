import { useDroppable } from "@dnd-kit/core";
import type { Square } from "chess.js";
import React, { type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
function ChessSquare({
  type,
  children,
  id,
  highlightSquare,
  highlightCheckSquare,
  showSqId,
}: PropsWithChildren<{
  id: string;
  type: "light" | "dark";
  highlightSquare: boolean;
  highlightCheckSquare: Square | null;
  showSqId?: boolean;
}>) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={twMerge(
        "relative select-none size-full aspect-square text-red-900 font-bold grid place-items-center",
        type === "light" ? "bg-gray-300" : "bg-gray-600"
      )}
    >
      {showSqId && <span className="select-none absolute inset-0">{id} </span>}

      <div className="z-10 relative">{children}</div>
      <div
        className={twMerge(
          "absolute hidden size-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg",
          highlightSquare && "block  bg-emerald-600",
          highlightCheckSquare === id && "block bg-red-600 size-3/4 blur-lg "
        )}
      />
    </div>
  );
}

export default ChessSquare;
