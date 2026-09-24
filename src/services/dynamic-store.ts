import type { DynamicLink } from "../types";

const KEY = "inoqr-dynamic-links";

function seed(): DynamicLink[] {
  const now = new Date().toISOString();
  return [
    {
      id: "demo-1",
      title: "Spring menu",
      slug: "menu-spring",
      destination: "https://example.com/menu-spring",
      scans: 1284,
      updatedAt: now,
      createdAt: now,
      active: true,
    },
    {
      id: "demo-2",
      title: "Storefront checkout",
      slug: "checkout",
      destination: "https://example.com/checkout",
      scans: 342,
      updatedAt: now,
      createdAt: now,
      active: true,
    },
  ];
}

export function loadLinks(): DynamicLink[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as DynamicLink[];
  } catch {
    return seed();
  }
}

export function saveLinks(links: DynamicLink[]): void {
  localStorage.setItem(KEY, JSON.stringify(links));
}

export function shortUrl(slug: string): string {
  return `https://inoqr.app/r/${slug}`;
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || `link-${Date.now().toString(36)}`
  );
}
