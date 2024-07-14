/* eslint-disable @next/next/no-img-element */
import { useDraggable } from "@dnd-kit/core";
import type { Piece } from "chess.js";
import React from "react";

function ChessPiece({ piece, id }: { piece: Piece; id: string }) {
  const { setNodeRef, attributes, listeners } = useDraggable({
    id: id,
  });

  return (
    <img
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      src={`/assets/chess/pieces/${piece.color}${piece.type}.png`}
      alt={`${piece.color}${piece.type}`}
      className="w-full cursor-grab active:cursor-grabbing h-full object-contain touch-none"
    />
  );
}

export default ChessPiece;
