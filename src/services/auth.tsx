import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthCtx {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const KEY = "inoqr-user";

function persist(user: User | null): void {
  try {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked — demo keeps the user in memory only */
  }
}

function load(): User | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load());

  const signInWithGoogle = useCallback(async () => {
    // Mock Google OAuth — simulates network + profile fetch.
    await new Promise((r) => setTimeout(r, 900));
    const mock: User = {
      name: "Ada Lovelace",
      email: "ada@gmail.com",
      avatar: "AL",
    };
    persist(mock);
    setUser(mock);
  }, []);

  const signInWithGitHub = useCallback(async () => {
    // Mock GitHub OAuth — simulates network + profile fetch.
    await new Promise((r) => setTimeout(r, 900));
    const mock: User = {
      name: "Ada Lovelace",
      email: "ada@github.com",
      avatar: "AL",
    };
    persist(mock);
    setUser(mock);
  }, []);

  const signOut = useCallback(() => {
    persist(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, signInWithGoogle, signInWithGitHub, signOut }),
    [user, signInWithGoogle, signInWithGitHub, signOut],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
