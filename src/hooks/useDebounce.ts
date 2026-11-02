import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g. search query)
 * Default 400ms meets the 300ms–500ms debounce requirement.
 */
export function useDebounce<T>(value: T, delayMs: number = 400): { debouncedValue: T; isDebouncing: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    if (value === debouncedValue) {
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs, debouncedValue]);

  return { debouncedValue, isDebouncing };
}
