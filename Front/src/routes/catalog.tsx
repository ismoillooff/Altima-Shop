import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
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
  Mountain,
  PackageCheck,
  Phone,
  Search,
  Shield,
  ShoppingBag,
  SlidersHorizontal,
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
import { fetchCategories, fetchProducts, fetchSettings, type ApiCategory, type ApiProduct, type ApiSettings } from "@/lib/api";
import heroTactical from "@/assets/hero-tactical.jpg";
import catCombat from "@/assets/cat-combat.jpg";
import catOutdoor from "@/assets/cat-outdoor.jpg";
import catDesert from "@/assets/cat-desert.jpg";
import bootWinter from "@/assets/boot-winter.jpg";
import bootCombat from "@/assets/boot-combat.jpg";
import bootTactical from "@/assets/boot-tactical.jpg";
import bootDesert from "@/assets/boot-desert.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Katalog | ALTIMA SHOP" },
      {
        name: "description",
        content:
          "ALTIMA SHOP katalogi: jangovar, taktik, trekking, cho'l va qishki oyoq kiyim kategoriyalari.",
      },
    ],
  }),
  component: CatalogPage,
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

const categories = [
  { name: "Jangovar botinkalar", count: "42 model", img: catCombat, icon: Shield, code: "01", text: "Patrul, qo'riqlash va og'ir xizmat uchun mustahkam tanlov." },
  { name: "Taktik xizmat", count: "34 model", img: bootTactical, icon: Crosshair, code: "02", text: "Yengilroq, chaqqonroq va kun bo'yi harakatga mos modellar." },
  { name: "Dala trekkingi", count: "38 model", img: catOutdoor, icon: Mountain, code: "03", text: "Tog', shag'al, loy va uzoq yurishlar uchun barqaror ushlash." },
  { name: "Cho'l taktikasi", count: "27 model", img: catDesert, icon: Flame, code: "04", text: "Issiq havoda nafas oluvchi va changli yo'lga mos konstruksiya." },
  { name: "Qishki armiya", count: "19 model", img: bootWinter, icon: Snowflake, code: "05", text: "Sovuq, namlik va muzlagan sirt uchun issiq himoya." },
  { name: "Shahar patruli", count: "31 model", img: product2, icon: Home, code: "06", text: "Past profil, tez harakat va kundalik forma bilan mos ko'rinish." },
];

type CategoryItem = (typeof categories)[number];

const filters = ["Barchasi", "Jangovar", "Taktik", "Trekking", "Qishki", "Chegirma"];

const catalogRules = [
  { icon: Droplet, title: "Suv o'tkazmaslik", text: "Namlikka chidamli membrana yoki mustahkam qoplama ko'rsatiladi." },
  { icon: Zap, title: "Zarba yutish", text: "Uzoq yurishda tizza va tovon yuklamasini kamaytirish uchun amortizatsiya." },
  { icon: Shield, title: "To'piq himoyasi", text: "Baland kesim va qattiq ushlash og'ir vazifada barqarorlik beradi." },
  { icon: Snowflake, title: "Mavsum mosligi", text: "Yoz, qish, nam va changli sharoitlar katalogda alohida ajratiladi." },
  { icon: Mountain, title: "Sirt ushlashi", text: "Protektor turi asfalt, shag'al, loy yoki muz uchun tanlanadi." },
  { icon: Gauge, title: "Vazn balansi", text: "Og'ir himoya va yengil harakat o'rtasidagi nisbat aniq ko'rsatiladi." },
  { icon: PackageCheck, title: "Ombor holati", text: "Har karta mavjud dona va yetkazish tayyorgarligini ko'rsatadi." },
  { icon: Award, title: "Premium seriya", text: "Yuqori sifatli charm, kuchaytirilgan chok va uzoq xizmat muddati." },
  { icon: Target, title: "Vazifa profili", text: "Patrul, navbatchilik, outdoor yoki xizmat uchun mos model tanlash." },
  { icon: CheckCircle2, title: "Razmer aniqligi", text: "Qalin paypoq va yarim razmer ehtiyoji alohida hisobga olinadi." },
  { icon: Truck, title: "Tez yuborish", text: "Ombordagi modellar O'zbekiston bo'ylab tez yetkazishga tayyor." },
  { icon: Heart, title: "Mijoz tanlovi", text: "Reyting va ko'p tanlangan modellar katalogda ajralib turadi." },
];

type FeaturedItem = {
  name: string;
  slug: string;
  price: string;
  img: string;
  rating: string;
  tag: string;
};

const categoryIconMap = {
  Shield,
  Crosshair,
  Mountain,
  Flame,
  Snowflake,
  Home,
};

const fallbackCategoryImages = [catCombat, bootTactical, catOutdoor, catDesert, bootWinter, product2];
const fallbackFeaturedImages = [bootCombat, bootTactical, bootDesert, product1];

function formatPrice(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value);
}

function mapApiCategory(category: ApiCategory, index: number): CategoryItem {
  const Icon = categoryIconMap[category.icon as keyof typeof categoryIconMap] ?? Shield;
  return {
    name: category.name,
    count: `${category.products_count ?? 0} model`,
    img: category.image_src || fallbackCategoryImages[index % fallbackCategoryImages.length],
    icon: Icon,
    code: category.code || String(index + 1).padStart(2, "0"),
    text: category.description || "ALTIMA katalogidagi faol kategoriya.",
  };
}

function mapApiFeatured(product: ApiProduct, index: number): FeaturedItem {
  return {
    name: product.name,
    slug: product.slug,
    price: formatPrice(product.price),
    img: product.image_src || fallbackFeaturedImages[index % fallbackFeaturedImages.length],
    rating: String(product.rating || "4.8"),
    tag: product.category_name || product.tags?.[0] || "ALTIMA",
  };
}

type ThemeMode = "light" | "dark";

function CatalogPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
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
    fetchCategories()
      .then((data) => {
        if (data.length) setCategoryItems(data.map(mapApiCategory));
      })
      .catch(() => setCategoryItems([]));

    fetchProducts("?status=active&featured=1&ordering=sort_order")
      .then((data) => {
        if (data.length) setFeaturedItems(data.slice(0, 4).map(mapApiFeatured));
      })
      .catch(() => setFeaturedItems([]));

    fetchSettings()
      .then((items) => {
        if (items[0]) setSettings(items[0]);
      })
      .catch(() => undefined);
  }, []);

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground lg:pb-0">
      <CatalogHeader mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen((open) => !open)} onCartOpen={() => setCartOpen(true)} settings={settings} />
      <CatalogMobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CatalogMobileBottomBar
        menuOpen={mobileOpen}
        onMenuToggle={() => setMobileOpen((open) => !open)}
        onNavigate={() => setMobileOpen(false)}
        onCartOpen={() => setCartOpen(true)}
      />
      <HeroSection />
      <FilterDock />
      <CategoryGrid categories={categoryItems} />
      <FeaturedSection featured={featuredItems} />
      <CatalogRulesSection />
      <CompareSection />
      <CallToAction />
      <SiteFooter settings={settings} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <img src={heroTactical} alt="ALTIMA katalog" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/35" />
      <div className="absolute inset-0 tactical-grid opacity-40" />
      <div className="relative mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-28">
        <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.75 }} className="flex min-h-[520px] flex-col justify-center">
          <SectionEyebrow text="// ALTIMA KATALOG" />
          <h1 className="mt-5 max-w-5xl font-display text-5xl font-bold leading-[0.94] text-balance sm:text-6xl lg:text-8xl">
            Vazifangizga mos kategoriyani tez toping.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Jangovar, taktik, trekking, cho'l va qishki modellar bitta tartibli katalogda jamlangan.
            Har bir kategoriya xizmat sharoiti, taglik, mavsum va chidamlilik bo'yicha ajratilgan.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#categories" className="group inline-flex items-center justify-center gap-3 bg-orange px-7 py-4 font-mono-tac text-xs font-bold uppercase text-primary-foreground clip-tac glow-orange-hover">
              Kategoriyalar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="/products" className="inline-flex items-center justify-center gap-3 border border-border bg-background/80 px-7 py-4 font-mono-tac text-xs font-bold uppercase clip-tac hover:border-orange hover:text-orange">
              <SlidersHorizontal className="h-4 w-4" />
              Mahsulot filtri
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 38, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative hidden min-h-[520px] overflow-hidden border border-border bg-panel clip-tac lg:block">
          <img src={catCombat} alt="Katalog hero" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
          <div className="absolute left-6 top-6 border border-orange/70 px-4 py-2 font-mono-tac text-[10px] uppercase text-orange">
            191+ model
          </div>
          <div className="absolute bottom-7 left-7 right-7 text-white">
            <div className="font-mono-tac text-[10px] uppercase text-orange">katalog tartibi</div>
            <div className="mt-3 max-w-lg font-display text-4xl font-bold leading-none">
              Model emas, avval vazifa tanlanadi.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FilterDock() {
  return (
    <section className="border-b border-border bg-panel/40">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex items-center gap-3 border border-border bg-background px-4 py-3 clip-tac">
          <Search className="h-4 w-4 text-orange" />
          <span className="font-mono-tac text-xs uppercase text-muted-foreground">Model, kategoriya yoki vazifa bo'yicha qidirish</span>
        </div>
        <div className="scrollbar-hidden flex gap-2 overflow-x-auto">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`shrink-0 border px-5 py-3 font-mono-tac text-xs font-bold uppercase transition-colors clip-tac ${
                index === 0
                  ? "border-orange bg-orange text-ink"
                  : "border-border bg-background text-muted-foreground hover:border-orange hover:text-orange"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryGrid({ categories }: { categories: CategoryItem[] }) {
  return (
    <section id="categories" className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-24">
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="max-w-4xl">
        <SectionEyebrow text="// Kategoriyalar" />
        <h2 className="mt-4 font-display text-4xl font-bold leading-none text-balance sm:text-5xl lg:text-6xl">
          Har bir yo'nalish alohida xizmat ssenariysiga qurilgan.
        </h2>
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <motion.a
            key={category.name}
            href="/products"
            variants={revealScale}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="group relative min-h-[440px] overflow-hidden border border-border bg-panel clip-tac media-card"
          >
            <img src={category.img} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />
            <div className="relative flex min-h-[440px] flex-col justify-end p-6 text-white">
              <div className="absolute left-5 top-5 font-display text-5xl font-bold text-white/15">{category.code}</div>
              <category.icon className="h-7 w-7 text-orange" />
              <h3 className="mt-5 font-display text-3xl font-bold leading-none">{category.name}</h3>
              <div className="mt-2 font-mono-tac text-xs uppercase text-orange">{category.count}</div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">{category.text}</p>
              <div className="mt-7 inline-flex items-center gap-2 font-mono-tac text-xs uppercase tracking-wider text-orange">
                Mahsulotlarni ko'rish <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

function FeaturedSection({ featured }: { featured: FeaturedItem[] }) {
  return (
    <section className="border-y border-border bg-panel/35">
      <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal}>
          <SectionEyebrow text="// Tez tanlanadigan modellar" />
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
            Katalogdagi eng ko'p ko'rilgan yo'nalishlar.
          </h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((item) => (
            <motion.a key={item.slug || item.name} href={item.slug ? `/products/${item.slug}` : "/products"} variants={revealScale} whileHover={{ y: -6 }} className="group overflow-hidden border border-border bg-background clip-tac hover:border-orange">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.img} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute left-3 top-3 bg-orange px-2 py-1 font-mono-tac text-[9px] font-bold uppercase text-ink">{item.tag}</div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold leading-none group-hover:text-orange">{item.name}</h3>
                  <span className="flex items-center gap-1 font-mono-tac text-[10px]"><Star className="h-3 w-3 fill-orange text-orange" />{item.rating}</span>
                </div>
                <div className="mt-4 font-display text-2xl font-bold text-orange">{item.price}</div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CatalogRulesSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 tactical-grid opacity-35" />
      <div className="relative mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="max-w-4xl">
          <SectionEyebrow text="// Tanlash mezonlari" />
          <h2 className="mt-4 font-display text-4xl font-bold leading-none text-balance sm:text-5xl lg:text-6xl">
            Katalog 12 ta amaliy mezon bilan tartiblangan.
          </h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {catalogRules.map((item, index) => (
            <motion.article key={item.title} variants={revealScale} whileHover={{ y: -8, scale: 1.015 }} className="group relative min-h-[235px] overflow-hidden border border-border bg-panel p-6 clip-tac transition-colors hover:border-orange hover:bg-background">
              <div className="absolute right-4 top-4 font-display text-5xl font-bold text-muted-foreground/10 group-hover:text-orange/15">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="flex h-12 w-12 items-center justify-center border border-border bg-background text-orange clip-tac transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-ink">
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

function CompareSection() {
  const rows = [
    ["Jangovar", "Baland kesim", "Og'ir xizmat", "Maksimal himoya"],
    ["Taktik", "O'rta kesim", "Kunlik xizmat", "Chaqqon harakat"],
    ["Trekking", "Yumshoq amortizatsiya", "Dala yurishi", "Uzoq masofa"],
    ["Qishki", "Issiq qatlam", "Sovuq navbatchilik", "Muzda ushlash"],
  ];

  return (
    <section className="border-b border-border bg-panel/30">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal}>
          <SectionEyebrow text="// Solishtirish" />
          <h2 className="mt-4 font-display text-4xl font-bold leading-none sm:text-5xl">
            Qaysi kategoriya sizga mos?
          </h2>
          <p className="mt-6 text-muted-foreground">
            Katalog ichida adashmaslik uchun asosiy farqlarni bir qarashda ko'rishingiz mumkin.
          </p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="overflow-hidden border border-border bg-border clip-tac">
          {rows.map((row) => (
            <motion.div key={row[0]} variants={reveal} className="grid gap-px bg-border md:grid-cols-4">
              {row.map((cell, index) => (
                <div key={cell} className={`bg-background p-5 ${index === 0 ? "font-display text-2xl font-bold text-orange" : "text-sm text-muted-foreground"}`}>
                  {cell}
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="relative overflow-hidden">
      <img src={bootWinter} alt="Katalog CTA" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-background/88" />
      <div className="absolute inset-0 tactical-grid opacity-45" />
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="relative mx-auto max-w-[1500px] px-6 py-20 text-center lg:px-10 lg:py-28">
        <SectionEyebrow text="// Keyingi qadam" />
        <h2 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-bold leading-none sm:text-5xl lg:text-7xl">
          Kategoriyani tanlang, keyin aniq modelga o'tamiz.
        </h2>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/products" className="group inline-flex items-center justify-center gap-3 bg-orange px-7 py-4 font-mono-tac text-xs font-bold uppercase text-primary-foreground clip-tac">
            Mahsulotlarni ko'rish
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="/contact" className="inline-flex items-center justify-center border border-border bg-background px-7 py-4 font-mono-tac text-xs font-bold uppercase hover:border-orange hover:text-orange clip-tac">
            Maslahat olish
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function SectionEyebrow({ text }: { text: string }) {
  return <div className="font-mono-tac text-[11px] uppercase tracking-wider text-orange">{text}</div>;
}

function CatalogHeader({ mobileOpen, onMobileToggle, onCartOpen, settings }: { mobileOpen: boolean; onMobileToggle: () => void; onCartOpen: () => void; settings: ApiSettings }) {
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
            <a key={item.href} href={item.href} className={`px-4 py-2 font-mono-tac text-sm uppercase tracking-wider transition-colors ${item.href === "/catalog" ? "text-orange" : "text-muted-foreground hover:text-orange"}`}>
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
          <button type="button" aria-label={mobileOpen ? "Mobil menyuni yopish" : "Mobil menyuni ochish"} aria-controls="catalog-mobile-menu" aria-expanded={mobileOpen} onClick={onMobileToggle} className="flex h-10 items-center justify-center gap-2 border border-border bg-panel px-3 text-foreground transition-colors clip-tac hover:border-orange hover:bg-secondary hover:text-orange lg:hidden">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="hidden font-mono-tac text-[10px] font-bold uppercase tracking-wider sm:inline">{mobileOpen ? "Yopish" : "Menyu"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function CatalogMobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div id="catalog-mobile-menu" className="fixed inset-x-0 bottom-[calc(74px+env(safe-area-inset-bottom))] top-[72px] z-40 overflow-y-auto border-t border-border bg-background/98 backdrop-blur-xl lg:hidden">
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
            <a key={item.href} href={item.href} onClick={onClose} className={`group min-h-20 border p-4 transition-colors clip-tac ${item.href === "/catalog" ? "border-orange bg-orange text-ink" : "border-border bg-panel hover:border-orange hover:bg-secondary"}`}>
              <div className={`font-mono-tac text-[10px] ${item.href === "/catalog" ? "text-ink/70" : "text-orange"}`}>{String(index + 1).padStart(2, "0")}</div>
              <div className={`mt-3 font-display text-lg font-bold ${item.href === "/catalog" ? "text-ink" : "text-foreground group-hover:text-orange"}`}>{item.label}</div>
            </a>
          ))}
        </div>
        <div className="border border-border bg-panel p-4 clip-tac">
          <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">Til tanlash</div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {languages.map((language) => (
              <button key={language.code} type="button" disabled={!language.enabled} className={`px-3 py-3 font-mono-tac text-[11px] font-bold uppercase clip-tac ${language.enabled ? "bg-orange text-ink" : "border border-border text-muted-foreground/60"}`}>
                {language.code}
              </button>
            ))}
          </div>
        </div>
        <a href="/products" onClick={onClose} className="inline-flex w-full items-center justify-center gap-3 bg-orange px-6 py-4 font-mono-tac text-sm font-bold uppercase tracking-wider text-ink clip-tac glow-orange-hover">
          Mahsulotlarni ko'rish <ArrowRight className="h-4 w-4" />
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

function CatalogMobileBottomBar({ menuOpen, onMenuToggle, onNavigate, onCartOpen }: { menuOpen: boolean; onMenuToggle: () => void; onNavigate: () => void; onCartOpen: () => void }) {
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
          <a key={item.label} href={item.href} onClick={onNavigate} className={`flex min-h-14 flex-col items-center justify-center gap-1 font-mono-tac text-[9px] uppercase tracking-wider transition-colors clip-tac ${item.href === "/catalog" ? "bg-orange font-bold text-ink" : "text-muted-foreground hover:bg-panel hover:text-orange"}`}>
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
