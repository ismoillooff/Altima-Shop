import { useCallback, useEffect, useSyncExternalStore } from "react";

export type CartLine = {
  id: number;
  slug: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

const STORAGE_KEY = "altima-cart";
const CHANGE_EVENT = "altima-cart-changed";
const MAX_QTY = 12;

const isBrowser = typeof window !== "undefined";

function readCart(): CartLine[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.slug === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.price === "number" &&
    typeof candidate.size === "string" &&
    typeof candidate.quantity === "number"
  );
}

function writeCart(lines: CartLine[]) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // ignore quota errors
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

function subscribe(listener: () => void) {
  if (!isBrowser) return () => {};
  const handler = () => listener();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

let cachedSnapshot: CartLine[] = [];
let lastRaw: string | null = null;

function getSnapshot(): CartLine[] {
  if (!isBrowser) return cachedSnapshot;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === lastRaw) return cachedSnapshot;
  lastRaw = raw;
  cachedSnapshot = readCart();
  return cachedSnapshot;
}

function getServerSnapshot(): CartLine[] {
  return [];
}

export function addToCart(line: Omit<CartLine, "quantity"> & { quantity?: number }) {
  const lines = readCart();
  const quantity = Math.max(1, Math.min(MAX_QTY, line.quantity ?? 1));
  const index = lines.findIndex((existing) => existing.id === line.id && existing.size === line.size);
  if (index >= 0) {
    const next = Math.min(MAX_QTY, lines[index].quantity + quantity);
    lines[index] = { ...lines[index], quantity: next };
  } else {
    lines.push({ ...line, quantity });
  }
  writeCart(lines);
}

export function updateLineQuantity(id: number, size: string, quantity: number) {
  const lines = readCart();
  const index = lines.findIndex((existing) => existing.id === id && existing.size === size);
  if (index < 0) return;
  const next = Math.max(1, Math.min(MAX_QTY, quantity));
  lines[index] = { ...lines[index], quantity: next };
  writeCart(lines);
}

export function removeFromCart(id: number, size: string) {
  const lines = readCart().filter((line) => !(line.id === id && line.size === size));
  writeCart(lines);
}

export function clearCart() {
  writeCart([]);
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const totalItems = lines.reduce((acc, line) => acc + line.quantity, 0);
  const totalAmount = lines.reduce((acc, line) => acc + line.price * line.quantity, 0);

  const add = useCallback((line: Omit<CartLine, "quantity"> & { quantity?: number }) => {
    addToCart(line);
  }, []);

  const update = useCallback((id: number, size: string, quantity: number) => {
    updateLineQuantity(id, size, quantity);
  }, []);

  const remove = useCallback((id: number, size: string) => {
    removeFromCart(id, size);
  }, []);

  const clear = useCallback(() => {
    clearCart();
  }, []);

  return { lines, totalItems, totalAmount, add, update, remove, clear };
}

export function useCartCount() {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return lines.reduce((acc, line) => acc + line.quantity, 0);
}

export function useHydrateCart() {
  useEffect(() => {
    lastRaw = null;
    getSnapshot();
  }, []);
}
