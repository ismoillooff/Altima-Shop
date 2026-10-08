const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const browserApiUrl =
  typeof window === "undefined"
    ? undefined
    : `${window.location.protocol}//${window.location.hostname}:8000/api`;

export const API_BASE_URL = configuredApiUrl ?? browserApiUrl ?? "http://127.0.0.1:8000/api";

const API_BASE_URLS = Array.from(
  new Set([
    API_BASE_URL,
    "http://127.0.0.1:8000/api",
    "http://localhost:8000/api",
  ]),
);

type Paginated<T> = {
  results?: T[];
};

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  code: string;
  description: string;
  image_src: string;
  icon: string;
  featured: boolean;
  products_count?: number;
};

export type ApiProductImage = {
  id: number;
  image_src: string;
  alt: string;
  sort_order: number;
};

export type ApiProduct = {
  id: number;
  category: number;
  slug: string;
  name: string;
  sku: string;
  price: number;
  old_price: number;
  stock: number;
  rating: string | number;
  tags: string[];
  specs?: Record<string, string>;
  description: string;
  image_src: string;
  category_name: string;
  gallery?: ApiProductImage[];
  hot: boolean;
  featured: boolean;
  status: string;
};

export type ApiHero = {
  id: number;
  eyebrow: string;
  badge: string;
  headline_top: string;
  headline_middle: string;
  headline_accent: string;
  headline_muted: string;
  headline_after_muted: string;
  headline_italic: string;
  description: string;
  primary_cta: string;
  secondary_cta: string;
  top_left_meta: string;
  top_second_meta: string;
  top_right_meta: string;
  image_src: string;
  image_kicker: string;
  image_model_code: string;
  image_status: string;
  specs_title: string;
  specs: Array<{ label: string; value: string }>;
  stats: Array<{ value: string; label: string }>;
  featured_kicker: string;
  featured_name: string;
  featured_tag_one: string;
  featured_tag_two: string;
  price_label: string;
  featured_price: string;
  is_published: boolean;
};

export type ApiOrder = {
  id: number;
  customer: string;
  phone: string;
  city: string;
  address: string;
  note: string;
  total: number;
  status: string;
  items?: Array<{ product_name?: string; quantity: number; price: number }>;
};

export type ApiSettings = {
  id: number;
  site_name: string;
  logo_url?: string;
  phone: string;
  email: string;
  address: string;
  map_embed?: string;
  work_time: string;
  instagram?: string;
  telegram?: string;
  telegram_bot_token?: string;
  telegram_chat_id?: string;
  enable_notifications?: boolean;
  enable_orders: boolean;
  enable_dark_theme: boolean;
};

export type ApiSiteHome = {
  settings: ApiSettings | null;
  hero: ApiHero | null;
  categories: ApiCategory[];
  products: ApiProduct[];
  reviews: unknown[];
};

async function request<T>(path: string): Promise<T> {
  let lastError: unknown;
  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        return response.json() as Promise<T>;
      }
      lastError = new Error(`API error ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("API ulanmagan");
}

function unwrapList<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function fetchCategories() {
  const data = await request<ApiCategory[] | Paginated<ApiCategory>>("/categories/?active=1&ordering=sort_order");
  return unwrapList(data);
}

export async function fetchProducts(query = "?status=active&ordering=sort_order") {
  const data = await request<ApiProduct[] | Paginated<ApiProduct>>(`/products/${query}`);
  return unwrapList(data);
}

export async function fetchProductBySlug(slug: string) {
  const encoded = encodeURIComponent(slug);
  try {
    return await request<ApiProduct>(`/products/${encoded}/`);
  } catch (error) {
    const products = await fetchProducts(`?slug=${encoded}`);
    return products.find((product) => product.slug === slug) ?? null;
  }
}

export async function fetchRelatedProducts(categoryId: number, excludeId: number, limit = 4) {
  if (!categoryId) return [] as ApiProduct[];
  const data = await fetchProducts(
    `?status=active&category=${categoryId}&exclude=${excludeId}&ordering=-rating`,
  );
  return data.slice(0, limit);
}

export async function fetchHeroSections() {
  const data = await request<ApiHero[] | Paginated<ApiHero>>("/hero/");
  return unwrapList(data);
}

export async function fetchOrders() {
  const data = await request<ApiOrder[] | Paginated<ApiOrder>>("/orders/");
  return unwrapList(data);
}

export async function fetchSettings() {
  const data = await request<ApiSettings[] | Paginated<ApiSettings>>("/settings/");
  return unwrapList(data);
}

export async function fetchSiteHome() {
  return request<ApiSiteHome>("/site/home/");
}

export async function saveResource<T>(path: string, payload: FormData | Record<string, unknown>, method: "POST" | "PATCH" = "POST") {
  const isFormData = payload instanceof FormData;
  let lastError: unknown;
  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: isFormData ? { Accept: "application/json" } : { Accept: "application/json", "Content-Type": "application/json" },
        body: isFormData ? payload : JSON.stringify(payload),
      });
      if (response.ok) {
        return response.json() as Promise<T>;
      }
      lastError = new Error((await response.text()) || `API error ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("API ulanmagan");
}

export async function deleteResource(path: string) {
  let lastError: unknown;
  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (response.ok) return;
      lastError = new Error((await response.text()) || `API error ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("API ulanmagan");
}
