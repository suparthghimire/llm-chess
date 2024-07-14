/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import type { Chess, Piece, Square } from "chess.js";
import ChessSquare from "./chess-square";
import type { Player } from "../../player/player-card";
import PlayerCard from "../../player/player-card";
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { ChessUtils } from "@/lib/chess/chess.util";
import ChessPiece from "./chess-piece";
import GameOverDialog from "./game-over-dialog";
import { useChessContext } from "@/lib/provider/game.provider";

function ChessBoard({
  lightPlayer,
  darkPlayer,
  makeAIMove,
}: {
  lightPlayer: Player;
  darkPlayer: Player;
  makeAIMove?: (pgn: string) => void;
  aiThinking?: boolean;
}) {
  const {
    chess,
    moveFromTo,
    gameState,
    handleGameOver,
    rerenderBoard,
    checkSquare,
    validSquaresForPiece,
    draggingPiece,
    setDraggingPiece,
    setValidSquaresForPiece,
  } = useChessContext();

  const board = chess.board();

  const handleDragStart = (event: DragStartEvent) => {
    // if it is not whites turn, then return
    if (chess.turn() !== "w") return;

    const activeSq = event.active.id as Square;
    const piece = chess.get(activeSq as Square);

    if (!piece || piece.color !== "w") return;

    setDraggingPiece(piece);

    const validMoves = chess.moves({
      square: activeSq,
      verbose: true,
    });

    const validSquares = validMoves.map((move) => move.to);

    setValidSquaresForPiece(validSquares);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (chess.turn() !== "w") return;

    setValidSquaresForPiece([]);

    const fromSq = event.active.id as Square | undefined;
    const toSq = event.over?.id as Square | undefined;

    if (!fromSq || !toSq) return;
    const fromPiece = chess.get(fromSq as Square);

    if (!fromPiece || fromPiece.color !== "w") return;

    if (fromSq === toSq) return;

    moveFromTo({
      from: fromSq,
      to: toSq,
    });

    if (makeAIMove) {
      const pgn = chess.pgn();
      makeAIMove(pgn);
    }
  };

  const handleDragCancel = () => {
    if (chess.turn() !== "w") return;

    setDraggingPiece(null);
    setValidSquaresForPiece([]);
  };

  return (
    <>
      <div
        className="w-full  grid place-items-center gap-3"
        key={rerenderBoard.toString()}
      >
        <PlayerCard player={darkPlayer} />
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="grid grid-cols-8 grid-rows-8 w-full aspect-square">
            {board.map((row, rowIndex) =>
              row.map((piece, cellIndex) => {
                const sqName = ChessUtils.getSquareName(rowIndex, cellIndex);
                return (
                  <ChessSquare
                    showSqId={false}
                    highlightSquare={validSquaresForPiece.includes(sqName)}
                    highlightCheckSquare={checkSquare}
                    id={sqName}
                    key={`${rowIndex}-${cellIndex.toString()}`}
                    type={(rowIndex + cellIndex) % 2 === 0 ? "light" : "dark"}
                  >
                    {piece ? (
                      <ChessPiece id={piece.square} piece={piece} />
                    ) : null}
                  </ChessSquare>
                );
              })
            )}
          </div>
          {draggingPiece && (
            <DragOverlay>
              <img
                src={`/assets/chess/pieces/${draggingPiece.color}${draggingPiece.type}.png`}
                alt={`${draggingPiece.color}${draggingPiece.type}`}
                className="w-full cursor-grab active:cursor-grabbing h-full object-contain opacity-50"
              />
            </DragOverlay>
          )}
        </DndContext>
        <PlayerCard player={lightPlayer} />
      </div>
      <GameOverDialog
        alertDialogProps={{
          open: gameState.status !== "playing",
          onOpenChange(open) {
            if (!open) handleGameOver();
          },
        }}
        gameState={gameState}
      />
    </>
  );
}

export default ChessBoard;
