import type { Metadata, Viewport } from "next";
import {Figtree} from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Crave",
    template: "%s",
  },
  description: "Browse and order from Crave locations.",
  icons: {
    icon: "/cravelogo.png",
    shortcut: "/cravelogo.png",
    apple: "/cravelogo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "cyan" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={figtree.className}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
