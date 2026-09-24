import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="shell grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Logo large />
          <p className="mt-3 max-w-[280px] text-[14px] leading-relaxed text-muted">
            A calm, precise QR studio. Static codes instantly, dynamic codes you can edit and measure.
          </p>
        </div>
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink">Create</h3>
          <ul className="mt-3 space-y-2 text-[14px] text-muted">
            <li><Link className="hover:text-ink" to="/create/static">Static QR</Link></li>
            <li><Link className="hover:text-ink" to="/create/dynamic">Dynamic QR</Link></li>
            <li><Link className="hover:text-ink" to="/signin">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink">Formats</h3>
          <ul className="mt-3 space-y-2 text-[14px] text-muted">
            <li>URL · Text · Wi-Fi</li>
            <li>Contact sharing · Email · SMS</li>
            <li>PNG · SVG export</li>
          </ul>
        </div>
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink">Legal</h3>
          <ul className="mt-3 space-y-2 text-[14px] text-muted">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="shell flex flex-col justify-between gap-2 py-5 text-[13px] text-faint sm:flex-row">
          <span>© 2026 INOQR. Powered by InovusLabs IEDC.</span>
          <span>Static codes never expire · Dynamic codes stay editable</span>
        </div>
      </div>
    </footer>
  );
}