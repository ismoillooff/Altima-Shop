import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Crosshair,
  Droplet,
  Flame,
  Gauge,
  Heart,
  Home,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Menu,
  Moon,
  PackageCheck,
  Phone,
  Search,
  Shield,
  ShoppingBag,
  Snowflake,
  Star,
  Sun,
  Target,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/lib/cart";
import { fetchProducts, fetchSettings, type ApiProduct, type ApiSettings } from "@/lib/api";
import heroTactical from "@/assets/hero-tactical.jpg";
import bootCombat from "@/assets/boot-combat.jpg";
import bootTactical from "@/assets/boot-tactical.jpg";
import bootDesert from "@/assets/boot-desert.jpg";
import bootWinter from "@/assets/boot-winter.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import catOutdoor from "@/assets/cat-outdoor.jpg";

export const Route = createFileRoute("/products")({
  loader: async () => {
    try {
      const products = await fetchProducts();
      return { products };
    } catch {
      return { products: [] as ApiProduct[] };
    }
  },
  head: () => ({
    meta: [
      { title: "Mahsulotlar | ALTIMA SHOP" },
      {
        name: "description",
        content:
          "ALTIMA SHOP mahsulotlari: jangovar botinkalar, taktik, trekking, qishki va kundalik xizmat modellar.",
      },
    ],
  }),
  component: ProductsPage,
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
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.08 } },
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

const products = [
  { name: "Phantom Combat 8\"", code: "ALT-CB-08", price: "1 890 000", old: "2 190 000", img: bootCombat, tags: ["Jangovar", "Suv o'tkazmas"], rating: 4.9, stock: 87, hot: true },
  { name: "Ranger Tactical Olive", code: "ALT-TC-05", price: "2 290 000", old: null, img: bootTactical, tags: ["Taktik", "Zarba yutadi"], rating: 4.8, stock: 34, hot: false },
  { name: "Desert Storm MK II", code: "ALT-DS-02", price: "2 090 000", old: "2 390 000", img: bootDesert, tags: ["Cho'l", "Nafas oladi"], rating: 4.7, stock: 52, hot: true },
  { name: "Arctic Recon Winter", code: "ALT-WT-11", price: "2 590 000", old: null, img: bootWinter, tags: ["Qishki", "-40°C"], rating: 4.9, stock: 19, hot: false },
  { name: "Urban Patrol Mid", code: "ALT-UP-04", price: "1 690 000", old: "1 890 000", img: product1, tags: ["Shahar", "Yengil"], rating: 4.6, stock: 64, hot: false },
  { name: "Recon Low Black", code: "ALT-RL-09", price: "1 490 000", old: null, img: product2, tags: ["Tezkor", "Past profil"], rating: 4.7, stock: 41, hot: false },
  { name: "Guard Pro Leather", code: "ALT-GP-12", price: "1 990 000", old: "2 150 000", img: product3, tags: ["Teri", "Xizmat"], rating: 4.8, stock: 55, hot: true },
  { name: "Storm Runner GTX", code: "ALT-SR-07", price: "2 190 000", old: null, img: product4, tags: ["Yomg'ir", "Ushlash"], rating: 4.7, stock: 33, hot: false },
  { name: "Alpha Duty Sand", code: "ALT-AD-03", price: "1 790 000", old: null, img: bootDesert, tags: ["Cho'l", "Nafas oladi"], rating: 4.6, stock: 72, hot: false },
  { name: "Night Ops 6\"", code: "ALT-NO-06", price: "2 390 000", old: "2 650 000", img: bootCombat, tags: ["Qora", "Maxfiy"], rating: 4.9, stock: 28, hot: true },
  { name: "Tundra Shield", code: "ALT-TS-14", price: "2 690 000", old: null, img: bootWinter, tags: ["Qishki", "Issiq"], rating: 4.8, stock: 24, hot: false },
  { name: "Olive Field MK I", code: "ALT-OF-01", price: "1 850 000", old: "2 050 000", img: bootTactical, tags: ["Dala", "Mustahkam"], rating: 4.7, stock: 49, hot: false },
  { name: "Rapid Response", code: "ALT-RR-10", price: "1 590 000", old: null, img: product2, tags: ["Tezkor", "Yengil"], rating: 4.5, stock: 91, hot: false },
  { name: "Commander Elite", code: "ALT-CE-15", price: "2 890 000", old: "3 150 000", img: product3, tags: ["Premium", "Teri"], rating: 5.0, stock: 16, hot: true },
  { name: "Trail Force", code: "ALT-TF-18", price: "1 750 000", old: null, img: catOutdoor, tags: ["Trekking", "Taglik"], rating: 4.6, stock: 58, hot: false },
  { name: "Barracks Classic", code: "ALT-BC-20", price: "1 390 000", old: "1 590 000", img: product1, tags: ["Klassik", "Kunlik"], rating: 4.5, stock: 104, hot: false },
];

type ProductItem = {
  id: number;
  name: string;
  slug: string;
  code: string;
  price: string;
  priceValue: number;
  old: string | null;
  img: string;
  tags: string[];
  rating: number;
  stock: number;
  hot: boolean;
};

const fallbackProductImages = [bootCombat, bootTactical, bootDesert, bootWinter, product1, product2, product3, product4, catOutdoor];

function formatPrice(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value);
}

function mapApiProduct(product: ApiProduct, index: number): ProductItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
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

const filters = ["Barchasi", "Jangovar", "Taktik", "Trekking", "Qishki", "Chegirma"];

const productFeatures = [
  { icon: Droplet, title: "Suv o'tkazmas", text: "Nam sharoitlarda oyoqni quruq saqlashga yordam beradi." },
  { icon: Zap, title: "Zarba yutadi", text: "Tovon va tizza yuklamasini kamaytiruvchi amortizatsiya." },
  { icon: Shield, title: "To'piq himoyasi", text: "Baland kesim og'ir vazifada barqarorlik beradi." },
  { icon: Snowflake, title: "Qishki himoya", text: "Sovuqda issiqlik va muzda ushlashni saqlash." },
  { icon: Gauge, title: "Yengil yurish", text: "Kun bo'yi harakatda charchoqni kamaytirishga mos." },
  { icon: PackageCheck, title: "Ombor nazorati", text: "Mavjudlik va qadoq holati yuborishdan oldin tekshiriladi." },
];

type ThemeMode = "light" | "dark";

function ProductsPage() {
  const matches = useMatches();
  const hasChildRoute = matches.some((match) => match.routeId === "/products/$slug");

  if (hasChildRoute) {
    return <Outlet />;
  }

  return <ProductsListPage />;
}

function ProductsListPage() {
  const loaderData = Route.useLoaderData();
  const initialItems = (loaderData?.products ?? []).map(mapApiProduct);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<ProductItem[]>(initialItems);
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
    if (initialItems.length) return;
    fetchProducts()
      .then((data) => {
        if (data.length) setItems(data.map(mapApiProduct));
      })
      .catch(() => setItems([]));
  }, [initialItems.length]);

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
      <ProductsHeader
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((open) => !open)}
        onCartOpen={() => setCartOpen(true)}
        settings={settings}
      />
      <ProductsMobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <ProductsMobileBottomBar
        menuOpen={mobileOpen}
        onMenuToggle={() => setMobileOpen((open) => !open)}
        onNavigate={() => setMobileOpen(false)}
        onCartOpen={() => setCartOpen(true)}
      />
      <HeroSection />
      <FilterPanel />
      <ProductsGrid products={items} onCartOpen={() => setCartOpen(true)} />
      <FeatureSection />
      <AdvisorSection />
      <CallToAction />
      <SiteFooter settings={settings} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}

function HeroSection() {
  const heroImages = [heroTactical, bootCombat, bootTactical, bootDesert, bootWinter, product3, product4, catOutdoor];
  const [randomHeroImg] = useState(() => heroImages[Math.floor(Math.random() * heroImages.length)]);

  return (
    <section className="relative overflow-hidden border-b border-border">
      <img src={randomHeroImg} alt="ALTIMA mahsulotlari" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
      <div className="absolute inset-0 tactical-grid opacity-40" />
      <div className="relative mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-28">
        <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.75 }} className="flex min-h-[520px] flex-col justify-center">
          <SectionEyebrow text="// ALTIMA MAHSULOTLARI" />
          <h1 className="mt-5 max-w-5xl font-display text-5xl font-bold leading-[0.94] text-balance sm:text-6xl lg:text-8xl">
            Taktik arsenalni aniq tanlang.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Mahsulotlar bo'limi model, narx, reyting, ombor holati va asosiy xususiyatlarni tez
            solishtirish uchun qurildi. Mobile ekranda ham kartalar 2 ustunda qulay ko'rinadi.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#products-grid" className="group inline-flex items-center justify-center gap-3 bg-orange px-7 py-4 font-mono-tac text-xs font-bold uppercase text-primary-foreground clip-tac glow-orange-hover">
              16 modelni ko'rish
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="/contact" className="inline-flex items-center justify-center gap-3 border border-border bg-background/80 px-7 py-4 font-mono-tac text-xs font-bold uppercase clip-tac hover:border-orange hover:text-orange">
              <Phone className="h-4 w-4" />
              Maslahat olish
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 38, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative hidden min-h-[520px] overflow-hidden border border-border bg-panel clip-tac lg:block">
          <img src={bootCombat} alt="Phantom Combat" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />
          <div className="absolute left-6 top-6 bg-orange px-4 py-2 font-mono-tac text-[10px] font-bold uppercase text-ink">Top model</div>
          <div className="absolute bottom-7 left-7 right-7 text-white">
            <div className="font-mono-tac text-[10px] uppercase text-orange">phantom combat 8"</div>
            <div className="mt-3 max-w-lg font-display text-4xl font-bold leading-none">
              Suv o'tkazmas jangovar tanlov.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FilterPanel() {
  return (
    <section className="sticky top-[72px] z-30 border-b border-border bg-background/92 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1500px] gap-4 px-6 py-5 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
        <div className="flex items-center gap-3 border border-border bg-panel px-4 py-3 clip-tac">
          <Search className="h-4 w-4 text-orange" />
          <span className="font-mono-tac text-xs uppercase text-muted-foreground">Model, kod yoki kategoriya bo'yicha qidirish</span>
        </div>
        <div className="scrollbar-hidden flex gap-2 overflow-x-auto">
          {filters.map((filter, index) => (
            <button key={filter} type="button" className={`shrink-0 border px-5 py-3 font-mono-tac text-xs font-bold uppercase transition-colors clip-tac ${index === 0 ? "border-orange bg-orange text-ink" : "border-border bg-panel text-muted-foreground hover:border-orange hover:text-orange"}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsGrid({ products, onCartOpen }: { products: ProductItem[]; onCartOpen: () => void }) {
  return (
    <section id="products-grid" className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:gap-4 lg:flex-row lg:items-end">
        <div>
          <SectionEyebrow text={`// ${products.length || 16} ta mahsulot`} />
          <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:mt-4 sm:text-4xl lg:text-6xl">
            Jangga tayyor mahsulotlar.
          </h2>
        </div>
        <div className="font-mono-tac text-[11px] uppercase text-muted-foreground sm:text-xs">Omborda mavjud modellar ko'rsatildi</div>
      </motion.div>
      {products.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 border border-dashed border-border bg-panel/40 px-5 text-center clip-tac sm:min-h-[280px] sm:px-6">
          <PackageCheck className="h-6 w-6 text-orange sm:h-7 sm:w-7" />
          <div className="font-display text-lg font-bold sm:text-xl">Hozircha mahsulot mavjud emas</div>
          <p className="max-w-md text-[13px] text-muted-foreground sm:text-sm">
            Backend ulanmagan yoki ma'lumotlar bazasi bo'sh. Admin panel orqali mahsulot qo'shing yoki
            <code className="mx-1 rounded bg-background px-1.5 py-0.5 font-mono-tac text-[10px] sm:text-[11px]">python manage.py seed_altima</code>
            buyrug'i bilan demo ma'lumotlarni yuklang.
          </p>
        </div>
      ) : (
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <ProductCard key={product.code} product={product} onCartOpen={onCartOpen} />
          ))}
        </motion.div>
      )}
    </section>
  );
}

function ProductCard({ product, onCartOpen }: { product: ProductItem; onCartOpen: () => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(t);
  }, [added]);

  const handleAdd = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (product.stock <= 0) return;
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.code,
      price: product.priceValue,
      image: product.img,
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
      href={`/products/${product.slug}`}
      variants={revealScale}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col overflow-hidden border border-border bg-panel clip-tac transition-colors hover:border-orange"
    >
      <div className="relative aspect-square overflow-hidden bg-ink">
        <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70" />
        <div className="absolute left-1.5 top-1.5 flex max-w-[80%] flex-col gap-1 sm:left-3 sm:top-3">
          {product.tags.slice(0, 2).map((tag, index) => (
            <span
              key={tag}
              className={`w-fit border border-orange/70 px-1.5 py-0.5 font-mono-tac text-[8px] font-bold uppercase tracking-wider sm:px-2 sm:py-1 sm:text-[10px] ${
                index === 0 ? "bg-orange text-ink" : "bg-black/60 text-orange"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        {product.hot && (
          <span className="absolute bottom-2 left-1.5 flex items-center gap-1 bg-destructive px-1.5 py-0.5 font-mono-tac text-[8px] font-bold uppercase text-destructive-foreground sm:bottom-3 sm:left-3 sm:px-2 sm:py-1 sm:text-[10px]">
            Hot
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <div className="flex items-center justify-between gap-2 font-mono-tac text-[9px] text-muted-foreground sm:text-[10px]">
          <span>{product.code}</span>
          <span className="flex items-center gap-1 text-foreground">
            <Star className="h-2.5 w-2.5 fill-orange text-orange sm:h-3 sm:w-3" />
            {product.rating}
          </span>
        </div>
        <h3 className="mt-1.5 min-h-9 font-display text-[13px] font-bold leading-tight transition-colors group-hover:text-orange sm:mt-2 sm:min-h-10 sm:text-lg">
          {product.name}
        </h3>
        <div className="mt-2 flex items-end justify-between gap-2 sm:mt-3">
          <div>
            <div className="font-display text-sm font-bold text-orange sm:text-xl">{product.price}</div>
            <div className="font-mono-tac text-[8px] uppercase text-muted-foreground sm:text-[9px]">so'm</div>
          </div>
          {product.old && (
            <div className="font-mono-tac text-[9px] text-muted-foreground line-through sm:text-[10px]">{product.old}</div>
          )}
        </div>
        {added ? (
          <button
            type="button"
            onClick={handleOpenCart}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 border border-orange bg-orange/15 py-2.5 font-mono-tac text-[10px] font-bold uppercase tracking-wider text-orange transition-colors hover:bg-orange/25 clip-tac sm:mt-3 sm:py-3"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Savatda · Ko'rish
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 bg-orange py-2.5 font-mono-tac text-[10px] font-bold uppercase tracking-wider text-ink clip-tac transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground sm:mt-3 sm:py-3"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {product.stock > 0 ? "Savatga" : "Mavjud emas"}
          </button>
        )}
      </div>
    </motion.a>
  );
}

function FeatureSection() {
  return (
    <section className="border-y border-border bg-panel/35">
      <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10 lg:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="max-w-4xl">
          <SectionEyebrow text="// Mahsulot ustunliklari" />
          <h2 className="mt-4 font-display text-4xl font-bold leading-none text-balance sm:text-5xl lg:text-6xl">
            Har bir karta amaliy qaror uchun kerakli ma'lumotni beradi.
          </h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productFeatures.map((item, index) => (
            <motion.article key={item.title} variants={revealScale} whileHover={{ y: -8, scale: 1.015 }} className="group relative min-h-[220px] overflow-hidden border border-border bg-background p-6 clip-tac transition-colors hover:border-orange hover:bg-panel">
              <div className="absolute right-4 top-4 font-display text-5xl font-bold text-muted-foreground/10 group-hover:text-orange/15">{String(index + 1).padStart(2, "0")}</div>
              <div className="flex h-12 w-12 items-center justify-center border border-border bg-panel text-orange clip-tac transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-ink">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-7 font-display text-2xl font-bold leading-none group-hover:text-orange">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-orange transition-all duration-500 group-hover:w-full" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AdvisorSection() {
  const rows = [
    ["Patrul", "Urban Patrol / Recon Low", "Yengil, tezkor, kun bo'yi qulay"],
    ["Og'ir xizmat", "Phantom Combat / Guard Pro", "Baland kesim va mustahkam taglik"],
    ["Qish", "Arctic Recon / Tundra Shield", "Issiq qatlam va muzda ushlash"],
  ];
  return (
    <section className="mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-28">
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal}>
        <SectionEyebrow text="// Tanlov yordamchisi" />
        <h2 className="mt-4 font-display text-4xl font-bold leading-none sm:text-5xl">
          Qaysi mahsulot sizga mos?
        </h2>
        <p className="mt-6 text-muted-foreground">
          Vazifangizga qarab tez yo'nalish oling, keyin mahsulot kartasidan aniq modelni tanlang.
        </p>
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="overflow-hidden border border-border bg-border clip-tac">
        {rows.map((row) => (
          <motion.div key={row[0]} variants={reveal} className="grid gap-px bg-border md:grid-cols-3">
            {row.map((cell, index) => (
              <div key={cell} className={`bg-background p-5 ${index === 0 ? "font-display text-2xl font-bold text-orange" : "text-sm text-muted-foreground"}`}>
                {cell}
              </div>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <img src={bootWinter} alt="Mahsulot tanlash" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-background/88" />
      <div className="absolute inset-0 tactical-grid opacity-45" />
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="relative mx-auto max-w-[1500px] px-6 py-20 text-center lg:px-10 lg:py-28">
        <SectionEyebrow text="// Buyurtmaga tayyor" />
        <h2 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-bold leading-none sm:text-5xl lg:text-7xl">
          Modelni tanlang, qolganini biz tartiblaymiz.
        </h2>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/contact" className="group inline-flex items-center justify-center gap-3 bg-orange px-7 py-4 font-mono-tac text-xs font-bold uppercase text-primary-foreground clip-tac">
            Buyurtma bo'yicha aloqa
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="/catalog" className="inline-flex items-center justify-center border border-border bg-background px-7 py-4 font-mono-tac text-xs font-bold uppercase hover:border-orange hover:text-orange clip-tac">
            Katalogga qaytish
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function SectionEyebrow({ text }: { text: string }) {
  return <div className="font-mono-tac text-[11px] uppercase tracking-wider text-orange">{text}</div>;
}

function ProductsHeader({ mobileOpen, onMobileToggle, onCartOpen, settings }: { mobileOpen: boolean; onMobileToggle: () => void; onCartOpen: () => void; settings: ApiSettings }) {
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
            <a key={item.href} href={item.href} className={`px-4 py-2 font-mono-tac text-sm uppercase tracking-wider transition-colors ${item.href === "/products" ? "text-orange" : "text-muted-foreground hover:text-orange"}`}>
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
          <button type="button" aria-label={mobileOpen ? "Mobil menyuni yopish" : "Mobil menyuni ochish"} aria-controls="products-mobile-menu" aria-expanded={mobileOpen} onClick={onMobileToggle} className="flex h-10 items-center justify-center gap-2 border border-border bg-panel px-3 text-foreground transition-colors clip-tac hover:border-orange hover:bg-secondary hover:text-orange lg:hidden">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="hidden font-mono-tac text-[10px] font-bold uppercase tracking-wider sm:inline">{mobileOpen ? "Yopish" : "Menyu"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function ProductsMobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div id="products-mobile-menu" className="fixed inset-x-0 bottom-[calc(74px+env(safe-area-inset-bottom))] top-[72px] z-40 overflow-y-auto border-t border-border bg-background/98 backdrop-blur-xl lg:hidden">
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
            <a key={item.href} href={item.href} onClick={onClose} className={`group min-h-20 border p-4 transition-colors clip-tac ${item.href === "/products" ? "border-orange bg-orange text-ink" : "border-border bg-panel hover:border-orange hover:bg-secondary"}`}>
              <div className={`font-mono-tac text-[10px] ${item.href === "/products" ? "text-ink/70" : "text-orange"}`}>{String(index + 1).padStart(2, "0")}</div>
              <div className={`mt-3 font-display text-lg font-bold ${item.href === "/products" ? "text-ink" : "text-foreground group-hover:text-orange"}`}>{item.label}</div>
            </a>
          ))}
        </div>
        <a href="#products-grid" onClick={onClose} className="inline-flex w-full items-center justify-center gap-3 bg-orange px-6 py-4 font-mono-tac text-sm font-bold uppercase tracking-wider text-ink clip-tac glow-orange-hover">
          16 modelni ko'rish <ArrowRight className="h-4 w-4" />
        </a>
        <div className="grid gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
          <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" /><span>Toshkent sh., Amir Temur ko'chasi 108</span></div>
          <div className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange" /><span>ops@altimashop.uz</span></div>
          <div className="flex items-start gap-3"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-orange" /><span>Dushanba-Yakshanba · 09:00-22:00</span></div>
        </div>
      </div>
    </div>
  );
}

function ProductsMobileBottomBar({ menuOpen, onMenuToggle, onNavigate, onCartOpen }: { menuOpen: boolean; onMenuToggle: () => void; onNavigate: () => void; onCartOpen: () => void }) {
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
          <a key={item.label} href={item.href} onClick={onNavigate} className={`flex min-h-14 flex-col items-center justify-center gap-1 font-mono-tac text-[9px] uppercase tracking-wider transition-colors clip-tac ${item.href === "/products" ? "bg-orange font-bold text-ink" : "text-muted-foreground hover:bg-panel hover:text-orange"}`}>
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
