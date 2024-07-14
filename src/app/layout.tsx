import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import RootProvider from "@/lib/provider/root.provider";
import RootLayout from "@/components/layout/root-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLM Chess - Gemini",
  description: "Created Gemini Chess",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          inter.className,
          "grid h-screen max-h-screen w-full place-items-center dark"
        )}
      >
        <RootLayout>
          <main className="w-full md:max-w-[770px] p-3 lg:p-0">{children}</main>
        </RootLayout>
      </body>
    </html>
  );
}
