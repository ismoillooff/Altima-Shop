import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  ArrowRight, Heart, Search, ShoppingBag, Menu, Star,
  Shield, Droplet, Footprints, Snowflake, Zap, Crosshair,
  Truck, Lock, Award, Send, Instagram, Phone, MapPin, Mail,
  ChevronDown, ChevronRight, Target, Flame, Mountain, Moon, Sun, X,
  Home, LayoutGrid,
} from "lucide-react";
import heroTactical from "@/assets/hero-tactical.jpg";
import bootCombat from "@/assets/boot-combat.jpg";
import bootTactical from "@/assets/boot-tactical.jpg";
import bootDesert from "@/assets/boot-desert.jpg";
import bootWinter from "@/assets/boot-winter.jpg";
import catCombat from "@/assets/cat-combat.jpg";
import catOutdoor from "@/assets/cat-outdoor.jpg";
import catDesert from "@/assets/cat-desert.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import { fetchSiteHome, type ApiCategory, type ApiHero, type ApiProduct, type ApiSettings } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const data = await fetchSiteHome();
      return { home: data };
    } catch {
      return { home: null };
    }
  },
  head: () => ({
    meta: [
      { title: "ALTIMA SHOP — Taktik oyoq kiyimlar · Kuch uchun yaratilgan" },
      { name: "description", content: "Professional jangovar, taktik va outdoor oyoq kiyimlar. Harbiy darajadagi suv o'tkazmas botinkalar, sirpanishga qarshi taglik va zarbani yutuvchi texnologiyalar bilan. O'zbekiston bo'ylab yetkazib berish." },
      { property: "og:title", content: "ALTIMA SHOP — Kuch uchun yaratilgan" },
      { property: "og:description", content: "Harbiy va taktik oyoq kiyimlar — jangovar botinkalar, taktik, outdoor va qishki armiya modellar." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

/* ------------------------------- DATA ------------------------------- */

const featured = [
  { id: 1, name: "Phantom Combat 8\"", code: "ALT-CB-08", price: "1 890 000", old: "2 190 000", img: bootCombat, tags: ["SUV O'TKAZMAS", "HARBIY DARAJA"], rating: 4.9, stock: 87, hot: true },
  { id: 2, name: "Ranger Tactical Olive", code: "ALT-TC-05", price: "2 290 000", old: null, img: bootTactical, tags: ["SIRPANMAYDI", "ZARBA YUTADI"], rating: 4.8, stock: 34, hot: false },
  { id: 3, name: "Desert Storm MK II", code: "ALT-DS-02", price: "2 090 000", old: "2 390 000", img: bootDesert, tags: ["NAFAS OLADI", "CHO'L"], rating: 4.7, stock: 52, hot: true },
  { id: 4, name: "Arctic Recon Winter", code: "ALT-WT-11", price: "2 590 000", old: null, img: bootWinter, tags: ["-40°C", "QISHKI"], rating: 4.9, stock: 19, hot: false },
  { id: 5, name: "Urban Patrol Mid", code: "ALT-UP-04", price: "1 690 000", old: "1 890 000", img: product1, tags: ["SHAHAR", "YENGIL"], rating: 4.6, stock: 64, hot: false },
  { id: 6, name: "Recon Low Black", code: "ALT-RL-09", price: "1 490 000", old: null, img: product2, tags: ["TEZKOR", "PAST PROFIL"], rating: 4.7, stock: 41, hot: false },
  { id: 7, name: "Guard Pro Leather", code: "ALT-GP-12", price: "1 990 000", old: "2 150 000", img: product3, tags: ["TERI", "XIZMAT"], rating: 4.8, stock: 55, hot: true },
  { id: 8, name: "Storm Runner GTX", code: "ALT-SR-07", price: "2 190 000", old: null, img: product4, tags: ["YOMG'IR", "USHLASH"], rating: 4.7, stock: 33, hot: false },
  { id: 9, name: "Alpha Duty Sand", code: "ALT-AD-03", price: "1 790 000", old: null, img: bootDesert, tags: ["CHO'L", "NAFAS OLADI"], rating: 4.6, stock: 72, hot: false },
  { id: 10, name: "Night Ops 6\"", code: "ALT-NO-06", price: "2 390 000", old: "2 650 000", img: bootCombat, tags: ["QORA", "MAXFIY"], rating: 4.9, stock: 28, hot: true },
  { id: 11, name: "Tundra Shield", code: "ALT-TS-14", price: "2 690 000", old: null, img: bootWinter, tags: ["QISHKI", "ISSIQ"], rating: 4.8, stock: 24, hot: false },
  { id: 12, name: "Olive Field MK I", code: "ALT-OF-01", price: "1 850 000", old: "2 050 000", img: bootTactical, tags: ["DALA", "MUSTAHKAM"], rating: 4.7, stock: 49, hot: false },
  { id: 13, name: "Rapid Response", code: "ALT-RR-10", price: "1 590 000", old: null, img: product2, tags: ["TEZKOR", "YENGIL"], rating: 4.5, stock: 91, hot: false },
  { id: 14, name: "Commander Elite", code: "ALT-CE-15", price: "2 890 000", old: "3 150 000", img: product3, tags: ["PREMIUM", "TERI"], rating: 5.0, stock: 16, hot: true },
  { id: 15, name: "Trail Force", code: "ALT-TF-18", price: "1 750 000", old: null, img: catOutdoor, tags: ["TREKKING", "TAGLIK"], rating: 4.6, stock: 58, hot: false },
  { id: 16, name: "Barracks Classic", code: "ALT-BC-20", price: "1 390 000", old: "1 590 000", img: product1, tags: ["KLASSIK", "KUNLIK"], rating: 4.5, stock: 104, hot: false },
];

type HomeProduct = (typeof featured)[number] & { slug: string; priceValue: number };
type HomeCategory = {
  name: string;
  count: number;
  img: string;
  icon: typeof Shield;
  code: string;
};

const fallbackProductImages = [bootCombat, bootTactical, bootDesert, bootWinter, product1, product2, product3, product4, catOutdoor];
const fallbackCategoryImages = [catCombat, catOutdoor, catDesert, bootTactical, bootWinter, product2];

function formatPrice(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value);
}

function mapHomeProduct(product: ApiProduct, index: number): HomeProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    code: product.sku,
    price: formatPrice(product.price),
    priceValue: product.price,
    old: product.old_price ? formatPrice(product.old_price) : null,
    img: product.image_src || fallbackProductImages[index % fallbackProductImages.length],
    tags: product.tags?.length ? product.tags : [product.category_name || "ALTIMA"],
    rating: Number(product.rating || 4.8),
    stock: product.stock,
    hot: product.hot,
  };
}

function mapHomeCategory(category: ApiCategory, index: number): HomeCategory {
  return {
    name: category.name,
    count: category.products_count ?? 0,
    img: category.image_src || fallbackCategoryImages[index % fallbackCategoryImages.length],
    icon: category.icon === "Mountain" ? Mountain : category.icon === "Flame" ? Flame : Shield,
    code: category.code || String(index + 1).padStart(2, "0"),
  };
}

function normalizeHero(hero: ApiHero | null) {
  if (!hero) return null;
  return {
    topLeftMeta: hero.top_left_meta,
    topSecondMeta: hero.top_second_meta,
    topRightMeta: hero.top_right_meta,
    badge: hero.badge || hero.eyebrow,
    headlineTop: hero.headline_top,
    headlineMiddle: hero.headline_middle,
    headlineAccent: hero.headline_accent,
    headlineMuted: hero.headline_muted,
    headlineAfterMuted: hero.headline_after_muted,
    headlineItalic: hero.headline_italic,
    description: hero.description,
    primaryCta: hero.primary_cta,
    secondaryCta: hero.secondary_cta,
    image: hero.image_src || heroTactical,
    imageKicker: hero.image_kicker,
    imageModelCode: hero.image_model_code,
    imageStatus: hero.image_status,
    specsTitle: hero.specs_title,
    specs: hero.specs ?? [],
    stats: hero.stats ?? [],
    featuredKicker: hero.featured_kicker,
    featuredName: hero.featured_name,
    featuredTagOne: hero.featured_tag_one,
    featuredTagTwo: hero.featured_tag_two,
    priceLabel: hero.price_label,
    featuredPrice: hero.featured_price,
  };
}

type HomeHero = NonNullable<ReturnType<typeof normalizeHero>>;

const fallbackSettings: ApiSettings = {
  id: 0,
  site_name: "ALTIMA SHOP",
  phone: "+998 71 200 70 70",
  email: "ops@altimashop.uz",
  address: "Toshkent sh., Amir Temur ko'chasi 108",
  work_time: "Dushanba-Yakshanba · 09:00-22:00",
  instagram: "",
  telegram: "",
  enable_orders: true,
  enable_dark_theme: true,
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const categories = [
  { name: "Jangovar botinkalar", count: 42, img: catCombat, icon: Shield, code: "01" },
  { name: "Dala trekkingi", count: 38, img: catOutdoor, icon: Mountain, code: "02" },
  { name: "Cho'l taktikasi", count: 27, img: catDesert, icon: Flame, code: "03" },
];

const subCategories = [
  "Jangovar botinkalar", "Taktik botinkalar", "Qishki armiya", "Politsiya poyabzali",
  "Qo'riqlash poyabzali", "Dala trekkingi", "Harbiy krossovkalar",
  "Cho'l taktikasi", "Suv o'tkazmas", "Og'ir xizmat",
];

const features = [
  { icon: Droplet, t: "Suv o'tkazmaydi", d: "Suv o'tkazmas membrana texnologiyasi" },
  { icon: Zap, t: "Zarbaga chidamli", d: "Zarbalardan to'liq himoyalanish" },
  { icon: Footprints, t: "Taktik ushlash", d: "Har qanday relyefda barqaror yurish" },
  { icon: Snowflake, t: "Qishki himoya", d: "−40°C gacha issiqlikni saqlash" },
  { icon: Shield, t: "Og'ir xizmat", d: "Og'ir vazifalar uchun mustahkam qurilma" },
  { icon: Crosshair, t: "Armiya standarti", d: "Mil-spec sertifikatlangan ishlab chiqarish" },
];

const languages = [
  { code: "UZ", label: "O'zbek", enabled: true },
  { code: "RU", label: "Ruscha", enabled: false },
  { code: "EN", label: "Inglizcha", enabled: false },
];

const missionKits = [
  { title: "Shahar patruli", img: product2, items: ["Yengil taglik", "Kun bo'yi qulaylik", "Tez yechiladigan bog'ich"] },
  { title: "Dala yurishi", img: catOutdoor, items: ["Tog' yo'li uchun ushlash", "Nafas oluvchi qoplama", "To'piq himoyasi"] },
  { title: "Qishki navbatchilik", img: bootWinter, items: ["Issiq ichki qatlam", "Muzda barqarorlik", "Namlikdan himoya"] },
];

const operationSteps = [
  "Vazifangizga mos kategoriyani tanlang",
  "O'lcham jadvali orqali aniq razmerni belgilang",
  "Yetkazib berish manzilini qoldiring",
  "Mahsulotni tekshirib qabul qiling",
];

const fieldSpecs = [
  { n: "640 g", l: "o'rtacha vazn" },
  { n: "IP67", l: "namlik himoyasi" },
  { n: "360°", l: "to'piq ushlashi" },
  { n: "18 oy", l: "kafolat nazorati" },
];

const fitRows = [
  ["39-41", "24.5-26.2 sm", "Yengil patrul va kunlik foydalanish"],
  ["42-44", "26.8-28.2 sm", "Standart taktik xizmat"],
  ["45-47", "28.8-30.1 sm", "Qalin paypoq va qishki foydalanish"],
];

const comparisonRows = [
  ["Suv o'tkazmaslik", "Membrana", "Oddiy qoplama"],
  ["Taglik ushlashi", "Taktik protektor", "Standart rezina"],
  ["Xizmat muddati", "Kuchaytirilgan chok", "Oddiy tikuv"],
  ["Qulaylik", "Zarba yutuvchi qatlam", "Minimal amortizatsiya"],
];

const faqs = [
  { q: "O'lcham mos kelmasa almashtirish mumkinmi?", a: "Ha, mahsulot ishlatilmagan holatda almashtirish bo'yicha yordam beramiz." },
  { q: "Yetkazib berish qayerlarga boradi?", a: "Toshkent va O'zbekiston bo'ylab yetkazib berish mavjud." },
  { q: "Qishki modellar nechchi darajagacha?", a: "Arctic seriyasi −40°C gacha bo'lgan sovuq sharoitlar uchun mo'ljallangan." },
];

type SiteNavItem = {
  label: string;
  href: string;
};

const viewportOnce = { once: true, amount: 0.18, margin: "0px 0px -90px 0px" };

const revealUp = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const revealScale = {
  hidden: { opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

const staggerGrid = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.08,
    },
  },
};

/* ------------------------------ LAYOUT ------------------------------ */

function Index() {
  const nav: SiteNavItem[] = [
    { label: "Bosh sahifa", href: "/" },
    { label: "Biz haqimizda", href: "/about" },
    { label: "Katalog", href: "/catalog" },
    { label: "Mahsulotlar", href: "/products" },
    { label: "Contact", href: "/contact" },
  ];
  const loaderData = Route.useLoaderData();
  const initialHome = loaderData?.home ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [homeHero, setHomeHero] = useState<HomeHero | null>(() => normalizeHero(initialHome?.hero ?? null));
  const [homeProducts, setHomeProducts] = useState<HomeProduct[]>(() => (initialHome?.products ?? []).map(mapHomeProduct));
  const [homeCategories, setHomeCategories] = useState<HomeCategory[]>(() => (initialHome?.categories ?? []).map(mapHomeCategory));
  const [siteSettings, setSiteSettings] = useState<ApiSettings>(initialHome?.settings ?? fallbackSettings);

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
    if (initialHome?.products?.length) return;
    fetchSiteHome()
      .then((data) => {
        setHomeHero(normalizeHero(data.hero));
        setHomeProducts((data.products ?? []).map(mapHomeProduct));
        setHomeCategories((data.categories ?? []).map(mapHomeCategory));
        if (data.settings) setSiteSettings(data.settings);
      })
      .catch(() => {
        setHomeHero(null);
        setHomeProducts([]);
        setHomeCategories([]);
      });
  }, [initialHome?.products?.length]);

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground antialiased selection:bg-orange selection:text-ink lg:pb-0">
      <TopBar settings={siteSettings} />
      <Header
        nav={nav}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((open) => !open)}
        onCartOpen={() => setCartOpen(true)}
      />
      <MobileMenu nav={nav} open={mobileOpen} onClose={() => setMobileOpen(false)} settings={siteSettings} />
      <MobileBottomBar
        menuOpen={mobileOpen}
        onMenuToggle={() => setMobileOpen((open) => !open)}
        onNavigate={() => setMobileOpen(false)}
        onCartOpen={() => setCartOpen(true)}
      />
      <ScrollProgress />
      <Hero hero={homeHero} products={homeProducts} />
      <FeaturedProducts products={homeProducts} categories={homeCategories} onCartOpen={() => setCartOpen(true)} />
      <CategoryTicker />
      <MissionKits />
      <FeaturedCollections categories={homeCategories} />
      <CategoryProducts products={homeProducts} onCartOpen={() => setCartOpen(true)} />
      <OperationFlow />
      <NewArrivals products={homeProducts} />
      <MilitaryFeatures />
      <FieldSpecGrid />
      <SpecsBanner />
      <SizeGuidePreview />
      <ImageMarqueeSection />
      <DurabilityLab />
      <DeliveryPromise />
      <Reviews />
      <BrandStory />
      <ComparisonTable />
      <FaqSection />
      <InstagramFeed />
      <Newsletter />
      <SiteFooter settings={siteSettings} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

/* -------------------------------- BARS ------------------------------- */

function TopBar({ settings }: { settings: ApiSettings }) {
  return (
    <div className="hidden md:block bg-ink border-b border-border ink-surface">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 h-9 flex items-center justify-between text-[11px] font-mono-tac uppercase text-muted-foreground">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange pulse-dot" /> Tizim onlayn · 24/7</span>
          <span className="hidden lg:inline">Xavfsizlik: taktik</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {settings.phone}</span>
          <span className="text-foreground">O'zbekcha interfeys</span>
        </div>
      </div>
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[80] h-1 origin-left bg-orange"
      style={{ scaleX }}
    />
  );
}

function Header({
  nav,
  mobileOpen,
  onMobileToggle,
  onCartOpen,
}: {
  nav: SiteNavItem[];
  mobileOpen: boolean;
  onMobileToggle: () => void;
  onCartOpen: () => void;
}) {
  const { totalItems } = useCart();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/85 border-b border-border">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 h-[64px] sm:h-[72px] flex items-center justify-between gap-2 sm:gap-3 lg:gap-8">
        <a href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="relative w-10 h-10 sm:w-16 sm:h-16 overflow-hidden flex items-center justify-center">
            <img src="/icon.png" alt="ALTIMA" className="h-full w-full object-contain" />
          </div>
          <div className="leading-none">
            <div className="font-display text-base sm:text-xl font-bold tracking-[0.15em]">ALTIMA</div>
            <div className="text-[8px] sm:text-[9px] font-mono-tac text-orange mt-1">DO'KON · TAKTIK</div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <a key={item.label} href={item.href} className="px-4 py-2 text-sm font-mono-tac uppercase tracking-wider text-muted-foreground hover:text-orange transition-colors">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-1">
            <IconBtn><Search className="w-4 h-4" /></IconBtn>
            <IconBtn><Heart className="w-4 h-4" /></IconBtn>
          </div>
          <button
            type="button"
            onClick={onCartOpen}
            aria-label={`Savatni ochish (${totalItems} dona)`}
            className="relative w-10 h-10 flex items-center justify-center text-foreground hover:text-orange hover:bg-secondary transition-colors clip-tac"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 bg-orange text-ink text-[9px] font-bold font-mono-tac flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? "Mobil menyuni yopish" : "Mobil menyuni ochish"}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={onMobileToggle}
            className="lg:hidden h-10 px-3 flex items-center justify-center gap-2 border border-border bg-panel text-foreground hover:text-orange hover:border-orange hover:bg-secondary transition-colors clip-tac"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="hidden sm:inline text-[10px] font-mono-tac font-bold uppercase tracking-wider">
              {mobileOpen ? "Yopish" : "Menyu"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileBottomBar({
  menuOpen,
  onMenuToggle,
  onNavigate,
  onCartOpen,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onNavigate: () => void;
  onCartOpen: () => void;
}) {
  const { totalItems } = useCart();
  const items = [
    { label: "Bosh", href: "/", icon: Home },
    { label: "Katalog", href: "/catalog", icon: LayoutGrid },
    { label: "Qidiruv", href: "/products", icon: Search },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] lg:hidden pointer-events-none">
      <nav className="pointer-events-auto grid w-full grid-cols-5 gap-1 border-t border-border bg-background/95 px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        {items.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[9px] font-mono-tac uppercase tracking-wider transition-colors clip-tac ${
              index === 0
                ? "bg-orange text-ink font-bold"
                : "text-muted-foreground hover:bg-panel hover:text-orange"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </a>
        ))}
        <button
          type="button"
          onClick={onCartOpen}
          aria-label={`Savatni ochish (${totalItems} dona)`}
          className="relative flex min-h-14 flex-col items-center justify-center gap-1 text-[9px] font-mono-tac uppercase tracking-wider text-muted-foreground transition-colors hover:bg-panel hover:text-orange clip-tac"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Savat</span>
          {totalItems > 0 && (
            <span className="absolute right-2 top-1.5 flex h-4 min-w-[16px] items-center justify-center bg-orange px-1 font-mono-tac text-[9px] font-bold text-ink">
              {totalItems}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Mobil menyuni yopish" : "Mobil menyuni ochish"}
          aria-expanded={menuOpen}
          className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[9px] font-mono-tac uppercase tracking-wider transition-colors clip-tac ${
            menuOpen
              ? "bg-orange text-ink font-bold"
              : "text-muted-foreground hover:bg-panel hover:text-orange"
          }`}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>{menuOpen ? "Yopish" : "Menyu"}</span>
        </button>
      </nav>
    </div>
  );
}

function MobileMenu({
  nav,
  open,
  onClose,
  settings,
}: {
  nav: SiteNavItem[];
  open: boolean;
  onClose: () => void;
  settings: ApiSettings;
}) {
  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      className="fixed inset-x-0 top-[72px] bottom-[calc(74px+env(safe-area-inset-bottom))] z-40 lg:hidden overflow-y-auto bg-background/98 backdrop-blur-xl border-t border-border"
    >
      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Qidirish", icon: Search },
            { label: "Sevimli", icon: Heart },
            { label: "Savat", icon: ShoppingBag },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              className="min-h-16 border border-border bg-panel text-foreground clip-tac hover:border-orange hover:text-orange transition-colors flex flex-col items-center justify-center gap-2"
            >
              <action.icon className="w-4 h-4" />
              <span className="text-[10px] font-mono-tac uppercase tracking-wider">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {nav.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="group min-h-20 border border-border bg-panel p-4 clip-tac hover:border-orange hover:bg-secondary transition-colors"
            >
              <div className="text-[10px] font-mono-tac text-orange">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="mt-3 font-display text-lg font-bold text-foreground group-hover:text-orange">
                {item.label}
              </div>
            </a>
          ))}
        </div>

        <div className="border border-border bg-panel p-4 clip-tac">
          <div className="text-[10px] font-mono-tac uppercase tracking-wider text-orange">
            Til tanlash
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                disabled={!language.enabled}
                className={`px-3 py-3 text-[11px] font-mono-tac font-bold uppercase clip-tac ${
                  language.enabled
                    ? "bg-orange text-ink"
                    : "border border-border text-muted-foreground/60"
                }`}
              >
                {language.code}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <a
            href="#featured"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-3 bg-orange text-ink px-6 py-4 font-mono-tac text-sm font-bold uppercase tracking-wider clip-tac glow-orange-hover"
          >
            Katalogni ko'rish
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={phoneHref(settings.phone)}
            className="inline-flex items-center justify-center gap-3 border border-border bg-panel px-6 py-4 font-mono-tac text-sm font-bold uppercase tracking-wider text-foreground clip-tac hover:border-orange hover:text-orange transition-colors"
          >
            <Phone className="w-4 h-4" />
            {settings.phone}
          </a>
        </div>

        <div className="grid gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-orange shrink-0 mt-0.5" />
            <span>{settings.address}</span>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-orange shrink-0 mt-0.5" />
            <span>{settings.email}</span>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-orange shrink-0 mt-0.5" />
            <span>{settings.work_time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type ThemeMode = "light" | "dark";

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
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Oq mavzuga o'tish" : "Qora mavzuga o'tish"}
      title={isDark ? "Oq mavzu" : "Qora mavzu"}
      className="relative w-10 h-10 flex items-center justify-center text-foreground hover:text-orange hover:bg-secondary transition-colors clip-tac"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function LanguageSwitcher() {
  return (
    <div className="hidden md:flex items-center gap-1 mr-1 lg:mr-2 border border-border bg-panel/60 p-1 clip-tac" aria-label="Til tanlash">
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          disabled={!language.enabled}
          aria-pressed={language.enabled}
          title={language.enabled ? language.label : `${language.label} tez orada qo'shiladi`}
          className={`px-2.5 py-1.5 text-[10px] font-mono-tac font-bold uppercase transition-colors ${
            !language.enabled ? "hidden md:inline-flex " : ""
          }${
            language.enabled
              ? "bg-orange text-ink"
              : "text-muted-foreground/60 cursor-not-allowed"
          }`}
        >
          {language.code}
        </button>
      ))}
    </div>
  );
}

function IconBtn({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <button className="relative w-10 h-10 flex items-center justify-center text-foreground hover:text-orange hover:bg-secondary transition-colors clip-tac">
      {children}
      {badge && (
        <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 bg-orange text-ink text-[9px] font-bold font-mono-tac flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

/* -------------------------------- HERO ------------------------------- */

function Hero({ hero, products }: { hero: HomeHero | null; products: HomeProduct[] }) {
  const rotation = useMemo(() => {
    if (!products.length) return [];
    // Shuffle and pick 5
    return [...products].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [products]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (rotation.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % rotation.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [rotation.length]);

  if (!hero) {
    return (
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10">
          <div className="font-mono-tac text-[11px] uppercase tracking-wider text-orange">Backend data</div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-none sm:text-5xl">
            Hero section ma'lumotlari bazadan yuklanadi.
          </h1>
        </div>
      </section>
    );
  }

  const stats = hero.stats.length ? hero.stats : [];
  const specs = hero.specs.length ? hero.specs : [];

  const activeProduct = rotation[activeIndex];
  const displayImage = activeProduct?.img || hero.image;
  const displayModelCode = activeProduct?.code || hero.imageModelCode;
  const displayStatus = activeProduct ? (activeProduct.hot ? "FAOL · QAYNOQ" : "FAOL") : hero.imageStatus;
  const displayName = activeProduct?.name || hero.featuredName;
  const displayTagOne = activeProduct?.tags?.[0] || hero.featuredTagOne;
  const displayTagTwo = activeProduct?.tags?.[1] || hero.featuredTagTwo;
  const displayPrice = activeProduct ? `${activeProduct.price} UZS` : hero.featuredPrice;
  const slotKey = activeProduct ? `slot-${activeProduct.id}` : "slot-hero";

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 tactical-grid opacity-40" />
      <div className="absolute inset-0 camo-noise" />

      {/* HUD coordinates */}
      <div className="hidden md:flex absolute top-4 left-6 lg:left-10 items-center gap-3 text-[10px] font-mono-tac text-orange/80 z-20">
        <span>{hero.topLeftMeta}</span>
        <span className="text-muted-foreground">|</span>
        <span>{hero.topSecondMeta}</span>
      </div>
      <div className="hidden md:flex absolute top-4 right-6 lg:right-10 items-center gap-3 text-[10px] font-mono-tac text-muted-foreground z-20">
        <span className="text-foreground">{hero.topRightMeta}</span>
        <span className="w-2 h-2 bg-destructive pulse-dot" />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 lg:pt-20 pb-16 lg:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-6 items-center relative z-10">
        {/* LEFT */}
        <div className="lg:col-span-6 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-orange/40 bg-orange/5 text-orange text-[11px] font-mono-tac uppercase mb-7"
          >
            <span className="w-1.5 h-1.5 bg-orange pulse-dot" />
            {hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold leading-[0.92] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] text-balance"
          >
            {hero.headlineTop}<br/>
            {hero.headlineMiddle} <span className="text-orange">{hero.headlineAccent}</span><br/>
            <span className="text-muted-foreground">{hero.headlineMuted}</span> {hero.headlineAfterMuted}<br/>
            <span className="italic font-display">{hero.headlineItalic}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-7 text-base lg:text-lg text-muted-foreground max-w-lg leading-relaxed"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 flex flex-nowrap items-center gap-2 sm:gap-3"
          >
            <a href="#featured" className="group inline-flex items-center gap-2 sm:gap-3 bg-orange text-ink px-4 sm:px-7 py-3 sm:py-4 font-mono-tac text-xs sm:text-sm font-bold uppercase tracking-wider clip-tac glow-orange-hover transition-all whitespace-nowrap">
              {hero.primaryCta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#" className="inline-flex items-center gap-2 sm:gap-3 border border-border hover:border-orange text-foreground px-4 sm:px-7 py-3 sm:py-4 font-mono-tac text-xs sm:text-sm font-bold uppercase tracking-wider clip-tac hover:text-orange transition-all whitespace-nowrap">
              <Target className="w-4 h-4" />
              {hero.secondaryCta}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-3 gap-6 max-w-md"
          >
            {stats.map((stat) => <Stat key={`${stat.value}-${stat.label}`} n={stat.value} l={stat.label} />)}
          </motion.div>
        </div>

        {/* RIGHT — HERO IMAGE */}
        <div className="lg:col-span-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative aspect-[5/6] overflow-hidden clip-tac bg-panel scanline"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={`img-${slotKey}`}
                src={displayImage}
                alt={displayName}
                width={1600}
                height={1600}
                initial={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />

            {/* HUD CORNERS */}
            <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />

            {/* TOP BADGE */}
            <div className="absolute top-5 left-5 right-5 flex items-start justify-between text-[10px] font-mono-tac">
              <div className="text-orange">
                <div className="opacity-60">{hero.imageKicker}</div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`code-${slotKey}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className="text-base font-bold mt-0.5"
                  >
                    {displayModelCode}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="text-right text-foreground/80">
                <div className="opacity-60">HOLAT</div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`status-${slotKey}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className="text-orange mt-0.5"
                  >
                    ● {displayStatus}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* BOTTOM SPEC CARD */}
            <div className="absolute bottom-5 left-5 right-5 bg-ink/85 backdrop-blur border border-border p-4 lg:p-5 clip-tac ink-surface overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`spec-${slotKey}`}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-end justify-between gap-4"
                >
                  <div>
                    <div className="text-[10px] font-mono-tac text-orange uppercase">{hero.featuredKicker}</div>
                    <div className="font-display text-xl lg:text-2xl font-bold mt-1">{displayName}</div>
                    <div className="flex gap-2 mt-2 text-[10px] font-mono-tac text-muted-foreground">
                      <span className="px-2 py-0.5 border border-border">{displayTagOne}</span>
                      <span className="px-2 py-0.5 border border-border">{displayTagTwo}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-mono-tac text-muted-foreground">{hero.priceLabel}</div>
                    <div className="font-display text-lg lg:text-xl font-bold text-orange">{displayPrice}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* rotation indicators */}
          {rotation.length > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2.5">
              {rotation.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`${p.name} mahsulotini ko'rsatish`}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-1.5 overflow-hidden transition-all clip-tac ${
                    idx === activeIndex ? "w-10 bg-orange" : "w-5 bg-border hover:bg-orange/60"
                  }`}
                >
                  {idx === activeIndex && (
                    <motion.span
                      key={`bar-${slotKey}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 4.5, ease: "linear" }}
                      className="absolute inset-0 origin-left bg-foreground/30"
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* floating side spec */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
            className="hidden xl:block absolute -right-6 top-16 bg-panel border border-border p-4 w-52 clip-tac"
          >
            <div className="text-[10px] font-mono-tac text-orange mb-2">{hero.specsTitle}</div>
            {specs.map((spec) => <SpecRow key={`${spec.label}-${spec.value}`} l={spec.label} v={spec.value} />)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpecRow({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex justify-between py-1 text-[11px] font-mono-tac border-b border-border/60 last:border-0">
      <span className="text-muted-foreground">{l}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "top-3 left-3 border-t-2 border-l-2",
    tr: "top-3 right-3 border-t-2 border-r-2",
    bl: "bottom-3 left-3 border-b-2 border-l-2",
    br: "bottom-3 right-3 border-b-2 border-r-2",
  } as const;
  return <div className={`absolute w-5 h-5 border-orange ${map[pos]}`} />;
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl lg:text-3xl font-bold text-orange leading-none">{n}</div>
      <div className="text-[10px] font-mono-tac text-muted-foreground uppercase mt-2">{l}</div>
    </div>
  );
}

/* ---------------------------- CATEGORY TICKER ------------------------ */

function CategoryTicker() {
  const list = [...subCategories, ...subCategories];
  return (
    <section className="border-b border-border bg-panel py-4 overflow-hidden">
      <div className="marquee flex gap-12 whitespace-nowrap items-center">
        {list.map((c, i) => (
          <span key={i} className="flex items-center gap-3 font-mono-tac text-sm uppercase tracking-wider text-muted-foreground">
            <Crosshair className="w-3.5 h-3.5 text-orange" /> {c}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ------------------------- FEATURED COLLECTIONS ---------------------- */

function FeaturedCollections({ categories }: { categories: HomeCategory[] }) {
  if (!categories.length) return null;

  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-24">
      <SectionHead code="// 01" eyebrow="Vazifa kategoriyalari" title={<>Yo'nalishingizni <span className="text-orange">tanlang.</span></>} />

      <div className="grid md:grid-cols-3 gap-5 mt-12">
        {categories.map((c, i) => (
          <motion.a
            key={c.name}
            href="#"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative aspect-[3/4] overflow-hidden clip-tac bg-panel border border-border hover:border-orange transition-all scanline media-card"
          >
            <img src={c.img} alt={c.name} loading="lazy" width={1000} height={1200} className="w-full h-full object-cover transition-transform duration-[1.4s] group-hover:scale-110 opacity-90 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/5" />

            <Corner pos="tl" /><Corner pos="br" />

            <div className="absolute top-5 left-5 right-5 flex items-start justify-between text-[10px] font-mono-tac">
              <span className="text-orange">BO'LIM/{c.code}</span>
              <span className="text-white/70">{c.count} MODEL</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 text-orange mb-3">
                <c.icon className="w-4 h-4" />
                <span className="font-mono-tac text-[11px] uppercase">Faol seriya</span>
              </div>
              <h3 className="font-display text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
                {c.name}
              </h3>
              <div className="inline-flex items-center gap-2 font-mono-tac text-xs uppercase tracking-wider text-white/80 group-hover:text-orange transition-colors">
                Ko'rish <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- MISSION KITS -------------------------- */

function MissionKits() {
  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
      <SectionHead code="// 00" eyebrow="Tayyor to'plamlar" title={<>Har vazifa uchun <span className="text-orange">aniq tanlov.</span></>} />
      <div className="grid lg:grid-cols-3 gap-5 mt-12">
        {missionKits.map((kit, i) => (
          <motion.article
            key={kit.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative min-h-[360px] overflow-hidden border border-border bg-panel clip-tac media-card"
          >
            <img src={kit.img} alt={kit.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
            <div className="relative flex h-full min-h-[360px] flex-col justify-end p-6">
              <div className="text-[10px] font-mono-tac text-orange">KIT/0{i + 1}</div>
              <h3 className="mt-3 font-display text-3xl font-bold text-white">{kit.title}</h3>
              <ul className="mt-5 space-y-2 text-sm text-white/75">
                {kit.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Crosshair className="h-3.5 w-3.5 text-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function CategoryProducts({ products, onCartOpen }: { products: HomeProduct[]; onCartOpen: () => void }) {
  const categoryShowcase = products.slice(8, 16);
  if (!categoryShowcase.length) return null;

  return (
    <section className="border-y border-border bg-panel/30">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <SectionHead
            code="// 01B"
            eyebrow="Kategoriya tanlovi"
            title={<>Har yo'nalish uchun <span className="text-orange">maxsus model.</span></>}
          />
          <a
            href="#featured"
            className="inline-flex items-center gap-3 border border-border hover:border-orange text-foreground hover:text-orange px-6 py-3.5 font-mono-tac text-xs uppercase tracking-wider clip-tac transition-all"
          >
            Arsenalga o'tish <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-12">
          {categoryShowcase.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} onCartOpen={onCartOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OperationFlow() {
  return (
    <section className="border-y border-border bg-panel/30">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <SectionHead code="// 02A" eyebrow="Buyurtma jarayoni" title={<>4 qadamda <span className="text-orange">tayyor.</span></>} />
          </div>
          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-8 grid sm:grid-cols-2 gap-4"
          >
            {operationSteps.map((step, i) => (
              <motion.div
                key={step}
                variants={revealScale}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                className="border border-border bg-background p-6 clip-tac"
              >
                <div className="font-display text-4xl text-orange">0{i + 1}</div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{step}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function NewArrivals({ products }: { products: HomeProduct[] }) {
  const arrivals = products.slice(4, 8);
  if (!arrivals.length) return null;

  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <SectionHead code="// 02B" eyebrow="Yangi kelganlar" title={<>So'nggi <span className="text-orange">partiya.</span></>} />
        <a href="#featured" className="inline-flex items-center gap-2 text-sm font-mono-tac uppercase tracking-wider text-muted-foreground hover:text-orange">
          Hammasini ko'rish <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      <motion.div
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid md:grid-cols-4 gap-4 mt-12"
      >
        {arrivals.map((p) => (
          <motion.a
            key={p.id}
            href="#featured"
            variants={revealScale}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="group border border-border bg-panel p-3 clip-tac hover:border-orange transition-colors"
          >
            <div className="aspect-[4/3] overflow-hidden bg-ink clip-tac">
              <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-mono-tac text-orange">{p.code}</div>
                <div className="mt-1 font-display text-lg font-bold">{p.name}</div>
              </div>
              <div className="text-right font-display text-lg font-bold text-orange">{p.price}</div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

/* --------------------------- FEATURED PRODUCTS ----------------------- */

function FeaturedProducts({ products, categories, onCartOpen }: { products: HomeProduct[]; categories: HomeCategory[]; onCartOpen: () => void }) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  if (!products.length) return null;
  const categoryLabels = categories.length ? ["Barchasi", ...categories.slice(0, 3).map((category) => category.name)] : ["Barchasi"];

  return (
    <section id="featured" className="border-y border-border bg-panel/30">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-24">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <SectionHead code="// 02" eyebrow="Eng ko'p sotilganlar" title={<>Jangga tayyor <span className="text-orange">arsenal.</span></>} />
          <div className="relative">
            <div className="scrollbar-hidden flex max-w-full gap-2 overflow-x-auto pb-1 text-[11px] font-mono-tac uppercase tracking-wider">
            {categoryLabels.map((t, i) => (
              <button key={t} className={`shrink-0 px-4 py-2.5 clip-tac transition-all ${i === 0 ? "bg-orange text-ink font-bold" : "border border-border text-muted-foreground hover:border-orange hover:text-orange"}`}>
                {t}
              </button>
            ))}
              <button
                type="button"
                aria-label="Kategoriyalarni ochish"
                aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((open) => !open)}
                className={`shrink-0 border border-border px-4 py-2.5 text-muted-foreground clip-tac transition-all hover:border-orange hover:text-orange ${
                  categoryOpen ? "border-orange text-orange" : ""
                }`}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            {categoryOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-3rem)] border border-border bg-background/95 p-2 shadow-2xl backdrop-blur-xl clip-tac">
                <div className="px-3 py-2 text-[10px] font-mono-tac uppercase tracking-wider text-orange">
                  Kategoriyalar
                </div>
                <div className="grid gap-1">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => setCategoryOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-panel hover:text-orange transition-colors clip-tac"
                    >
                      <span>{category.name}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-12">
          {products.map((p, i) => <ProductCard key={p.id} p={p} i={i} onCartOpen={onCartOpen} />)}
        </div>

        <div className="mt-12 flex justify-center">
          <a href="#" className="inline-flex items-center gap-3 border border-border hover:border-orange text-foreground hover:text-orange px-8 py-4 font-mono-tac text-sm uppercase tracking-wider clip-tac transition-all">
            To'liq arsenalni ko'rish <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, i, onCartOpen }: { p: HomeProduct; i: number; onCartOpen: () => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1500);
    return () => window.clearTimeout(t);
  }, [added]);

  const handleAdd = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (p.stock <= 0) return;
    add({
      id: p.id,
      slug: p.slug,
      name: p.name,
      sku: p.code,
      price: p.priceValue,
      image: p.img,
      size: "42",
      quantity: 1,
    });
    setAdded(true);
  };

  const handleOpenCart = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onCartOpen();
  };

  return (
    <motion.a
      href={`/products/${p.slug}`}
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: Math.min(i, 7) * 0.05 }}
      className="group relative bg-panel border border-border hover:border-orange/60 transition-all clip-tac"
    >
      <div className="relative aspect-square overflow-hidden bg-ink ink-surface">
        <img src={p.img} alt={p.name} loading="lazy" width={900} height={900}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 max-w-[80%]">
          {p.tags.slice(0, 2).map(t => (
            <span key={t} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-ink/85 border border-orange/40 text-orange text-[8px] sm:text-[9px] font-mono-tac font-bold tracking-wider w-fit">
              {t}
            </span>
          ))}
          {p.hot && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange text-ink text-[8px] sm:text-[9px] font-mono-tac font-bold tracking-wider inline-flex items-center gap-1 w-fit">
              <Flame className="w-3 h-3" /> HOT
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label="Sevimlilarga qo'shish"
          onClick={(event) => event.preventDefault()}
          className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-ink/85 border border-border flex items-center justify-center hover:border-orange hover:text-orange transition-colors"
        >
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center gap-1.5 text-[8px] sm:text-[10px] font-mono-tac text-white/85">
          <span className="w-1.5 h-1.5 bg-tactical pulse-dot rounded-full" />
          OMBORDA · {p.stock}
        </div>
      </div>

      <div className="p-2.5 sm:p-4">
        <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-mono-tac text-muted-foreground uppercase">
          <span>{p.code}</span>
          <span className="flex items-center gap-1 text-foreground">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-orange text-orange" /> {p.rating}
          </span>
        </div>
        <h3 className="font-display text-[13px] sm:text-lg font-bold mt-1.5 sm:mt-2 leading-tight min-h-9 sm:min-h-10">{p.name}</h3>
        <div className="mt-2 sm:mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="font-display text-sm sm:text-xl font-bold text-orange leading-none">{p.price}</div>
            <div className="text-[8px] sm:text-[10px] font-mono-tac text-muted-foreground mt-0.5">SO'M</div>
          </div>
          {p.old && <span className="text-[9px] sm:text-xs text-muted-foreground line-through font-mono-tac">{p.old}</span>}
        </div>
        {added ? (
          <button
            type="button"
            onClick={handleOpenCart}
            className="mt-2 sm:mt-3 inline-flex w-full items-center justify-center gap-2 border border-orange bg-orange/15 py-2.5 font-mono-tac text-[10px] font-bold uppercase tracking-wider text-orange transition-colors hover:bg-orange/25 clip-tac"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Savatda · Ko'rish
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={p.stock <= 0}
            className="mt-2 sm:mt-3 inline-flex w-full items-center justify-center gap-2 bg-orange py-2.5 font-mono-tac text-[10px] font-bold uppercase tracking-wider text-ink clip-tac transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {p.stock > 0 ? "Savatga" : "Mavjud emas"}
          </button>
        )}
      </div>
    </motion.a>
  );
}

/* --------------------------- MILITARY FEATURES ----------------------- */

function MilitaryFeatures() {
  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-24">
      <SectionHead code="// 03" eyebrow="Taktik texnologiya" title={<>Maydon uchun <span className="text-orange">yaratilgan.</span></>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px mt-12 bg-border border border-border clip-tac">
        {features.map((f, i) => (
          <motion.div
            key={f.t}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.07 }}
            className="bg-background p-8 group hover:bg-panel transition-colors relative"
          >
            <div className="text-[10px] font-mono-tac text-orange/70">F/0{i + 1}</div>
            <div className="mt-6 w-14 h-14 border border-orange/40 bg-orange/5 flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-ink transition-all clip-tac">
              <f.icon className="w-6 h-6" />
            </div>
            <div className="font-display text-xl font-bold mt-5">{f.t}</div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- SPECS BANNER ------------------------- */

function SpecsBanner() {
  const stats = [
    { n: "15K+", l: "Faol foydalanuvchi", icon: Crosshair },
    { n: "98%", l: "Vazifa muvaffaqiyati", icon: Target },
    { n: "24/7", l: "Dala qo'llab-quvvatlovi", icon: Shield },
    { n: "MIL-A", l: "Sertifikatlangan daraja", icon: Award },
  ];
  return (
    <section className="relative overflow-hidden border-y border-border bg-ink ink-surface">
      <div className="absolute inset-0 tactical-grid opacity-50" />
      <div className="absolute inset-0 camo-noise" />
      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((s, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 border border-orange/40 bg-orange/5 flex items-center justify-center text-orange clip-tac">
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-3xl lg:text-4xl font-bold text-foreground leading-none">{s.n}</div>
              <div className="text-[10px] font-mono-tac uppercase tracking-wider text-muted-foreground mt-2">{s.l}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FieldSpecGrid() {
  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 pb-20 lg:pb-24">
      <motion.div
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid lg:grid-cols-4 gap-px bg-border border border-border clip-tac"
      >
        {fieldSpecs.map((spec, i) => (
          <motion.div
            key={spec.l}
            variants={revealUp}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="bg-panel p-7"
          >
            <div className="text-[10px] font-mono-tac text-orange">SPEC/{String(i + 1).padStart(2, "0")}</div>
            <div className="mt-4 font-display text-4xl font-bold">{spec.n}</div>
            <div className="mt-2 text-sm text-muted-foreground">{spec.l}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function SizeGuidePreview() {
  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <SectionHead code="// 06" eyebrow="O'lcham nazorati" title={<>Razmerni <span className="text-orange">aniq tanlang.</span></>} />
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
            Taktik botinkada yarim razmer ham muhim. Jadval oyoq uzunligi va foydalanish sharoitiga qarab tez tanlashga yordam beradi.
          </p>
        </div>
        <div className="lg:col-span-7 border border-border bg-panel clip-tac overflow-hidden">
          {fitRows.map((row) => (
            <motion.div
              key={row[0]}
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-3 gap-3 border-b border-border last:border-0 p-4 text-sm"
            >
              <div className="font-display text-2xl text-orange">{row[0]}</div>
              <div className="font-mono-tac text-xs uppercase text-foreground">{row[1]}</div>
              <div className="text-muted-foreground">{row[2]}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageMarqueeSection() {
  const topRow = [bootCombat, bootTactical, bootDesert, bootWinter, product1, product2];
  const bottomRow = [product3, product4, catCombat, catOutdoor, catDesert, heroTactical];

  return (
    <section className="relative overflow-hidden border-y border-border bg-panel/30 py-8 sm:py-12 lg:py-16">
      <div className="absolute inset-0 tactical-grid opacity-35" />
      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            code="// 06B"
            eyebrow="Vizual patrul"
            title={<>Modellar harakatda <span className="text-orange">ko'rinsin.</span></>}
          />
          <div className="hidden md:block max-w-sm text-sm leading-relaxed text-muted-foreground">
            Ikki yo'nalishli marquee qatorlari katalog kayfiyatini jonlantiradi va modellarning ko'rinishini tez ko'rsatadi.
          </div>
        </div>
      </div>

      <div className="relative space-y-5">
        <ImageMarquee images={topRow} direction="left" />
        <ImageMarquee images={bottomRow} direction="right" />
      </div>
    </section>
  );
}

function ImageMarquee({ images, direction }: { images: string[]; direction: "left" | "right" }) {
  const list = [...images, ...images, ...images];

  return (
    <div className="marquee-mask overflow-hidden">
      <div className={`image-marquee flex w-max gap-4 ${direction === "right" ? "image-marquee-reverse" : ""}`}>
        {list.map((image, i) => (
          <div
            key={`${direction}-${i}`}
            className="group relative h-36 w-56 shrink-0 overflow-hidden border border-border bg-ink clip-tac sm:h-44 sm:w-72 lg:h-52 lg:w-80"
          >
            <img
              src={image}
              alt="Altima mahsulot tasviri"
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            <div className="absolute bottom-3 left-3 text-[10px] font-mono-tac uppercase tracking-wider text-orange">
              ALTIMA / {String((i % images.length) + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DurabilityLab() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-ink ink-surface">
      <div className="absolute inset-0 tactical-grid opacity-40" />
      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-[11px] font-mono-tac uppercase tracking-wider text-orange">// Sinov laboratoriyasi</div>
          <h2 className="mt-4 font-display text-4xl lg:text-6xl font-bold leading-[0.95]">
            Chok, taglik va membrana alohida sinovdan o'tadi.
          </h2>
        </div>
        <motion.div
          variants={staggerGrid}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid sm:grid-cols-3 gap-3"
        >
          {["Namlik", "Zarba", "Sirpanish"].map((test, i) => (
            <motion.div
              key={test}
              variants={revealScale}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="border border-border bg-white/5 p-5 clip-tac"
            >
              <div className="text-[10px] font-mono-tac text-orange">TEST/0{i + 1}</div>
              <div className="mt-8 font-display text-2xl font-bold text-foreground">{test}</div>
              <div className="mt-2 text-sm text-muted-foreground">Har partiyada nazoratdan o'tkaziladi.</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DeliveryPromise() {
  const items = [
    { icon: Truck, t: "Tez yetkazish", d: "Toshkent bo'ylab tezkor, viloyatlarga kelishilgan muddatda." },
    { icon: Shield, t: "Tekshirib olish", d: "Mahsulot holatini ko'rib, keyin qabul qilish mumkin." },
    { icon: Lock, t: "Xavfsiz to'lov", d: "Naqd yoki kelishilgan to'lov usuli orqali." },
  ];

  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
      <SectionHead code="// 07" eyebrow="Servis va kafolat" title={<>Yetkazish ham <span className="text-orange">taktik.</span></>} />
      <motion.div
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid md:grid-cols-3 gap-5 mt-12"
      >
        {items.map((item) => (
          <motion.div
            key={item.t}
            variants={revealScale}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="border border-border bg-panel p-7 clip-tac hover:border-orange/60 transition-colors"
          >
            <item.icon className="w-8 h-8 text-orange" />
            <h3 className="mt-6 font-display text-2xl font-bold">{item.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------- REVIEWS ----------------------------- */

function Reviews() {
  const list = [
    { n: "Serj. Kamol R.", role: "Maxsus bo'linma xodimi", t: "Tog'da 12 soatlik operatsiyada Phantom Combat hech bir muammosiz ishladi. Suv o'tkazmasligi haqiqatan ishonchli.", r: 5 },
    { n: "Bekzod A.", role: "Politsiya xodimi · TSh", t: "Yarim yil kiyaman — taglik hali yangi kabi. Taktik ushlash muz ustida ham qulay.", r: 5 },
    { n: "Jasur M.", role: "Dala yo'lboshchisi", t: "Cho'l ekspeditsiyasi uchun Desert Storm tanlovim. Yengil, nafas oluvchan va juda mustahkam.", r: 5 },
  ];
  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-24">
      <SectionHead code="// 04" eyebrow="Dala fikrlari" title={<>Foydalanuvchilardan <span className="text-orange">haqiqiy tajriba.</span></>} />

      <div className="grid md:grid-cols-3 gap-5 mt-12">
        {list.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative bg-panel border border-border p-7 clip-tac hover:border-orange/50 transition-colors"
          >
            <div className="text-[10px] font-mono-tac text-orange">FIKR #{String(i + 1).padStart(3, "0")}</div>
            <div className="flex gap-0.5 mt-4">
              {Array.from({ length: r.r }).map((_, k) => <Star key={k} className="w-4 h-4 fill-orange text-orange" />)}
            </div>
            <p className="mt-5 text-foreground/90 leading-relaxed">"{r.t}"</p>
            <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
              <div className="w-10 h-10 bg-tactical/30 border border-tactical/50 flex items-center justify-center font-display font-bold text-sand clip-tac">
                {r.n[0]}
              </div>
              <div>
                <div className="font-display font-bold text-sm">{r.n}</div>
                <div className="text-[10px] font-mono-tac text-muted-foreground uppercase">{r.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
      <motion.div
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid lg:grid-cols-12 gap-6 items-stretch"
      >
        <motion.div
          variants={revealUp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 border border-border bg-panel p-8 lg:p-10 clip-tac"
        >
          <SectionHead code="// 08" eyebrow="Brend falsafasi" title={<>ALTIMA kundalik ko'rinish emas, <span className="text-orange">xizmat vositasi.</span></>} />
          <p className="mt-7 text-muted-foreground leading-relaxed max-w-2xl">
            Har bir model uzoq yurish, navbatchilik, dala sharoiti va shahar patruli kabi real holatlar uchun tanlanadi. Dizayn ko'rinish uchun emas, chidamlilik va barqarorlik uchun quriladi.
          </p>
        </motion.div>
        <motion.div
          variants={revealScale}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative min-h-[360px] overflow-hidden clip-tac media-card"
        >
          <img src={heroTactical} alt="ALTIMA brend hikoyasi" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-[10px] font-mono-tac text-orange">FIELD NOTE</div>
            <div className="mt-2 font-display text-3xl font-bold text-white">Kuch detalda bilinadi.</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section className="border-y border-border bg-panel/30">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
        <SectionHead code="// 09" eyebrow="Farqni ko'ring" title={<>Oddiy botinka va <span className="text-orange">taktik model.</span></>} />
        <div className="mt-12 overflow-hidden border border-border bg-background clip-tac">
          <div className="grid grid-cols-3 bg-panel p-4 text-[10px] font-mono-tac uppercase tracking-wider text-muted-foreground">
            <div>Ko'rsatkich</div>
            <div>ALTIMA</div>
            <div>Oddiy model</div>
          </div>
          {comparisonRows.map((row) => (
            <motion.div
              key={row[0]}
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-3 gap-3 border-t border-border p-4 text-sm"
            >
              <div className="font-semibold text-foreground">{row[0]}</div>
              <div className="text-orange">{row[1]}</div>
              <div className="text-muted-foreground">{row[2]}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <SectionHead code="// 10" eyebrow="Savollar" title={<>Tez-tez <span className="text-orange">so'raladi.</span></>} />
        </div>
        <motion.div
          variants={staggerGrid}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-span-8 space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              variants={revealScale}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="border border-border bg-panel p-6 clip-tac"
            >
              <div className="flex items-start gap-4">
                <div className="font-display text-2xl text-orange">0{i + 1}</div>
                <div>
                  <h3 className="font-display text-xl font-bold">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------- INSTAGRAM FEED -------------------------- */

function InstagramFeed() {
  const imgs = [bootCombat, bootTactical, bootDesert, bootWinter, catCombat, catDesert];
  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 pb-20 lg:pb-28">
      <SectionHead code="// 05" eyebrow="@altimashop_tactical" title={<>Missiyani <span className="text-orange">kuzating.</span></>} />

      <motion.div
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-3 lg:grid-cols-6 gap-2 mt-12"
      >
        {imgs.map((im, i) => (
          <motion.a
            key={i}
            href="#"
            variants={revealScale}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square overflow-hidden group bg-panel clip-tac"
          >
            <img src={im} alt="Altima taktik tasmasi" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/70 transition-colors flex items-center justify-center">
              <Instagram className="w-5 h-5 text-orange opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

/* ----------------------------- NEWSLETTER ---------------------------- */

function Newsletter() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="absolute inset-0 tactical-grid opacity-40" />
      <div className="absolute inset-0 camo-noise" />
      <motion.div
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center"
      >
        <motion.div variants={revealUp} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="text-[11px] font-mono-tac uppercase tracking-wider text-orange mb-4">// Maxsus xabarnoma</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold leading-[1] text-balance">
            Yangi taktik kolleksiyalarni <span className="text-orange">birinchi biling.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md leading-relaxed">
            Yangi kolleksiyalar, cheklangan seriyalar va faqat obunachilar uchun chegirmalar to'g'risida birinchi bo'lib bilib oling.
          </p>
        </motion.div>
        <motion.form
          variants={revealScale}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="email" placeholder="EMAIL MANZILINGIZ" className="w-full bg-panel border border-border focus:border-orange outline-none pl-11 pr-4 py-4 font-mono-tac text-sm uppercase tracking-wider placeholder:text-muted-foreground/60 clip-tac transition-colors" />
          </div>
          <button className="bg-orange text-ink px-8 py-4 font-mono-tac text-sm font-bold uppercase tracking-wider clip-tac glow-orange-hover transition-all inline-flex items-center justify-center gap-2">
            Obuna bo'lish <Send className="w-4 h-4" />
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
}

/* ------------------------------- FOOTER ------------------------------ */

function Footer({ settings }: { settings: ApiSettings }) {
  const brand = settings.site_name || fallbackSettings.site_name;
  return (
    <footer className="bg-ink border-t border-border relative overflow-hidden ink-surface">
      <div className="absolute inset-0 tactical-grid opacity-30" />
      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 overflow-hidden flex items-center justify-center">
                <img src="/icon.png" alt="ALTIMA" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="font-display text-xl font-bold tracking-[0.15em]">{brand.replace(" SHOP", "")}</div>
                <div className="text-[9px] font-mono-tac text-orange">DO'KON · TAKTIK</div>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Professional military, tactical va outdoor oyoq kiyimlar. Mustahkam, ishonchli va jangovor sharoitlarda sinovdan o'tgan modellar.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Send, Phone].map((I, i) => (
                <a key={i} href={i === 0 ? settings.instagram || "#" : i === 1 ? settings.telegram || "#" : phoneHref(settings.phone)} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-orange hover:border-orange transition-colors clip-tac">
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Katalog" items={["Jangovar botinkalar", "Taktik seriya", "Cho'l taktikasi", "Qishki armiya", "Politsiya poyabzali"]} />
          <FooterCol title="Yordam" items={["O'lcham qo'llanmasi", "Parvarish bo'yicha ko'rsatma", "Yetkazib berish", "Qaytarish", "Aloqa"]} />

          <div className="lg:col-span-3">
            <div className="text-[10px] font-mono-tac uppercase text-orange tracking-wider mb-5">HQ · Base</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3"><MapPin className="w-4 h-4 text-orange shrink-0 mt-0.5" /> {settings.address}</li>
              <li className="flex gap-3"><Phone className="w-4 h-4 text-orange shrink-0 mt-0.5" /> {settings.phone}</li>
              <li className="flex gap-3"><Mail className="w-4 h-4 text-orange shrink-0 mt-0.5" /> {settings.email}</li>
              <li className="flex gap-3"><Lock className="w-4 h-4 text-orange shrink-0 mt-0.5" /> {settings.work_time}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-border flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono-tac uppercase tracking-wider text-muted-foreground">
          <div>© 2026 {brand} · KUCH UCHUN YARATILGAN</div>
          <div>
            <a href="https://myweb.uz" target="_blank" rel="noreferrer" className="text-orange hover:text-foreground">
              MyWeb
            </a>{" "}
            Digital Agency tomonidan ishlab chiqilgan
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="lg:col-span-2">
      <div className="text-[10px] font-mono-tac uppercase text-orange tracking-wider mb-5">{title}</div>
      <ul className="space-y-3 text-sm">
        {items.map(i => (
          <li key={i}><a href="#" className="text-muted-foreground hover:text-orange transition-colors">{i}</a></li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------- SECTION HEADER -------------------------- */

function SectionHead({ code, eyebrow, title }: { code: string; eyebrow: string; title: React.ReactNode }) {
  return (
    <motion.div
      variants={revealUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3"
    >
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "auto", opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="flex items-center gap-3 text-[11px] font-mono-tac uppercase tracking-wider"
      >
        <span className="text-orange">{code}</span>
        <span className="w-8 h-px bg-orange/50" />
        <span className="text-muted-foreground">{eyebrow}</span>
      </motion.div>
      <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-[0.95] text-balance max-w-3xl">
        {title}
      </h2>
    </motion.div>
  );
}
