import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="shell grid place-items-center py-20">
      <div className="max-w-[480px] text-center">
        <p className="mono-label text-[12px] font-medium text-faint">404</p>
        <h1 className="mt-2 font-display text-[38px] font-normal leading-[1.0] tracking-tight">Nothing here — yet.</h1>
        <p className="mt-3 text-muted">The page you’re looking for moved or never existed. The studio is one click away.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/" className="h-btn inline-flex items-center rounded-md bg-ink px-5 text-[14px] font-semibold text-canvas">Back home</Link>
          <Link to="/create/static" className="h-btn inline-flex items-center rounded-md bg-field px-5 text-[14px] font-semibold">Static QR</Link>
        </div>
      </div>
    </div>
  );
}
