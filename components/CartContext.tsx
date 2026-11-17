"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface BagItem {
  slug: string;
  size: string;
  qty: number;
}

interface BagState {
  items: BagItem[];
  count: number;
  add: (slug: string, size: string) => void;
}

const BagContext = createContext<BagState>({ items: [], count: 0, add: () => {} });

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);

  const add = useCallback((slug: string, size: string) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.slug === slug && x.size === size);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { slug, size, qty: 1 }];
    });
  }, []);

  const value = useMemo(
    () => ({ items, count: items.reduce((n, i) => n + i.qty, 0), add }),
    [items, add]
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export const useBag = () => useContext(BagContext);
