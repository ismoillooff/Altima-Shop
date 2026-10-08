import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Phone, ShoppingBag, User, X } from "lucide-react";
import { saveResource } from "@/lib/api";

export type OrderLine = {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  size?: string;
};

type OrderModalProps = {
  open: boolean;
  title?: string;
  lines: OrderLine[];
  onClose: () => void;
  onSuccess?: () => void;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value);
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

function isValidPhone(value: string) {
  const normalized = normalizePhone(value);
  return /^\+?\d{9,15}$/.test(normalized);
}

export function OrderModal({ open, title = "Buyurtma berish", lines, onClose, onSuccess }: OrderModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines],
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose, submitting]);

  useEffect(() => {
    if (!open) {
      setError("");
      setSubmitting(false);
      setSubmitted(false);
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const customer = name.trim();
    const customerPhone = normalizePhone(phone);

    if (!lines.length) {
      setError("Buyurtma uchun mahsulot tanlanmagan.");
      return;
    }
    if (customer.length < 2) {
      setError("Ismingizni kiriting.");
      return;
    }
    if (!isValidPhone(customerPhone)) {
      setError("Telefon raqamni to'g'ri kiriting. Masalan: +998901234567");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await saveResource("/orders/", {
        customer,
        phone: customerPhone,
        total,
        note: lines.map((line) => `${line.sku} / ${line.name}${line.size ? ` / o'lcham ${line.size}` : ""} x ${line.quantity}`).join("; "),
        items: lines.map((line) => ({
          product: line.id,
          quantity: line.quantity,
          price: line.price,
        })),
      });
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Buyurtmani yuborishda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="order-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={submitting ? undefined : onClose}
            className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm"
          />
          <motion.div
            key="order-modal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            className="fixed left-1/2 top-1/2 z-[115] max-h-[calc(100vh-2rem)] w-[calc(100vw-1.5rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-border bg-background shadow-[0_28px_90px_rgba(0,0,0,0.6)] clip-tac"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border bg-panel px-5 py-4 sm:px-6">
              <div>
                <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">// Aloqa ma'lumotlari</div>
                <h2 id="order-modal-title" className="mt-1 font-display text-2xl font-bold">
                  {submitted ? "Buyurtma qabul qilindi" : title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                aria-label="Modalni yopish"
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:border-orange hover:text-orange disabled:opacity-50 clip-tac"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitted ? (
              <div className="px-5 py-6 sm:px-6">
                <div className="flex h-14 w-14 items-center justify-center border border-orange/60 bg-orange/10 text-orange clip-tac">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Rahmat. Operatorimiz siz bilan telefon orqali bog'lanib, buyurtmani tasdiqlaydi.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 bg-orange px-5 font-mono-tac text-[11px] font-bold uppercase tracking-wider text-ink clip-tac glow-orange-hover"
                >
                  Yopish
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6">
                <div className="max-h-44 overflow-y-auto border-y border-border">
                  {lines.map((line) => (
                    <div key={`${line.id}-${line.size ?? "default"}`} className="flex items-start justify-between gap-3 py-3">
                      <div>
                        <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">{line.sku}</div>
                        <div className="mt-1 font-display text-sm font-bold sm:text-base">{line.name}</div>
                        <div className="mt-1 font-mono-tac text-[10px] uppercase tracking-wider text-muted-foreground">
                          {line.size ? `O'lcham ${line.size} · ` : ""}{line.quantity} dona
                        </div>
                      </div>
                      <div className="shrink-0 text-right font-display text-base font-bold text-orange">
                        {formatPrice(line.price * line.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border border-border bg-panel px-4 py-3 clip-tac">
                  <span className="font-mono-tac text-[11px] uppercase tracking-wider text-muted-foreground">Jami</span>
                  <span className="font-display text-2xl font-bold text-orange">
                    {formatPrice(total)} <span className="text-xs text-muted-foreground">so'm</span>
                  </span>
                </div>

                <div className="mt-4 grid gap-3">
                  <label className="grid gap-2">
                    <span className="font-mono-tac text-[10px] uppercase tracking-wider text-muted-foreground">Ism</span>
                    <span className="flex h-12 items-center gap-3 border border-border bg-panel px-3 transition-colors focus-within:border-orange clip-tac">
                      <User className="h-4 w-4 text-orange" />
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name"
                        placeholder="Ismingiz"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                    </span>
                  </label>
                  <label className="grid gap-2">
                    <span className="font-mono-tac text-[10px] uppercase tracking-wider text-muted-foreground">Telefon raqam</span>
                    <span className="flex h-12 items-center gap-3 border border-border bg-panel px-3 transition-colors focus-within:border-orange clip-tac">
                      <Phone className="h-4 w-4 text-orange" />
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="+998 90 123 45 67"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="mt-4 border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono-tac text-[11px] uppercase tracking-wider text-destructive clip-tac">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !lines.length}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-orange px-5 font-mono-tac text-[11px] font-bold uppercase tracking-wider text-ink clip-tac glow-orange-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                  Buyurtmani yuborish
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
