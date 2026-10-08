import { Instagram, Lock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchSettings, type ApiSettings } from "@/lib/api";

const footerLinks = [
  {
    title: "Sahifalar",
    items: [
      { label: "Biz haqimizda", href: "/about" },
      { label: "Katalog", href: "/catalog" },
      { label: "Mahsulotlar", href: "/products" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Katalog",
    items: [
      { label: "Jangovar botinkalar", href: "/catalog" },
      { label: "Taktik seriya", href: "/catalog" },
      { label: "Dala trekkingi", href: "/catalog" },
      { label: "Qishki armiya", href: "/catalog" },
    ],
  },
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

function mapQuery(address: string) {
  return encodeURIComponent(address);
}

function extractMapSrc(value?: string) {
  if (!value) return "";
  const trimmed = value.trim();
  const src = trimmed.match(/\bsrc=["']([^"']+)["']/i)?.[1] ?? trimmed;
  if (!src.startsWith("https://www.google.com/maps/embed") && !src.startsWith("https://maps.google.com/maps")) {
    return "";
  }
  return src.replace(/&amp;/g, "&");
}

export function SiteFooter({ settings: providedSettings }: { settings?: ApiSettings | null }) {
  const [settings, setSettings] = useState<ApiSettings>(providedSettings ?? fallbackSettings);

  useEffect(() => {
    if (providedSettings) {
      setSettings(providedSettings);
      return;
    }

    let cancelled = false;
    fetchSettings()
      .then((items) => {
        if (!cancelled && items[0]) setSettings(items[0]);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [providedSettings]);

  const brand = settings.site_name || fallbackSettings.site_name;
  const address = settings.address || fallbackSettings.address;
  const phone = settings.phone || fallbackSettings.phone;
  const email = settings.email || fallbackSettings.email;
  const workTime = settings.work_time || fallbackSettings.work_time;
  const mapSrc = extractMapSrc(settings.map_embed) || `https://maps.google.com/maps?q=${mapQuery(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <footer className="relative overflow-hidden border-t border-border bg-ink ink-surface">
      <div className="absolute inset-0 tactical-grid opacity-30" />
      <div className="relative mx-auto max-w-[1500px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden">
                <img src="/icon.png" alt="ALTIMA" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="font-display text-xl font-bold tracking-[0.15em]">{brand.replace(" SHOP", "")}</div>
                <div className="font-mono-tac text-[9px] text-orange">DO'KON · TAKTIK</div>
              </div>
            </a>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Professional military, tactical va outdoor oyoq kiyimlar. Mustahkam, ishonchli va
              xizmat sharoitlari uchun sinovdan o'tgan modellar.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Send, Phone].map((Icon, index) => (
                <a
                  key={index}
                  href={index === 0 ? settings.instagram || "#" : index === 1 ? settings.telegram || "#" : phoneHref(phone)}
                  aria-label="ALTIMA aloqa"
                  className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors clip-tac hover:border-orange hover:text-orange"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <div className="mb-5 font-mono-tac text-[10px] uppercase tracking-wider text-orange">{group.title}</div>
              <ul className="space-y-3 text-sm">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-muted-foreground transition-colors hover:text-orange">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-4">
            <div className="mb-5 font-mono-tac text-[10px] uppercase tracking-wider text-orange">
              Joylashuv · {brand} HQ
            </div>
            <div className="grid gap-5 md:grid-cols-[1fr_0.9fr] lg:grid-cols-1 xl:grid-cols-[1fr_0.9fr]">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                  <span>{address}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                  <span>{phone}</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                  <span>{email}</span>
                </li>
                <li className="flex gap-3">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                  <span>{workTime}</span>
                </li>
              </ul>
              <div className="relative min-h-44 overflow-hidden border border-border bg-white/5 clip-tac">
                <iframe
                  title="ALTIMA SHOP xaritadagi joylashuvi"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0 grayscale invert-[0.9] hue-rotate-180 dark:invert-0"
                />
                <div className="pointer-events-none absolute inset-0 border border-orange/20" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery(address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 left-3 right-3 bg-ink/85 px-3 py-2 text-center font-mono-tac text-[10px] uppercase text-orange backdrop-blur clip-tac hover:bg-orange hover:text-ink"
                >
                  Xaritada ochish
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7 font-mono-tac text-[10px] uppercase tracking-wider text-muted-foreground">
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
