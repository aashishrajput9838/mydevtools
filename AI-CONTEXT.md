# AI-CONTEXT: MyDevTools Project

This document provides a comprehensive, up-to-date overview of the MyDevTools project for AI agents. It covers the architecture, tech stack, database schema, and development conventions.

## 1. Project Overview
**MyDevTools** is a premium website inspiration gallery. It allows users to:
- Save website URLs.
- Automatically generate screenshots using Puppeteer.
- Extract site metadata (Title, Description, Favicon).
- Organize inspirations into themed Collections.
- Search and filter saved websites.
- Favorite inspirations for quick access.

## 2. Tech Stack
- **Framework**: Next.js 16+ (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI (Radix UI)
- **Icons**: Lucide React
- **Backend/DB**: Firebase (Auth, Firestore)
- **Image Storage**: Cloudinary (Free Tier)
- **Automation**: Puppeteer (Running in Next.js API route)
- **Notifications**: Sonner
- **Security**: DOMPurify (for XSS protection)

## 3. Core Architecture

### Service Layer (`/src/services`)
Decouples UI from data fetching logic.
- `firestore.ts`: Centralized Firestore operations (CRUD for websites and collections). Uses `sanitizeXSS()` and `sanitizeUrl()` from `lib/security.ts`.
- `screenshot.ts`: Encapsulates Puppeteer screenshot logic and Cloudinary upload.

### Custom Hooks (`/src/hooks`)
Encapsulate business logic and data subscription.
- `useWebsites.ts`: Real-time subscription to user's websites, plus search filtering.
- `useCollections.ts`: Real-time subscription to user's collections, and specific collection details.

### Context (`/src/context`)
- `AuthContext.tsx`: Manages Firebase Authentication state (Google login).

### Utilities (`/src/lib`)
- `constants.ts`: Application-wide constants (routes, config, limits).
- `firebase.ts`: Firebase initialization.
- `utils/`: Split into single-responsibility files for better maintainability:
  - `cn.ts`: Classname merging (tailwind-merge + clsx).
  - `date.ts`: Date formatting with `date-fns`.
  - `string.ts`: String utilities (extractHostname, truncateText).
  - `index.ts`: Re-exports all utils for backward compatibility.
- `validators.ts`: Input validation functions (URLs, collection names).
- `security.ts`: XSS sanitization and URL/hostname security checks (using DOMPurify).
- `errors.ts`: Custom error classes and handling utilities.

## 4. Database Schema (Firestore)

### `users` (Collection)
```typescript
{
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp | FieldValue;
}
```

### `collections` (Collection)
```typescript
{
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Timestamp | FieldValue;
}
```

### `websites` (Collection)
```typescript
{
  id: string;
  userId: string;
  collectionId: string; // "default" or collection ID
  websiteName: string;
  url: string;
  thumbnailUrl: string; // URL to Cloudinary image
  faviconUrl: string;
  websiteTitle: string;
  websiteDescription: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Timestamp | FieldValue;
}
```

## 5. API Routes

### `POST /api/screenshot`
- **Input**: `{ url: string }`
- **Process**: Uses ScreenshotService -> Launches Puppeteer -> Crawls URL -> Takes Screenshot -> Uploads to Cloudinary -> Returns metadata.
- **Location**: `src/app/api/screenshot/route.ts`
- **Security**: Validates URL, blocks internal/localhost hosts, sanitizes hostname.

## 6. Development Conventions
- **Component Structure**: Use `use client` only when necessary.
- **Styling**: Prefer Tailwind utility classes. Use `cn()` (from `lib/utils`) for conditional classes.
- **State Management**: Prefer local state and custom hooks over global state managers unless necessary.
- **Firebase**: Always use `FirestoreService` instead of calling `firebase/firestore` directly in components.
- **Responsive**: Mobile-first design. Use `container mx-auto` for layout wrapping.
- **Type Safety**: Always use TypeScript types from `src/types` (user, collection, website).
- **Images**: Always use Next.js `Image` component instead of raw `<img>` tags, with proper `sizes` and `priority`.
- **Security**: Always sanitize user inputs using `sanitizeXSS()` from `lib/security.ts`.

## 7. Security
- **Firestore Rules**: Implemented in `firestore.rules`. Users can only access documents where `userId == request.auth.uid`.
- **Environment Variables**: Managed via `.env.local` (see `.env.local.example` for template). Required variables:
  - Firebase Config: `NEXT_PUBLIC_FIREBASE_*`
  - Cloudinary Config: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **XSS Protection**: All user inputs sanitized using DOMPurify via `lib/security.ts`.
- **Security Headers**: Configured in `next.config.ts` (CSP, X-Frame-Options, X-XSS-Protection, etc.).
- **Blocked Hosts**: Internal URLs and localhost blocked in screenshot API.

## 8. Performance & Speed Optimizations
- **Next.js Image Component**: Used for all images (lazy loading, automatic format conversion, responsive sizing).
- **Modern Image Formats**: WebP and AVIF support enabled for smaller file sizes.
- **Aggressive Caching**: Images cached for 1 year; static assets cached appropriately.
- **SWC Minification**: Enabled via Next.js 16 defaults.
- **Powered-By Header**: Disabled to reduce response size and improve security.
- **Turbopack**: Used for fast builds in Next.js 16.
- **Compression**: Gzip/Brotli enabled via `compress: true` in `next.config.ts`.

## 9. Directory Map
- `/src/app`: Next.js App Router pages and API endpoints.
- `/src/components/ui`: Atomic Shadcn components.
- `/src/components/dashboard`: Feature-specific components for the app.
- `/src/components/collections`: Collection management components.
- `/src/components/layout`: Shared layout components (Navbar, Sidebar, ThemeToggle, DashboardLayout, ThemeProvider).
- `/src/hooks`: Reusable logic hooks.
- `/src/services`: API and Database services.
- `/src/types`: Global TypeScript definitions (separated into individual type files for clarity).
- `/src/lib`: Utilities, constants, validators, security helpers, and error handlers.
