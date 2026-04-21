import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { GameProvider } from "@/context/GameContext";
import { I18nProvider } from "@/context/I18nContext";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flip 7 — Online Card Game",
  description: "Play Flip 7 online with friends! First to 200 points wins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${nunito.variable}`}>
        <I18nProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
