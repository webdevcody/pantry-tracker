"use client";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
