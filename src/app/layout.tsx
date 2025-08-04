import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Providers & Components
import { CartProvider } from "./providers/cart-provider";
import { RestaurantThemeProvider } from "@/hooks/use-restaurant-theme";
import { ErrorBoundary } from "./components/error-boundary";

// Load Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Page Metadata
export const metadata: Metadata = {
  title: "Xichuan Noodles - Authentic Xi'an Hand-Pulled Noodles",
  description: "Experience authentic Xi'an cuisine with hand-pulled Biang Biang noodles, spicy beef dishes, and traditional Chinese dumplings. Order online for delivery or pickup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <RestaurantThemeProvider defaultThemePath="/themes/leclerc-theme.json">
            <CartProvider>{children}</CartProvider>
          </RestaurantThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
