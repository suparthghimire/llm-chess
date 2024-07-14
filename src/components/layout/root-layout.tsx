"use client";
import RootProvider from "@/lib/provider/root.provider";
import type { PropsWithChildren } from "react";

function RootLayout({ children }: PropsWithChildren) {
  return <RootProvider>{children}</RootProvider>;
}

export default RootLayout;
