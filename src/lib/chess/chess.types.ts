import type { Color, PieceSymbol, Square } from "chess.js";
export type T_Board = ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][];

type T_GameStatusNoWinner = {
  status:
    | "stalemate"
    | "draw"
    | "insufficient_material"
    | "threefold_repetition"
    | "game_over"
    | "playing";
};

type T_GameOverCheckmate = {
  status: "checkmate";
  winner: Color;
};

export type T_GameState = T_GameStatusNoWinner | T_GameOverCheckmate;
