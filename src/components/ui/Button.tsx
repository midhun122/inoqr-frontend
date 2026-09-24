import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "outline";
type Size = "md" | "sm";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-ink text-canvas hover:bg-ink-soft",
  accent: "bg-[#0066FF] text-white hover:bg-[#004FCC] shadow-pop",
  secondary: "bg-field text-ink hover:bg-hairline",
  ghost: "bg-transparent text-ink hover:bg-canvas-soft",
  outline: "border border-hairline bg-canvas text-ink hover:border-faint",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  children,
  disabled,
  ...rest
}: Props) {
  const h = size === "md" ? "h-btn" : "h-btn-sm";
  return (
    <button
      className={`${h} inline-flex items-center justify-center gap-2 rounded-full px-5 text-[14px] font-semibold tracking-tight transition-all duration-fast active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
