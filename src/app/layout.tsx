import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Providers & Components
import { CartProvider } from "./providers/cart-provider";
import { RestaurantThemeProvider } from "@/hooks/use-restaurant-theme";
import { ErrorBoundary } from "./components/error-boundary";
import { XichuanQueryClientProvider } from "./providers/query-client-provider";

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

const themeInitializerScript = `
(function() {
  try {
    var storageKey = 'restaurant-theme-dark-mode';
    var storedPreference = localStorage.getItem(storageKey);
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedPreference === 'true' || (storedPreference === null && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (error) {
    // no-op: fall back to default theme
  }
})();
`;

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
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializerScript }}
        />
        <ErrorBoundary>
          <XichuanQueryClientProvider>
            <RestaurantThemeProvider defaultThemePath="/themes/leclerc-theme.json">
              <CartProvider>{children}</CartProvider>
            </RestaurantThemeProvider>
          </XichuanQueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
