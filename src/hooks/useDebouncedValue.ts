import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 450): { value: T; debouncing: boolean } {
  const [debounced, setDebounced] = useState(value);
  const [debouncing, setDebouncing] = useState(false);

  useEffect(() => {
    setDebouncing(true);
    const t = setTimeout(() => {
      setDebounced(value);
      setDebouncing(false);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return { value: debounced, debouncing };
}
