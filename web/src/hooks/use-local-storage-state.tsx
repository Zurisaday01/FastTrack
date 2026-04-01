import { useState, useEffect } from "react";

export function useLocalStorageState<T>(initialState: T, key: string) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return initialState;
    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return storedValue as T;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}