import { useEffect, useState } from "react";

function readStorageValue<T>(key: string, fallbackValue: T) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    return rawValue ? (JSON.parse(rawValue) as T) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function useLocalStorage<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState<T>(() => readStorageValue(key, fallbackValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }, [key, value]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(readStorageValue(key, fallbackValue));
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [fallbackValue, key]);

  return [value, setValue] as const;
}
