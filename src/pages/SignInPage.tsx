import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { MotionReveal } from "../components/motion/MotionReveal";
import { useAuth } from "../services/auth";

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
  const { user, signInWithGoogle, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const onGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      nav("/create/dynamic", { replace: true });
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell grid place-items-center py-14 md:py-20">
      <MotionReveal className="w-full max-w-[440px]">
        <div className="card p-7 md:p-9">
          <p className="mono-label text-[11px] font-medium text-faint">INOQR account</p>
          <h1 className="mt-2 font-display text-[32px] font-normal leading-[1.0] tracking-tight">Sign in with Google</h1>
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
            <div className="mt-6">
              <Button variant="outline" className="w-full" loading={loading} icon={!loading && <GoogleG />} onClick={onGoogle}>
                {loading ? "Connecting to Google…" : "Continue with Google"}
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
