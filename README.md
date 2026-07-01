<p align="center">
  <img src="https://mydevtools-d663d.web.app/logo.png" alt="MyDevTools Logo" width="120" height="120" />
</p>

<h1 align="center">✨ MyDevTools - Premium Website Inspiration Gallery</h1>

<p align="center">
  A sophisticated platform for designers and developers to capture, organize, and curate website inspirations effortlessly.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#security">Security</a> •
  <a href="#performance">Performance</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-v12-orange?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Cloudinary-323330?style=for-the-badge&logo=cloudinary" alt="Cloudinary" />
</p>

---

## 🌟 Preview

<p align="center">
  <img src="https://res.cloudinary.com/demkeuigf/image/upload/v1782913503/mydevtools-screenshot/preview.png" alt="MyDevTools Preview" width="800" />
</p>

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| 📸 **Auto-Capture** | Automatically generate high-quality screenshots using Puppeteer. |
| 🏷️ **Metadata Extraction** | Intelligent fetching of page titles, descriptions, and favicons. |
| 📂 **Smart Collections** | Organize your inspirations into custom themed folders for easy access. |
| ❤️ **Favorites** | One-click favoriting to keep your top-tier inspirations front and center. |
| 🔍 **Real-time Search** | Instant global search across website names, URLs, and descriptions. |
| 🌗 **Dark & Light Mode** | A beautiful, premium interface with support for both themes. |
| 📱 **Fully Responsive** | Mobile-first approach ensuring a seamless experience across all devices. |
| ☁️ **Cloudinary Integration** | Free, reliable image hosting for all your screenshots. |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend & Infrastructure
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth) (Google)
- **Database**: [Cloud Firestore](https://firebase.google.com/products/firestore)
- **Image Storage**: [Cloudinary](https://cloudinary.com/) (Free Tier)
- **Screenshot Engine**: [Puppeteer](https://pptr.dev/) (Headless Chrome)
- **XSS Protection**: [DOMPurify](https://github.com/cure53/DOMPurify)

---

## 🏗️ Architecture

MyDevTools follows a professional, scalable architecture for maximum maintainability:

```
src/
├── app/                 # Next.js App Router pages & APIs
│   ├── api/            # Serverless API routes
│   └── page.tsx        # Landing page
├── components/         # React components
│   ├── ui/             # Shadcn/UI atomic components
│   ├── dashboard/      # Dashboard feature components
│   ├── collections/    # Collection management components
│   └── layout/         # Layout components (Navbar, Sidebar, ThemeProvider, etc.)
├── context/            # React Context (Auth)
├── hooks/              # Custom hooks (useWebsites, useCollections)
├── lib/                # Utilities, validators, security helpers
│   ├── utils/          # Split utils for maintainability
│   │   ├── cn.ts
│   │   ├── date.ts
│   │   ├── string.ts
│   │   └── index.ts
│   ├── security.ts
│   ├── validators.ts
│   └── constants.ts
├── services/           # Business logic (Firestore, Screenshot)
└── types/              # TypeScript type definitions
```

- **Service Layer**: Decoupled logic in `src/services/` for testability and reuse
- **Custom Hooks**: Encapsulated business logic in `src/hooks/`
- **Type Safety**: Strict TypeScript types from `src/types/`
- **Utilities**: Reusable functions and validators in `src/lib/`

---

## 🔒 Security

MyDevTools is built with security as a top priority:
- **XSS Protection**: All user inputs sanitized using DOMPurify
- **Security Headers**: CSP, X-Frame-Options, X-XSS-Protection, etc., Referrer-Policy, Permissions-Policy
- **Firestore Rules**: Strict security rules ensuring users can only access their own data
- **Environment Variables**: Secure credential management via `.env.local`
- **Blocked Hosts**: Internal/localhost URLs blocked in screenshot API
- **URL Validation**: Strict input validation for all user-provided URLs

---

## ⚡ Performance & Speed Optimizations

The application is optimized for maximum performance:
- **Next.js Image Component**: Automatic lazy loading, format conversion (WebP/AVIF), responsive sizing
- **Aggressive Caching**: Images cached for 1 year; static assets cached appropriately
- **SWC Minification**: Super-fast JavaScript/TypeScript compilation
- **Turbopack**: Next.js 16 Turbopack enabled for lightning-fast builds
- **Compression**: Gzip/Brotli enabled for all assets
- **Powered-By Header**: Disabled for smaller response sizes

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- A Firebase project with Auth and Firestore enabled
- A Cloudinary account (free tier works perfectly!)

### 1. Installation
```bash
git clone https://github.com/aashishrajput9838/mydevtools.git
cd mydevtools
npm install
```

### 2. Environment Configuration
Copy `.env.local.example` to `.env.local` and fill in your credentials:
```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable **Firestore Database** (Native Mode)
3. Enable **Google Authentication**
4. Deploy Firestore rules from `firestore.rules`

### 4. Cloudinary Setup
1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com/)
2. Get your credentials from the Dashboard
3. Update your `.env.local` file

### 5. Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Aashish Rajput
</p>

<p align="center">
  If you like this project, please give it a ⭐ on GitHub!
</p>
