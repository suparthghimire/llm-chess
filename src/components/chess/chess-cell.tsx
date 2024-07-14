import React, { type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
function ChessCell({
  type,
  children,
}: PropsWithChildren<{ type: "light" | "dark" }>) {
  return (
    <div
      className={twMerge(
        "relative size-full aspect-square text-red-900 font-bold grid place-items-center",
        type === "light" ? "bg-gray-300" : "bg-gray-600"
      )}
    >
      {children}
    </div>
  );
}

export default ChessCell;
