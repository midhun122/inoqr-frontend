import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../services/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-hairline bg-canvas text-muted transition-colors duration-fast hover:border-faint hover:text-ink"
    >
      <motion.span
        key={dark ? "moon" : "sun"}
        initial={{ rotate: -70, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="grid place-items-center"
      >
        {dark ? <Moon size={17} /> : <Sun size={17} />}
      </motion.span>
    </button>
  );
}
