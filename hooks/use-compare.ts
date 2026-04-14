"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "prestige_compare_ids";
const MAX_COMPARE = 3;

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCompareIds(parsed.slice(0, MAX_COMPARE));
        }
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
    }
  }, [compareIds, isHydrated]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const addCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id) || prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const removeCompare = useCallback((id: string) => {
    setCompareIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const isComparing = useCallback(
    (id: string) => compareIds.includes(id),
    [compareIds]
  );

  const canAddMore = compareIds.length < MAX_COMPARE;

  return {
    compareIds,
    isHydrated,
    toggleCompare,
    addCompare,
    removeCompare,
    clearCompare,
    isComparing,
    canAddMore,
  };
}
