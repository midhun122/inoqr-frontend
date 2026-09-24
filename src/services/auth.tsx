import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthCtx {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const KEY = "inoqr-user";

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
    localStorage.setItem(KEY, JSON.stringify(mock));
    setUser(mock);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signInWithGoogle, signOut }), [user, signInWithGoogle, signOut]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
