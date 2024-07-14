import { NextResponse } from "next/server";
import { Chess } from "chess.js";
import { GetGeminiResponse } from "./llm";

export async function POST(request: Request) {
  try {
    type T_Body = { pgn: string };
    const body: T_Body | undefined = await request.json();

    if (!body || !body.pgn) throw new Error("Invalid request body");

    const { pgn } = body;

    // Instantiate a new chess game
    const chess = new Chess();

    // Load the game from the PGN
    chess.loadPgn(pgn);

    // Get the next move from the AI
    const response = await GetGeminiResponse(pgn);

    return NextResponse.json({
      status: 200,
      data: response,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({
        message: error.message,
      });
    return NextResponse.json({
      message: "ERROR",
    });
  }
}
