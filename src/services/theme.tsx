import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

const KEY = "inoqr-theme";

function initialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  // Both hooks: Tailwind `dark:` variants read the class,
  // thinking-orbs `auto` reads either, our CSS vars flip on either.
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#09090B" : "#FFFFFF");
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* private mode — theme just won't persist */
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => initialTheme());

  // Synchronous with render — no first-paint mismatch, ever.
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow OS switches + other tabs only when the user hasn't picked explicitly.
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(KEY)) return;
      } catch {
        return;
      }
      const next = e.matches ? "dark" : "light";
      applyTheme(next);
      setThemeState(next);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      if (e.newValue === "light" || e.newValue === "dark") {
        applyTheme(e.newValue);
        setThemeState(e.newValue);
      }
    };
    mq.addEventListener("change", onMedia);
    window.addEventListener("storage", onStorage);
    return () => {
      mq.removeEventListener("change", onMedia);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
    setThemeState(t);
  }, []);
  const toggle = useCallback(() => {
    setThemeState((t) => {
      const next = t === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle, setTheme]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
