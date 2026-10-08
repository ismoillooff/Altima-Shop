import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import {
  BarChart3,
  Boxes,
  Check,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Eye,
  FileText,
  Grid3X3,
  Home,
  ImagePlus,
  LayoutDashboard,
  Megaphone,
  Moon,
  PackageCheck,
  Plus,
  Save,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sun,
  Trash2,
  Truck,
  Upload,
  X,
} from "lucide-react";
import heroTactical from "@/assets/hero-tactical.jpg";
import bootCombat from "@/assets/boot-combat.jpg";
import bootTactical from "@/assets/boot-tactical.jpg";
import bootDesert from "@/assets/boot-desert.jpg";
import bootWinter from "@/assets/boot-winter.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import {
  deleteResource,
  fetchCategories,
  fetchHeroSections,
  fetchOrders,
  fetchProducts,
  fetchSettings,
  saveResource,
  type ApiCategory,
  type ApiHero,
  type ApiOrder,
  type ApiProduct,
  type ApiSettings,
} from "@/lib/api";

export const Route = createFileRoute("/own")({
  head: () => ({
    meta: [
      { title: "Own Admin Panel | ALTIMA SHOP" },
      {
        name: "description",
        content:
          "ALTIMA SHOP uchun mahsulot, kategoriya, hero section va buyurtmalarni boshqarish paneli.",
      },
    ],
  }),
  component: OwnAdminPage,
});

type AdminTab = "overview" | "hero" | "products" | "categories" | "orders" | "settings";
type ProductStatus = "active" | "draft" | "archived";
type OrderStatus = "new" | "confirmed" | "shipping" | "done";
type ThemeMode = "light" | "dark";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
};

type Product = {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  price: number;
  oldPrice: number;
  stock: number;
  status: ProductStatus;
  tags: string;
  description: string;
  image: string;
};

type HeroContent = {
  eyebrow: string;
  headlineTop: string;
  headlineMiddle: string;
  headlineAccent: string;
  headlineMuted: string;
  headlineAfterMuted: string;
  headlineItalic: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  badge: string;
  topLeftMeta: string;
  topSecondMeta: string;
  topRightMeta: string;
  statOneValue: string;
  statOneLabel: string;
  statTwoValue: string;
  statTwoLabel: string;
  statThreeValue: string;
  statThreeLabel: string;
  image: string;
  imageKicker: string;
  imageModelCode: string;
  imageStatus: string;
  specsTitle: string;
  specOneLabel: string;
  specOneValue: string;
  specTwoLabel: string;
  specTwoValue: string;
  specThreeLabel: string;
  specThreeValue: string;
  specFourLabel: string;
  specFourValue: string;
  featuredKicker: string;
  featuredName: string;
  featuredTagOne: string;
  featuredTagTwo: string;
  priceLabel: string;
  featuredPrice: string;
  isPublished: boolean;
};

type Order = {
  id: string;
  customer: string;
  phone: string;
  product: string;
  total: number;
  status: OrderStatus;
  city: string;
};

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Jangovar botinkalar",
    slug: "combat-boots",
    description: "Og'ir xizmat, patrul va himoya vazifalari uchun.",
    image: bootCombat,
    featured: true,
  },
  {
    id: 2,
    name: "Taktik xizmat",
    slug: "tactical-duty",
    description: "Kunlik xizmat, tez harakat va barqaror yurish uchun.",
    image: bootTactical,
    featured: true,
  },
  {
    id: 3,
    name: "Cho'l taktikasi",
    slug: "desert-tactical",
    description: "Issiq va changli sharoitda nafas oluvchi modellar.",
    image: bootDesert,
    featured: false,
  },
  {
    id: 4,
    name: "Qishki armiya",
    slug: "winter-army",
    description: "Sovuq, namlik va muzlagan sirt uchun issiq himoya.",
    image: bootWinter,
    featured: true,
  },
];

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Phantom Combat 8"',
    sku: "ALT-CB-08",
    categoryId: 1,
    price: 1890000,
    oldPrice: 2190000,
    stock: 87,
    status: "active",
    tags: "Suv o'tkazmas, Harbiy daraja",
    description: "Baland kesim, namlikdan himoya va og'ir xizmat uchun barqaror taglik.",
    image: bootCombat,
  },
  {
    id: 2,
    name: "Ranger Tactical Olive",
    sku: "ALT-TC-05",
    categoryId: 2,
    price: 2290000,
    oldPrice: 0,
    stock: 34,
    status: "active",
    tags: "Sirpanmaydi, Zarba yutadi",
    description: "Kunlik navbatchilik va dala harakati uchun yengil taktika modeli.",
    image: bootTactical,
  },
  {
    id: 3,
    name: "Desert Storm MK II",
    sku: "ALT-DS-02",
    categoryId: 3,
    price: 2090000,
    oldPrice: 2390000,
    stock: 52,
    status: "active",
    tags: "Cho'l, Nafas oladi",
    description: "Issiq hududlar, changli yo'l va uzoq yurish uchun tanlangan model.",
    image: bootDesert,
  },
  {
    id: 4,
    name: "Arctic Recon Winter",
    sku: "ALT-WT-11",
    categoryId: 4,
    price: 2590000,
    oldPrice: 0,
    stock: 19,
    status: "active",
    tags: "-40C, Qishki",
    description: "Sovuq havo, qor va muzda barqarorlik uchun qishki model.",
    image: bootWinter,
  },
  {
    id: 5,
    name: "Urban Patrol Mid",
    sku: "ALT-UP-04",
    categoryId: 2,
    price: 1690000,
    oldPrice: 1890000,
    stock: 64,
    status: "draft",
    tags: "Shahar, Yengil",
    description: "Shahar patruli va kundalik xizmat uchun pastroq profil.",
    image: product1,
  },
  {
    id: 6,
    name: "Recon Low Black",
    sku: "ALT-RL-09",
    categoryId: 2,
    price: 1490000,
    oldPrice: 0,
    stock: 41,
    status: "active",
    tags: "Tezkor, Past profil",
    description: "Tez harakat va yengil xizmat uchun qora taktika modeli.",
    image: product2,
  },
  {
    id: 7,
    name: "Guard Pro Leather",
    sku: "ALT-GP-12",
    categoryId: 1,
    price: 1990000,
    oldPrice: 2150000,
    stock: 55,
    status: "active",
    tags: "Teri, Xizmat",
    description: "Charm ko'rinish, mustahkam chok va uzoq xizmat uchun.",
    image: product3,
  },
  {
    id: 8,
    name: "Storm Runner GTX",
    sku: "ALT-SR-07",
    categoryId: 3,
    price: 2190000,
    oldPrice: 0,
    stock: 33,
    status: "active",
    tags: "Yomg'ir, Ushlash",
    description: "Nam yo'l va tezkor outdoor harakatlar uchun tayyorlangan model.",
    image: product4,
  },
];

const initialOrders: Order[] = [
  {
    id: "ALT-2401",
    customer: "Jasur M.",
    phone: "+998 90 411 20 17",
    product: 'Phantom Combat 8"',
    total: 1890000,
    status: "new",
    city: "Toshkent",
  },
  {
    id: "ALT-2402",
    customer: "Kamol R.",
    phone: "+998 93 707 15 11",
    product: "Arctic Recon Winter",
    total: 2590000,
    status: "confirmed",
    city: "Samarqand",
  },
  {
    id: "ALT-2403",
    customer: "Bekzod A.",
    phone: "+998 97 019 44 88",
    product: "Ranger Tactical Olive",
    total: 2290000,
    status: "shipping",
    city: "Farg'ona",
  },
];

const initialHero: HeroContent = {
  eyebrow: "Vazifaga tayyor · Bahor kolleksiyasi 2026",
  headlineTop: "KUCH",
  headlineMiddle: "UCHUN",
  headlineAccent: "YARATILGAN.",
  headlineMuted: "XIZMAT",
  headlineAfterMuted: "UCHUN",
  headlineItalic: "SINOVDAN O'TGAN.",
  description:
    "Professional military, tactical va outdoor oyoq kiyimlar. Har bir model askar va xavfsizlik xodimlari uchun jangovor sharoitlarda sinovdan o'tgan.",
  primaryCta: "Katalogni ko'rish",
  secondaryCta: "Harbiy seriya",
  badge: "Vazifaga tayyor · Bahor kolleksiyasi 2026",
  topLeftMeta: "41'18N · 69'16'E",
  topSecondMeta: "OPS-2026-02",
  topRightMeta: "YOZUV",
  statOneValue: "15K+",
  statOneLabel: "Faol foydalanuvchi",
  statTwoValue: "MIL-SPEC",
  statTwoLabel: "Sertifikatlangan daraja",
  statThreeValue: "-40°C",
  statThreeLabel: "Sovuqda sinalgan",
  image: heroTactical,
  imageKicker: "Model",
  imageModelCode: "ALT-CB-08",
  imageStatus: "Jangga tayyor",
  specsTitle: "Taktik ko'rsatkichlar",
  specOneLabel: "Vazn",
  specOneValue: "640 g",
  specTwoLabel: "Material",
  specTwoValue: "Cordura 1000D",
  specThreeLabel: "Taglik",
  specThreeValue: "Vibram Mil",
  specFourLabel: "Himoya",
  specFourValue: "IP67",
  featuredKicker: "Tavsiya etilgan model",
  featuredName: "PHANTOM COMBAT 8”",
  featuredTagOne: "Suv o'tkazmas",
  featuredTagTwo: "Sirpanmaydi",
  priceLabel: "Narx",
  featuredPrice: "1 890 000",
  isPublished: true,
};

const navItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "hero", label: "Hero section", icon: Megaphone },
  { id: "products", label: "Mahsulotlar", icon: Boxes },
  { id: "categories", label: "Kategoriyalar", icon: Grid3X3 },
  { id: "orders", label: "Buyurtmalar", icon: ClipboardList },
  { id: "settings", label: "Sozlamalar", icon: Settings },
] satisfies Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }>;

const money = new Intl.NumberFormat("uz-UZ");

const emptyProduct = (categoryId: number): Product => ({
  id: 0,
  name: "",
  sku: "",
  categoryId,
  price: 0,
  oldPrice: 0,
  stock: 0,
  status: "draft",
  tags: "",
  description: "",
  image: "",
});

const emptyCategory: Category = {
  id: 0,
  name: "",
  slug: "",
  description: "",
  image: "",
  featured: false,
};

const fallbackProductImages = [bootCombat, bootTactical, bootDesert, bootWinter, product1, product2, product3, product4];
const fallbackCategoryImages = [bootCombat, bootTactical, bootDesert, bootWinter];

function mapApiCategory(category: ApiCategory, index: number): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image_src || fallbackCategoryImages[index % fallbackCategoryImages.length],
    featured: category.featured,
  };
}

function mapApiProduct(product: ApiProduct, index: number): Product {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    categoryId: Number(product.category ?? 1),
    price: product.price,
    oldPrice: product.old_price,
    stock: product.stock,
    status: product.status as ProductStatus,
    tags: product.tags?.join(", ") ?? "",
    description: product.description,
    image: product.image_src || fallbackProductImages[index % fallbackProductImages.length],
  };
}

function mapApiOrder(order: ApiOrder): Order {
  return {
    id: `ALT-${order.id}`,
    customer: order.customer,
    phone: order.phone,
    product: order.items?.[0]?.product_name || order.note || "Buyurtma",
    total: order.total,
    status: (order.status === "cancelled" ? "done" : order.status) as OrderStatus,
    city: order.city,
  };
}

function mapApiHero(hero: ApiHero): HeroContent {
  const stats = hero.stats ?? [];
  const specs = hero.specs ?? [];
  return {
    eyebrow: hero.eyebrow,
    headlineTop: hero.headline_top,
    headlineMiddle: hero.headline_middle,
    headlineAccent: hero.headline_accent,
    headlineMuted: hero.headline_muted,
    headlineAfterMuted: hero.headline_after_muted,
    headlineItalic: hero.headline_italic,
    description: hero.description,
    primaryCta: hero.primary_cta,
    secondaryCta: hero.secondary_cta,
    badge: hero.badge,
    topLeftMeta: hero.top_left_meta,
    topSecondMeta: hero.top_second_meta,
    topRightMeta: hero.top_right_meta,
    statOneValue: stats[0]?.value ?? initialHero.statOneValue,
    statOneLabel: stats[0]?.label ?? initialHero.statOneLabel,
    statTwoValue: stats[1]?.value ?? initialHero.statTwoValue,
    statTwoLabel: stats[1]?.label ?? initialHero.statTwoLabel,
    statThreeValue: stats[2]?.value ?? initialHero.statThreeValue,
    statThreeLabel: stats[2]?.label ?? initialHero.statThreeLabel,
    image: hero.image_src || heroTactical,
    imageKicker: hero.image_kicker,
    imageModelCode: hero.image_model_code,
    imageStatus: hero.image_status,
    specsTitle: hero.specs_title,
    specOneLabel: specs[0]?.label ?? initialHero.specOneLabel,
    specOneValue: specs[0]?.value ?? initialHero.specOneValue,
    specTwoLabel: specs[1]?.label ?? initialHero.specTwoLabel,
    specTwoValue: specs[1]?.value ?? initialHero.specTwoValue,
    specThreeLabel: specs[2]?.label ?? initialHero.specThreeLabel,
    specThreeValue: specs[2]?.value ?? initialHero.specThreeValue,
    specFourLabel: specs[3]?.label ?? initialHero.specFourLabel,
    specFourValue: specs[3]?.value ?? initialHero.specFourValue,
    featuredKicker: hero.featured_kicker,
    featuredName: hero.featured_name,
    featuredTagOne: hero.featured_tag_one,
    featuredTagTwo: hero.featured_tag_two,
    priceLabel: hero.price_label,
    featuredPrice: hero.featured_price,
    isPublished: hero.is_published,
  };
}

function settingsFromApi(settings: ApiSettings) {
  return {
    storeName: settings.site_name,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    mapEmbed: settings.map_embed || "",
    workTime: settings.work_time,
    deliveryEnabled: settings.enable_orders,
    publicCatalog: true,
    orderNotifications: settings.enable_notifications ?? true,
    telegramBotToken: settings.telegram_bot_token || "",
    telegramChatId: settings.telegram_chat_id || "",
  };
}

function dataUrlToFile(dataUrl: string, filename: string) {
  const [meta, content] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(content);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new File([bytes], filename, { type: mime });
}

function appendImage(form: FormData, image: string, filename: string) {
  if (image.startsWith("data:")) {
    form.append("image", dataUrlToFile(image, filename));
  } else if (image.startsWith("http")) {
    form.append("image_url", image);
  }
}

function productFormData(product: Product) {
  const form = new FormData();
  form.append("name", product.name);
  form.append("sku", product.sku);
  form.append("category", String(product.categoryId));
  form.append("price", String(product.price));
  form.append("old_price", String(product.oldPrice));
  form.append("stock", String(product.stock));
  form.append("status", product.status);
  form.append("tags", product.tags);
  form.append("description", product.description);
  appendImage(form, product.image, `${product.sku || "product"}.png`);
  return form;
}

function categoryFormData(category: Category) {
  const form = new FormData();
  form.append("name", category.name);
  form.append("slug", category.slug);
  form.append("description", category.description);
  form.append("featured", String(category.featured));
  form.append("is_active", "true");
  appendImage(form, category.image, `${category.slug || "category"}.png`);
  return form;
}

function heroFormData(hero: HeroContent) {
  const form = new FormData();
  form.append("eyebrow", hero.eyebrow);
  form.append("badge", hero.badge);
  form.append("headline_top", hero.headlineTop);
  form.append("headline_middle", hero.headlineMiddle);
  form.append("headline_accent", hero.headlineAccent);
  form.append("headline_muted", hero.headlineMuted);
  form.append("headline_after_muted", hero.headlineAfterMuted);
  form.append("headline_italic", hero.headlineItalic);
  form.append("description", hero.description);
  form.append("primary_cta", hero.primaryCta);
  form.append("secondary_cta", hero.secondaryCta);
  form.append("top_left_meta", hero.topLeftMeta);
  form.append("top_second_meta", hero.topSecondMeta);
  form.append("top_right_meta", hero.topRightMeta);
  form.append("image_kicker", hero.imageKicker);
  form.append("image_model_code", hero.imageModelCode);
  form.append("image_status", hero.imageStatus);
  form.append("specs_title", hero.specsTitle);
  form.append("stats", JSON.stringify([
    { value: hero.statOneValue, label: hero.statOneLabel },
    { value: hero.statTwoValue, label: hero.statTwoLabel },
    { value: hero.statThreeValue, label: hero.statThreeLabel },
  ]));
  form.append("specs", JSON.stringify([
    { label: hero.specOneLabel, value: hero.specOneValue },
    { label: hero.specTwoLabel, value: hero.specTwoValue },
    { label: hero.specThreeLabel, value: hero.specThreeValue },
    { label: hero.specFourLabel, value: hero.specFourValue },
  ]));
  form.append("featured_kicker", hero.featuredKicker);
  form.append("featured_name", hero.featuredName);
  form.append("featured_tag_one", hero.featuredTagOne);
  form.append("featured_tag_two", hero.featuredTagTwo);
  form.append("price_label", hero.priceLabel);
  form.append("featured_price", hero.featuredPrice);
  form.append("is_published", String(hero.isPublished));
  appendImage(form, hero.image, "hero.png");
  return form;
}

function OwnAdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("altima-theme") as ThemeMode | null) ?? "light";
  });
  const [hero, setHero] = useState<HeroContent>(initialHero);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [heroApiId, setHeroApiId] = useState<number | null>(null);
  const [settingsApiId, setSettingsApiId] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [productDraft, setProductDraft] = useState<Product>(emptyProduct(0));
  const [categoryDraft, setCategoryDraft] = useState<Category>(emptyCategory);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [settings, setSettings] = useState({
    storeName: "ALTIMA SHOP",
    phone: "+998 71 200 70 70",
    email: "ops@altimashop.uz",
    address: "Toshkent sh., Amir Temur ko'chasi 108",
    mapEmbed: "",
    workTime: "Dushanba-Yakshanba · 09:00-22:00",
    deliveryEnabled: true,
    publicCatalog: true,
    orderNotifications: true,
    telegramBotToken: "",
    telegramChatId: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadBackendData() {
      setLoadingData(true);
      const [categoryResult, productResult, heroResult, orderResult, settingsResult] = await Promise.allSettled([
        fetchCategories(),
        fetchProducts("?ordering=sort_order"),
        fetchHeroSections(),
        fetchOrders(),
        fetchSettings(),
      ]);

      if (cancelled) return;

      const apiCategories = categoryResult.status === "fulfilled" ? categoryResult.value : [];
      const apiProducts = productResult.status === "fulfilled" ? productResult.value : [];
      const apiHero = heroResult.status === "fulfilled" ? heroResult.value : [];
      const apiOrders = orderResult.status === "fulfilled" ? orderResult.value : [];
      const apiSettings = settingsResult.status === "fulfilled" ? settingsResult.value : [];
      const hasBackendData = categoryResult.status === "fulfilled" || productResult.status === "fulfilled" || heroResult.status === "fulfilled";

      try {
        const nextCategories = apiCategories.map(mapApiCategory);
        const nextProducts = apiProducts.map(mapApiProduct);
        if (nextCategories.length) {
          setCategories(nextCategories);
          setCategoryDraft(nextCategories[0]);
        }
        if (nextProducts.length) {
          setProducts(nextProducts);
          setProductDraft(nextProducts[0]);
        }
        if (apiHero[0]) {
          setHeroApiId(apiHero[0].id);
          setHero(mapApiHero(apiHero[0]));
        }
        if (apiOrders.length) {
          setOrders(apiOrders.map(mapApiOrder));
        }
        if (apiSettings[0]) {
          setSettingsApiId(apiSettings[0].id);
          setSettings(settingsFromApi(apiSettings[0]));
        }
        setBackendOnline(hasBackendData);
        showNotice(hasBackendData ? "Backend ma'lumotlari yuklandi." : "Backenddan ma'lumot kelmadi. Server va API URLni tekshiring.");
      } catch {
        if (!cancelled) {
          setBackendOnline(false);
          showNotice("Backend ma'lumotlarini o'qishda xatolik bor. API javob formatini tekshiring.");
        }
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    }

    loadBackendData();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => {
      const category = categories.find((item) => item.id === product.categoryId)?.name ?? "";
      return [product.name, product.sku, category, product.tags, product.status]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [categories, products, query]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const stock = products.reduce((sum, product) => sum + product.stock, 0);
    const activeProducts = products.filter((product) => product.status === "active").length;
    const lowStock = products.filter((product) => product.stock < 35).length;
    return { revenue, stock, activeProducts, lowStock };
  }, [orders, products]);

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: String(category.id),
  }));

  const showNotice = (message: string) => {
    setNotice(message);
  };

  const handleThemeToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("altima-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const saveProduct = async () => {
    const name = productDraft.name.trim();
    const sku = productDraft.sku.trim();
    if (!name || !sku) {
      showNotice("Mahsulot nomi va SKU majburiy.");
      return;
    }
    if (!productDraft.categoryId) {
      showNotice("Mahsulot kategoriyasini tanlang.");
      return;
    }
    if (!productDraft.price || productDraft.price <= 0) {
      showNotice("Mahsulot narxini kiriting.");
      return;
    }
    if (!productDraft.tags.trim()) {
      showNotice("Mahsulot teglarini kiriting.");
      return;
    }
    if (!productDraft.description.trim()) {
      showNotice("Mahsulot tavsifini kiriting.");
      return;
    }
    if (!productDraft.image) {
      showNotice("Mahsulot rasmini yuklang.");
      return;
    }

    try {
      if (backendOnline) {
        const saved = await saveResource<ApiProduct>(
          productDraft.id === 0 ? "/products/" : `/products/${productDraft.id}/`,
          productFormData(productDraft),
          productDraft.id === 0 ? "POST" : "PATCH",
        );
        const next = mapApiProduct(saved, 0);
        if (productDraft.id === 0) {
          setProducts((current) => [next, ...current]);
          setProductDraft(emptyProduct(0));
        } else {
          setProducts((current) => current.map((product) => (product.id === next.id ? next : product)));
          setProductDraft(next);
        }
        showNotice("Mahsulot backend bazasiga saqlandi.");
        return;
      }

      if (productDraft.id === 0) {
        const next = { ...productDraft, id: nextId(products) };
        setProducts((current) => [next, ...current]);
        setProductDraft(emptyProduct(0));
        showNotice("Yangi mahsulot local qo'shildi.");
        return;
      }

      setProducts((current) =>
        current.map((product) => (product.id === productDraft.id ? productDraft : product)),
      );
      showNotice("Mahsulot local saqlandi.");
    } catch (error) {
      showNotice(`Mahsulot saqlanmadi: ${error instanceof Error ? error.message : "backend xatosi"}`);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      if (backendOnline) {
        await deleteResource(`/products/${id}/`);
      }
      setProducts((current) => current.filter((product) => product.id !== id));
      setProductDraft(emptyProduct(0));
      showNotice("Mahsulot o'chirildi.");
    } catch (error) {
      showNotice(`Mahsulot o'chirilmadi: ${error instanceof Error ? error.message : "backend xatosi"}`);
    }
  };

  const saveCategory = async () => {
    const name = categoryDraft.name.trim();
    const slug = categoryDraft.slug.trim();
    if (!name || !slug) {
      showNotice("Kategoriya nomi va slug majburiy.");
      return;
    }
    if (!categoryDraft.description.trim()) {
      showNotice("Kategoriya tavsifini kiriting.");
      return;
    }
    if (!categoryDraft.image) {
      showNotice("Kategoriya rasmini yuklang.");
      return;
    }

    try {
      if (backendOnline) {
        const saved = await saveResource<ApiCategory>(
          categoryDraft.id === 0 ? "/categories/" : `/categories/${categoryDraft.id}/`,
          categoryFormData(categoryDraft),
          categoryDraft.id === 0 ? "POST" : "PATCH",
        );
        const next = mapApiCategory(saved, 0);
        if (categoryDraft.id === 0) {
          setCategories((current) => [next, ...current]);
          setCategoryDraft(emptyCategory);
        } else {
          setCategories((current) => current.map((category) => (category.id === next.id ? next : category)));
          setCategoryDraft(next);
        }
        showNotice("Kategoriya backend bazasiga saqlandi.");
        return;
      }

      if (categoryDraft.id === 0) {
        const next = { ...categoryDraft, id: nextId(categories) };
        setCategories((current) => [next, ...current]);
        setCategoryDraft(emptyCategory);
        showNotice("Yangi kategoriya local qo'shildi.");
        return;
      }

      setCategories((current) =>
        current.map((category) => (category.id === categoryDraft.id ? categoryDraft : category)),
      );
      showNotice("Kategoriya local saqlandi.");
    } catch (error) {
      showNotice(`Kategoriya saqlanmadi: ${error instanceof Error ? error.message : "backend xatosi"}`);
    }
  };

  const deleteCategory = async (id: number) => {
    if (products.some((product) => product.categoryId === id)) {
      showNotice("Bu kategoriyada mahsulot bor. Avval mahsulotlarni boshqa kategoriyaga o'tkazing.");
      return;
    }

    try {
      if (backendOnline) {
        await deleteResource(`/categories/${id}/`);
      }
      setCategories((current) => current.filter((category) => category.id !== id));
      setCategoryDraft(emptyCategory);
      showNotice("Kategoriya o'chirildi.");
    } catch (error) {
      showNotice(`Kategoriya o'chirilmadi: ${error instanceof Error ? error.message : "backend xatosi"}`);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const numericId = Number(id.replace("ALT-", ""));
    try {
      if (backendOnline && Number.isFinite(numericId)) {
        await saveResource<ApiOrder>(`/orders/${numericId}/`, { status }, "PATCH");
      }
      setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
      showNotice(`${id} buyurtma holati yangilandi.`);
    } catch (error) {
      showNotice(`Buyurtma yangilanmadi: ${error instanceof Error ? error.message : "backend xatosi"}`);
    }
  };

  const saveHero = async () => {
    try {
      if (backendOnline) {
        const saved = await saveResource<ApiHero>(
          heroApiId ? `/hero/${heroApiId}/` : "/hero/",
          heroFormData(hero),
          heroApiId ? "PATCH" : "POST",
        );
        setHeroApiId(saved.id);
        setHero(mapApiHero(saved));
        showNotice("Hero section backend bazasiga saqlandi.");
        return;
      }
      showNotice("Hero section local saqlandi. Backend ishga tushsa bazaga yoziladi.");
    } catch (error) {
      showNotice(`Hero saqlanmadi: ${error instanceof Error ? error.message : "backend xatosi"}`);
    }
  };

  const saveSettings = async () => {
    try {
      if (backendOnline) {
        const saved = await saveResource<ApiSettings>(
          settingsApiId ? `/settings/${settingsApiId}/` : "/settings/",
          {
            site_name: settings.storeName,
            phone: settings.phone,
            email: settings.email,
            address: settings.address,
            map_embed: settings.mapEmbed,
            work_time: settings.workTime,
            enable_orders: settings.deliveryEnabled,
            enable_notifications: settings.orderNotifications,
            telegram_bot_token: settings.telegramBotToken,
            telegram_chat_id: settings.telegramChatId,
          },
          settingsApiId ? "PATCH" : "POST",
        );
        setSettingsApiId(saved.id);
        setSettings(settingsFromApi(saved));
        showNotice("Umumiy sozlamalar backend bazasiga saqlandi.");
        return;
      }
      showNotice("Umumiy sozlamalar local saqlandi.");
    } catch (error) {
      showNotice(`Sozlamalar saqlanmadi: ${error instanceof Error ? error.message : "backend xatosi"}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-950 dark:bg-[#0d1117] dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[288px_1fr]">
        <aside className="border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="border-b border-slate-200 p-5 dark:border-slate-800">
              <a href="/" className="flex items-center gap-3">
                <img src="/icon.png" alt="ALTIMA" className="h-12 w-12 object-contain" />
                <div>
                  <div className="font-display text-xl font-bold">OWN PANEL</div>
                  <div className="text-xs font-semibold uppercase text-slate-500">ALTIMA CMS</div>
                </div>
              </a>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-semibold transition-colors ${
                    activeTab === item.id
                      ? "bg-slate-950 text-white dark:bg-orange dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className={`h-4 w-4 ${backendOnline ? "text-emerald-500" : "text-orange"}`} />
                  {backendOnline ? "Backend ulangan" : "Fallback rejim"}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {loadingData
                    ? "Ma'lumotlar bazadan yuklanmoqda..."
                    : backendOnline
                      ? "DBdagi ma'lumotlar ko'rsatiladi va amallar backendga yoziladi."
                      : "Backend ishga tushmaganida local preview ishlaydi."}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/88">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange">
                  Site management
                </div>
                <h1 className="mt-1 font-display text-3xl font-bold">
                  {navItems.find((item) => item.id === activeTab)?.label}
                </h1>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900 sm:w-96">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Mahsulot, SKU yoki kategoriya qidirish"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleThemeToggle}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  aria-label="Mavzuni almashtirish"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <a
                  href="/"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white dark:bg-orange dark:text-slate-950"
                >
                  <Home className="h-4 w-4" />
                  Saytni ko'rish
                </a>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1560px] px-4 py-6 sm:px-6">
            {notice && (
              <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {notice}
                </span>
                <button type="button" onClick={() => setNotice("")} aria-label="Xabarni yopish">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {activeTab === "overview" && (
              <OverviewPanel
                stats={stats}
                products={products}
                categories={categories}
                orders={orders}
                hero={hero}
              />
            )}
            {activeTab === "hero" && (
              <HeroEditor hero={hero} onHeroChange={setHero} onSaved={saveHero} />
            )}
            {activeTab === "products" && (
              <ProductsPanel
                products={filteredProducts}
                categories={categories}
                categoryOptions={categoryOptions}
                draft={productDraft}
                onDraftChange={setProductDraft}
                onNew={() => setProductDraft(emptyProduct(0))}
                onEdit={setProductDraft}
                onSave={saveProduct}
                onDelete={deleteProduct}
              />
            )}
            {activeTab === "categories" && (
              <CategoriesPanel
                categories={categories}
                products={products}
                draft={categoryDraft}
                onDraftChange={setCategoryDraft}
                onNew={() => setCategoryDraft(emptyCategory)}
                onEdit={setCategoryDraft}
                onSave={saveCategory}
                onDelete={deleteCategory}
              />
            )}
            {activeTab === "orders" && (
              <OrdersPanel orders={orders} onUpdateStatus={updateOrderStatus} />
            )}
            {activeTab === "settings" && (
              <SettingsPanel
                settings={settings}
                onSettingsChange={setSettings}
                onSave={saveSettings}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function OverviewPanel({
  stats,
  products,
  categories,
  orders,
  hero,
}: {
  stats: { revenue: number; stock: number; activeProducts: number; lowStock: number };
  products: Product[];
  categories: Category[];
  orders: Order[];
  hero: HeroContent;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Savdo hajmi" value={`${money.format(stats.revenue)} so'm`} />
        <StatCard icon={Boxes} label="Faol mahsulot" value={`${stats.activeProducts} ta`} />
        <StatCard icon={Grid3X3} label="Kategoriyalar" value={`${categories.length} ta`} />
        <StatCard icon={PackageCheck} label="Kam zaxira" value={`${stats.lowStock} model`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card title="Hero preview" icon={Megaphone}>
          <HeroPreviewCanvas>
            <HeroPreview hero={hero} compact />
          </HeroPreviewCanvas>
        </Card>

        <Card title="Tezkor holat" icon={BarChart3}>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold">{order.id} / {order.customer}</div>
                    <div className="mt-1 text-sm text-slate-500">{order.product} / {order.city}</div>
                  </div>
                  <Badge>{orderStatusLabel(order.status)}</Badge>
                </div>
              </div>
            ))}
            <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-900">
              <div className="text-sm font-semibold">Omborda jami: {stats.stock} dona</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-[72%] rounded-full bg-orange" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Mahsulot signal kartalari" icon={SlidersHorizontal}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductMiniCard key={product.id} product={product} category={categories.find((item) => item.id === product.categoryId)?.name ?? "-"} />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

function HeroEditor({
  hero,
  onHeroChange,
  onSaved,
}: {
  hero: HeroContent;
  onHeroChange: (hero: HeroContent) => void;
  onSaved: () => void;
}) {
  return (
    <div className="grid gap-6 2xl:grid-cols-[0.82fr_1.18fr]">
      <div className="space-y-6">
        <Card title="Umumiy hero yozuvlari" icon={Megaphone}>
          <div className="space-y-5">
            <EditorGroup title="Yuqori meta yozuvlar" description="Hero yuqorisidagi koordinata, operatsiya kodi va o'ngdagi kichik indikator.">
              <div className="grid gap-4 md:grid-cols-3">
                <TextInput label="Chap yuqori meta" value={hero.topLeftMeta} onChange={(value) => onHeroChange({ ...hero, topLeftMeta: value })} />
                <TextInput label="Ikkinchi meta" value={hero.topSecondMeta} onChange={(value) => onHeroChange({ ...hero, topSecondMeta: value })} />
                <TextInput label="O'ng yuqori yozuv" value={hero.topRightMeta} onChange={(value) => onHeroChange({ ...hero, topRightMeta: value })} />
              </div>
            </EditorGroup>

            <EditorGroup title="Badge va kirish matni" description="Katta sarlavha ustidagi chip va yordamchi yozuvlar.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput label="Badge / yuqori chip" value={hero.badge} onChange={(value) => onHeroChange({ ...hero, badge: value })} />
                <TextInput label="Eyebrow" value={hero.eyebrow} onChange={(value) => onHeroChange({ ...hero, eyebrow: value })} />
              </div>
            </EditorGroup>

            <EditorGroup title="Katta headline" description="Screenshotdagi yirik tipografiya satrlarini alohida boshqarish.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput label="1-qator" value={hero.headlineTop} onChange={(value) => onHeroChange({ ...hero, headlineTop: value })} />
                <TextInput label="2-qator" value={hero.headlineMiddle} onChange={(value) => onHeroChange({ ...hero, headlineMiddle: value })} />
                <TextInput label="Orange qator" value={hero.headlineAccent} onChange={(value) => onHeroChange({ ...hero, headlineAccent: value })} />
                <TextInput label="Kulrang so'z" value={hero.headlineMuted} onChange={(value) => onHeroChange({ ...hero, headlineMuted: value })} />
                <TextInput label="Kulrangdan keyingi so'z" value={hero.headlineAfterMuted} onChange={(value) => onHeroChange({ ...hero, headlineAfterMuted: value })} />
                <TextInput label="Italic qator" value={hero.headlineItalic} onChange={(value) => onHeroChange({ ...hero, headlineItalic: value })} />
              </div>
            </EditorGroup>

            <EditorGroup title="Tavsif va tugmalar" description="Hero ostidagi matn va ikkita asosiy chaqiriq tugmasi.">
              <div className="grid gap-4">
                <TextArea label="Hero tavsifi" value={hero.description} onChange={(value) => onHeroChange({ ...hero, description: value })} />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextInput label="Asosiy button" value={hero.primaryCta} onChange={(value) => onHeroChange({ ...hero, primaryCta: value })} />
                  <TextInput label="Ikkinchi button" value={hero.secondaryCta} onChange={(value) => onHeroChange({ ...hero, secondaryCta: value })} />
                </div>
              </div>
            </EditorGroup>
          </div>
        </Card>

        <Card title="Statistika yozuvlari" icon={BarChart3}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput label="Stat 1 qiymat" value={hero.statOneValue} onChange={(value) => onHeroChange({ ...hero, statOneValue: value })} />
            <TextInput label="Stat 2 qiymat" value={hero.statTwoValue} onChange={(value) => onHeroChange({ ...hero, statTwoValue: value })} />
            <TextInput label="Stat 3 qiymat" value={hero.statThreeValue} onChange={(value) => onHeroChange({ ...hero, statThreeValue: value })} />
            <TextInput label="Stat 1 label" value={hero.statOneLabel} onChange={(value) => onHeroChange({ ...hero, statOneLabel: value })} />
            <TextInput label="Stat 2 label" value={hero.statTwoLabel} onChange={(value) => onHeroChange({ ...hero, statTwoLabel: value })} />
            <TextInput label="Stat 3 label" value={hero.statThreeLabel} onChange={(value) => onHeroChange({ ...hero, statThreeLabel: value })} />
          </div>
        </Card>

        <Card title="Rasm va rasm usti yozuvlari" icon={ImagePlus}>
          <div className="grid gap-4">
            <ImageUploader label="Hero rasmi upload" image={hero.image} onImageChange={(image) => onHeroChange({ ...hero, image })} />
            <div className="grid gap-4 md:grid-cols-3">
              <TextInput label="Rasm kicker" value={hero.imageKicker} onChange={(value) => onHeroChange({ ...hero, imageKicker: value })} />
              <TextInput label="Model kodi" value={hero.imageModelCode} onChange={(value) => onHeroChange({ ...hero, imageModelCode: value })} />
              <TextInput label="Rasm statusi" value={hero.imageStatus} onChange={(value) => onHeroChange({ ...hero, imageStatus: value })} />
            </div>
            <TextInput label="Specs karta sarlavhasi" value={hero.specsTitle} onChange={(value) => onHeroChange({ ...hero, specsTitle: value })} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Spec 1 nomi" value={hero.specOneLabel} onChange={(value) => onHeroChange({ ...hero, specOneLabel: value })} />
              <TextInput label="Spec 1 qiymati" value={hero.specOneValue} onChange={(value) => onHeroChange({ ...hero, specOneValue: value })} />
              <TextInput label="Spec 2 nomi" value={hero.specTwoLabel} onChange={(value) => onHeroChange({ ...hero, specTwoLabel: value })} />
              <TextInput label="Spec 2 qiymati" value={hero.specTwoValue} onChange={(value) => onHeroChange({ ...hero, specTwoValue: value })} />
              <TextInput label="Spec 3 nomi" value={hero.specThreeLabel} onChange={(value) => onHeroChange({ ...hero, specThreeLabel: value })} />
              <TextInput label="Spec 3 qiymati" value={hero.specThreeValue} onChange={(value) => onHeroChange({ ...hero, specThreeValue: value })} />
              <TextInput label="Spec 4 nomi" value={hero.specFourLabel} onChange={(value) => onHeroChange({ ...hero, specFourLabel: value })} />
              <TextInput label="Spec 4 qiymati" value={hero.specFourValue} onChange={(value) => onHeroChange({ ...hero, specFourValue: value })} />
            </div>
          </div>
        </Card>

        <Card title="Pastki mahsulot overlay" icon={PackageCheck}>
          <div className="grid gap-4">
            <TextInput label="Overlay kicker" value={hero.featuredKicker} onChange={(value) => onHeroChange({ ...hero, featuredKicker: value })} />
            <TextInput label="Overlay mahsulot nomi" value={hero.featuredName} onChange={(value) => onHeroChange({ ...hero, featuredName: value })} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Tag 1" value={hero.featuredTagOne} onChange={(value) => onHeroChange({ ...hero, featuredTagOne: value })} />
              <TextInput label="Tag 2" value={hero.featuredTagTwo} onChange={(value) => onHeroChange({ ...hero, featuredTagTwo: value })} />
              <TextInput label="Narx label" value={hero.priceLabel} onChange={(value) => onHeroChange({ ...hero, priceLabel: value })} />
              <TextInput label="Narx" value={hero.featuredPrice} onChange={(value) => onHeroChange({ ...hero, featuredPrice: value })} />
            </div>
            <ToggleLine label="Hero publish qilingan" checked={hero.isPublished} onChange={() => onHeroChange({ ...hero, isPublished: !hero.isPublished })} />
            <button type="button" onClick={onSaved} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white dark:bg-orange dark:text-slate-950">
              <Save className="h-4 w-4" />
              Hero sectionni saqlash
            </button>
          </div>
        </Card>
      </div>

      <div className="2xl:sticky 2xl:top-28 2xl:self-start">
        <Card title="Hero live preview" icon={Eye}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <span className="font-semibold">Real-time preview: hero qanday chiqsa, shu holatda kichraytirib ko'rsatiladi.</span>
            <span className="rounded-md bg-orange px-3 py-1.5 text-xs font-black uppercase text-slate-950">
              Desktop canvas
            </span>
          </div>
          <HeroPreviewCanvas scaled>
            <HeroPreview hero={hero} />
          </HeroPreviewCanvas>
        </Card>
      </div>
    </div>
  );
}

function HeroPreviewCanvas({ children, scaled }: { children: ReactNode; scaled?: boolean }) {
  if (scaled) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto h-[520px] w-full max-w-[820px] overflow-hidden rounded-2xl bg-[#f3efdf] shadow-inner">
          <div className="origin-top-left scale-[0.64]">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-slate-100 p-3 dark:bg-slate-900">
      <div className="w-fit">
        {children}
      </div>
    </div>
  );
}

function HeroPreview({ hero, compact }: { hero: HeroContent; compact?: boolean }) {
  const stats = [
    { value: hero.statOneValue, label: hero.statOneLabel },
    { value: hero.statTwoValue, label: hero.statTwoLabel },
    { value: hero.statThreeValue, label: hero.statThreeLabel },
  ];
  const specs = [
    [hero.specOneLabel, hero.specOneValue],
    [hero.specTwoLabel, hero.specTwoValue],
    [hero.specThreeLabel, hero.specThreeValue],
    [hero.specFourLabel, hero.specFourValue],
  ];

  return (
    <div
      className={`relative shrink-0 origin-top overflow-hidden rounded-2xl border border-[#d8d1bd] bg-[#f3efdf] text-[#111812] ${
        compact
            ? "min-h-[420px] min-w-[920px]"
            : "min-h-[720px] min-w-[1240px]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(111,116,92,0.14),transparent_30%),radial-gradient(circle_at_82%_78%,rgba(255,108,0,0.08),transparent_32%)]" />
      <div className="absolute left-5 top-4 z-10 flex gap-5 font-mono-tac text-[9px] font-bold uppercase tracking-wider text-orange sm:left-8">
        <span>{hero.topLeftMeta}</span>
        <span>{hero.topSecondMeta}</span>
      </div>
      <div className="absolute right-6 top-4 z-10 flex items-center gap-2 font-mono-tac text-[9px] font-bold uppercase tracking-wider text-slate-600">
        {hero.topRightMeta}
        <span className="h-2 w-2 bg-orange" />
      </div>

      <div className={`relative grid gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] ${compact ? "lg:px-8 lg:py-14" : "lg:px-12 lg:py-20"}`}>
        <div className="flex min-h-[520px] flex-col justify-center">
          <div className="mb-8 w-fit border border-orange bg-orange/5 px-4 py-2 font-mono-tac text-[10px] font-bold uppercase tracking-wider text-orange">
            <span className="mr-2 inline-block h-2 w-2 bg-orange" />
            {hero.badge || hero.eyebrow}
          </div>
          <h2 className={`font-display font-black leading-[0.86] tracking-normal ${compact ? "text-5xl xl:text-6xl" : "text-6xl sm:text-7xl xl:text-[6.6rem]"}`}>
            <span className="block">{hero.headlineTop}</span>
            <span className="block">{hero.headlineMiddle}</span>
            <span className="block text-orange">{hero.headlineAccent}</span>
            <span className="block">
              <span className="text-slate-500">{hero.headlineMuted}</span>{" "}
              {hero.headlineAfterMuted}
            </span>
            <span className="block italic">{hero.headlineItalic}</span>
          </h2>
          <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-slate-600">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex min-h-12 items-center justify-center gap-2 bg-orange px-7 text-sm font-black uppercase text-slate-950">
              {hero.primaryCta}
              <span>→</span>
            </span>
            <span className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#d8d1bd] bg-[#f7f2e4] px-7 text-sm font-black uppercase">
              ◎ {hero.secondaryCta}
            </span>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-black text-orange sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1.5 font-mono-tac text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[560px] items-center pr-10">
          <div className="relative h-full min-h-[560px] w-full overflow-visible bg-slate-950 shadow-2xl">
            <div className="absolute inset-0 overflow-hidden">
              <img src={hero.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-88" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f3efdf]/72 via-transparent to-black/20" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent" />
            </div>
            <CornerMarks />

            <div className="absolute left-5 top-5">
              <div className="h-0.5 w-8 bg-orange" />
              <div className="mt-3 font-mono-tac text-[10px] uppercase text-orange">{hero.imageKicker}</div>
              <div className="mt-1 font-display text-xl font-black text-orange">{hero.imageModelCode}</div>
            </div>
            <div className="absolute right-5 top-9 flex items-center gap-2 font-mono-tac text-[9px] font-black uppercase text-orange">
              <span className="h-1.5 w-1.5 bg-orange" />
              {hero.imageStatus}
            </div>

            <div className="absolute right-[-28px] top-[76px] z-10 w-[250px] border border-[#d8d1bd] bg-[#f8f3e5] p-5 text-slate-800 shadow-xl">
              <div className="mb-4 font-mono-tac text-[10px] font-black uppercase tracking-wider text-orange">
                {hero.specsTitle}
              </div>
              <div className="space-y-3">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 font-mono-tac text-[11px]">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-black text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-8 left-6 right-6 bg-[#1b221d]/96 p-5 text-white shadow-xl">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <div className="font-mono-tac text-[9px] font-black uppercase tracking-wider text-orange">
                    {hero.featuredKicker}
                  </div>
                  <div className="mt-2 font-display text-3xl font-black leading-none">
                    {hero.featuredName}
                  </div>
                  <div className="mt-4 flex gap-5 font-mono-tac text-[9px] font-black uppercase tracking-wider text-white/42">
                    <span>{hero.featuredTagOne}</span>
                    <span>{hero.featuredTagTwo}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono-tac text-[9px] font-black uppercase text-white/42">
                    {hero.priceLabel}
                  </div>
                  <div className="font-display text-2xl font-black text-orange">
                    {hero.featuredPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CornerMarks() {
  return (
    <>
      <span className="absolute left-4 top-4 h-7 w-7 border-l-2 border-t-2 border-orange" />
      <span className="absolute right-4 top-4 h-7 w-7 border-r-2 border-t-2 border-orange" />
      <span className="absolute bottom-4 left-4 h-7 w-7 border-b-2 border-l-2 border-orange" />
      <span className="absolute bottom-4 right-4 h-7 w-7 border-b-2 border-r-2 border-orange" />
    </>
  );
}

function ProductsPanel({
  products,
  categories,
  categoryOptions,
  draft,
  onDraftChange,
  onNew,
  onEdit,
  onSave,
  onDelete,
}: {
  products: Product[];
  categories: Category[];
  categoryOptions: Array<{ label: string; value: string }>;
  draft: Product;
  onDraftChange: (product: Product) => void;
  onNew: () => void;
  onEdit: (product: Product) => void;
  onSave: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
      <Card title="Mahsulotlar ro'yxati" icon={Boxes} action={<ActionButton icon={Plus} label="Yangi mahsulot" onClick={onNew} />}>
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="hidden grid-cols-[88px_1.1fr_0.8fr_130px_110px_110px] gap-4 bg-slate-50 p-4 text-xs font-bold uppercase text-slate-500 dark:bg-slate-900 lg:grid">
            <div>Rasm</div>
            <div>Mahsulot</div>
            <div>Kategoriya</div>
            <div>Narx</div>
            <div>Zaxira</div>
            <div>Action</div>
          </div>
          {products.map((product) => {
            const category = categories.find((item) => item.id === product.categoryId)?.name ?? "-";
            return (
              <div key={product.id} className="grid gap-4 border-t border-slate-200 p-4 dark:border-slate-800 lg:grid-cols-[88px_1.1fr_0.8fr_130px_110px_110px] lg:items-center">
                <ImagePreview image={product.image} label={product.name} className="h-20 w-20 rounded-xl" />
                <div>
                  <div className="font-bold">{product.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{product.sku}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge>{productStatusLabel(product.status)}</Badge>
                    {product.tags.split(",").filter(Boolean).slice(0, 2).map((tag) => <Badge key={tag}>{tag.trim()}</Badge>)}
                  </div>
                </div>
                <div className="text-sm font-semibold">{category}</div>
                <div className="font-bold">{money.format(product.price)} so'm</div>
                <div className={product.stock < 35 ? "font-bold text-rose-600" : "font-bold"}>{product.stock} dona</div>
                <div className="flex gap-2">
                  <IconButton label="Tahrirlash" icon={Edit3} onClick={() => onEdit(product)} />
                  <IconButton label="O'chirish" icon={Trash2} onClick={() => onDelete(product.id)} danger />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title={draft.id === 0 ? "Yangi mahsulot" : "Mahsulotni tahrirlash"} icon={Edit3}>
        <div className="grid gap-4">
          <ImageUploader label="Mahsulot rasmi upload" image={draft.image} onImageChange={(image) => onDraftChange({ ...draft, image })} />
          <TextInput label="Mahsulot nomi" value={draft.name} onChange={(value) => onDraftChange({ ...draft, name: value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="SKU / kod" value={draft.sku} onChange={(value) => onDraftChange({ ...draft, sku: value })} />
            <SelectInput
              label="Kategoriya"
              value={String(draft.categoryId)}
              options={[{ label: "Kategoriyani tanlang", value: "0" }, ...categoryOptions]}
              onChange={(value) => onDraftChange({ ...draft, categoryId: Number(value) })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <NumberInput label="Narx" value={draft.price} onChange={(value) => onDraftChange({ ...draft, price: value })} />
            <NumberInput label="Eski narx" value={draft.oldPrice} onChange={(value) => onDraftChange({ ...draft, oldPrice: value })} />
            <NumberInput label="Zaxira" value={draft.stock} onChange={(value) => onDraftChange({ ...draft, stock: value })} />
          </div>
          <SelectInput
            label="Holat"
            value={draft.status}
            options={[
              { label: "Faol", value: "active" },
              { label: "Qoralama", value: "draft" },
              { label: "Arxiv", value: "archived" },
            ]}
            onChange={(value) => onDraftChange({ ...draft, status: value as ProductStatus })}
          />
          <TextInput label="Teglar" value={draft.tags} onChange={(value) => onDraftChange({ ...draft, tags: value })} />
          <TextArea label="Mahsulot tavsifi" value={draft.description} onChange={(value) => onDraftChange({ ...draft, description: value })} />
          <div className="grid gap-3 md:grid-cols-2">
            <button type="button" onClick={onSave} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white dark:bg-orange dark:text-slate-950">
              <Save className="h-4 w-4" />
              Saqlash
            </button>
            {draft.id !== 0 && (
              <button type="button" onClick={() => onDelete(draft.id)} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-rose-200 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950">
                <Trash2 className="h-4 w-4" />
                O'chirish
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function CategoriesPanel({
  categories,
  products,
  draft,
  onDraftChange,
  onNew,
  onEdit,
  onSave,
  onDelete,
}: {
  categories: Category[];
  products: Product[];
  draft: Category;
  onDraftChange: (category: Category) => void;
  onNew: () => void;
  onEdit: (category: Category) => void;
  onSave: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
      <Card title="Kategoriyalar" icon={Grid3X3} action={<ActionButton icon={Plus} label="Yangi kategoriya" onClick={onNew} />}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const count = products.filter((product) => product.categoryId === category.id).length;
            return (
              <article key={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="relative aspect-[4/3]">
                  <ImagePreview image={category.image} label={category.name} className="h-full w-full" />
                  {category.featured && <span className="absolute left-3 top-3 rounded-full bg-orange px-3 py-1 text-xs font-bold text-slate-950">Featured</span>}
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold uppercase text-slate-500">{category.slug}</div>
                  <h3 className="mt-2 font-display text-2xl font-bold">{category.name}</h3>
                  <p className="mt-2 min-h-10 text-sm text-slate-500">{category.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge>{count} mahsulot</Badge>
                    <div className="flex gap-2">
                      <IconButton label="Tahrirlash" icon={Edit3} onClick={() => onEdit(category)} />
                      <IconButton label="O'chirish" icon={Trash2} onClick={() => onDelete(category.id)} danger />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Card>

      <Card title={draft.id === 0 ? "Yangi kategoriya" : "Kategoriya tahriri"} icon={FileText}>
        <div className="grid gap-4">
          <ImageUploader label="Kategoriya rasmi upload" image={draft.image} onImageChange={(image) => onDraftChange({ ...draft, image })} />
          <TextInput label="Kategoriya nomi" value={draft.name} onChange={(value) => onDraftChange({ ...draft, name: value })} />
          <TextInput label="Slug" value={draft.slug} onChange={(value) => onDraftChange({ ...draft, slug: value })} />
          <TextArea label="Tavsif" value={draft.description} onChange={(value) => onDraftChange({ ...draft, description: value })} />
          <ToggleLine label="Bosh sahifada ko'rsatish" checked={draft.featured} onChange={() => onDraftChange({ ...draft, featured: !draft.featured })} />
          <button type="button" onClick={onSave} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white dark:bg-orange dark:text-slate-950">
            <Save className="h-4 w-4" />
            Kategoriyani saqlash
          </button>
        </div>
      </Card>
    </div>
  );
}

function OrdersPanel({
  orders,
  onUpdateStatus,
}: {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}) {
  return (
    <Card title="Buyurtmalar" icon={ClipboardList}>
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        {orders.map((order) => (
          <div key={order.id} className="grid gap-4 border-t border-slate-200 p-4 first:border-t-0 dark:border-slate-800 lg:grid-cols-[140px_1fr_1fr_150px_180px] lg:items-center">
            <div className="font-display text-2xl font-bold">{order.id}</div>
            <div>
              <div className="font-bold">{order.customer}</div>
              <div className="mt-1 text-sm text-slate-500">{order.phone} / {order.city}</div>
            </div>
            <div className="font-semibold">{order.product}</div>
            <div className="font-bold">{money.format(order.total)} so'm</div>
            <SelectInput
              label="Status"
              value={order.status}
              options={[
                { label: "Yangi", value: "new" },
                { label: "Tasdiqlandi", value: "confirmed" },
                { label: "Yetkazilmoqda", value: "shipping" },
                { label: "Yopildi", value: "done" },
              ]}
              onChange={(value) => onUpdateStatus(order.id, value as OrderStatus)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

function SettingsPanel({
  settings,
  onSettingsChange,
  onSave,
}: {
  settings: {
    storeName: string;
    phone: string;
    email: string;
    address: string;
    mapEmbed: string;
    workTime: string;
    deliveryEnabled: boolean;
    publicCatalog: boolean;
    orderNotifications: boolean;
    telegramBotToken: string;
    telegramChatId: string;
  };
  onSettingsChange: (settings: {
    storeName: string;
    phone: string;
    email: string;
    address: string;
    mapEmbed: string;
    workTime: string;
    deliveryEnabled: boolean;
    publicCatalog: boolean;
    orderNotifications: boolean;
    telegramBotToken: string;
    telegramChatId: string;
  }) => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <Card title="Do'kon sozlamalari" icon={Settings}>
        <div className="grid gap-4">
          <TextInput label="Do'kon nomi" value={settings.storeName} onChange={(value) => onSettingsChange({ ...settings, storeName: value })} />
          <TextInput label="Telefon" value={settings.phone} onChange={(value) => onSettingsChange({ ...settings, phone: value })} />
          <TextInput label="Email" value={settings.email} onChange={(value) => onSettingsChange({ ...settings, email: value })} />
          <TextInput label="Manzil" value={settings.address} onChange={(value) => onSettingsChange({ ...settings, address: value })} />
          <TextArea label="Google Maps iframe yoki embed URL" value={settings.mapEmbed} onChange={(value) => onSettingsChange({ ...settings, mapEmbed: value })} />
          <TextInput label="Ish vaqti" value={settings.workTime} onChange={(value) => onSettingsChange({ ...settings, workTime: value })} />
          <div className="grid gap-3 md:grid-cols-3">
            <ToggleLine label="Yetkazish faol" checked={settings.deliveryEnabled} onChange={() => onSettingsChange({ ...settings, deliveryEnabled: !settings.deliveryEnabled })} />
            <ToggleLine label="Katalog public" checked={settings.publicCatalog} onChange={() => onSettingsChange({ ...settings, publicCatalog: !settings.publicCatalog })} />
            <ToggleLine label="Order alert" checked={settings.orderNotifications} onChange={() => onSettingsChange({ ...settings, orderNotifications: !settings.orderNotifications })} />
          </div>
          <button type="button" onClick={onSave} className="items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white dark:bg-orange dark:text-slate-950 hidden xl:inline-flex h-12 w-fit">
            <Save className="h-4 w-4" />
            Sozlamalarni saqlash
          </button>
        </div>
      </Card>
      
      <div className="space-y-6">
        <Card title="Telegram Bot" icon={Megaphone}>
          <div className="grid gap-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Yangi buyurtmalar haqida Telegram kanalga xabarnoma yuborish uchun bot tokeni va kanal ID raqamini kiriting.
            </p>
            <TextInput 
              label="Telegram Bot Token" 
              value={settings.telegramBotToken} 
              onChange={(value) => onSettingsChange({ ...settings, telegramBotToken: value })} 
            />
            <TextInput 
              label="Telegram Kanal ID" 
              value={settings.telegramChatId} 
              onChange={(value) => onSettingsChange({ ...settings, telegramChatId: value })} 
            />
            <button type="button" onClick={onSave} className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white dark:bg-orange dark:text-slate-950">
              <Save className="h-4 w-4" />
              Saqlash
            </button>
          </div>
        </Card>

        <Card title="Rol va himoya" icon={ShieldCheck}>
          <div className="space-y-3">
            {["Owner - to'liq boshqaruv", "Operator - buyurtmalar", "Editor - kontent va media"].map((role) => (
              <div key={role} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <Check className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold">{role}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: typeof LayoutDashboard;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
            <Icon className="h-5 w-5 text-orange" />
          </div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EditorGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/55">
      <div className="mb-4">
        <h3 className="text-base font-black text-slate-950 dark:text-slate-100">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof ShoppingBag; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
          <Icon className="h-5 w-5 text-orange" />
        </div>
        <Badge>Live</Badge>
      </div>
      <div className="mt-8 text-sm font-semibold text-slate-500">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}

function ProductMiniCard({ product, category }: { product: Product; category: string }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
      <ImagePreview image={product.image} label={product.name} className="aspect-[4/3] w-full" />
      <div className="p-4">
        <div className="text-xs font-bold uppercase text-slate-500">{category}</div>
        <h3 className="mt-2 font-display text-xl font-bold">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-orange">{money.format(product.price)}</span>
          <Badge>{product.stock} dona</Badge>
        </div>
      </div>
    </article>
  );
}

function ImagePreview({ image, label, className }: { image: string; label: string; className: string }) {
  if (!image) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100 text-center text-xs font-bold uppercase tracking-wide text-slate-400 dark:bg-slate-900 dark:text-slate-600`}>
        Rasm yo'q
      </div>
    );
  }

  return <img src={image} alt={label} className={`${className} object-cover`} />;
}

function ImageUploader({
  label,
  image,
  onImageChange,
}: {
  label: string;
  image: string;
  onImageChange: (image: string) => void;
}) {
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-2 text-sm font-bold">{label}</div>
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <ImagePreview image={image} label={label} className="h-56 w-full" />
        <div className="grid gap-3 border-t border-slate-200 p-3 dark:border-slate-800 sm:grid-cols-2">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white dark:bg-orange dark:text-slate-950">
            <Upload className="h-4 w-4" />
            Rasm upload
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
          <button
            type="button"
            onClick={() => onImageChange("")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-bold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <ImagePlus className="h-4 w-4" />
            Rasmni tozalash
          </button>
        </div>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange dark:border-slate-800 dark:bg-slate-900"
      />
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <input
        type="number"
        value={value || ""}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange dark:border-slate-800 dark:bg-slate-900"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange dark:border-slate-800 dark:bg-slate-900"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange dark:border-slate-800 dark:bg-slate-900"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleLine({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex min-h-12 items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 text-left dark:border-slate-800"
    >
      <span className="text-sm font-bold">{label}</span>
      <span className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-orange" : "bg-slate-300 dark:bg-slate-800"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </span>
    </button>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: typeof Plus; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white dark:bg-orange dark:text-slate-950"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  danger,
}: {
  label: string;
  icon: typeof Edit3;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${
        danger
          ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950"
          : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      {children}
    </span>
  );
}

function nextId(items: Array<{ id: number }>) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function productStatusLabel(status: ProductStatus) {
  return {
    active: "Faol",
    draft: "Qoralama",
    archived: "Arxiv",
  }[status];
}

function orderStatusLabel(status: OrderStatus) {
  return {
    new: "Yangi",
    confirmed: "Tasdiqlandi",
    shipping: "Yetkazilmoqda",
    done: "Yopildi",
  }[status];
}
