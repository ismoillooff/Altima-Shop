import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { OrderModal } from "@/components/OrderModal";

function formatPrice(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value);
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, totalItems, totalAmount, update, remove, clear } = useCart();
  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-[440px] flex-col border-l border-border bg-background shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            role="dialog"
            aria-label="Savat"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border bg-panel px-5 py-4">
              <div>
                <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">// Sizning savatingiz</div>
                <div className="mt-1 flex items-baseline gap-2 font-display text-2xl font-bold">
                  Savat
                  <span className="font-mono-tac text-sm text-muted-foreground">· {totalItems} dona</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Savatni yopish"
                className="flex h-10 w-10 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:border-orange hover:text-orange clip-tac"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {lines.length === 0 ? (
                <EmptyState onClose={onClose} />
              ) : (
                <ul className="divide-y divide-border px-5">
                  {lines.map((line) => (
                    <li key={`${line.id}-${line.size}`} className="flex gap-4 py-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-border bg-ink clip-tac sm:h-24 sm:w-24">
                        <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">{line.sku}</div>
                            <a
                              href={`/products/${line.slug}`}
                              onClick={onClose}
                              className="mt-1 font-display text-sm font-bold leading-tight transition-colors hover:text-orange sm:text-base"
                            >
                              {line.name}
                            </a>
                            <div className="mt-1 font-mono-tac text-[10px] uppercase tracking-wider text-muted-foreground">
                              O'lcham · {line.size}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(line.id, line.size)}
                            aria-label="Mahsulotni o'chirish"
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center border border-border bg-panel clip-tac">
                            <button
                              type="button"
                              onClick={() => update(line.id, line.size, line.quantity - 1)}
                              disabled={line.quantity <= 1}
                              aria-label="Sonni kamaytirish"
                              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-orange disabled:opacity-40"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-8 text-center font-display text-sm font-bold tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => update(line.id, line.size, line.quantity + 1)}
                              aria-label="Sonni oshirish"
                              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-orange"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="font-display text-base font-bold text-orange">
                              {formatPrice(line.price * line.quantity)}
                            </div>
                            <div className="font-mono-tac text-[9px] uppercase tracking-wider text-muted-foreground">
                              so'm
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-border bg-panel px-5 py-4">
                <div className="mb-3 flex items-center justify-between gap-2 font-mono-tac text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span>Yetkazib berish</span>
                  <span className="text-orange">Toshkent bo'ylab 24 soat</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-y border-border py-3">
                  <span className="font-display text-base font-bold">Jami</span>
                  <span className="font-display text-2xl font-bold text-orange">
                    {formatPrice(totalAmount)} <span className="text-xs text-muted-foreground">so'm</span>
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={clear}
                    className="inline-flex h-11 items-center justify-center gap-2 border border-border bg-background px-4 font-mono-tac text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-destructive hover:text-destructive clip-tac"
                  >
                    <Trash2 className="h-4 w-4" />
                    Tozalash
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderOpen(true)}
                    className="group inline-flex h-11 flex-1 items-center justify-center gap-2 bg-orange px-4 font-mono-tac text-[11px] font-bold uppercase tracking-wider text-ink clip-tac glow-orange-hover"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Buyurtma berish
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
          <OrderModal
            open={orderOpen}
            title="Savatdagi mahsulotlarni buyurtma qilish"
            lines={lines}
            onClose={() => setOrderOpen(false)}
            onSuccess={() => {
              clear();
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center border border-border bg-panel clip-tac">
        <ShoppingBag className="h-7 w-7 text-orange" />
      </div>
      <h3 className="mt-5 font-display text-xl font-bold">Savat hozircha bo'sh</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Mahsulotlarni ko'rib chiqing va o'zingizga mos modelni savatga qo'shing.
      </p>
      <a
        href="/products"
        onClick={onClose}
        className="mt-6 inline-flex items-center justify-center gap-2 bg-orange px-6 py-3 font-mono-tac text-[11px] font-bold uppercase tracking-wider text-ink clip-tac glow-orange-hover"
      >
        Mahsulotlarga o'tish
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
