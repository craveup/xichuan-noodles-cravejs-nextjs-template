/**
 * React Hook for Restaurant Theme Management
 * Provides theme loading, switching, and customization capabilities
 */

"use client";

import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { ThemeEngine, RestaurantTheme } from "@/lib/theme-engine";

const DARK_MODE_STORAGE_KEY = "restaurant-theme-dark-mode";

const syncDocumentDarkClass = (isDark: boolean) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", isDark);
};

interface ThemeContextType {
  theme: RestaurantTheme | null;
  isDarkMode: boolean;
  loadTheme: (themePath: string) => Promise<void>;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function RestaurantThemeProvider({
  children,
  defaultThemePath,
}: {
  children: ReactNode;
  defaultThemePath?: string;
}) {
  const [theme, setTheme] = useState<RestaurantTheme | null>(null);
  const [themeEngine, setThemeEngine] = useState<ThemeEngine | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const loadTheme = useCallback(async (themePath: string) => {
    try {
      const loadedTheme = await ThemeEngine.loadTheme(themePath);
      const engine = new ThemeEngine(loadedTheme);

      setTheme(loadedTheme);
      setThemeEngine(engine);

      // Apply theme to document
      engine.applyTheme();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load theme";
      console.error("❌ Theme loading failed:", errorMessage);
    }
  }, []);

  const handleSetDarkMode = useCallback(
    (isDark: boolean) => {
      setIsDarkMode(isDark);
      // Persist preference
      if (typeof window !== "undefined") {
        localStorage.setItem(DARK_MODE_STORAGE_KEY, isDark.toString());
      }

      if (!themeEngine) {
        syncDocumentDarkClass(isDark);
      }
    },
    [themeEngine]
  );

  // Auto-detect dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDarkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY);
      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === "true";
        setIsDarkMode(isDark);
        syncDocumentDarkClass(isDark);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDarkMode(prefersDark);
        syncDocumentDarkClass(prefersDark);
      }
    }
  }, []);

  // Load default theme on mount
  useEffect(() => {
    if (defaultThemePath) {
      loadTheme(defaultThemePath);
    }
  }, [defaultThemePath, loadTheme]);

  // Apply dark mode when it changes
  useEffect(() => {
    if (themeEngine) {
      themeEngine.setDarkMode(isDarkMode);
    } else {
      syncDocumentDarkClass(isDarkMode);
    }
  }, [isDarkMode, themeEngine]);

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    loadTheme,
    setDarkMode: handleSetDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useRestaurantTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useRestaurantTheme must be used within a RestaurantThemeProvider"
    );
  }
  return context;
}

/**
 * Hook for component-level theme utilities
 */
export function useThemeClasses() {
  const { theme, isDarkMode } = useRestaurantTheme();

  const getThemeClass = useCallback(
    (component: string, variant?: string) => {
      if (!theme) return "";

      const base = `theme-${theme.clientId}`;
      const dark = isDarkMode ? "dark" : "";
      const comp = component ? `${component}` : "";
      const var_ = variant ? `${component}-${variant}` : "";

      return [base, dark, comp, var_].filter(Boolean).join(" ");
    },
    [theme, isDarkMode]
  );

  const getThemeCSS = useCallback(
    (path: string) => {
      if (!theme) return undefined;

      const pathParts = path.split(".");
      let value: unknown = theme;

      for (const part of pathParts) {
        if (value && typeof value === "object" && part in value) {
          value = (value as Record<string, unknown>)[part];
        } else {
          return undefined;
        }
      }

      return value as string | undefined;
    },
    [theme]
  );

  return {
    themeClass: theme ? `theme-${theme.clientId}` : "",
    isDark: isDarkMode,
    getThemeClass,
    getThemeCSS,
  };
}
