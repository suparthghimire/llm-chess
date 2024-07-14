import type { Metadata } from "next";
import React, { type PropsWithChildren } from "react";

// metadata
export const metadata: Metadata = {
  title: "Human vs Gemini",
};

function ChessGameVSAILayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export default ChessGameVSAILayout;
