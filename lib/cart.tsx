"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "./products";

export interface BagLine {
  slug: string;
  size: string;
  qty: number;
}

export interface BagLineDetailed extends BagLine {
  product: Product;
}

interface CartContextValue {
  lines: BagLineDetailed[];
  count: number;
  subtotal: number;
  add: (slug: string, size: string, qty?: number) => void;
  remove: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "rabble-bag-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BagLine[];
        if (Array.isArray(parsed)) {
          // hydration-safe one-time read of persisted bag state
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLines(parsed.filter((l) => getProduct(l.slug)));
        }
      }
    } catch {
      /* private mode / blocked storage — start empty */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const add = useCallback((slug: string, size: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug && l.size === size);
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, qty: Math.min(l.qty + qty, 9) } : l,
        );
      }
      return [...prev, { slug, size, qty }];
    });
    setDrawerOpen(true);
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.size === size)));
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    if (qty < 1) return;
    setLines((prev) =>
      prev.map((l) => (l.slug === slug && l.size === size ? { ...l, qty: Math.min(qty, 9) } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const detailed = lines
      .map((l) => ({ ...l, product: getProduct(l.slug)! }))
      .filter((l) => l.product);
    return {
      lines: detailed,
      count: detailed.reduce((n, l) => n + l.qty, 0),
      subtotal: detailed.reduce((n, l) => n + l.qty * l.product.price, 0),
      add,
      remove,
      setQty,
      clear,
      drawerOpen,
      openDrawer,
      closeDrawer,
    };
  }, [lines, drawerOpen, add, remove, setQty, clear, openDrawer, closeDrawer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
