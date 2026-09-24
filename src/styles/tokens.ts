// INOQR design tokens (TypeScript mirror — source of truth is
// src/index.css `:root` / `.dark` plus tailwind.config.js).
// Light values are the brand originals; dark values keep the same
// roles readable on near-black surfaces.

export const tokens = {
  color: {
    light: {
      ink: "#141414",
      inkSoft: "#262626",
      muted: "#707070",
      faint: "#ADADAD",
      canvas: "#FFFFFF",
      canvasSoft: "#F3F3F3",
      field: "#F0F0F0",
      hairline: "#E0E0E0",
      accent: "#0066FF",
    },
    dark: {
      ink: "#F4F4F5",
      inkSoft: "#E4E4E7",
      muted: "#A1A1AA",
      faint: "#71717A",
      canvas: "#09090B",
      canvasSoft: "#141417",
      field: "#1C1C21",
      hairline: "#2A2A30",
      accent: "#60A5FA",
    },
  },
  font: { sans: "Inter, ui-sans-serif, system-ui, sans-serif" },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, full: 999 },
  height: { button: 48, buttonSm: 40, input: 48 },
  container: { shell: 1160, narrow: 760 },
  motion: { fast: 180, base: 320, slow: 600 },
} as const;
