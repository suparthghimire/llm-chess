import React from "react";
import type { Chess } from "chess.js";
import ChessCell from "./chess-cell";
import Image from "next/image";
import type { Player } from "../player/player-card";
import PlayerCard from "../player/player-card";

function ChessBoard({
  chess,
  lightPlayer,
  darkPlayer,
}: {
  chess: Chess;
  lightPlayer: Player;
  darkPlayer: Player;
}) {
  const board = chess.board();
  return (
    <div className="w-full  grid place-items-center gap-3">
      <PlayerCard player={darkPlayer} />
      <div className="grid grid-cols-8 grid-rows-8 w-full aspect-square">
        {board.map((row, rowIndex) =>
          row.map((piece, cellIndex) => (
            <ChessCell
              key={`${rowIndex}-${cellIndex.toString()}`}
              type={(rowIndex + cellIndex) % 2 === 0 ? "light" : "dark"}
            >
              {piece ? (
                <Image
                  src={`/assets/chess/pieces/${piece.color}${piece.type}.png`}
                  alt={`${piece.color}${piece.type}`}
                  fill
                  className="object-contain"
                />
              ) : null}
            </ChessCell>
          ))
        )}
      </div>
      <PlayerCard player={lightPlayer} />
    </div>
  );
}

export default ChessBoard;
