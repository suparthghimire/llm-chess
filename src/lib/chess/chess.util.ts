import type { Chess, Color, Piece, PieceSymbol, Square } from "chess.js";
import type { T_Board, T_GameState } from "./chess.types";

export const ChessUtils = {
  getSquareName(rowIndex: number, colIndex: number): Square {
    const col = String.fromCharCode(97 + colIndex);
    const row = 8 - rowIndex;
    return `${col}${row}` as Square;
  },
  getSquareFromPiece(piece: PieceSymbol, color: Color, board: T_Board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        console.log({
          pieceToFind: piece,
          colorToFind: color,
          boardPiece: board[i][j]?.type,
          boardColor: board[i][j]?.color,
          square: board[i][j]?.square,
        });
        if (
          board[i][j] &&
          board[i][j]?.type === piece &&
          board[i][j]?.color === color &&
          board[i][j]?.square
        ) {
          return board[i][j]?.square ?? null;
        }
      }
    }
    return null; // If piece is not found
  },
  getGameOverStatus(chess: Chess): T_GameState {
    const hasWhiteWon = chess.isCheckmate() && chess.turn() === "b";
    const hasBlackWon = chess.isCheckmate() && chess.turn() === "w";

    if (hasWhiteWon)
      return {
        status: "checkmate",
        winner: "w",
      } as const;
    if (hasBlackWon)
      return {
        status: "checkmate",
        winner: "b",
      } as const;

    if (chess.isStalemate())
      return {
        status: "stalemate",
      } as const;
    if (chess.isInsufficientMaterial())
      return {
        status: "insufficient_material",
      } as const;
    if (chess.isThreefoldRepetition())
      return {
        status: "threefold_repetition",
      } as const;
    if (chess.isDraw())
      return {
        status: "draw",
      } as const;
    if (chess.isGameOver())
      return {
        status: "game_over",
      } as const;
    return {
      status: "playing",
    } as const;
  },
  getGameOverContent(state: T_GameState) {
    switch (state.status) {
      case "checkmate": {
        const winner = state.winner === "w" ? "White" : "Black";
        return {
          title: `Checkmate! ${winner} wins!`,
          description: `Congratulations! ${winner} has defeated the opponent!`,
        };
      }
      case "draw":
        return {
          title: "Draw!",
          description: "Good game! It's a draw!",
        };
      case "stalemate":
        return {
          title: "Stalemate!",
          description: "Game over due to stalemate!",
        };
      case "insufficient_material":
        return {
          title: "Insufficient material!",
          description: "Game over due to insufficient material!",
        };
      case "threefold_repetition":
        return {
          title: "Threefold repetition!",
          description: "Game over due to threefold repetition!",
        };
      case "game_over":
        return {
          title: "Game over!",
          description: "Game over!",
        };
      case "playing":
        return {
          title: "Game in progress",
          description: "Game is still in progress!",
        };
    }
  },
};
