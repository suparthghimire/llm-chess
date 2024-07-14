/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import type { Chess, Piece, Square } from "chess.js";
import ChessSquare from "./chess-square";
import type { Player } from "../player/player-card";
import PlayerCard from "../player/player-card";
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { ChessUtils } from "@/lib/chess/chess.util";
import ChessPiece from "./chess-piece";
import type { T_GameState } from "@/lib/chess/chess.types";
import GameOverDialog from "./game-over-dialog";

function ChessBoard({
  chess,
  lightPlayer,
  darkPlayer,
  handleFromToMove,
}: {
  chess: Chess;
  lightPlayer: Player;
  darkPlayer: Player;
  handleFromToMove: (params: { from: Square; to: Square }) => void;
}) {
  const board = chess.board();
  const [rerenderBoard, setRerenderBoard] = useState(false);

  const [draggingPiece, setDraggingPiece] = useState<Piece | null>(null);
  const [validSquaresForPiece, setValidSquaresForPiece] = useState<Square[]>(
    []
  );

  const [gameState, setGameState] = useState<T_GameState>({
    status: "playing",
  });

  const [checkSquare, setCheckSquare] = useState<Square | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const activeSq = event.active.id as Square;
    const piece = chess.get(activeSq as Square);

    if (!piece) return;

    setDraggingPiece(piece);

    const validMoves = chess.moves({
      square: activeSq,
      verbose: true,
    });

    const validSquares = validMoves.map((move) => move.to);

    setValidSquaresForPiece(validSquares);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setValidSquaresForPiece([]);

    const fromSq = event.active.id as Square | undefined;
    const toSq = event.over?.id as Square | undefined;

    if (!fromSq || !toSq) return;

    handleFromToMove({
      from: fromSq,
      to: toSq,
    });

    setRerenderBoard((pv) => !pv);

    const gameOverStatus = ChessUtils.getGameOverStatus(chess);

    // if game over status is not playing, then set the game state and end the game
    if (gameOverStatus.status !== "playing") {
      setGameState(gameOverStatus);
      return;
    }

    const isCheck = chess.isCheck();
    if (isCheck) {
      const currentTurn = chess.turn();
      // get position of king in check
      const checkSq = ChessUtils.getSquareFromPiece("k", "b", chess.board());
      console.log({ checkSq });
      setCheckSquare(checkSq);
    } else {
      setCheckSquare(null);
    }

    setDraggingPiece(null);
    setValidSquaresForPiece([]);
  };

  const handleDragCancel = () => {
    setDraggingPiece(null);
    setValidSquaresForPiece([]);
  };

  const handleGameOver = () => {
    chess.reset();
    handleDragCancel();
    setGameState({ status: "playing" });
    setRerenderBoard((pv) => !pv);
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
