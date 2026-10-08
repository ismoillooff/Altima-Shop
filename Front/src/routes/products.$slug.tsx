import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Droplet,
  Gauge,
  Heart,
  Home,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Search,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Target,
  Truck,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { OrderModal } from "@/components/OrderModal";
import { useCart } from "@/lib/cart";
import {
  fetchProductBySlug,
  fetchRelatedProducts,
  fetchSettings,
  type ApiProduct,
  type ApiProductImage,
  type ApiSettings,
} from "@/lib/api";
import bootCombat from "@/assets/boot-combat.jpg";
import bootTactical from "@/assets/boot-tactical.jpg";
import bootDesert from "@/assets/boot-desert.jpg";
import bootWinter from "@/assets/boot-winter.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import catOutdoor from "@/assets/cat-outdoor.jpg";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    try {
      const product = await fetchProductBySlug(params.slug);
      if (!product) return { product: null, related: [] as ApiProduct[] };
      const related = await fetchRelatedProducts(product.category, product.id).catch(() => [] as ApiProduct[]);
      return { product, related };
    } catch {
      return { product: null, related: [] as ApiProduct[] };
    }
  },
  head: ({ params, loaderData }) => {
    const product = loaderData?.product ?? null;
    const title = product ? `${product.name} | ALTIMA SHOP` : `${formatSlugTitle(params.slug)} | ALTIMA SHOP`;
    const description = product?.description?.trim()
      || `ALTIMA SHOP "${product?.name ?? formatSlugTitle(params.slug)}" mahsuloti: narx, ombor, texnik xususiyatlar va o'lchamlar.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        ...(product?.image_src ? [{ property: "og:image", content: product.image_src }] : []),
      ],
    };
  },
  component: ProductDetailPage,
});

const fallbackImages = [bootCombat, bootTactical, bootDesert, bootWinter, product1, product2, product3, product4, catOutdoor];
const sizes = ["40", "41", "42", "43", "44", "45", "46"];

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

const navLinks = [
  { label: "Bosh sahifa", href: "/" },
  { label: "Biz haqimizda", href: "/about" },
  { label: "Katalog", href: "/catalog" },
  { label: "Mahsulotlar", href: "/products" },
  { label: "Contact", href: "/contact" },
];

const trustBlocks: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Truck, title: "Tez yetkazib berish", text: "Toshkent bo'ylab 24 soat, viloyatlarga 2-4 kun ichida yetkazamiz." },
  { icon: Shield, title: "Mil-spec sifat", text: "Har bir model harbiy darajadagi sinovdan o'tkazilgan." },
  { icon: PackageCheck, title: "14 kun almashtirish", text: "O'lcham yoki model mos kelmasa, ishlatilmagan holatda almashtiramiz." },
  { icon: Award, title: "Rasmiy kafolat", text: "18 oy ichida ishlab chiqarish nuqsoni bo'lsa, bepul ta'mirlash." },
];

const defaultSpecs: Array<{ label: string; value: string }> = [
  { label: "Vazn", value: "640 g" },
  { label: "Material", value: "Cordura 1000D" },
  { label: "Taglik", value: "Vibram MIL" },
  { label: "Himoya", value: "IP67" },
];

const reveal = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value);
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function formatSlugTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Mahsulot";
}

function fallbackImage(index: number) {
  return fallbackImages[index % fallbackImages.length];
}

function discountPercent(price: number, old: number) {
  if (!old || old <= price) return 0;
  return Math.round(((old - price) / old) * 100);
}

function getSpecsList(product: ApiProduct): Array<{ label: string; value: string }> {
  const specs = product.specs;
  if (specs && typeof specs === "object" && !Array.isArray(specs)) {
    const entries = Object.entries(specs).filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "");
    if (entries.length) {
      return entries.map(([label, value]) => ({ label, value: String(value) }));
    }
  }
  return defaultSpecs;
}

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const product = loaderData?.product ?? null;
  const related = loaderData?.related ?? [];
  const [settings, setSettings] = useState<ApiSettings>(fallbackSettings);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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
      .catch(() => {
        // keep fallback
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [slug]);

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground antialiased lg:pb-0">
      <ProductHeader
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((open) => !open)}
        onCartOpen={() => setCartOpen(true)}
        settings={settings}
      />
      <ProductMobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        settings={settings}
      />
      <ProductBottomBar
        menuOpen={mobileOpen}
        onMenuToggle={() => setMobileOpen((open) => !open)}
        onNavigate={() => setMobileOpen(false)}
        onCartOpen={() => setCartOpen(true)}
      />

      <div className="mx-auto max-w-[1500px] px-4 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pt-12">
        <Breadcrumb product={product} slug={slug} />
      </div>

      {!product ? (
        <ProductNotFound slug={slug} />
      ) : (
        <ProductBody product={product} related={related} onCartOpen={() => setCartOpen(true)} />
      )}

      <SiteFooter settings={settings} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}

/* ----------------------------- BREADCRUMB ----------------------------- */

function Breadcrumb({ product, slug }: { product: ApiProduct | null; slug: string }) {
  const label = product?.name ?? formatSlugTitle(slug);
  return (
    <nav aria-label="Sahifa joylashuvi" className="flex flex-wrap items-center gap-2 font-mono-tac text-[11px] uppercase tracking-wider text-muted-foreground">
      <Link to="/" className="hover:text-orange transition-colors">Bosh</Link>
      <ChevronRight className="h-3 w-3" />
      <Link to="/products" className="hover:text-orange transition-colors">Mahsulotlar</Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-orange line-clamp-1 max-w-[220px] sm:max-w-none">{label}</span>
    </nav>
  );
}

/* -------------------------------- BODY -------------------------------- */

function ProductBody({ product, related, onCartOpen }: { product: ApiProduct; related: ApiProduct[]; onCartOpen: () => void }) {
  const galleryImages = useMemo(() => buildGallery(product), [product]);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string>(sizes[2]);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    setActiveImage(0);
    setSize(sizes[2]);
    setQuantity(1);
    setFeedback(null);
    setOrderOpen(false);
  }, [product.id]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 2400);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const tags = product.tags?.length ? product.tags : [product.category_name || "ALTIMA"];
  const discount = discountPercent(product.price, product.old_price);
  const specs = getSpecsList(product);
  const inStock = product.stock > 0 && product.status === "active";
  const maxQuantity = Math.max(1, Math.min(product.stock || 1, 12));
  const currentImage = galleryImages[activeImage] ?? galleryImages[0];

  const adjustQuantity = (delta: number) => {
    setQuantity((value) => Math.max(1, Math.min(maxQuantity, value + delta)));
  };

  const handleAddToCart = () => {
    if (!inStock) {
      setFeedback("Mahsulot ombordan tugagan");
      return;
    }
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: currentImage,
      size,
      quantity,
    });
    setFeedback(`Savatga qo'shildi · O'lcham ${size}`);
  };

  const orderLines = useMemo(
    () => [
      {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity,
        size,
      },
    ],
    [product.id, product.name, product.price, product.sku, quantity, size],
  );

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.name, url });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setFeedback("Havola nusxalandi");
    } catch {
      setFeedback("Havolani nusxalashda xatolik");
    }
  };

  return (
    <article className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
      <section className="grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-10">
        <Gallery
          name={product.name}
          images={galleryImages}
          activeIndex={activeImage}
          onSelect={setActiveImage}
          discount={discount}
          hot={product.hot}
        />

        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="flex flex-col gap-4 sm:gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono-tac text-[10px] uppercase tracking-wider text-orange sm:gap-3 sm:text-[11px]">
              <span>ALTIMA · {product.sku}</span>
              <span className="text-muted-foreground/60">|</span>
              <span className="text-muted-foreground">{product.category_name}</span>
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold leading-[0.98] tracking-tight text-balance sm:mt-4 sm:text-4xl lg:text-6xl">
              {product.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm sm:mt-4 sm:gap-3">
              <span className="inline-flex items-center gap-1 font-mono-tac text-foreground">
                <Star className="h-3.5 w-3.5 fill-orange text-orange sm:h-4 sm:w-4" />
                {Number(product.rating || 4.8).toFixed(1)}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className={`inline-flex items-center gap-2 font-mono-tac text-[10px] uppercase tracking-wider sm:text-xs ${inStock ? "text-orange" : "text-destructive"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-orange pulse-dot" : "bg-destructive"}`} />
                {inStock ? `Omborda ${product.stock} dona` : "Ombordan tugagan"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tags.map((tag) => (
              <span key={tag} className="border border-orange/60 bg-orange/10 px-2.5 py-1 font-mono-tac text-[9px] font-bold uppercase tracking-wider text-orange clip-tac sm:px-3 sm:py-1.5 sm:text-[10px]">
                {tag}
              </span>
            ))}
          </div>

          <div className="border border-border bg-panel p-4 clip-tac sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
              <div>
                <div className="font-mono-tac text-[10px] uppercase tracking-wider text-muted-foreground">Narx</div>
                <div className="mt-1 flex items-baseline gap-2 sm:mt-2 sm:gap-3">
                  <span className="font-display text-3xl font-bold text-orange sm:text-4xl lg:text-5xl">{formatPrice(product.price)}</span>
                  <span className="font-mono-tac text-xs text-muted-foreground sm:text-sm">so'm</span>
                </div>
                {product.old_price > 0 && product.old_price > product.price && (
                  <div className="mt-2 flex items-center gap-2 font-mono-tac text-xs sm:gap-3 sm:text-sm">
                    <span className="text-muted-foreground line-through">{formatPrice(product.old_price)} so'm</span>
                    <span className="bg-destructive/15 px-2 py-0.5 text-[10px] font-bold uppercase text-destructive sm:text-xs">
                      -{discount}%
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right font-mono-tac text-[10px] uppercase tracking-wider text-muted-foreground">
                <div>Jami</div>
                <div className="mt-1 font-display text-lg font-bold text-foreground sm:text-2xl">
                  {formatPrice(product.price * quantity)} <span className="text-xs text-muted-foreground">so'm</span>
                </div>
              </div>
            </div>
          </div>

          <SizeSelector value={size} onChange={setSize} />

          <div className="grid gap-2 sm:grid-cols-[176px_1fr_1fr_auto_auto] sm:items-stretch sm:gap-3">
            <div className="flex h-12 w-full items-center justify-between gap-2 border border-border bg-panel px-2 clip-tac sm:h-14 sm:w-44 sm:px-3">
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                disabled={quantity <= 1}
                aria-label="Sonni kamaytirish"
                className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-orange disabled:opacity-40 sm:h-10 sm:w-10"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-display text-xl font-bold tabular-nums sm:text-2xl">{quantity}</span>
              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                disabled={quantity >= maxQuantity}
                aria-label="Sonni oshirish"
                className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-orange disabled:opacity-40 sm:h-10 sm:w-10"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="group inline-flex h-12 min-w-0 items-center justify-center gap-2 border border-orange bg-orange/15 px-4 font-mono-tac text-[11px] font-bold uppercase tracking-wider text-orange clip-tac transition-all hover:bg-orange/25 disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70 sm:h-14 sm:gap-3 sm:px-5 sm:text-xs"
            >
              <ShoppingBag className="h-4 w-4" />
              {inStock ? "Savatga qo'shish" : "Mavjud emas"}
              {inStock && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
            <button
              type="button"
              onClick={() => setOrderOpen(true)}
              disabled={!inStock}
              className="group inline-flex h-12 min-w-0 items-center justify-center gap-2 bg-orange px-4 font-mono-tac text-[11px] font-bold uppercase tracking-wider text-ink clip-tac transition-all glow-orange-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70 sm:h-14 sm:gap-3 sm:px-5 sm:text-xs"
            >
              <Phone className="h-4 w-4" />
              Buyurtma berish
              {inStock && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
            <button
              type="button"
              onClick={() => setFavorite((value) => !value)}
              aria-label={favorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
              className={`flex h-12 w-12 items-center justify-center border border-border bg-panel transition-colors clip-tac sm:h-14 sm:w-14 ${
                favorite ? "border-orange text-orange" : "text-muted-foreground hover:border-orange hover:text-orange"
              }`}
            >
              <Heart className={`h-5 w-5 ${favorite ? "fill-orange" : ""}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Mahsulotni ulashish"
              className="flex h-12 w-12 items-center justify-center border border-border bg-panel text-muted-foreground transition-colors hover:border-orange hover:text-orange clip-tac sm:h-14 sm:w-14"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {feedback && (
            <button
              type="button"
              onClick={onCartOpen}
              className="flex items-center justify-between gap-3 border border-orange/40 bg-orange/10 px-4 py-3 text-left font-mono-tac text-[11px] uppercase tracking-wider text-orange transition-colors hover:bg-orange/15 clip-tac sm:text-xs"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {feedback}
              </span>
              <span className="hidden items-center gap-1 sm:inline-flex">
                Savatni ko'rish
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <InfoTile icon={PackageCheck} label="Ombor" value={`${product.stock} dona`} />
            <InfoTile icon={Shield} label="Holat" value={statusLabel(product.status)} />
            <InfoTile icon={Gauge} label="Reyting" value={Number(product.rating || 4.8).toFixed(1)} />
          </div>
        </motion.div>
      </section>

      <DescriptionSection product={product} specs={specs} />
      <TrustGrid />
      {related.length > 0 && <RelatedProducts items={related} />}
      <OrderModal
        open={orderOpen}
        title="Mahsulotni buyurtma qilish"
        lines={orderLines}
        onClose={() => setOrderOpen(false)}
        onSuccess={() => {
          setFeedback("Buyurtma qabul qilindi");
        }}
      />
    </article>
  );
}

/* ------------------------------- GALLERY ------------------------------ */

function Gallery({
  name,
  images,
  activeIndex,
  onSelect,
  discount,
  hot,
}: {
  name: string;
  images: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  discount: number;
  hot: boolean;
}) {
  const visible = images[activeIndex] ?? images[0];

  return (
    <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-3 sm:space-y-4">
      <div className="relative aspect-square overflow-hidden border border-border bg-ink clip-tac lg:aspect-[5/6]">
        <motion.img
          key={visible}
          src={visible}
          alt={name}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {hot && (
            <span className="bg-orange px-2 py-0.5 font-mono-tac text-[9px] font-bold uppercase tracking-wider text-ink sm:px-3 sm:py-1 sm:text-[10px]">
              Hot
            </span>
          )}
          {discount > 0 && (
            <span className="bg-destructive px-2 py-0.5 font-mono-tac text-[9px] font-bold uppercase tracking-wider text-destructive-foreground sm:px-3 sm:py-1 sm:text-[10px]">
              -{discount}%
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono-tac uppercase tracking-wider text-white/85 sm:bottom-4 sm:left-4 sm:right-4 sm:text-[10px]">
          <span>ALTIMA · DETAIL VIEW</span>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        </div>
      </div>
      {images.length > 1 && (
        <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Galereyadagi ${index + 1}-rasm`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden border bg-ink transition-colors clip-tac sm:h-24 sm:w-24 ${
                index === activeIndex ? "border-orange" : "border-border hover:border-orange/70"
              }`}
            >
              <img src={image} alt={`${name} ${index + 1}`} className="h-full w-full object-cover" />
              {index === activeIndex && <div className="absolute inset-0 ring-2 ring-orange ring-offset-2 ring-offset-background" />}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "top-3 left-3 border-t-2 border-l-2",
    tr: "top-3 right-3 border-t-2 border-r-2",
    bl: "bottom-3 left-3 border-b-2 border-l-2",
    br: "bottom-3 right-3 border-b-2 border-r-2",
  } as const;
  return <div className={`absolute h-5 w-5 border-orange ${map[pos]}`} />;
}

/* ----------------------------- SIZE SELECTOR -------------------------- */

function SizeSelector({ value, onChange }: { value: string; onChange: (size: string) => void }) {
  return (
    <div className="border border-border bg-panel p-3 clip-tac sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">O'lcham</div>
          <div className="mt-0.5 font-display text-base font-bold sm:mt-1 sm:text-xl">Sizga mos razmer</div>
        </div>
        <a href="#size-guide" className="font-mono-tac text-[9px] uppercase tracking-wider text-muted-foreground hover:text-orange transition-colors sm:text-[10px]">
          O'lcham jadvali
        </a>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5 sm:mt-4 sm:grid-cols-7 sm:gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            aria-pressed={value === size}
            className={`flex h-10 items-center justify-center font-mono-tac text-sm font-bold transition-colors clip-tac sm:h-11 ${
              value === size
                ? "bg-orange text-ink"
                : "border border-border bg-background text-foreground hover:border-orange hover:text-orange"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- INFO TILES ----------------------------- */

function InfoTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="border border-border bg-panel p-3 clip-tac sm:p-4">
      <Icon className="h-4 w-4 text-orange sm:h-5 sm:w-5" />
      <div className="mt-2 font-mono-tac text-[9px] uppercase tracking-wider text-muted-foreground sm:mt-3 sm:text-[10px]">{label}</div>
      <div className="mt-0.5 font-display text-base font-bold sm:mt-1 sm:text-xl">{value}</div>
    </div>
  );
}

function statusLabel(status: string) {
  switch (status) {
    case "active":
      return "Faol";
    case "draft":
      return "Qoralama";
    case "archived":
      return "Arxiv";
    default:
      return status;
  }
}

/* --------------------------- DESCRIPTION + SPECS ---------------------- */

function DescriptionSection({ product, specs }: { product: ApiProduct; specs: Array<{ label: string; value: string }> }) {
  return (
    <section id="size-guide" className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 lg:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} transition={{ duration: 0.55 }} className="border border-border bg-panel p-5 clip-tac sm:p-6 lg:p-8">
        <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">// 01 Tavsif</div>
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:mt-3 sm:text-3xl">{product.name} haqida</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
          {product.description?.trim() ||
            "Ushbu model professional xizmat va outdoor sharoitlari uchun mo'ljallangan. Suv o'tkazmas qoplama, kuchaytirilgan to'piq himoyasi va MIL-spec sertifikatlangan taglik bilan tayyorlangan."}
        </p>

        <div className="mt-5 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3">
          {[
            { icon: Droplet, title: "Suv o'tkazmas qoplama" },
            { icon: Zap, title: "Zarba yutuvchi qatlam" },
            { icon: Crosshair, title: "Taktik protektor" },
            { icon: Shield, title: "Kuchaytirilgan to'piq" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 border border-border bg-background p-3 clip-tac sm:p-4">
              <item.icon className="h-4 w-4 shrink-0 text-orange sm:h-5 sm:w-5" />
              <span className="font-mono-tac text-[11px] uppercase tracking-wider sm:text-xs">{item.title}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} transition={{ duration: 0.55, delay: 0.1 }} className="border border-border bg-background p-5 clip-tac sm:p-6 lg:p-8">
        <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">// 02 Texnik xarakteristika</div>
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:mt-3 sm:text-3xl">Taktik ko'rsatkichlar</h2>
        <dl className="mt-4 divide-y divide-border border-y border-border sm:mt-6">
          {specs.map((spec) => (
            <div key={`${spec.label}-${spec.value}`} className="flex items-center justify-between gap-3 py-2.5 font-mono-tac text-[13px] sm:py-3 sm:text-sm">
              <dt className="text-muted-foreground">{spec.label}</dt>
              <dd className="font-bold text-foreground">{spec.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-start gap-3 border border-orange/40 bg-orange/5 p-3 clip-tac sm:mt-6 sm:p-4">
          <Target className="h-4 w-4 shrink-0 text-orange mt-0.5 sm:h-5 sm:w-5" />
          <p className="font-mono-tac text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            Modelni harbiy va xavfsizlik xodimlari sinovdan o'tkazgan. O'lcham bo'yicha ikkilansangiz, qalin paypoq uchun bir razmer kattaroq tanlang.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------ TRUST GRID ---------------------------- */

function TrustGrid() {
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:mt-16 lg:grid-cols-4">
      {trustBlocks.map((block) => (
        <motion.div key={block.title} variants={reveal} transition={{ duration: 0.55 }} className="border border-border bg-panel p-4 clip-tac sm:p-6">
          <block.icon className="h-5 w-5 text-orange sm:h-6 sm:w-6" />
          <h3 className="mt-3 font-display text-base font-bold sm:mt-4 sm:text-xl">{block.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">{block.text}</p>
        </motion.div>
      ))}
    </motion.section>
  );
}

/* --------------------------- RELATED PRODUCTS ------------------------- */

function RelatedProducts({ items }: { items: ApiProduct[] }) {
  return (
    <section className="mt-12 sm:mt-16 lg:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
        <div>
          <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">// O'xshash modellar</div>
          <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:mt-3 sm:text-3xl lg:text-4xl">
            Shu kategoriyadagi <span className="text-orange">boshqa modellar.</span>
          </h2>
        </div>
        <Link to="/products" className="inline-flex items-center gap-2 border border-border bg-panel px-4 py-2.5 font-mono-tac text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-orange hover:text-orange clip-tac sm:px-5 sm:py-3 sm:text-xs">
          Barchasini ko'rish
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.div key={item.id} variants={reveal} transition={{ duration: 0.5 }}>
            <RelatedCard product={item} index={index} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function RelatedCard({ product, index }: { product: ApiProduct; index: number }) {
  const image = product.image_src || fallbackImage(index);
  const tags = product.tags?.length ? product.tags.slice(0, 2) : [product.category_name || "ALTIMA"];
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group flex h-full flex-col overflow-hidden border border-border bg-panel transition-colors hover:border-orange clip-tac"
    >
      <div className="relative aspect-square overflow-hidden bg-ink">
        <img src={image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute left-2 top-2 flex flex-col gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
          {tags.map((tag, tagIndex) => (
            <span
              key={tag}
              className={`border border-orange/60 px-1.5 py-0.5 font-mono-tac text-[8px] font-bold uppercase tracking-wider sm:px-2 sm:py-1 sm:text-[9px] ${
                tagIndex === 0 ? "bg-orange text-ink" : "bg-black/55 text-orange"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="font-mono-tac text-[9px] uppercase tracking-wider text-orange sm:text-[10px]">{product.sku}</div>
        <h3 className="font-display text-sm font-bold leading-tight group-hover:text-orange sm:text-lg">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="font-display text-base font-bold text-orange sm:text-xl">{formatPrice(product.price)}</div>
          <span className="inline-flex items-center gap-1 font-mono-tac text-[9px] uppercase tracking-wider text-muted-foreground sm:text-[10px]">
            <Star className="h-2.5 w-2.5 fill-orange text-orange sm:h-3 sm:w-3" />
            {Number(product.rating || 4.8).toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------- HEADER ------------------------------- */

function ProductHeader({
  mobileOpen,
  onMobileToggle,
  onCartOpen,
  settings,
}: {
  mobileOpen: boolean;
  onMobileToggle: () => void;
  onCartOpen: () => void;
  settings: ApiSettings;
}) {
  const { totalItems } = useCart();
  return (
    <>
      <div className="hidden border-b border-border bg-ink ink-surface md:block">
        <div className="mx-auto flex h-9 max-w-[1500px] items-center justify-between px-6 font-mono-tac text-[11px] uppercase tracking-wider text-muted-foreground lg:px-10">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange pulse-dot" />
            Tizim onlayn · 24/7
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" /> {settings.phone}
          </span>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-border bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[1500px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:gap-8 lg:px-10">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src="/icon.png" alt="ALTIMA" className="h-10 w-10 object-contain sm:h-14 sm:w-14" />
            <div>
              <div className="font-display text-base font-bold tracking-[0.15em] sm:text-xl">ALTIMA</div>
              <div className="font-mono-tac text-[8px] text-orange sm:text-[9px]">DO'KON · TAKTIK</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-4 py-2 font-mono-tac text-sm uppercase tracking-wider transition-colors ${
                  item.href === "/products" ? "text-orange" : "text-muted-foreground hover:text-orange"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={phoneHref(settings.phone)}
              className="hidden h-10 items-center justify-center gap-2 border border-border bg-panel px-4 font-mono-tac text-[10px] font-bold uppercase tracking-wider text-foreground transition-colors hover:border-orange hover:text-orange clip-tac sm:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" />
              {settings.phone}
            </a>
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
            <button
              type="button"
              aria-label={mobileOpen ? "Mobil menyuni yopish" : "Mobil menyuni ochish"}
              aria-controls="product-mobile-menu"
              aria-expanded={mobileOpen}
              onClick={onMobileToggle}
              className="flex h-10 items-center justify-center gap-2 border border-border bg-panel px-3 text-foreground transition-colors hover:border-orange hover:bg-secondary hover:text-orange clip-tac lg:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="hidden font-mono-tac text-[10px] font-bold uppercase tracking-wider sm:inline">
                {mobileOpen ? "Yopish" : "Menyu"}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function ProductMobileMenu({
  open,
  onClose,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  settings: ApiSettings;
}) {
  if (!open) return null;
  return (
    <div
      id="product-mobile-menu"
      className="fixed inset-x-0 top-[72px] bottom-[calc(74px+env(safe-area-inset-bottom))] z-40 overflow-y-auto border-t border-border bg-background/98 backdrop-blur-xl lg:hidden"
    >
      <div className="space-y-6 px-6 py-6">
        <div className="grid grid-cols-2 gap-2">
          {navLinks.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group min-h-20 border p-4 clip-tac transition-colors ${
                item.href === "/products" ? "border-orange bg-orange text-ink" : "border-border bg-panel hover:border-orange hover:bg-secondary"
              }`}
            >
              <div className={`font-mono-tac text-[10px] ${item.href === "/products" ? "text-ink/70" : "text-orange"}`}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className={`mt-3 font-display text-lg font-bold ${item.href === "/products" ? "text-ink" : "text-foreground group-hover:text-orange"}`}>
                {item.label}
              </div>
            </a>
          ))}
        </div>
        <div className="grid gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-orange mt-0.5" />
            <span>{settings.address}</span>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 shrink-0 text-orange mt-0.5" />
            <span>{settings.email}</span>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="h-4 w-4 shrink-0 text-orange mt-0.5" />
            <span>{settings.work_time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductBottomBar({
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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] lg:hidden">
      <nav className="pointer-events-auto grid w-full grid-cols-5 gap-1 border-t border-border bg-background/95 px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 font-mono-tac text-[9px] uppercase tracking-wider transition-colors clip-tac ${
              item.href === "/products" ? "bg-orange font-bold text-ink" : "text-muted-foreground hover:bg-panel hover:text-orange"
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
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Mobil menyuni yopish" : "Mobil menyuni ochish"}
          aria-expanded={menuOpen}
          className={`flex min-h-14 flex-col items-center justify-center gap-1 font-mono-tac text-[9px] uppercase tracking-wider transition-colors clip-tac ${
            menuOpen ? "bg-orange font-bold text-ink" : "text-muted-foreground hover:bg-panel hover:text-orange"
          }`}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>{menuOpen ? "Yopish" : "Menyu"}</span>
        </button>
      </nav>
    </div>
  );
}

/* ------------------------------ NOT FOUND ----------------------------- */

function ProductNotFound({ slug }: { slug: string }) {
  return (
    <section className="mx-auto flex max-w-[1500px] flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-10 lg:py-32">
      <div className="border border-orange/40 bg-orange/5 px-4 py-1.5 font-mono-tac text-[10px] uppercase tracking-wider text-orange clip-tac sm:text-[11px]">
        Mahsulot topilmadi
      </div>
      <h1 className="mt-4 max-w-3xl font-display text-2xl font-bold leading-tight sm:mt-6 sm:text-4xl lg:text-6xl">
        "{formatSlugTitle(slug)}" hozircha mavjud emas yoki <span className="text-orange">faol holatda emas.</span>
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
        Mahsulot bazadan o'chirilgan, hali e'lon qilinmagan yoki havola noto'g'ri bo'lishi mumkin. Mahsulotlar ro'yxatiga qaytib boshqa modellarni ko'rib chiqing.
      </p>
      <div className="mt-6 flex w-full flex-col gap-2 sm:mt-9 sm:w-auto sm:flex-row sm:gap-3">
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-3 bg-orange px-6 py-3.5 font-mono-tac text-[11px] font-bold uppercase tracking-wider text-ink clip-tac glow-orange-hover sm:px-7 sm:py-4 sm:text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          Mahsulotlarga qaytish
        </Link>
        <Link
          to="/catalog"
          className="inline-flex items-center justify-center gap-3 border border-border bg-panel px-6 py-3.5 font-mono-tac text-[11px] font-bold uppercase tracking-wider text-foreground transition-colors hover:border-orange hover:text-orange clip-tac sm:px-7 sm:py-4 sm:text-xs"
        >
          Katalogni ko'rish
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------ HELPERS ------------------------------- */

function buildGallery(product: ApiProduct): string[] {
  const fromApi = (product.gallery ?? [])
    .map((image: ApiProductImage) => image.image_src)
    .filter((value): value is string => Boolean(value && value.trim()));
  const hero = product.image_src ? [product.image_src] : [];
  const all = [...hero, ...fromApi];
  if (all.length) return Array.from(new Set(all));
  return [fallbackImage(product.id)];
}
