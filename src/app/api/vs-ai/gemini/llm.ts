import { GoogleGenerativeAI } from "@google/generative-ai";

import { ChessUtils } from "../../../../lib/chess/chess.util";
import { Chess, type PieceSymbol, type Square } from "chess.js";

function getPrompt(pgn: string) {
  const chess = new Chess();

  console.log("CURRENT PGN", pgn);

  const basePrompt = `You are a chess grand master. You will be given a game of history of moves in PGN format. You will play as BLACK. You need to respond your next move in PGN notation. Make sure the move is valid, the PGN notation is valid and you are not making an illegal move. IF THE PGN MOVE HISTORY IS EMPTY, IT MEANS YOU NEED TO START THE GAME WITH A MOVE. Here are the history of moves in the match in PGN notation: '${pgn}'`;

  const basePrefix =
    "WHAT IS YOUR NEXT MOVE? ONLY MAKE ONE MOVE AND REPLY WITH FULL PGN HISTORY UPTO YOUR NEXT MOVE. DONT APPEND OR PREPEND ANY EXTRA TEXT TO PGN STRING";

  // check if any piece is under attack
  // for each square on board check if any piece is under attack
  const piecesInDanger = ChessUtils.getAllPiecesInDanger(pgn, "w");

  const constructAttackerSentence = (
    args: { byPiece: PieceSymbol; square: Square }[]
  ) => {
    let str = "";
    for (const arg of args) {
      str += ` ${ChessUtils.getPieceFullname(arg.byPiece)} at square ${
        arg.square
      },`;
    }
    return str;
  };

  // check by order: K is most important, p is least important

  if (piecesInDanger.k.attackers.length > 0)
    return `${basePrompt}. YOUR KING AT SQUARE '${
      piecesInDanger.k.at
    }' IS IN CHECK FROM FOLLOWING: '${constructAttackerSentence(
      piecesInDanger.k.attackers
    )}'. MAKE SURE THE KING IS PROTECTED BY OTHER PIECE. IF NOT, PROTECT THE KING BY ANOTHER PIECE SO THAT THE POINT WILL BE SAME AND YOU WILL NOT BE AT A DISADVANTAGE. ${basePrefix}`;

  if (piecesInDanger.q.attackers.length > 0)
    return `${basePrompt}. YOUR QUEEN AT SQUARE '${
      piecesInDanger.q.at
    }' IS UNDER ATTACK FROM FOLLOWING: '${constructAttackerSentence(
      piecesInDanger.q.attackers
    )}'. MAKE SURE THE QUEEN IS PROTECTED BY OTHER PIECE. IF NOT, PROTECT THE QUEEN BY ANOTHER PIECE SO THAT THE POINT WILL BE SAME AND YOU WILL NOT BE AT A DISADVANTAGE. ${basePrefix}`;

  if (piecesInDanger.r.attackers.length > 0)
    return `${basePrompt}. YOUR ROOK AT SQUARE '${
      piecesInDanger.r.at
    }' IS UNDER ATTACK FROM FOLLOWING: '${constructAttackerSentence(
      piecesInDanger.r.attackers
    )}'. MAKE SURE THE ROOK IS PROTECTED BY OTHER PIECE. IF NOT, PROTECT THE ROOK BY ANOTHER PIECE SO THAT THE POINT WILL BE SAME AND YOU WILL NOT BE AT A DISADVANTAGE. ${basePrefix}`;

  if (piecesInDanger.b.attackers.length > 0)
    return `${basePrompt}. YOUR BISHOP AT SQUARE '${
      piecesInDanger.b.at
    }' IS UNDER ATTACK FROM FOLLOWING: '${constructAttackerSentence(
      piecesInDanger.b.attackers
    )}'. MAKE SURE THE BISHOP IS PROTECTED BY OTHER PIECE. IF NOT, PROTECT THE BISHOP BY ANOTHER PIECE SO THAT THE POINT WILL BE SAME AND YOU WILL NOT BE AT A DISADVANTAGE. ${basePrefix}`;

  if (piecesInDanger.n.attackers.length > 0)
    return `${basePrompt}. YOUR KNIGHT AT SQUARE '${
      piecesInDanger.n.at
    }' IS UNDER ATTACK FROM FOLLOWING: '${constructAttackerSentence(
      piecesInDanger.n.attackers
    )}'. MAKE SURE THE KNIGHT IS PROTECTED BY OTHER PIECE. IF NOT, PROTECT THE KNIGHT BY ANOTHER PIECE SO THAT THE POINT WILL BE SAME AND YOU WILL NOT BE AT A DISADVANTAGE. ${basePrefix}`;

  if (piecesInDanger.p.attackers.length > 0)
    return `${basePrompt}. YOUR PAWN AT SQUARE '${
      piecesInDanger.p.at
    }' IS UNDER ATTACK FROM FOLLOWING: '${constructAttackerSentence(
      piecesInDanger.p.attackers
    )}'. MAKE SURE THE PAWN IS PROTECTED BY OTHER PIECE. IF NOT, PROTECT THE PAWN BY ANOTHER PIECE SO THAT THE POINT WILL BE SAME AND YOU WILL NOT BE AT A DISADVANTAGE. ${basePrefix}`;

  return `${basePrompt} ${basePrefix}`;
}

export async function GetGeminiResponse(originalPgn: string) {
  let prompt = "";
  try {
    // Get the API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API key is missing");

    // Instantiate the model
    const genAI = new GoogleGenerativeAI(apiKey);

    // Write the prompt
    prompt = getPrompt(originalPgn);
    console.log("PROMPT", prompt);

    // if (prompt.length > 1) throw new Error();

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate the content
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Convert the response to text to get raw PGN
    const rawPgnFromGemini = response.text();

    // clean the pgn - remove unwanted characters
    const cleanedPgn = ChessUtils.cleanPgn(rawPgnFromGemini);

    //   Declare final pgn
    let finalPgn = cleanedPgn;

    console.log("BY GEMINI", finalPgn);

    //  check if pgn is not valid
    if (!ChessUtils.isPgnValid(finalPgn)) {
      console.log("INSIDE PGN VALID CHECK AND WHILE LOOP");
      // Retry 1 more time to ask gemini
      let i = 0;
      while (!ChessUtils.isPgnValid(finalPgn) && i < 1) {
        prompt = `${prompt}. DONOT RETURN FOLLOWING PGN: ${finalPgn}'`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const rawPgnFromGemini = response.text();
        const cleanedPgn = ChessUtils.cleanPgn(rawPgnFromGemini);
        finalPgn = cleanedPgn;
        i++;
      }

      if (!ChessUtils.isPgnValid(finalPgn)) {
        console.log("THROW AFTER WHILE", finalPgn);
        throw new Error("Invalid PGN");
      }
    }

    console.log("GETTING EXACTLY 1 MOVE MORE");
    // get exactly 1 more move from gemini response than the original pgn
    finalPgn = ChessUtils.getExactly1MoreMoveFromNewPgn(originalPgn, finalPgn);
    console.log("AFTER GETTING EXACTLY 1 MOVE MORE");

    //   check if pgn is valid
    if (!ChessUtils.isPgnValid(finalPgn)) {
      console.log("Final check, invalid");
      throw new Error("Invalid PGN");
    }

    return { pgn: finalPgn, prompt: prompt, fromGemini: true };
  } catch (error) {
    /* TODO: CREATE A TRANSPOSITION TABLE AND IF THE POSITION IS ALREADY PLAYED, PLAY THE NEXT MOVE ELSE PLAY RANDOM MOVE */
    // Play a random move
    const chess = new Chess();
    chess.loadPgn(originalPgn);

    const move = ChessUtils.getRandomMove(chess);
    chess.move(move);
    const pgn = chess.pgn();
    return { prompt, pgn: pgn, fromGemini: false };
  }
}
