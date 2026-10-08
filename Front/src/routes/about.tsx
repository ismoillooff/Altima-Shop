import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Crosshair,
  Gauge,
  MapPin,
  Heart,
  Home,
  LayoutGrid,
  Lock,
  Mail,
  Menu,
  Moon,
  PackageCheck,
  Phone,
  Search,
  Shield,
  ShoppingBag,
  Sun,
  Target,
  Truck,
  Users,
  X,
} from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchSettings, type ApiSettings } from "@/lib/api";
import heroTactical from "@/assets/hero-tactical.jpg";
import bootCombat from "@/assets/boot-combat.jpg";
import bootTactical from "@/assets/boot-tactical.jpg";
import bootWinter from "@/assets/boot-winter.jpg";
import catCombat from "@/assets/cat-combat.jpg";
import catOutdoor from "@/assets/cat-outdoor.jpg";
import catDesert from "@/assets/cat-desert.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Biz haqimizda | ALTIMA SHOP" },
      {
        name: "description",
        content:
          "ALTIMA SHOP haqida: taktik, jangovar va outdoor oyoq kiyimlarni sinov, xizmat va ishonch asosida tanlaydigan jamoa.",
      },
    ],
  }),
  component: AboutPage,
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
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const viewport = { once: true, amount: 0.18, margin: "0px 0px -80px 0px" };

const stats = [
  { icon: Shield, n: "MIL", l: "taktik tanlov standarti" },
  { icon: Users, n: "15K+", l: "faol mijozlar ishonchi" },
  { icon: Truck, n: "24/7", l: "buyurtma va maslahat" },
  { icon: Award, n: "18 oy", l: "kafolat nazorati" },
];

const principles = [
  {
    icon: Target,
    title: "Vazifaga mos tanlov",
    text: "Har model ko'rinishi bilan emas, qanday sharoitda xizmat qilishi bilan baholanadi.",
  },
  {
    icon: Gauge,
    title: "Real yuklama",
    text: "Taglik ushlashi, namlik, chok va to'piq himoyasi kundalik og'ir foydalanish uchun tekshiriladi.",
  },
  {
    icon: PackageCheck,
    title: "Qabul qilish intizomi",
    text: "Buyurtma yetkazilganda mijoz model, o'lcham va holatni tekshirib qabul qiladi.",
  },
];

const timeline = [
  ["01", "Talabni eshitamiz", "Patrul, xizmat, trekking yoki qishki foydalanish uchun kerakli sharoit aniqlanadi."],
  ["02", "Modelni saralaymiz", "Material, taglik, vazn, o'lcham va mavsum bo'yicha mos variantlar ajratiladi."],
  ["03", "Sifatni tekshiramiz", "Chok, yelim, bog'ich, taglik va qadoq holati buyurtmadan oldin nazorat qilinadi."],
  ["04", "Yetkazib beramiz", "O'zbekiston bo'ylab buyurtma kuzatuv va qabul qilish tartibi bilan yuboriladi."],
];

const qualityChecks = [
  "Suv va namlikka chidamlilik",
  "Sirpanishga qarshi protektor",
  "To'piqni barqaror ushlash",
  "Qalin paypoq bilan o'lcham aniqligi",
  "Chok va yelim nuqtalari",
  "Qadoq va yetkazish holati",
];

const fieldCards = [
  { title: "Jangovar liniya", tag: "Combat", img: catCombat },
  { title: "Dala yurishi", tag: "Outdoor", img: catOutdoor },
  { title: "Cho'l sharoiti", tag: "Desert", img: catDesert },
];

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

const additionalInfo = [
  { icon: Shield, title: "Harbiy ruhdagi tanlov", text: "Katalogga kiradigan mahsulotlar avvalo chidamlilik va xizmatga mosligi bo'yicha saralanadi." },
  { icon: Target, title: "Aniq vazifa profili", text: "Mijoz patrul, trekking, qishki navbatchilik yoki kundalik xizmat uchun alohida tavsiya oladi." },
  { icon: Gauge, title: "Qulaylik balansi", text: "Og'ir xizmat modeli ham uzoq yurishda oyoqni charchatmasligi kerakligi hisobga olinadi." },
  { icon: PackageCheck, title: "Qadoq nazorati", text: "Mahsulot yuborilishidan oldin juftlik, razmer, qadoq va tashqi holat qayta ko'rib chiqiladi." },
  { icon: Truck, title: "Yetkazish tartibi", text: "Buyurtmalar shahar va viloyatlarga imkon qadar aniq vaqt oralig'ida yo'naltiriladi." },
  { icon: CheckCircle2, title: "Almashtirish yordami", text: "O'lcham mos kelmasa, mahsulot holatiga qarab almashtirish bo'yicha yo'l ko'rsatiladi." },
  { icon: Crosshair, title: "Model mosligi", text: "Agar tanlangan model vazifaga to'g'ri kelmasa, jamoa boshqa muqobil variantni tavsiya qiladi." },
  { icon: Users, title: "Mijoz tajribasi", text: "Fikr-mulohazalar keyingi katalog tanlovida va mahsulot ta'riflarini yaxshilashda ishlatiladi." },
  { icon: Award, title: "Kafolat madaniyati", text: "Kafolat shartlari, foydalanish me'yori va parvarish bo'yicha tushuntirish ochiq beriladi." },
  { icon: MapPin, title: "Mahalliy ehtiyoj", text: "Tanlov O'zbekiston iqlimi, chang, yomg'ir, sovuq va shahar yo'llariga moslab shakllantiriladi." },
  { icon: Lock, title: "Ishonchli aloqa", text: "Buyurtma ma'lumotlari, telefon va manzil tafsilotlari faqat xizmat ko'rsatish uchun ishlatiladi." },
  { icon: Heart, title: "Uzoq muddatli munosabat", text: "ALTIMA bir martalik savdodan ko'ra qayta murojaat qiladigan mijoz ishonchini ustun qo'yadi." },
];

type ThemeMode = "light" | "dark";

function AboutPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
      <AboutHeader mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen((open) => !open)} settings={settings} />
      <AboutMobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} settings={settings} />
      <AboutMobileBottomBar
        menuOpen={mobileOpen}
        onMenuToggle={() => setMobileOpen((open) => !open)}
        onNavigate={() => setMobileOpen(false)}
      />
      <HeroSection />
      <StatsSection />
      <MissionSection />
      <PrinciplesSection />
      <AdditionalInfoSection />
      <TimelineSection />
      <FieldSection />
      <QualitySection />
      <TrustSection />
      <CallToAction />
      <SiteFooter settings={settings} />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <img
        src={heroTactical}
        alt="ALTIMA taktik oyoq kiyimlari"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/20" />
      <div className="absolute inset-0 tactical-grid opacity-35" />

      <div className="relative mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 0.75 }}
          className="flex min-h-[560px] flex-col justify-center"
        >
          <div className="font-mono-tac text-[11px] uppercase tracking-wider text-orange">// ALTIMA SHOP HAQIDA</div>
          <h1 className="mt-5 max-w-5xl font-display text-5xl font-bold leading-[0.94] text-balance sm:text-6xl lg:text-8xl">
            Biz oyoq kiyim sotmaymiz. Biz vazifa uchun tayanch tanlaymiz.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            ALTIMA taktik, jangovar va outdoor oyoq kiyimlarni real foydalanish sharoitiga qarab
            saralaydi. Har bir juftlik mijozning vazifasi, mavsumi va harakat ritmiga mos kelishi kerak.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/catalog"
              className="group inline-flex items-center justify-center gap-3 bg-orange px-7 py-4 font-mono-tac text-xs font-bold uppercase text-primary-foreground clip-tac glow-orange-hover"
            >
              Katalogni ko'rish
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center border border-border bg-background/80 px-7 py-4 font-mono-tac text-xs font-bold uppercase text-foreground clip-tac hover:border-orange hover:text-orange"
            >
              Maslahat olish
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 38, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative hidden min-h-[560px] overflow-hidden border border-border bg-panel clip-tac lg:block"
        >
          <img src={bootCombat} alt="Jangovar botinka" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-transparent" />
          <div className="absolute left-6 top-6 border border-orange/70 px-4 py-2 font-mono-tac text-[10px] uppercase text-orange">
            Field tested
          </div>
          <div className="absolute bottom-7 left-7 right-7 text-white">
            <div className="font-mono-tac text-[10px] uppercase text-orange">asosiy prinsip</div>
            <div className="mt-3 max-w-lg font-display text-4xl font-bold leading-none">
              Chidamlilik, qulaylik va nazorat bir joyda.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-14 lg:px-10 lg:py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((item) => (
          <motion.div
            key={item.l}
            variants={revealScale}
            transition={{ duration: 0.55 }}
            className="border border-border bg-panel p-6 clip-tac"
          >
            <item.icon className="h-7 w-7 text-orange" />
            <div className="mt-8 font-display text-4xl font-bold">{item.n}</div>
            <div className="mt-2 text-sm text-muted-foreground">{item.l}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="border-y border-border bg-panel/35">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal}>
          <SectionEyebrow text="// Missiya" />
          <h2 className="mt-4 font-display text-4xl font-bold leading-none text-balance sm:text-5xl lg:text-6xl">
            Har qadam ishongan tayanchga aylanishi kerak.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Bizning vazifamiz mijozga shunchaki model tavsiya qilish emas. Biz oyoqning kengligi,
            foydalanish vaqti, mavsum, sirt turi va xizmat rejimini hisobga olib tanlovni aniqlashtiramiz.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="grid gap-4"
        >
          {[
            ["Shahar", "Tez harakat, past profil, kun bo'yi qulaylik"],
            ["Dala", "Taglik ushlashi, to'piq himoyasi, namlikdan saqlash"],
            ["Qish", "Issiqlik, muzda barqarorlik, qalin paypoq uchun moslik"],
          ].map(([title, text]) => (
            <motion.div
              key={title}
              variants={reveal}
              transition={{ duration: 0.55 }}
              className="grid gap-4 border border-border bg-background p-6 clip-tac sm:grid-cols-[140px_1fr] sm:items-center"
            >
              <div className="font-display text-3xl font-bold text-orange">{title}</div>
              <p className="text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal}>
          <SectionEyebrow text="// Qadriyatlar" />
          <h2 className="mt-4 font-display text-4xl font-bold leading-none sm:text-5xl">
            Tanlovimiz uchta asosga tayanadi.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="grid gap-5 md:grid-cols-3"
        >
          {principles.map((item) => (
            <motion.article
              key={item.title}
              variants={revealScale}
              transition={{ duration: 0.55 }}
              className="border border-border bg-panel p-7 clip-tac"
            >
              <item.icon className="h-8 w-8 text-orange" />
              <h3 className="mt-8 font-display text-2xl font-bold leading-none">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AdditionalInfoSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-panel/25">
      <div className="absolute inset-0 tactical-grid opacity-35" />
      <div className="relative mx-auto max-w-[1500px] px-6 py-20 lg:px-10 lg:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="max-w-4xl">
          <SectionEyebrow text="// Qo'shimcha ma'lumotlar" />
          <h2 className="mt-4 font-display text-4xl font-bold leading-none text-balance sm:text-5xl lg:text-6xl">
            ALTIMA ishlash uslubini 12 ta aniq nuqta orqali tushuntiramiz.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Bu ma'lumotlar mijoz nima uchun aynan bizdan tanlashi, qanday yordam olishi va
            buyurtma jarayoni qanday tamoyillarga tayanishini ko'rsatadi.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {additionalInfo.map((item, index) => (
            <motion.article
              key={item.title}
              variants={revealScale}
              transition={{ duration: 0.55 }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="group relative min-h-[250px] overflow-hidden border border-border bg-background p-6 clip-tac transition-colors hover:border-orange hover:bg-panel"
            >
              <div className="absolute right-4 top-4 font-display text-5xl font-bold text-muted-foreground/10 transition-colors group-hover:text-orange/15">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="flex h-12 w-12 items-center justify-center border border-border bg-panel text-orange clip-tac transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-ink">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-7 font-display text-2xl font-bold leading-none transition-colors group-hover:text-orange">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-orange transition-all duration-500 group-hover:w-full" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="overflow-hidden border-y border-border bg-panel/30">
      <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10 lg:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal}>
          <SectionEyebrow text="// Ish jarayoni" />
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
            Buyurtmadan qabul qilishgacha tartibli yo'l.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="mt-12 grid gap-4 lg:grid-cols-4"
        >
          {timeline.map(([step, title, text]) => (
            <motion.div
              key={step}
              variants={reveal}
              transition={{ duration: 0.55 }}
              className="relative border border-border bg-background p-6 clip-tac"
            >
              <div className="font-display text-5xl font-bold text-orange">{step}</div>
              <h3 className="mt-8 font-display text-2xl font-bold">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FieldSection() {
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10 lg:py-28">
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={reveal} className="max-w-3xl">
        <SectionEyebrow text="// Yo'nalishlar" />
        <h2 className="mt-4 font-display text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
          Har sharoit uchun alohida yondashuv.
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
        className="mt-12 grid gap-5 lg:grid-cols-3"
      >
        {fieldCards.map((card) => (
          <motion.article
            key={card.title}
            variants={revealScale}
            transition={{ duration: 0.6 }}
            className="group relative min-h-[430px] overflow-hidden clip-tac media-card"
          >
            <img src={card.img} alt={card.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/28 to-transparent" />
            <div className="absolute left-5 top-5 border border-orange/70 px-3 py-2 font-mono-tac text-[10px] uppercase text-orange">
              {card.tag}
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="font-display text-3xl font-bold">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Tanlovda vazifa turi, sirt va mavsum birinchi o'ringa qo'yiladi.
              </p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

function QualitySection() {
  return (
    <section className="border-y border-border bg-panel/35">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-28">
        <motion.div
          initial={{ opacity: 0, x: -34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7 }}
          className="relative min-h-[520px] overflow-hidden clip-tac media-card"
        >
          <img src={bootTactical} alt="Sifat nazorati" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/15 to-transparent" />
          <div className="absolute bottom-7 left-7 right-7 text-white">
            <div className="font-mono-tac text-[10px] uppercase text-orange">quality control</div>
            <h2 className="mt-3 font-display text-4xl font-bold leading-none">
              Omborga kirgan mahsulot nazoratsiz chiqmaydi.
            </h2>
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="self-center">
          <SectionEyebrow text="// Tekshiruv ro'yxati" />
          <h2 className="mt-4 font-display text-4xl font-bold leading-none sm:text-5xl">
            Ishonch kichik detallardan boshlanadi.
          </h2>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {qualityChecks.map((item) => (
              <motion.div
                key={item}
                variants={reveal}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 border border-border bg-background p-4 clip-tac"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-orange" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={reveal}
          className="border border-border bg-panel p-8 clip-tac lg:p-10"
        >
          <SectionEyebrow text="// Ishonch modeli" />
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-none sm:text-5xl">
            Mijoz uchun eng yaxshi mahsulot eng mos mahsulotdir.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            Shu sabab ALTIMA katalogi faqat chiroyli ko'rinishga qurilmaydi. Har bir sahifada
            o'lcham, foydalanish sharoiti, mavsum, taglik turi va xizmat muddati haqida aniqroq
            qaror qilishga yordam beradigan ma'lumotlar joylashadi.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
          className="grid gap-4"
        >
          {[
            { icon: MapPin, t: "O'zbekiston bo'ylab", d: "Shahar va viloyatlarga yetkazish yo'lga qo'yilgan." },
            { icon: Crosshair, t: "Aniq maslahat", d: "Model vazifaga mos kelmasa, boshqa variant tavsiya qilinadi." },
            { icon: Shield, t: "Kafolatli yondashuv", d: "Mahsulot holati va almashtirish tartibi ochiq tushuntiriladi." },
          ].map((item) => (
            <motion.div
              key={item.t}
              variants={revealScale}
              transition={{ duration: 0.55 }}
              className="border border-border bg-background p-6 clip-tac"
            >
              <item.icon className="h-6 w-6 text-orange" />
              <h3 className="mt-5 font-display text-2xl font-bold">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <img src={bootWinter} alt="ALTIMA bilan bog'lanish" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-background/88" />
      <div className="absolute inset-0 tactical-grid opacity-45" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={reveal}
        className="relative mx-auto max-w-[1500px] px-6 py-20 text-center lg:px-10 lg:py-28"
      >
        <SectionEyebrow text="// Keyingi qadam" />
        <h2 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-bold leading-none sm:text-5xl lg:text-7xl">
          Qaysi sharoitda yurasiz, biz shunga mos juftlikni topamiz.
        </h2>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/products"
            className="group inline-flex items-center justify-center gap-3 bg-orange px-7 py-4 font-mono-tac text-xs font-bold uppercase text-primary-foreground clip-tac"
          >
            Mahsulotlarni ko'rish
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center border border-border bg-background px-7 py-4 font-mono-tac text-xs font-bold uppercase hover:border-orange hover:text-orange clip-tac"
          >
            Contact
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function SectionEyebrow({ text }: { text: string }) {
  return <div className="font-mono-tac text-[11px] uppercase tracking-wider text-orange">{text}</div>;
}

function AboutHeader({
  mobileOpen,
  onMobileToggle,
  settings,
}: {
  mobileOpen: boolean;
  onMobileToggle: () => void;
  settings: ApiSettings;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-3 px-6 lg:px-10">
        <a href="/" className="group flex items-center gap-3">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden">
            <img src="/icon.png" alt="ALTIMA" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="leading-none">
            <div className="font-display text-xl font-bold tracking-[0.15em]">ALTIMA</div>
            <div className="mt-1 font-mono-tac text-[9px] text-orange">DO'KON · TAKTIK</div>
          </div>
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-4 py-2 font-mono-tac text-sm uppercase tracking-wider transition-colors ${
                item.href === "/about"
                  ? "text-orange"
                  : "text-muted-foreground hover:text-orange"
              }`}
            >
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
            <IconButton label="Qidiruv">
              <Search className="h-4 w-4" />
            </IconButton>
            <IconButton label="Sevimli">
              <Heart className="h-4 w-4" />
            </IconButton>
          </div>
          <IconButton label="Savat" badge="3">
            <ShoppingBag className="h-4 w-4" />
          </IconButton>
          <button
            type="button"
            aria-label={mobileOpen ? "Mobil menyuni yopish" : "Mobil menyuni ochish"}
            aria-controls="about-mobile-menu"
            aria-expanded={mobileOpen}
            onClick={onMobileToggle}
            className="flex h-10 min-w-[86px] items-center justify-center gap-2 border border-border bg-panel px-3 text-foreground transition-colors clip-tac hover:border-orange hover:bg-secondary hover:text-orange lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="font-mono-tac text-[10px] font-bold uppercase tracking-wider">
              {mobileOpen ? "Yopish" : "Menyu"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function AboutMobileMenu({
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
      id="about-mobile-menu"
      className="fixed inset-x-0 bottom-[calc(74px+env(safe-area-inset-bottom))] top-[72px] z-40 overflow-y-auto border-t border-border bg-background/98 backdrop-blur-xl lg:hidden"
    >
      <div className="space-y-6 px-6 py-6">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Qidirish", icon: Search },
            { label: "Sevimli", icon: Heart },
            { label: "Savat", icon: ShoppingBag },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex min-h-16 flex-col items-center justify-center gap-2 border border-border bg-panel text-foreground transition-colors clip-tac hover:border-orange hover:text-orange"
            >
              <action.icon className="h-4 w-4" />
              <span className="font-mono-tac text-[10px] uppercase tracking-wider">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {navLinks.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group min-h-20 border p-4 transition-colors clip-tac ${
                item.href === "/about"
                  ? "border-orange bg-orange text-ink"
                  : "border-border bg-panel hover:border-orange hover:bg-secondary"
              }`}
            >
              <div className={`font-mono-tac text-[10px] ${item.href === "/about" ? "text-ink/70" : "text-orange"}`}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className={`mt-3 font-display text-lg font-bold ${item.href === "/about" ? "text-ink" : "text-foreground group-hover:text-orange"}`}>
                {item.label}
              </div>
            </a>
          ))}
        </div>

        <div className="border border-border bg-panel p-4 clip-tac">
          <div className="font-mono-tac text-[10px] uppercase tracking-wider text-orange">Til tanlash</div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                disabled={!language.enabled}
                className={`px-3 py-3 font-mono-tac text-[11px] font-bold uppercase clip-tac ${
                  language.enabled ? "bg-orange text-ink" : "border border-border text-muted-foreground/60"
                }`}
              >
                {language.code}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <a
            href="/catalog"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-3 bg-orange px-6 py-4 font-mono-tac text-sm font-bold uppercase tracking-wider text-ink clip-tac glow-orange-hover"
          >
            Katalogni ko'rish
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={phoneHref(settings.phone)}
            className="inline-flex items-center justify-center gap-3 border border-border bg-panel px-6 py-4 font-mono-tac text-sm font-bold uppercase tracking-wider text-foreground transition-colors clip-tac hover:border-orange hover:text-orange"
          >
            <Phone className="h-4 w-4" />
            {settings.phone}
          </a>
        </div>

        <div className="grid gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
            <span>Toshkent sh., Amir Temur ko'chasi 108</span>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
            <span>ops@altimashop.uz</span>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
            <span>Dushanba-Yakshanba · 09:00-22:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutMobileBottomBar({
  menuOpen,
  onMenuToggle,
  onNavigate,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onNavigate: () => void;
}) {
  const items = [
    { label: "Bosh", href: "/", icon: Home },
    { label: "Katalog", href: "/catalog", icon: LayoutGrid },
    { label: "Qidiruv", href: "/products", icon: Search },
    { label: "Aloqa", href: "/contact", icon: ShoppingBag },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] lg:hidden">
      <nav className="pointer-events-auto grid w-full grid-cols-5 gap-1 border-t border-border bg-background/95 px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="flex min-h-14 flex-col items-center justify-center gap-1 font-mono-tac text-[9px] uppercase tracking-wider text-muted-foreground transition-colors clip-tac hover:bg-panel hover:text-orange"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </a>
        ))}
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

function LanguageSwitcher() {
  return (
    <div className="mr-1 hidden items-center gap-1 border border-border bg-panel/60 p-1 clip-tac md:flex lg:mr-2" aria-label="Til tanlash">
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          disabled={!language.enabled}
          aria-pressed={language.enabled}
          title={language.enabled ? language.label : `${language.label} tez orada qo'shiladi`}
          className={`px-2.5 py-1.5 font-mono-tac text-[10px] font-bold uppercase transition-colors ${
            language.enabled ? "bg-orange text-ink" : "cursor-not-allowed text-muted-foreground/60"
          }`}
        >
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
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Oq mavzuga o'tish" : "Qora mavzuga o'tish"}
      title={isDark ? "Oq mavzu" : "Qora mavzu"}
      className="relative flex h-10 w-10 items-center justify-center text-foreground transition-colors clip-tac hover:bg-secondary hover:text-orange"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function IconButton({
  children,
  label,
  badge,
}: {
  children: ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="relative flex h-10 w-10 items-center justify-center text-foreground transition-colors clip-tac hover:bg-secondary hover:text-orange"
    >
      {children}
      {badge && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center bg-orange px-1 font-mono-tac text-[9px] font-bold text-ink">
          {badge}
        </span>
      )}
    </button>
  );
}
