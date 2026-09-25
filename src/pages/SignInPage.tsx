import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { MotionReveal } from "../components/motion/MotionReveal";
import { useAuth } from "../services/auth";

function GitHubMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.6 2.8v.1C3.5 21.3 7.5 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.5-2.7-.1.1C.5 8.9 0 10.4 0 12s.5 3.1 1.5 4.4l3.7-2z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.5 0 3.5 2.7 1.5 6.6l3.7 2.9c1-2.9 3.7-4.8 6.8-4.8z" />
    </svg>
  );
}

export function SignInPage() {
  const { user, signInWithGoogle, signInWithGitHub, signOut } = useAuth();
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const onProvider = async (provider: "google" | "github") => {
    setLoading(provider);
    setError("");
    try {
      if (provider === "google") await signInWithGoogle();
      else await signInWithGitHub();
      nav("/create/dynamic", { replace: true });
    } catch {
      setError(`${provider === "google" ? "Google" : "GitHub"} sign-in failed. Please try again.`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="shell grid place-items-center py-14 md:py-20">
      <MotionReveal className="w-full max-w-[440px]">
        <div className="card p-7 md:p-9">
          <p className="mono-label text-[11px] font-medium text-faint">INOQR account</p>
          <h1 className="mt-2 font-display text-[32px] font-normal leading-[1.0] tracking-tight">Welcome back</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            One click unlocks dynamic QR links — editable destinations, slugs, and scan counts.
            Static QR never needs an account.
          </p>

          {user ? (
            <div className="mt-6 rounded-md border border-hairline bg-canvas-soft p-4">
              <p className="text-[14px] font-semibold">Signed in as {user.name}</p>
              <p className="text-[13px] text-muted">{user.email}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="accent" size="sm" onClick={() => nav("/create/dynamic")}>Go to dynamic studio</Button>
                <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              <Button variant="outline" className="w-full" loading={loading === "google"} icon={loading !== "google" && <GoogleG />} onClick={() => onProvider("google")}>
                {loading === "google" ? "Connecting to Google…" : "Continue with Google"}
              </Button>
              <Button variant="outline" className="w-full" loading={loading === "github"} icon={loading !== "github" && <GitHubMark />} onClick={() => onProvider("github")}>
                {loading === "github" ? "Connecting to GitHub…" : "Continue with GitHub"}
              </Button>
              {error && <p role="alert" className="field-error">{error}</p>}
              <p className="mt-4 text-center text-[12px] leading-relaxed text-faint">
                Demo OAuth — no real credentials leave your browser.
                <br />By continuing you agree to the studio terms.
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-hairline pt-5 text-[13px] text-muted">
            Just need a quick code?{" "}
            <button className="font-semibold text-accent hover:underline" onClick={() => nav("/create/static")}>
              Use static QR without signing in →
            </button>
          </div>
        </div>
      </MotionReveal>
    </div>
  );
}
