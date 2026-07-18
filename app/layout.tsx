import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sahaaya — Family Continuity Planner",
  description: "When you cannot be there, your circle knows what to do.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
