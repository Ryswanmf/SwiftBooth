# Swift Studio - Digital Photobooth

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-pink?style=for-the-badge&logo=lucide)

Swift Studio adalah aplikasi photobooth berbasis web yang dirancang dengan estetika Soft Pink yang elegan. Aplikasi ini memungkinkan pengguna untuk menangkap momen spesial mereka secara digital dengan berbagai pilihan frame unik dan filter artistik.

---

## Fitur Utama

*   Elegant Soft Pink Theme - Antarmuka pengguna yang modern, bersih, dan memanjakan mata.
*   Dual Frame Support:
    *   Swift Pink Arch (6 Slots): Desain lengkung yang estetik untuk lebih banyak ekspresi.
    *   Swift Pink Polaroid (4 Slots): Gaya klasik minimalis yang timeless.
*   Real-time Filter System - Pilih filter favoritmu (B&W, Vintage, Vibrant, Pinky) setelah sesi foto selesai.
*   Interactive Countdown - Indikator hitung mundur visual yang membantu pengguna bersiap.
*   Cloud Storage Integration - Simpan mahakarya Anda ke Supabase dan bagikan tautannya dengan mudah.
*   Local Download - Unduh langsung hasil foto dalam format JPG berkualitas tinggi.
*   Responsive Design - Dioptimalkan untuk penggunaan di perangkat mobile maupun desktop.

---

## Teknologi yang Digunakan

*   Framework: Next.js 15 (App Router)
*   Language: TypeScript
*   Styling: Tailwind CSS
*   Database & Storage: Supabase
*   Icons: Lucide React
*   State Management: React Context API

---

## Persiapan & Instalasi

### 1. Clone Repositori
```bash
git clone https://github.com/username/photoboth.git
cd photoboth
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file .env.local di akar direktori dan tambahkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Akses aplikasi di http://localhost:3000.

---

## Struktur Folder

```text
src/
├── app/            # Next.js App Router (Layouts & Pages)
├── components/     # UI Components (CameraView, dsb)
├── hooks/          # Custom Hooks & Context Store
├── lib/            # Third-party configurations (Supabase, Utils)
public/
└── frames/         # Aset bingkai (PNG)
```

---

## Credit

Dibuat untuk mengabadikan momen indah Anda.

Cryswann Studio © 2026
