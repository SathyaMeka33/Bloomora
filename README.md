# 🌸 Bloomora — India's Premier AI-Powered Hyperlocal Gifting Platform

Bloomora is an industry-grade e-commerce gifting platform that connects gift seekers with local artisan bakers, florists, and creators. Featuring an emotion-driven AI Gift Concierge, dynamic Indian festive occasion countdowns, signature "Meet Me There" smart pickup lockers, and a dedicated multi-vendor Seller Partner Portal.

---

## ✨ Features Overview

### 🛍️ Customer Experience
- **AI Gift Finder**: Emotion-driven recommendations matching recipient relationship, occasion, and budget with custom Gift Fit Scores™.
- **Dynamic Indian Occasion Engine**: Live countdowns to authentic Indian festivals (Navratri, Dussehra, Diwali, Bhai Dooj, etc.) with automated daily date updates.
- **Custom Gift Studio**: Build custom hampers with live packaging selection, custom wax seals, and personalized greeting cards.
- **Signature Fulfillment**:
  - ⚡ *Hyperlocal Same-Day Delivery* (from ₹149 within partner radius).
  - 📍 *"Meet Me There" Smart Pickup Lockers* for confidential or surprise gifting.
- **Customer Account Suite**: Wishlist, Reminders & Occasions manager, Gift DNA profiles, Saved delivery addresses, and Live order tracking.

### 🏪 Seller Partner Portal (`/partner`)
- **Strict Role & Session Isolation**: Completely separate customer and merchant sessions with zero cross-leakage.
- **Merchant Authentication Gate**: Restricted access requiring verified merchant credentials.
- **Fulfillment Pipeline**: Real-time 4-stage kanban tracking (`New / Got`, `Preparing`, `Dispatched`, `Delivered`).
- **Catalog Management**: Instant product publishing with rich photography presets, story descriptions, and inline inventory adjusters.
- **Inventory Replenishment**: Low stock alerts with one-click adjustments.
- **Financial Ledger & Settlements**: Gross sales tracking, 10% platform fee calculation, net earnings ledger, and bank/UPI payout configuration.
- **Printable Invoices & Dispatch Slips**: Formatted packing slips ready for kitchen and courier handover.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Python 3.13, Django, Django REST Framework, SimpleJWT (JWT Authentication).
- **Database**: SQLite (Development) / PostgreSQL (Production).
- **Payment & Cloud**: Razorpay integration ready, Firebase / Cloud Storage support.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Credentials for Testing

- **Customer Demo**: `customer@bloomora.com` / `Bloomora@2026`
- **Seller Partner Demo**: `seller@bloomora.com` / `Bloomora@2026`

---

## 📄 License
MIT License. Crafted with intention for Bloomora.
