import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Headphones,
  Heart,
  Home,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Phone,
  Search,
  Send,
  ShoppingBag,
  Sun,
  Truck,
  X,
} from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/lib/cart";
import { fetchSettings, type ApiSettings } from "@/lib/api";
import heroTactical from "@/assets/hero-tactical.jpg";
import bootWinter from "@/assets/boot-winter.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | ALTIMA SHOP" },
      {
        name: "description",
        content: "ALTIMA SHOP bilan bog'lanish: telefon, email, manzil, maslahat va buyurtma formasi.",
      },
    ],
  }),
  component: ContactPage,
});

const reveal = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const revealScale = {
  hidden: { opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.08 } },
};

const viewport = { once: true, amount: 0.18, margin: "0px 0px -80px 0px" };

const languages = [
  { code: "UZ", label: "O'zbek", enabled: true },
  { code: "RU", label: "Ruscha", enabled: false },
  { code: "EN", label: "Inglizcha", enabled: false },
];

const navLinks = [
  { label: "Bosh sahifa", href: "/" },
  { label: "Biz haqimizda", href: "/about" },
  { label: "Katalog", href: "/catalog" },
  { label: "Mahsulotlar", href: "/products" },
  { label: "Contact", href: "/contact" },
];

const contactCards = [
  { icon: Phone, title: "Telefon", value: "+998 71 200 70 70", text: "Buyurtma va razmer bo'yicha tezkor maslahat." },
  { icon: Mail, title: "Email", value: "ops@altimashop.uz", text: "Hamkorlik, ulgurji savdo va rasmiy so'rovlar." },
  { icon: MapPin, title: "Manzil", value: "Toshkent sh., Amir Temur 108", text: "Mahsulotni ko'rish uchun oldindan bog'laning." },
  { icon: Clock, title: "Ish vaqti", value: "09:00 - 22:00", text: "Dushanbadan yakshanbagacha maslahat beramiz." },
];

const fallbackSettings: ApiSettings = {
  id: 0,
  site_name: "ALTIMA SHOP",
  phone: "+998 71 200 70 70",
  email: "ops@altimashop.uz",
  address: "Toshkent sh., Amir Temur ko'chasi 108",
  map_embed: "",
  work_time: "Dushanba-Yakshanba · 09:00-22:00",
  instagram: "",
  telegram: "",
  enable_orders: true,
  enable_dark_theme: true,
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const process = [
  { icon: MessageCircle, title: "Xabar qoldirasiz", text: "Model, razmer yoki foydalanish sharoitini yozib yuborasiz." },
  { icon: Headphones, title: "Maslahat olasiz", text: "Jamoa sizga mos kategoriya va modelni aniqlashtiradi." },
  { icon: Truck, title: "Yetkazish kelishiladi", text: "Manzil, vaqt va qabul qilish tartibi oldindan kelishiladi." },
  { icon: CheckCircle2, title: "Tekshirib olasiz", text: "Mahsulot holati, razmer va qadoqni ko'rib qabul qilasiz." },
];

const faqs = [
  ["Razmer bo'yicha yordam berasizmi?", "Ha, oyoq uzunligi, paypoq qalinligi va foydalanish turiga qarab maslahat beramiz."],
  ["Viloyatlarga yetkazib berish bormi?", "Ha, O'zbekiston bo'ylab yetkazish tartibi buyurtma vaqtida kelishiladi."],
  ["Mahsulotni oldindan ko'rish mumkinmi?", "Toshkentdagi asosiy nuqta bo'yicha oldindan bog'lanib kelish mumkin."],
  ["Qaysi model qish uchun mos?", "Qishki navbatchilik uchun Arctic Recon va Tundra Shield yo'nalishlari tavsiya qilinadi."],
];

type ThemeMode = "light" | "dark";

function ContactPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [settings, setSettings] = useState<ApiSettings>(fallbackSettings);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  useEffect(() => {
    let cancelled = false;
    fetchSettings()
      .then((items) => {
        if (!cancelled && items[0]) setSettings(items[0]);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground lg:pb-0">
      <ContactHeader mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen((open) => !open)} onCartOpen={() => setCartOpen(true)} settings={settings} />
      <ContactMobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} settings={settings} />
      <ContactMobileBottomBar
        menuOpen={mobileOpen}
        onMenuToggle={() => setMobileOpen((open) => !open)}
        onNavigate={() => setMobileOpen(false)}
        onCartOpen={() => setCartOpen(true)}
      />
      <HeroSection settings={settings} />
      <ContactCards settings={settings} />
      <LocationSection settings={settings} />
      <ProcessSection />
      <FaqSection />
      <CallToAction settings={settings} />
      <SiteFooter settings={settings} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}

function HeroSection({ settings }: { settings: ApiSettings }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <img src={heroTactical} alt="ALTIMA contact" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/35" />
      <div className="absolute inset-0 tactical-grid opacity-40" />
      <div className="relative mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-28">
        <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.75 }} className="flex min-h-[560px] flex-col justify-center">
          <SectionEyebrow text="// ALTIMA CONTACT" />
          <h1 className="mt-5 max-w-5xl font-display text-5xl font-bold leading-[0.94] text-balance sm:text-6xl lg:text-8xl">
            Buyurtma, razmer yoki maslahat uchun bog'laning.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Qaysi model vazifangizga mosligini aniqlash, ombordagi mavjudlikni tekshirish va
            yetkazib berishni kelishish uchun formani to'ldiring yoki tez aloqa kanallaridan foydalaning.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={phoneHref(settings.phone)} className="group inline-flex items-center justify-center gap-3 bg-orange px-7 py-4 font-mono-tac text-xs font-bold uppercase text-primary-foreground clip-tac glow-orange-hover">
              Qo'ng'iroq qilish
              <Phone className="h-4 w-4" />
            </a>
            <a href={`mailto:${settings.email}`} className="inline-flex items-center justify-center gap-3 border border-border bg-background/80 px-7 py-4 font-mono-tac text-xs font-bold uppercase clip-tac hover:border-orange hover:text-orange">
              Email yuborish
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
        <ContactForm />
      </div>
    </section>
  );
}

function ContactForm() {
  return (
    <motion.form
      initial={{ opacity: 0, x: 38, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="self-center border border-border bg-panel p-5 clip-tac sm:p-7"
    >
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <SectionEyebrow text="// Tezkor so'rov" />
          <h2 className="mt-2 font-display text-3xl font-bold">Xabar qoldiring</h2>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center bg-orange text-ink clip-tac sm:flex">
          <Send className="h-5 w-5" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="border border-border bg-background px-4 py-4 outline-none clip-tac focus:border-orange" placeholder="Ismingiz" />
        <input className="border border-border bg-background px-4 py-4 outline-none clip-tac focus:border-orange" placeholder="Telefon raqam" />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input className="border border-border bg-background px-4 py-4 outline-none clip-tac focus:border-orange" placeholder="Qiziqqan model" />
        <select className="border border-border bg-background px-4 py-4 outline-none clip-tac focus:border-orange">
          <option>Maslahat turi</option>
          <option>Razmer tanlash</option>
          <option>Yetkazib berish</option>
          <option>Ulgurji savdo</option>
        </select>
      </div>
      <textarea className="mt-3 min-h-40 w-full resize-none border border-border bg-background px-4 py-4 outline-none clip-tac focus:border-orange" placeholder="Xabaringiz" />
      <button type="button" className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-orange px-6 py-4 font-mono-tac text-sm font-bold uppercase text-ink clip-tac transition-transform active:scale-[0.98]">
        Yuborish <Send className="h-4 w-4" />
      </button>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Xabar yuborilgandan so'ng operator mavjudlik, razmer va yetkazish tafsilotlarini aniqlashtiradi.
      </p>
    </motion.form>
  );
}

function ContactCards({ settings }: { settings: ApiSettings }) {
  const dynamicCards = [
    { ...contactCards[0], value: settings.phone },
    { ...contactCards[1], value: settings.email },
    { ...contactCards[2], value: settings.address },
    { ...contactCards[3], value: settings.work_time },
  ];
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10 lg:py-28">
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dynamicCards.map((item) => (
          <motion.article key={item.title} variants={revealScale} whileHover={{ y: -8, scale: 1.015 }} className="group border border-border bg-panel p-7 clip-tac transition-colors hover:border-orange hover:bg-background">
            <div className="flex h-12 w-12 items-center justify-center border border-border bg-background text-orange clip-tac transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-ink">
              <item.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-7 font-display text-2xl font-bold group-hover:text-orange">{item.title}</h2>
            <div className="mt-2 font-mono-tac text-sm text-orange">{item.value}</div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

function LocationSection({ settings }: { settings: ApiSettings }) {
  const mapQuery = encodeURIComponent(settings.address);
  return (
    <section className="border-y border-border bg-ink ink-surface">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="self-center">
          <SectionEyebrow text="// HQ koordinata" />
          <h2 className="mt-4 font-display text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
            Toshkentdagi asosiy aloqa nuqtasi.
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
            Mahsulotni ko'rish, razmerni tekshirish yoki buyurtmani aniq kelishish uchun oldindan
            bog'laning. Jamoa sizga kelish vaqti va mavjud modellardan xabar beradi.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewport} transition={{ duration: 0.7 }} className="relative min-h-[460px] overflow-hidden border border-border bg-white/5 clip-tac">
          <iframe
            title="ALTIMA SHOP xaritadagi joylashuvi"
            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/15" />
          <div className="absolute bottom-5 left-5 right-5 border border-border bg-ink/85 p-5 backdrop-blur clip-tac">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="font-mono-tac text-[10px] uppercase text-orange">ALTIMA SHOP joylashuvi</div>
                <div className="mt-2 font-display text-3xl font-bold">{settings.address}</div>
                <div className="mt-2 text-sm text-muted-foreground">41°18′N · 69°16′E</div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-orange px-5 py-3 font-mono-tac text-xs font-bold uppercase text-ink clip-tac"
              >
                Xaritada ochish
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10 lg:py-28">
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="max-w-4xl">
        <SectionEyebrow text="// Aloqa jarayoni" />
        <h2 className="mt-4 font-display text-4xl font-bold leading-none text-balance sm:text-5xl lg:text-6xl">
          Xabardan buyurtmagacha aniq tartib.
        </h2>
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {process.map((item, index) => (
          <motion.article key={item.title} variants={revealScale} whileHover={{ y: -8 }} className="group relative min-h-[245px] border border-border bg-panel p-6 clip-tac transition-colors hover:border-orange hover:bg-background">
            <div className="absolute right-4 top-4 font-display text-5xl font-bold text-muted-foreground/10 group-hover:text-orange/15">{String(index + 1).padStart(2, "0")}</div>
            <item.icon className="h-7 w-7 text-orange" />
            <h3 className="mt-8 font-display text-2xl font-bold group-hover:text-orange">{item.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="border-y border-border bg-panel/35">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal}>
          <SectionEyebrow text="// Savollar" />
          <h2 className="mt-4 font-display text-4xl font-bold leading-none sm:text-5xl">
            Eng ko'p so'raladigan aloqa savollari.
          </h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="grid gap-3">
          {faqs.map(([q, a]) => (
            <motion.div key={q} variants={reveal} className="border border-border bg-background p-6 clip-tac">
              <h3 className="font-display text-2xl font-bold">{q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CallToAction({ settings }: { settings: ApiSettings }) {
  return (
    <section className="relative overflow-hidden">
      <img src={bootWinter} alt="ALTIMA aloqa" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-background/88" />
      <div className="absolute inset-0 tactical-grid opacity-45" />
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="relative mx-auto max-w-[1500px] px-6 py-20 text-center lg:px-10 lg:py-28">
        <SectionEyebrow text="// Tez aloqa" />
        <h2 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-bold leading-none sm:text-5xl lg:text-7xl">
          Qaysi sharoitda yurasiz? Biz mos modelni topishga yordam beramiz.
        </h2>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={phoneHref(settings.phone)} className="group inline-flex items-center justify-center gap-3 bg-orange px-7 py-4 font-mono-tac text-xs font-bold uppercase text-primary-foreground clip-tac">
            Telefon qilish
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="/products" className="inline-flex items-center justify-center border border-border bg-background px-7 py-4 font-mono-tac text-xs font-bold uppercase hover:border-orange hover:text-orange clip-tac">
            Mahsulotlarni ko'rish
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function SectionEyebrow({ text }: { text: string }) {
  return <div className="font-mono-tac text-[11px] uppercase tracking-wider text-orange">{text}</div>;
}

function ContactHeader({ mobileOpen, onMobileToggle, onCartOpen, settings }: { mobileOpen: boolean; onMobileToggle: () => void; onCartOpen: () => void; settings: ApiSettings }) {
  const { totalItems } = useCart();
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-[1500px] items-center justify-between gap-2 px-4 sm:h-[72px] sm:gap-3 sm:px-6 lg:px-10">
        <a href="/" className="group flex items-center gap-2 sm:gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden sm:h-16 sm:w-16">
            <img src="/icon.png" alt="ALTIMA" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="leading-none">
            <div className="font-display text-base font-bold tracking-[0.15em] sm:text-xl">ALTIMA</div>
            <div className="mt-1 font-mono-tac text-[8px] text-orange sm:text-[9px]">DO'KON · TAKTIK</div>
          </div>
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className={`px-4 py-2 font-mono-tac text-sm uppercase tracking-wider transition-colors ${item.href === "/contact" ? "text-orange" : "text-muted-foreground hover:text-orange"}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <a href={phoneHref(settings.phone)} className="hidden h-10 items-center justify-center gap-2 border border-border bg-panel px-3 font-mono-tac text-[10px] font-bold uppercase tracking-wider text-foreground transition-colors hover:border-orange hover:text-orange clip-tac xl:inline-flex">
            <Phone className="h-3.5 w-3.5" />
            {settings.phone}
          </a>
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="hidden items-center gap-1 sm:flex">
            <IconButton label="Qidiruv"><Search className="h-4 w-4" /></IconButton>
            <IconButton label="Sevimli"><Heart className="h-4 w-4" /></IconButton>
          </div>
          <button
            type="button"
            onClick={onCartOpen}
            aria-label={`Savatni ochish (${totalItems} dona)`}
            className="relative flex h-10 w-10 items-center justify-center border border-border bg-panel text-foreground transition-colors hover:border-orange hover:text-orange clip-tac"
          >
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center bg-orange px-1 font-mono-tac text-[9px] font-bold text-ink">
                {totalItems}
              </span>
            )}
          </button>
          <button type="button" aria-label={mobileOpen ? "Mobil menyuni yopish" : "Mobil menyuni ochish"} aria-controls="contact-mobile-menu" aria-expanded={mobileOpen} onClick={onMobileToggle} className="flex h-10 items-center justify-center gap-2 border border-border bg-panel px-3 text-foreground transition-colors clip-tac hover:border-orange hover:bg-secondary hover:text-orange lg:hidden">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="hidden font-mono-tac text-[10px] font-bold uppercase tracking-wider sm:inline">{mobileOpen ? "Yopish" : "Menyu"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function ContactMobileMenu({ open, onClose, settings }: { open: boolean; onClose: () => void; settings: ApiSettings }) {
  if (!open) return null;
  return (
    <div id="contact-mobile-menu" className="fixed inset-x-0 bottom-[calc(74px+env(safe-area-inset-bottom))] top-[72px] z-40 overflow-y-auto border-t border-border bg-background/98 backdrop-blur-xl lg:hidden">
      <div className="space-y-6 px-6 py-6">
        <div className="grid grid-cols-3 gap-2">
          {[{ label: "Qidirish", icon: Search }, { label: "Sevimli", icon: Heart }, { label: "Savat", icon: ShoppingBag }].map((action) => (
            <button key={action.label} type="button" className="flex min-h-16 flex-col items-center justify-center gap-2 border border-border bg-panel text-foreground transition-colors clip-tac hover:border-orange hover:text-orange">
              <action.icon className="h-4 w-4" />
              <span className="font-mono-tac text-[10px] uppercase tracking-wider">{action.label}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {navLinks.map((item, index) => (
            <a key={item.href} href={item.href} onClick={onClose} className={`group min-h-20 border p-4 transition-colors clip-tac ${item.href === "/contact" ? "border-orange bg-orange text-ink" : "border-border bg-panel hover:border-orange hover:bg-secondary"}`}>
              <div className={`font-mono-tac text-[10px] ${item.href === "/contact" ? "text-ink/70" : "text-orange"}`}>{String(index + 1).padStart(2, "0")}</div>
              <div className={`mt-3 font-display text-lg font-bold ${item.href === "/contact" ? "text-ink" : "text-foreground group-hover:text-orange"}`}>{item.label}</div>
            </a>
          ))}
        </div>
        <a href={phoneHref(settings.phone)} className="inline-flex w-full items-center justify-center gap-3 bg-orange px-6 py-4 font-mono-tac text-sm font-bold uppercase tracking-wider text-ink clip-tac glow-orange-hover">
          Telefon qilish <Phone className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function ContactMobileBottomBar({ menuOpen, onMenuToggle, onNavigate, onCartOpen }: { menuOpen: boolean; onMenuToggle: () => void; onNavigate: () => void; onCartOpen: () => void }) {
  const { totalItems } = useCart();
  const items = [
    { label: "Bosh", href: "/", icon: Home },
    { label: "Katalog", href: "/catalog", icon: LayoutGrid },
    { label: "Qidiruv", href: "/products", icon: Search },
  ];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] lg:hidden">
      <nav className="pointer-events-auto grid w-full grid-cols-5 gap-1 border-t border-border bg-background/95 px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        {items.map((item) => (
          <a key={item.label} href={item.href} onClick={onNavigate} className={`flex min-h-14 flex-col items-center justify-center gap-1 font-mono-tac text-[9px] uppercase tracking-wider transition-colors clip-tac ${item.href === "/contact" ? "bg-orange font-bold text-ink" : "text-muted-foreground hover:bg-panel hover:text-orange"}`}>
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </a>
        ))}
        <button
          type="button"
          onClick={onCartOpen}
          aria-label={`Savatni ochish (${totalItems} dona)`}
          className="relative flex min-h-14 flex-col items-center justify-center gap-1 font-mono-tac text-[9px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-panel hover:text-orange clip-tac"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Savat</span>
          {totalItems > 0 && (
            <span className="absolute right-2 top-1.5 flex h-4 min-w-[16px] items-center justify-center bg-orange px-1 font-mono-tac text-[9px] font-bold text-ink">
              {totalItems}
            </span>
          )}
        </button>
        <button type="button" onClick={onMenuToggle} aria-label={menuOpen ? "Mobil menyuni yopish" : "Mobil menyuni ochish"} aria-expanded={menuOpen} className={`flex min-h-14 flex-col items-center justify-center gap-1 font-mono-tac text-[9px] uppercase tracking-wider transition-colors clip-tac ${menuOpen ? "bg-orange font-bold text-ink" : "text-muted-foreground hover:bg-panel hover:text-orange"}`}>
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>{menuOpen ? "Yopish" : "Menyu"}</span>
        </button>
      </nav>
    </div>
  );
}

function LanguageSwitcher() {
  return (
    <div className="mr-1 hidden items-center gap-1 border border-border bg-panel/60 p-1 clip-tac md:flex lg:mr-2" aria-label="Til tanlash">
      {languages.map((language) => (
        <button key={language.code} type="button" disabled={!language.enabled} aria-pressed={language.enabled} title={language.enabled ? language.label : `${language.label} tez orada qo'shiladi`} className={`px-2.5 py-1.5 font-mono-tac text-[10px] font-bold uppercase transition-colors ${language.enabled ? "bg-orange text-ink" : "cursor-not-allowed text-muted-foreground/60"}`}>
          {language.code}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  useEffect(() => {
    const savedTheme = localStorage.getItem("altima-theme") as ThemeMode | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = savedTheme ?? (prefersDark ? "dark" : "light");
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("altima-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };
  const isDark = theme === "dark";
  return (
    <button type="button" onClick={toggleTheme} aria-label={isDark ? "Oq mavzuga o'tish" : "Qora mavzuga o'tish"} title={isDark ? "Oq mavzu" : "Qora mavzu"} className="relative flex h-10 w-10 items-center justify-center text-foreground transition-colors clip-tac hover:bg-secondary hover:text-orange">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function IconButton({ children, label, badge }: { children: ReactNode; label: string; badge?: string }) {
  return (
    <button type="button" aria-label={label} title={label} className="relative flex h-10 w-10 items-center justify-center text-foreground transition-colors clip-tac hover:bg-secondary hover:text-orange">
      {children}
      {badge && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center bg-orange px-1 font-mono-tac text-[9px] font-bold text-ink">{badge}</span>}
    </button>
  );
}
