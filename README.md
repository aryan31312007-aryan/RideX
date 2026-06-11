# 🚀 RIDEX — AI-Powered Logistics & Mobility Platform

> Next-Gen taxi booking, bike rides, parcel delivery, and corporate fleet management — unified under one Firebase-powered platform.

## ✨ Platform Overview

RIDEX is a complete startup-grade transportation ecosystem with 4 integrated portals:

| Portal | URL | Access |
|--------|-----|--------|
| 🌐 **Landing Site** | `/` | Public |
| 📦 **Customer App** | `/dashboard` | Login Required |
| 🏍️ **Driver Portal** | `/driver` | Login Required |
| ⚡ **Admin Control** | `/admin` | Login Required |
| 🏢 **Corporate Portal** | `/corporate` | Login Required |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 App Router (TypeScript strict)
- **Styling:** TailwindCSS v4 + Custom Glassmorphism CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Database:** Firebase Realtime Database (asia-southeast1)
- **Auth:** Firebase Authentication
- **State:** Zustand (global) + React Context (Firebase session)
- **Maps:** Custom HTML5 Canvas-based city grid map simulator
- **Deployment:** Vercel-ready

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for Production
```bash
npm run build
```

---

## 🔐 Testing All Portals

Use the Login page at `/auth/login` — click a role tab to **autofill credentials**:

| Role | Email | Dashboard |
|------|-------|-----------|
| **Customer** | `client.user@gmail.com` | `/dashboard` |
| **Driver** | `driver.amit@ridex.io` | `/driver` |
| **Corporate** | `logistics@stark.com` | `/corporate` |
| **Admin** | `admin@ridex.io` | `/admin` |

All users are created automatically in Firebase on first login.

---

## 🗄️ Firebase Database Structure

```
ridex-rtdb/
├── users/          # User profiles keyed by UID
├── orders/         # All delivery/ride orders
├── drivers/        # Driver profiles + location + status
├── vehicles/       # Registered vehicle fleet
├── pricing_rules/  # Editable fare rules (bike/car/truck)
├── notifications/  # Admin broadcast messages
├── corporates/     # Corporate employee rosters
└── contacts/       # Support contact form submissions
```

---

## 📋 Key Features

### Customer App
- Book rides (bike/car) or parcel deliveries
- Click-on-map coordinate selection
- Real-time Firebase price calculation
- Live order tracking with simulation engine
- Printable tax invoices
- Order history & cancellation

### Driver Portal  
- Online/offline status toggle (syncs to Firebase)
- Live dispatch notifications for pending orders
- Accept/Reject job workflow
- Transit step progression (Accepted → Pickup → In Transit → Delivered)
- Earnings & rating dashboard
- Document upload for admin verification

### Admin Control Center
- Live fleet map showing all online drivers
- Real-time order monitoring
- **Driver Verificator** — approve document uploads
- **Pricing Rules** — edit base/per-km/per-minute rates live
- **Vehicle Addon** — register new vehicles and assign drivers
- **Notification Broadcaster** — push messages to Firebase
- Analytics dashboard with revenue charts

### Corporate Portal
- Credit balance & billing overview
- Employee roster management
- **Batch Manifest Dispatcher** — paste multiple delivery routes to dispatch all at once
- Invoice history by order

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Set install command: `npm install --legacy-peer-deps`
4. Deploy — Firebase credentials are embedded (no env vars needed for MVP)

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   ├── auth/             # Login + Register
│   ├── dashboard/        # Customer portal
│   │   ├── create/       # Book order + map
│   │   └── track/        # Live tracking + invoice
│   ├── driver/           # Driver portal
│   ├── admin/            # Admin control center
│   │   └── analytics/    # Platform analytics
│   ├── corporate/        # Corporate portal
│   ├── features/         # Features page
│   ├── pricing/          # Pricing page
│   ├── business/         # Business solutions
│   ├── about/            # About page
│   ├── contact/          # Contact + Firebase form
│   ├── help/             # FAQ accordion
│   └── profile/          # User profile settings
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx    # Responsive nav with role switcher
│   │   └── Footer.tsx    # Full marketing footer
│   └── maps/
│       └── MapCanvas.tsx # Interactive canvas city map
├── context/
│   └── FirebaseContext.tsx  # Auth + profile state
└── utils/
    ├── firebase.ts       # Firebase SDK + data seeding
    └── hooks.ts          # Custom React hooks
```
