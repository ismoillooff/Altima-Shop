# ALTIMA SHOP

ALTIMA SHOP - taktik, harbiy va outdoor oyoq kiyimlar uchun frontend loyiha.

Bu public repository faqat frontend kodlarini saqlaydi. Backend kodi public repository ichidan olib tashlangan va alohida private/local joyda saqlanishi kerak.

## Aloqa

Frontend, integratsiya yoki loyiha bo'yicha savollar uchun:

- Telefon: `+998950051545`
- Telegram: [@ismoillooff](https://t.me/ismoillooff)
- Instagram: [@ismoillooff](https://instagram.com/ismoillooff)

## Texnologiyalar

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- Radix UI
- Framer Motion
- Lucide React

## Loyiha Tuzilmasi

```text
Altima/
  Front/
    public/
    src/
      assets/
      components/
      hooks/
      lib/
      routes/
    package.json
    vite.config.ts
    wrangler.jsonc
  .gitattributes
  .gitignore
  README.md
```

## Asosiy Imkoniyatlar

- Home sahifa.
- Katalog sahifasi.
- Mahsulotlar ro'yxati.
- Mahsulot detail sahifasi.
- Savatcha.
- Buyurtma oynasi.
- Contact sahifasi.
- Responsive mobile va desktop interfeys.

## Talablar

- Node.js 20 yoki undan yangi versiya
- npm yoki bun
- Git

## Ishga Tushirish

```powershell
cd Front
npm install
npm run dev
```

Frontend odatda quyidagi manzillardan birida ishlaydi:

- `http://127.0.0.1:5173/`
- `http://localhost:5173/`

## Environment

Backend API manzilini ko'rsatish uchun `Front/.env` yarating:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Public repo ichida real secret, token, parol yoki private backend kodi saqlamang.

## Buyruqlar

```powershell
npm run dev
npm run build
npm run build:dev
npm run preview
npm run lint
npm run format
```

## Sahifalar

- `/` - bosh sahifa.
- `/about` - brend haqida.
- `/catalog` - katalog.
- `/products` - mahsulotlar ro'yxati.
- `/products/$slug` - mahsulot detail sahifasi.
- `/contact` - aloqa sahifasi.
- `/own` - qo'shimcha sahifa.

## Backend Haqida

Backend public repositorydan olib tashlangan. Backend kodi alohida private repository, server yoki local backup ichida saqlanishi kerak.

Frontend backend bilan faqat API URL orqali ulanadi:

```env
VITE_API_BASE_URL=https://your-api-domain.uz/api
```

## Production Build

```powershell
cd Front
npm run build
```

Build natijasini hosting yoki deployment platformasiga joylash mumkin.

## Litsenziya va Egalik

Bu loyiha ALTIMA SHOP uchun ishlab chiqilgan. Backend kodi, server sozlamalari yoki loyiha bo'yicha texnik savollar uchun yuqoridagi aloqa kanallari orqali bog'laning.
