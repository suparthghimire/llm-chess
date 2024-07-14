import {
  Chess,
  Piece,
  type Color,
  type PieceSymbol,
  type Square,
} from "chess.js";
import type { T_Board, T_GameState } from "./chess.types";

export const ChessUtils = {
  splitPgn(pgn: string) {
    const words = pgn.split(/\s+/); // Split by any whitespace
    const result: string[] = [];

    for (let i = 0; i < words.length; i += 3) {
      result.push(words.slice(i, i + 3).join(" "));
    }

    return result.filter(Boolean);
  },
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
  getGameState(chess: Chess): T_GameState {
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
  getMoveType(chess: Chess) {
    const history = chess.history({ verbose: true });

    const isCheck = chess.isCheck();
    const isCheckmate = chess.isCheckmate();
    const isDraw = chess.isDraw();

    const lastMove = history.at(-1);

    if (isCheck) return "CHECK";
    if (isCheckmate) return "WIN";
    if (isDraw) return "DRAW";
    if (lastMove?.flags === "c" || lastMove?.flags === "e") return "CAPTURE";
    if (lastMove?.flags === "k" || lastMove?.flags === "q") return "CASTLE";
    return "MOVE";
  },
  getRandomMove(chess: Chess) {
    const moves = chess.moves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove;
  },

  cleanPgn(pgn: string) {
    let newStr = "";

    // remove new line
    newStr = pgn.replace(/\n/g, "").trim();

    // remove * characters
    newStr = newStr.replace(/\*/g, "").trim();

    return newStr.trim();
  },

  isPgnValid: (pgn: string) => {
    try {
      const chess = new Chess();
      chess.loadPgn(pgn);
      return true;
    } catch (error) {
      return false;
    }
  },

  getExactly1MoreMoveFromNewPgn: (prevPgn: string, newPgn: string) => {
    const prevPgnChess = new Chess();

    const newPgnChess = new Chess();

    prevPgnChess.loadPgn(prevPgn);
    newPgnChess.loadPgn(newPgn);

    const totalMovesPrev = prevPgnChess.history().length;
    const totalMovesNew = newPgnChess.history().length;

    // Difference is from totalMovesPrev to totalMovesNew + 1 because newPgn should be 1 move more than prevPgn
    const difference = totalMovesNew - totalMovesPrev;

    let pgn = newPgn;

    console.log({
      original: prevPgn,
      new: newPgn,
      totalMovesPrev,
      totalMovesNew,
      difference,
      check: totalMovesNew !== 1 + totalMovesPrev,
    });

    //   if gemini has not played exactly 1 move more than the original pgn
    if (totalMovesNew !== 1 + totalMovesPrev) {
      // If gemini played more than 1 + totalMovesInOriginal
      if (difference > 0) {
        // undo all moves until movesByGemini = 1 + totalMovesInOriginal
        const movesToUndo = difference - 1;
        for (let i = 0; i < movesToUndo; i++) {
          newPgnChess.undo();
        }
        pgn = newPgnChess.pgn();
      } else if (difference < 0) {
        console.log("LESS THAN PREV, false");
        throw new Error("Invalid PGN");
      }
    }

    return pgn;
  },

  getOpponentMoves: (chess: Chess) => {
    const gamePGN = chess.pgn();

    let tokens = chess.fen().split(" ");
    tokens[1] = tokens[1] === "w" ? "b" : "w";
    chess.load(tokens.join(" "));

    const moves = chess.moves({ verbose: true });

    tokens = chess.fen().split(" ");
    tokens[1] = tokens[1] === "w" ? "b" : "w";
    chess.loadPgn(gamePGN);

    return moves;
  },

  getAllPiecesInDanger(pgn: string, attackerColor: Color) {
    const chess = new Chess();
    chess.loadPgn(pgn);

    const board = chess.board();

    type AttackerInfo = Record<
      PieceSymbol,
      {
        at: Square | null;
        attackers: { byPiece: PieceSymbol; square: Square }[];
      }
    >;

    const attackerMap: AttackerInfo = {
      b: { at: null, attackers: [] },
      k: { at: null, attackers: [] },
      n: { at: null, attackers: [] },
      p: { at: null, attackers: [] },
      q: { at: null, attackers: [] },
      r: { at: null, attackers: [] },
    };

    const opponentMoves = ChessUtils.getOpponentMoves(chess);

    for (const row of board) {
      for (const piece of row) {
        // if piece is not null and piece is not of the attackerColor
        if (piece) {
          const sqAttachedByOpponentMoves = opponentMoves.filter(
            (move) => move.to === piece.square
          );
          if (sqAttachedByOpponentMoves.length > 0) {
            // attackerMap[piece.type].at = piece.square;
            attackerMap[piece.type] = {
              at: piece.square,
              attackers: sqAttachedByOpponentMoves.map((m) => ({
                byPiece: m.piece,
                square: m.from,
              })),
            };
          }
        }
      }
    }

    console.log(attackerMap);
    return attackerMap;

    // console.log("GET ALL ATTACKERS FOR BLACK PIECES");

    // // Function to get all possible squares on the board
    // const getAllSquares = (): Square[] => {
    //   const squares: Square[] = [];
    //   for (let row = 0; row < 8; row++) {
    //     for (let col = 0; col < 8; col++) {
    //       squares.push(ChessUtils.getSquareName(row, col));
    //     }
    //   }
    //   return squares;
    // };

    // const allSquares = getAllSquares();

    // for (let row = 0; row < 8; row++) {
    //   for (let col = 0; col < 8; col++) {
    //     const piece = board[row][col];
    //     if (piece && piece.color === color) {
    //       const square = ChessUtils.getSquareName(row, col);
    //       const attackers = allSquares
    //         .filter((s) => {
    //           const move = chess.move({ from: s, to: square, promotion: "q" });
    //           if (move) {
    //             chess.undo();
    //             return chess.get(s)?.color === opponentColor;
    //           }
    //           return false;
    //         })
    //         .map((s) => chess.get(s)?.type || "");

    //       attackerMap[piece.type].push(...attackers);
    //     }
    //   }
    // }

    // return attackerMap;
  },

  getPieceFullname(piece: PieceSymbol) {
    switch (piece) {
      case "p":
        return "Pawn";
      case "n":
        return "Knight";
      case "b":
        return "Bishop";
      case "r":
        return "Rook";
      case "q":
        return "Queen";
      case "k":
        return "King";
    }
  },
};
