import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/Clerk.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/ui/Navbar";
import { ConfirmProvider } from "@/components/ui/its-confirm-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Simpli Recipes",
  description: "A minimalist, social, recipe site. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html className="flex justify-center" lang="en">
        <body className="max-w-[800px] w-[800px] pt-14 flex flex-col">
          <ConfirmProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <Navbar />
                <Toaster />
              </SignedIn>
              {children}
            </ThemeProvider>
          </ConfirmProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
