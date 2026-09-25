import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3.5 py-2 transition-colors hover:text-ink ${isActive ? "text-ink bg-canvas-soft" : ""}`;

export function Navbar() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  return (
    <div className="fixed inset-x-0 top-3 z-40 px-3 sm:px-5">
      <header className="mx-auto w-full max-w-shell rounded-[20px] border border-hairline/70 bg-canvas/60 shadow-[0_2px_16px_rgba(20,20,20,0.06)] backdrop-blur-md md:rounded-full">
        <div className="flex h-14 items-center justify-between gap-2 pl-4 pr-2 md:pl-5">
          <Link to="/" aria-label="INOQR home" className="shrink-0">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 text-[14px] font-medium text-muted md:flex" aria-label="Primary">
            <NavLink to="/create/static" className={linkCls}>
              Static QR
            </NavLink>
            <NavLink to="/create/dynamic" className={linkCls}>
              Dynamic QR
            </NavLink>
            {user ? (
              <Link to="/my-qrs">
                My QRs
              </Link>
            ) : (
              <Link to="/signin">
                Sign in
              </Link>
            )}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <span className="hidden items-center gap-2 text-[13px] font-medium text-muted sm:inline-flex">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-bold text-canvas">
                    {user.avatar}
                  </span>
                  {user.name}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    signOut();
                    nav("/");
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => nav("/signin")}>
                Get started
              </Button>
            )}
          </div>
        </div>
        {/* mobile links */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-hairline px-3 py-2 text-[13px] font-medium text-muted md:hidden">
          <NavLink to="/create/static" className="whitespace-nowrap rounded-full px-3 py-1.5">Static QR</NavLink>
          <NavLink to="/create/dynamic" className="whitespace-nowrap rounded-full px-3 py-1.5">Dynamic QR</NavLink>
          <NavLink to="/signin" className="whitespace-nowrap rounded-full px-3 py-1.5">Sign in</NavLink>
        </div>
      </header>
    </div>
  );
}
