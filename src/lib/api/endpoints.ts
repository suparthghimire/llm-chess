import type { AxiosResponse } from "axios";
import { axiosInstance } from "../axios";
import type { T_Response } from "./types";

export async function geminiMove(currentPgn: string): Promise<
  T_Response<{
    pgn: string;
    prompt: string;
    fromGemini: string;
  }>
> {
  const response = await axiosInstance.post("/vs-ai/gemini", {
    pgn: currentPgn,
  });
  return response.data;
}
