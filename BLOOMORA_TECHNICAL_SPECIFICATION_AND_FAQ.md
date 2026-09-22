# Bloomora: Comprehensive Technical Architecture, Tech Stack & Engineering Q&A Document

**Project:** Bloomora — Hyperlocal Gifting Atelier, AI-Driven Gift Recommendation Platform & Merchant Ecosystem  
**Repository:** `Bloomora-main`  
**Version:** 1.0.0 Production Architecture  
**Generated:** September 2026  

---

## Table of Contents
1. [Executive Summary & System Architecture Overview](#1-executive-summary--system-architecture-overview)
2. [Comprehensive Tech Stack Breakdown](#2-comprehensive-tech-stack-breakdown)
   - 2.1 Frontend Stack & Usage Matrix
   - 2.2 Backend Stack & Usage Matrix
   - 2.3 Artificial Intelligence & Machine Learning Stack
   - 2.4 Cloud, Payments & Third-Party Integrations
3. [Core Technical Features & Capabilities](#3-core-technical-features--capabilities)
   - 3.1 Multi-Role Role-Based Access Control (RBAC)
   - 3.2 Authentic Curated Products & Catalog Engine (Gifts Catalog)
   - 3.3 AI Gift Finder & Gift Fit Score™ Algorithmic Engine
   - 3.4 Interactive AI Concierge & Chatbot
   - 3.5 Merchant Partner Portal & Studio Management
   - 3.6 Hyperlocal Delivery, Stealth Delivery & "Meet Me There"
   - 3.7 Custom Hamper & Gift Box Builder
   - 3.8 Indian Occasion Calendar & Gift DNA / Gift Memory
   - 3.9 End-to-End Commerce, Cart & Payment Gateway
4. [Technical Approaches & Architectural Decisions](#4-technical-approaches--architectural-decisions)
   - 4.1 Headless Decoupled Client-Server Model
   - 4.2 Resilient Backend-First with Offline Local Store Fallback
   - 4.3 Custom Email-Based Authentication & Dual-Keyword Auth
   - 4.4 Multi-Factor Recommendation Algorithm Design
   - 4.5 Responsive Editorial & Luxury Design System
5. [Exhaustive Technical Questions & Answers (Q&A)](#5-exhaustive-technical-questions--answers-qa)
   - 5.1 Architecture & Infrastructure (Q1 – Q5)
   - 5.2 Authentication & Security (Q6 – Q10)
   - 5.3 Artificial Intelligence & Recommendation Algorithms (Q11 – Q15)
   - 5.4 Database, Data Models & Django Backend (Q16 – Q20)
   - 5.5 Frontend State Management, Rendering & Performance (Q21 – Q25)
   - 5.6 Commerce, Payments & Order Fulfillment (Q26 – Q30)

---

## 1. Executive Summary & System Architecture Overview

**Bloomora** is an enterprise-grade, omnichannel e-commerce and hyperlocal gifting platform designed specifically for elevated gifting experiences. Unlike conventional shopping carts, Bloomora bridges emotional intelligence with logistical precision through:

- **AI-Powered Gift Discovery:** Intent-based, contextual gift recommendations powered by Google Gemini and proprietary multi-factor affinity scoring (Gift Fit Score™).
- **Hyperlocal Fulfilment:** Rapid delivery coordination with live coordinates, stealth "surprise" delivery options, and artisan routing.
- **Merchant Partner Ecosystem:** A dedicated Merchant Studio enabling artisan bakers, florists, and luxury confectioners to manage products, view real-time orders, and track fulfillment.
- **Enterprise-Grade Headless Architecture:** Clean separation of concerns between an ultra-responsive Next.js 16 frontend and a robust Django REST Framework backend.

```
                                  ┌─────────────────────────────────────────────────────────────┐
                                  │                       CLIENT TIERS                          │
                                  │   (Mobile Web, Desktop Browsers, Merchant Partner Portal)   │
                                  └──────────────────────────────┬──────────────────────────────┘
                                                                 │
                                                    HTTPS / JSON / JWT Tokens
                                                                 │
                                  ┌──────────────────────────────▼──────────────────────────────┐
                                  │               FRONTEND: NEXT.JS 16 APP ROUTER               │
                                  │  • React 19 Server & Client Components                      │
                                  │  • Tailwind CSS v4 + Framer Motion (Editorial Design)       │
                                  │  • Local Reactive State Stores (SellerStore, Cart, Auth)    │
                                  │  • Client-side Gemini SDK (@google/genai)                   │
                                  └──────────────────────────────┬──────────────────────────────┘
                                                                 │
                                                    REST API Requests (JWT Auth)
                                                                 │
                                  ┌──────────────────────────────▼──────────────────────────────┐
                                  │             BACKEND: DJANGO REST FRAMEWORK (DRF)            │
                                  │  • Custom User Model (Email Auth, Multi-Role RBAC)          │
                                  │  • 19 Modular Domain Apps (Catalog, Orders, AI, Creators)   │
                                  │  • SimpleJWT Authentication & Permission Classes            │
                                  │  • drf-spectacular OpenAPI 3.0 / Swagger Documentation      │
                                  └──────────────┬───────────────────────────────┬──────────────┘
                                                 │                               │
                      ┌──────────────────────────▼──────────┐        ┌───────────▼───────────┐
                      │          PERSISTENCE LAYER          │        │  INTELLIGENCE & CLOUD │
                      │  • SQLite3 (Dev) / PostgreSQL (Prod)│        │  • Google Gemini API  │
                      │  • Static & Media Asset Storage     │        │  • Razorpay Payments  │
                      │  • Django ORM with Custom Managers  │        │  • Firebase Firestore │
                      └─────────────────────────────────────┘        └───────────────────────┘
```

---

## 2. Comprehensive Tech Stack Breakdown

### 2.1 Frontend Stack & Usage Matrix

| Technology / Library | Version | Where It Is Used in Bloomora | Purpose & Responsibility |
| :--- | :--- | :--- | :--- |
| **Next.js** | `^16.2.12` | Root application framework (`frontend/app/`) | Provides React App Router, hybrid server/client rendering, file-based routing, API routes, fast image optimization, and Suspense streaming. |
| **React & React-DOM** | `^19.2.4` | Throughout the entire UI | Component architecture, state lifecycle, hooks (`useState`, `useEffect`, `useMemo`, `useCallback`), and Concurrent React capabilities. |
| **TypeScript** | `5.9.3` | All frontend `.ts` and `.tsx` source files | Strict compile-time type checking, domain interface definitions (`frontend/lib/types/`), and API contract safety. |
| **Tailwind CSS** | `^4.0` | Global styles (`app/globals.css`), inline classes | Modern utility-first CSS engine; implements Bloomora’s bespoke luxury color palette (`#FFF8F5`, `#3B172D`, `#D98C95`, `#C8A46A`). |
| **Framer Motion** | `^12.43.0` | Hero headers, modals, filters, page transitions | Rich micro-interactions, smooth spring-based modal entrances, accordion expansions, and interactive hover states. |
| **Lucide React** | `^1.28.0` | All UI components, navigation, buttons | Scalable, accessible SVG vector icons representing gifting categories, controls, and status badges. |
| **Canvas Confetti** | `^1.9.4` | Checkout confirmation, surprise triggers | Celebration animations upon completing orders, booking surprise delivery, or achieving high Gift Fit scores. |
| **@vis.gl/react-google-maps** | `^1.9.0` | `app/meet-me-there/`, `app/tracking/` | Interactive GPS coordinate picking, destination geocoding, and hyperlocal courier live tracking. |
| **Razorpay Checkout** | `^2.9.8` | `app/checkout/` | Client-side payment pop-up handling UPI, Credit/Debit cards, Net Banking, and digital wallets. |
| **Firebase / Firestore** | `^12.17.1` | `lib/firebase.ts`, `lib/firestoreService.ts` | Real-time WebSocket delivery updates, live courier location sync, and cloud fallback storage. |

### 2.2 Backend Stack & Usage Matrix

| Technology / Package | Version | Where It Is Used in Bloomora | Purpose & Responsibility |
| :--- | :--- | :--- | :--- |
| **Python** | `3.11+ / 3.12+` | Entire backend runtime (`backend/`) | High-performance, clean language platform hosting the web services and algorithmic engines. |
| **Django** | `>=5.1, <5.2` | Core backend framework (`backend/config/`) | Enterprise web framework providing the ORM, migration engine, admin console, signal dispatching, and security middleware. |
| **Django REST Framework (DRF)** | `>=3.15` | All 19 domain apps (`backend/apps/`) | Serialization, deserialization, API viewsets, generic controllers, request parsing, and HTTP status handling. |
| **SimpleJWT (`djangorestframework-simplejwt`)** | `>=5.3` | `apps/accounts/`, `apps/accounts/serializers.py` | Stateless JSON Web Token authentication (Access + Refresh tokens) with token blacklisting support. |
| **django-cors-headers** | `>=4.3` | `backend/config/settings/base.py` | Configures Cross-Origin Resource Sharing (CORS) allowing safe API communication from `http://localhost:3000`. |
| **django-filter** | `>=24.1` | `apps/catalog/`, `apps/orders/` | Declarative query filtering across products (price ranges, categories, occasion tags, ratings, availability). |
| **drf-spectacular** | `>=0.27` | `backend/config/urls.py`, `/api/docs/` | Automated OpenAPI 3.0 schema generation and Swagger UI / ReDoc interactive documentation. |
| **Pillow** | `>=10.4` | `apps/catalog/models.py`, `apps/accounts/models.py` | Image processing, thumbnail generation, avatar handling, and product image uploads. |
| **python-decouple** | `>=3.8` | Settings configuration | Environment variable separation (`.env`), keeping secret keys and API credentials out of source control. |
| **SQLite3 / PostgreSQL** | Dual Ready | Database engine | SQLite3 for zero-configuration, lightweight local development; plug-and-play PostgreSQL configuration for production. |

### 2.3 Artificial Intelligence & Machine Learning Stack

| Tool / Model | Version / Provider | Where It Is Used | Purpose & Responsibility |
| :--- | :--- | :--- | :--- |
| **Google Gemini API (`@google/genai`)** | `^2.15.0` (Client) | `frontend/lib/gemini.ts`, `app/ai-concierge/` | Powers the conversational AI Concierge, natural language prompt decomposition, and gift sentiment analysis. |
| **google-generativeai** | `>=0.8` (Python) | `backend/apps/ai/views.py` | Server-side AI endpoint extracting structured gifting personas, message generation, and intent tagging. |
| **Gift Fit Score™ Engine** | Bloomora Proprietary | `apps/recommendations/service.py`, `frontend/lib/gemini.ts` | Multi-criteria scoring algorithm calculating compatibility percentages (0–100%) between products and recipient profiles. |

### 2.4 Cloud, Payments & Third-Party Integrations

| Service | Provider | Where It Is Used | Purpose & Responsibility |
| :--- | :--- | :--- | :--- |
| **Razorpay API** | Razorpay India | `backend/apps/payments/`, `frontend/app/checkout/` | Payment gateway order generation, signature verification (`razorpay_signature`), and refund processing. |
| **Firebase Admin SDK** | Google Cloud | `backend/`, `frontend/next.config.ts` | Server-side privileged access to Firestore, custom authentication claims, and push notification relays. |
| **Unsplash Image CDN** | Unsplash Source | `backend/generate_1000_products.py`, product dataset | High-resolution, curated royalty-free lifestyle photography for flowers, cakes, chocolates, and artisan hampers. |

---

## 3. Core Technical Features & Capabilities

### 3.1 Multi-Role Role-Based Access Control (RBAC)
Bloomora supports five distinct system roles defined on the `User` model:
1. **`customer`**: Gifting customers who browse catalogs, use the AI Finder, customize hampers, and place orders.
2. **`seller`**: Artisan merchants, florists, and bakers who own a verified studio, list inventory, and fulfill hyperlocal orders.
3. **`admin`**: Superusers and platform moderators with full control over users, inventory approval, analytics, and disputes.
4. **`support`**: Customer support personnel assisting with order modifications, refunds, and live chat inquiries.
5. **`delivery_partner`**: Hyperlocal couriers who receive pickup alerts, navigate via coordinates, and confirm stealth drops.

### 3.2 Authentic Curated Products & Catalog Engine (Gifts Catalog)

Bloomora features **245 authentic curated products** across 11 distinct artisanal gifting categories. Every single product in the store directly maps to verified photography from the Gifts asset archive, ensuring 100% visual fidelity between the catalog and physical delivery.

#### Verified Product & Image Inventory Matrix

##### Artisanal Floral Bouquets (23 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Romantic Blush Pink Rose Hand Bouquet** | 15 Fresh Dutch Pink Roses with Eucalyptus in Matte Wrap | ₹1299 | /gifts/Bouquets/IMG_4110.JPG |
| 02 | **Imperial Crimson Velvet Rose Cylinder** | Deep Red Scarlet Roses in Luxury Black Keepsake Wrap | ₹1499 | /gifts/Bouquets/IMG_4111.JPG |
| 03 | **Pastel Lilac & Hydrangea Dream Bouquet** | Lavender Peonies, Lilac Roses & Gypsophila Mist | ₹1399 | /gifts/Bouquets/IMG_4112.JPG |
| 04 | **Pure Casablanca Ivory Lily & White Rose Sheaf** | Fragrant White Oriental Lilies with Snow White Roses | ₹1599 | /gifts/Bouquets/IMG_4113.JPG |
| 05 | **Sunburst Peach & Buttercup Dutch Rose Bouquet** | Warm Peach Roses with Sun-Drenched Buttercup Blooms | ₹1199 | /gifts/Bouquets/IMG_4114.JPG |
| 06 | **Vintage Champagne & Dusty Rose Hand-Tied Spray** | Antique Champagne Blooms with Silver Dollar Eucalyptus | ₹1349 | /gifts/Bouquets/IMG_4115.JPG |
| 07 | **Royal Orchid Cascade & White Blossom Fan** | Fresh Cut Phalaenopsis Orchids with White Tea Roses | ₹1799 | /gifts/Bouquets/IMG_4116.JPG |
| 08 | **Sweet Blossom Miniature Rose Posy** | Compact Pink Spray Roses with Baby’s Breath | ₹799 | /gifts/Bouquets/IMG_4117.JPG |
| 09 | **Symphony Scarlet & Pink Grand Floral Cascade** | Two-Tone Dutch Roses in Layered Organza Sheaf | ₹1699 | /gifts/Bouquets/IMG_4118.JPG |
| 10 | **Sunflower Meadow & Golden Daisy Posy** | Bright Yellow Sunflowers with Chamomile Sprigs | ₹999 | /gifts/Bouquets/IMG_4119.JPG |
| 11 | **Grand 30-Stem Dutch Red Rose Cascade** | Opulent Red Rose Explosion with Satin Bow | ₹2199 | /gifts/Bouquets/IMG_4120.JPG |
| 12 | **Lavender Mist & Purple Dahlia Artisanal Bunch** | Deep Violet Dahlias & Fragrant Lavender Sprigs | ₹1249 | /gifts/Bouquets/IMG_4121.JPG |
| 13 | **Blushing Bride Peony & White Rose Ensemble** | Soft Fluffy Peonies with Ivory Spray Blooms | ₹1899 | /gifts/Bouquets/IMG_4122.JPG |
| 14 | **Golden Glow Coral & Apricot Tulip Sheaf** | Holland Coral Tulips with Golden Meadow Greens | ₹1499 | /gifts/Bouquets/IMG_4123.JPG |
| 15 | **Ruby Red Velvet Mini Rose Bouquet** | Pocket-Friendly Romantic 8-Rose Posy | ₹599 | /gifts/Bouquets/IMG_4124.JPG |
| 16 | **Cherry Blossom & Powder Pink Lily Bouquet** | Delicate Asian Cherry Sprays with Asiatic Lilies | ₹1399 | /gifts/Bouquets/IMG_4125.JPG |
| 17 | **Sun-Drenched Yellow Tulip & Daisy Hand Sheaf** | Vibrant Yellow Tulips with Green Foliage Accents | ₹1149 | /gifts/Bouquets/IMG_4126.JPG |
| 18 | **Elysian Garden Mixed Meadow Flora** | Ranunculus, Delphiniums & Wild Hydrangeas | ₹1599 | /gifts/Bouquets/IMG_4127.JPG |
| 19 | **Midnight Indigo Iris & White Rose Cascade** | Deep Blue Irises Paired with Crisp Snow Blooms | ₹1349 | /gifts/Bouquets/IMG_4128.JPG |
| 20 | **Classic Single Red Rose Love Gesture** | Single Long-Stem Dutch Rose with Gypsophila in Cone Wrap | ₹199 | /gifts/Bouquets/IMG_4129.JPG |
| 21 | **Opulent Multi-Tiered Garden Rose Bouquet** | 24 Heritage Garden Roses with Golden Fern Sprays | ₹1999 | /gifts/Bouquets/IMG_4130.JPG |
| 22 | **Pure White Orchid & Hydrangea Cloud Bouquet** | Fluffy White Hydrangeas with Moth Orchid Petals | ₹1649 | /gifts/Bouquets/IMG_4131.JPG |
| 23 | **Sweet Valentine Two-Tone Rose & Carnation Posy** | Blush Dutch Carnations with Ruby Silk Roses | ₹899 | /gifts/Bouquets/IMG_4132.JPG |

##### Gourmet Celebration Cakes (22 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Pastel Rosette & Edible Pearl Celebration Cake** | Whipped Vanilla Buttercream with Pink Rose Piping & Pearls | ₹599 | /gifts/Cakes/IMG_4021.JPG |
| 02 | **Belgian Mocha Chocolate Drip Torte** | Dark Chocolate Ganache Drip with Espresso Swirls | ₹699 | /gifts/Cakes/IMG_4022.JPG |
| 03 | **Golden Milestone Buttercream Floral Cake** | Palette-Knife Buttercream Flowers with Gold Number 20 | ₹749 | /gifts/Cakes/IMG_4023.JPG |
| 04 | **Velvet Rose Gold Bento Mini Cake** | Single-Portion Strawberry Cream Bento with Gold Dust | ₹349 | /gifts/Cakes/IMG_4025.JPG |
| 05 | **Vintage Lambeth Piped Royal Wedding Cake** | Intricate Victorian Ruffle Piping with Cherry Garnish | ₹899 | /gifts/Cakes/IMG_4026.JPG |
| 06 | **Wild Berry Mascarpone Naked Layer Cake** | Fresh Raspberries, Blueberries & Whipped Mascarpone | ₹799 | /gifts/Cakes/IMG_4027.JPG |
| 07 | **Dark Forest Cherry & Chocolate Shaving Cake** | Kirsch-Infused Cocoa Sponge with Fluffy White Cream | ₹649 | /gifts/Cakes/IMG_4028.JPG |
| 08 | **Lotus Biscoff Crunch Caramel Drip Cake** | Caramelized Cookie Butter Frosting & Biscoff Biscuits | ₹749 | /gifts/Cakes/IMG_4029.JPG |
| 09 | **Tender Heart Red Velvet Bento Love Cake** | Heart-Shaped Bento Cake with Custom Lettering | ₹399 | /gifts/Cakes/IMG_4030.JPG |
| 10 | **Salted Butter Caramel & Roasted Pecan Gateau** | Rich Butterscotch Drip with Toasted Pecan Halves | ₹799 | /gifts/Cakes/IMG_4031.JPG |
| 11 | **Pistachio Rosewater Persian Love Cake** | Ground Pistachio Sponge with Cardamom & Dried Rosebuds | ₹849 | /gifts/Cakes/IMG_4032.JPG |
| 12 | **Double Belgian Dark Chocolate Truffle Cake** | 70% Dark Cocoa Ganache with Shimmering Truffle Balls | ₹699 | /gifts/Cakes/IMG_4033.JPG |
| 13 | **Baby Blue Cloud Ombre Birthday Cake** | Sky Blue Watercolour Gradient Buttercream & Pearl Dust | ₹599 | /gifts/Cakes/IMG_4035.JPG |
| 14 | **Lemon Curd & Poppyseed Zest Mini Cake** | Tart Meyer Lemon Filling with Candied Citrus Slices | ₹499 | /gifts/Cakes/IMG_4036.JPG |
| 15 | **Almond Praline & Coffee Mocha Gateau** | Italian Espresso Soaked Sponge with Caramelized Almonds | ₹749 | /gifts/Cakes/IMG_4037.JPG |
| 16 | **Pastel Lavender Earl Grey Tea Infused Cake** | Bergamot Earl Grey Sponge with Lavender Buttercream | ₹649 | /gifts/Cakes/IMG_4039.JPG |
| 17 | **Cookies & Cream Oreo Crumble Bento Cake** | Crushed Oreo Sponge with Cookie Butter Cream | ₹349 | /gifts/Cakes/IMG_4040.JPG |
| 18 | **Golden Pineapple Upside-Down Rustic Cake** | Caramelized Tropical Pineapple Rings & Glace Cherries | ₹549 | /gifts/Cakes/IMG_4041.JPG |
| 19 | **Matcha Green Tea White Chocolate Mousse Cake** | Kyoto Uji Matcha Sponge with Silky White Ganache | ₹799 | /gifts/Cakes/IMG_4042.JPG |
| 20 | **Hazelnut Nutella Crunch Explosion Cake** | Rich Nutella Swirls with Ferrero Rocher Toppings | ₹899 | /gifts/Cakes/IMG_4043.JPG |
| 21 | **Strawberry Shortcake Chiffon Cloud** | Feather-Light Chiffon Sponge with Fresh Sweet Strawberries | ₹649 | /gifts/Cakes/IMG_4044.JPG |
| 22 | **Confetti Funfetti Rainbow Birthday Cake** | Vanilla Sponge Studded with Multi-Color Sugar Sprinkles | ₹599 | /gifts/Cakes/IMG_4045.JPG |

##### Men Accessories & Style (32 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Onyx Bar Cuban Link Steel Bracelet** | Polished Stainless Steel with Black Onyx Centerpiece | ₹699 | /gifts/Accessories for mens/128556de8739d8368578a70501d6f90f.jpg |
| 02 | **Geometric Metal Aviator Sunglasses** | UV400 Polarized Hexagonal Frame in Designer Case | ₹1299 | /gifts/Accessories for mens/1660c9f130ebdc65b9069f0187267c3c.jpg |
| 03 | **18K Gold Plated Mariner Chain Bracelet** | Minimalist Flat Marine Link Chain for Men | ₹899 | /gifts/Accessories for mens/253d11eeed1fd65f0faad49c16626950.jpg |
| 04 | **Pablo Raez Executive Stainless Steel Watch** | Midnight Sunburst Dial with Date & Roman Numerals | ₹1899 | /gifts/Accessories for mens/31539d062f953b238e58806ce775e1a7.jpg |
| 05 | **Minimalist Magnetic Leather Cardholder** | Top-Grain Vintage Brown Leather with RFID Shielding | ₹499 | /gifts/Accessories for mens/35b1ad9bfd2cd27bae7e3b57e47faa19.jpg |
| 06 | **Tactical Quick-Release Nylon Webbing Belt** | Matte Black Alloy Buckle & High-Tensile Webbing | ₹399 | /gifts/Accessories for mens/3c5fc613e4ced45e4cb21a02113364fc.jpg |
| 07 | **Signet Black Onyx Stainless Steel Ring** | Brushed & Mirror-Polished Men’s Statement Band | ₹549 | /gifts/Accessories for mens/3c61fe7cf11d1ec646cc00220ee58afa.jpg |
| 08 | **WilliamPolo Geometric Embossed Leather Wallet** | Architectural Faceted Texture & Zip Coin Compartment | ₹1199 | /gifts/Accessories for mens/4ba662f14ef683606774111da0e0bae3.jpg |
| 09 | **WilliamPolo Gold Eagle Automatic Ratchet Belt** | Full-Grain Textured Black Leather with Gold Hardware | ₹1399 | /gifts/Accessories for mens/4d234cf14d05a260ad5ff72cddb6ceb6.jpg |
| 10 | **Vintage Bronze Skeleton Pocket Watch** | Antique Filigree Casing with Open Mechanical Gear Window | ₹999 | /gifts/Accessories for mens/4f56df76148f53b3a19c8d24993ad72d.jpg |
| 11 | **Dual-Row Braided Leather & Tiger Eye Bracelet** | Genuine Nappa Leather with Magnetic Steel Clasp | ₹649 | /gifts/Accessories for mens/55fe9497ce358d7f6643431ba4053e39.jpg |
| 12 | **Classic Matte Onyx & Steel Cufflink Pair** | Executive Formalwear Accessory with Pivot Toggle | ₹499 | /gifts/Accessories for mens/5bf967edabd8f92b49517dc32c350b57.jpg |
| 13 | **Titanium Steel Figaro Link Neck Chain** | 6mm Diamond-Cut Figaro Chain with Lobster Claw Clasp | ₹799 | /gifts/Accessories for mens/60fa847fe8c0210d673a834dc8ed031d.jpg |
| 14 | **Matte Black Matte Finish Luxury Watch Box** | Velvet-Lined Single Watch Travel Display Case | ₹599 | /gifts/Accessories for mens/6113ce236b6749cf4dee23ac7cc3763b.jpg |
| 15 | **Brushed Gunmetal Money Clip & Card Case** | Spring-Loaded Spring Steel Currency Clip | ₹349 | /gifts/Accessories for mens/6968578cdf004ba8491d61b57ab70a25.jpg |
| 16 | **Obsidian Matte Bead & Silver Crown Bracelet** | Natural Lava Stone Beads with Royal Crown Accent | ₹449 | /gifts/Accessories for mens/7378560c83a15023c80527ffb92f928f.jpg |
| 17 | **Nordic Wood & Steel Minimalist Watch** | Sandalwood Bezel with Raw Metal Mesh Band | ₹1599 | /gifts/Accessories for mens/7bd3b6d6b8416ec57a76a76d01fcaa87.jpg |
| 18 | **Vintage Aviator Sunglasses with Gold Accents** | Tortoiseshell Browline & Dark Tint Polarized Lenses | ₹1099 | /gifts/Accessories for mens/7c2c6f8fb5ce30902326364234ade4ab.jpg |
| 19 | **Executive Stainless Steel Collar Stays & Clip** | Monogrammed Brass Tie Bar & Magnetic Stays Set | ₹399 | /gifts/Accessories for mens/8a742781d632258d1dfce97afc257b78.jpg |
| 20 | **Braided Multi-Strand Leather Nautical Bracelet** | Anchor Hook Shackle Clasp in Silver Rhodium | ₹599 | /gifts/Accessories for mens/9713649abfc3b8a65ecb1bb269802532.jpg |
| 21 | **Matte Black Ceramic Minimalist Wedding Band** | Scratch-Proof Comfort Fit 8mm Ceramic Ring | ₹749 | /gifts/Accessories for mens/9dfe2f593341820c117b7a2247f20e23.jpg |
| 22 | **Personalized Monogram Leather Keychain & Valet** | Heavy Zinc Alloy Swivel Keyring with Saddle Leather | ₹299 | /gifts/Accessories for mens/9f70a4507e9e74caf7a8e7e65817cc55.jpg |
| 23 | **Groom’s Silk Jacquard Bowtie & Lapel Pin Set** | Midnight Black Satin Bowtie with Silver Rose Pin | ₹599 | /gifts/Accessories for mens/b0c142f10818d671ec044bf72a9ac1b2.jpg |
| 24 | **Laser-Engraved Wooden Men’s Grooming Comb** | Anti-Static Sandalwood Beard & Hair Pocket Comb | ₹249 | /gifts/Accessories for mens/b6746dc9c63cbed4a7b560da65a1fa5d.jpg |
| 25 | **Heavy Byzantine King Chain Stainless Bracelet** | Intricate Hand-Woven Byzantine Link Structure | ₹899 | /gifts/Accessories for mens/b9781b4bb9d62b3aaac44077821cf33d.jpg |
| 26 | **Matte Gunmetal Pilot Sunglasses** | Spring-Hinged Temples with Polarized Smoke Lenses | ₹1199 | /gifts/Accessories for mens/cc00c6ea5b18945d2837fc902ce8074e.jpg |
| 27 | **Magnetic Therapy Stainless Steel Men’s Bangle** | Brushed Silver Bangle with Dual Neodymium Magnets | ₹699 | /gifts/Accessories for mens/d860e263136b5ea3f6ebdc69a62d16a8.jpg |
| 28 | **Full-Grain Leather Vintage Passport Travel Wallet** | Bi-Fold Boarding Pass & Passport Document Organizer | ₹849 | /gifts/Accessories for mens/df929aaa9a600c114a3f3d230330d77f.jpg |
| 29 | **Chiseled Tungsten Carbide Faceted Men’s Ring** | Prismatic Geometric Cut Edge Band with Brushed Core | ₹799 | /gifts/Accessories for mens/e8ac270fa9e6b96668594ffaa9e6528d (1).jpg |
| 30 | **Tungsten Carbide Prism Facet Ring Edition II** | Comfort-Fit High-Polish Tungsten Metal Band | ₹799 | /gifts/Accessories for mens/e8ac270fa9e6b96668594ffaa9e6528d.jpg |
| 31 | **Vintage Steampunk Skeleton Automatic Watch** | Self-Winding Mechanical Movement with Leather Strap | ₹2299 | /gifts/Accessories for mens/efae679688a0b342498478cea377570c.jpg |
| 32 | **Matte Onyx & Hematite Energy Beaded Bracelet** | Triple-Layer Grounding Stones with Stainless Charm | ₹499 | /gifts/Accessories for mens/f56716fedabd977d3b81acdcb01bba96.jpg |

##### Customised Gift Hampers (13 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Pastel Unicorn Aesthetic Stationery Hamper** | Spiral Diary, Unicorn Bottle, Highlighters & Trinkets | ₹999 | /gifts/Customised hampers/IMG_4075.JPG |
| 02 | **Crimson Birthday Delight Luxe Hamper** | Glass Tumbler, Satin Scrunchie, Scented Candle & KitKat | ₹1199 | /gifts/Customised hampers/IMG_4076.JPG |
| 03 | **Artisanal Lavender Pamper Spa Hamper** | Organic Soap Bar, Bath Salts, Face Roller & Body Mist | ₹1299 | /gifts/Customised hampers/IMG_4077.JPG |
| 04 | **Executive Leather & Copper Desk Gift Hamper** | Faux Leather Journal, Copper Mug & Parker Pen | ₹1499 | /gifts/Customised hampers/IMG_4078.JPG |
| 05 | **Cozy Winter Coffee & Cocoa Keepsake Hamper** | Ceramic Speckled Mug, Single-Origin Beans & Marshmallows | ₹899 | /gifts/Customised hampers/IMG_4079.JPG |
| 06 | **Golden Glow Gourmet Dry Fruit & Truffle Hamper** | California Almonds, Jumbo Cashews & Hazelnut Pralines | ₹1599 | /gifts/Customised hampers/IMG_4080.JPG |
| 07 | **Romantic Rose Petal & Champagne Scent Hamper** | Soy Candle, Heart Locket, Silk Scarf & Chocolates | ₹1399 | /gifts/Customised hampers/IMG_4081.JPG |
| 08 | **Sweet Sunshine Citrus & Honey Pamper Hamper** | Wildflower Honey, Citrus Soap, Lip Butter & Herbal Tea | ₹1099 | /gifts/Customised hampers/IMG_4082.JPG |
| 09 | **Little Explorer Kids Creative Hamper** | Sketch Pad, Non-Toxic Oil Pastels, Modeling Clay & Stickers | ₹799 | /gifts/Customised hampers/IMG_4083.JPG |
| 10 | **Bespoke Vintage Memory Photo & Card Hamper** | Wooden Photo Stand, Mini Fairylights & Customized Notes | ₹949 | /gifts/Customised hampers/IMG_4085.JPG |
| 11 | **Gentleman’s Grooming & Shaving Luxe Hamper** | Beard Oil, Badger Bristle Brush, Sandalwood Balm & Comb | ₹1499 | /gifts/Customised hampers/IMG_4086.JPG |
| 12 | **Chai Lover’s Authentic Terracotta Kulhad Hamper** | Handmade Clay Kulhads, Assam CTC Tea & Cardamom Biscotti | ₹749 | /gifts/Customised hampers/IMG_4087.JPG |
| 13 | **Midnight Indulgence Dark Truffle & Candle Hamper** | 90% Dark Single-Origin Truffles & Amber Jar Candle | ₹1249 | /gifts/Customised hampers/IMG_4088.JPG |

##### Handcrafted Letters & Wax Seals (18 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Pure Silk Ribbon & Fresh Pink Rose Letter** | Handmade Deckle-Edge Envelope with Fresh Rose Blossom | ₹299 | /gifts/Letters/00d2b1c0f895bbf66c1f748d4e4fedf8.jpg |
| 02 | **Vintage Wax-Sealed Parchment Love Scroll** | Hand-Burnt Edges with Crimson Wax Seal Stamp | ₹249 | /gifts/Letters/17bab517adcb37d16dee007dabff2725.jpg |
| 03 | **Botanical Pressed Wildflower Greeting Envelope** | Kraft Envelope with Dried Floral Bouquet & Twine | ₹199 | /gifts/Letters/29733ad1e522ba1832c516c3efe9d1f2.jpg |
| 04 | **Golden Calligraphy Wedding Vow Keepsake** | Gold Ink Script on Heavyweight 300GSM Cotton Rag Paper | ₹349 | /gifts/Letters/350c57e04cf057a3f13aa405467db0e4.jpg |
| 05 | **Midnight Navy & Gold Foil Monogrammed Letter** | Matte Royal Blue Envelope with Gilded Edge Card | ₹279 | /gifts/Letters/38976ecb50df391dfbf16f8288510136.jpg |
| 06 | **Romantic Secret Love Capsule Message Bottle** | Glass Vial with Cork Stopper & Rolled Parchment Note | ₹229 | /gifts/Letters/4deaf6f3401f6d8e86869a4af11e3ea8.jpg |
| 07 | **Pastel Watercolor Floral Greeting Note Card** | Hand-Painted Floral Borders with Blank Sentiment Card | ₹179 | /gifts/Letters/579cab3bed7b88404252844e03e5ba41.jpg |
| 08 | **Antique Victorian Wax Stamp Letter Set** | Includes Brass Seal Stamp, Sealing Wax Stick & 3 Envelopes | ₹499 | /gifts/Letters/5871da148d27ad9d668952bcffe3fdc4.jpg |
| 09 | **Handwritten Poetry Keepsake Scroll with Ribbon** | Vintage Typewriter Font on Textured Parchment | ₹249 | /gifts/Letters/5c13a62d876e6503bd61b12c609c8230.jpg |
| 10 | **Gold Stamped Birthday Wishes Keepsake Card** | Embossed Gold Foil Typography on Sage Green Card | ₹199 | /gifts/Letters/5ddeb3049ebe633119fefc7b512133e0.jpg |
| 11 | **Illuminated LED Fairy Glow Letter Envelope** | Warm String Light Micro Wire Inside Vellum Envelope | ₹399 | /gifts/Letters/7049fce832b2ec4112524ffc15adc226.jpg |
| 12 | **Aesthetic Eucalyptus Branch Letter Sleeve** | Pressed Silver Dollar Eucalyptus on Soft White Linen Paper | ₹229 | /gifts/Letters/85bf454f0289aee1b58010093c0f9f2e.jpg |
| 13 | **Embossed Rose Petal Romantic Note Folio** | Deckled Border Folio with Embedded Dried Rose Petals | ₹269 | /gifts/Letters/9be6b0d59680dc1fba5814a68c32f925.jpg |
| 14 | **Vintage Air Mail Postcard & Love Letter Set** | Retro Aviation Stripe Border with Nostalgic Postage Stamp | ₹199 | /gifts/Letters/a32dca9dafbfe00633133c9089ff3dd9.jpg |
| 15 | **Floral Border Pop-Up Bouquet Greeting Card** | 3D Laser-Cut Paper Flower Bouquet Inside Card | ₹299 | /gifts/Letters/b478629a901c9ffac423256ac8336c27.jpg |
| 16 | **Minimalist Gold Rimmed Monogram Note Card** | Heavyweight Cotton Card with Hand-Painted Gold Foil Rim | ₹219 | /gifts/Letters/b76f795a6d14a38aba5f20a43bb59bee.jpg |
| 17 | **Romantic Valentine Accordion Photo Pull-Out Card** | Fold-Out Accordion Photo Strip in Matchbox Slider | ₹349 | /gifts/Letters/c5a86a9674b4f459d500153f52f64ba4.jpg |
| 18 | **Celestial Zodiac Constellation Gold Foil Letter** | Night Sky Constellation Foil Art on Midnight Black Board | ₹259 | /gifts/Letters/dc753c810a3a5d738b27dd50a851598c.jpg |

##### Living Plants & Succulents (14 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Mini Succulent & Rosemary Potted Event Favors** | Kraft Wrapped Ceramic Pots with Jute Twine & Name Tags | ₹299 | /gifts/Plants/IMG_4094.JPG |
| 02 | **Watermelon Peperomia in Matte Ceramic Planter** | Lush Striped Foliage in Fluted Ivory Ceramic Pot | ₹599 | /gifts/Plants/IMG_4096.JPG |
| 03 | **Blooming White Peace Lily in Speckled Pot** | Air-Purifying Spathiphyllum with Elegant White Spathes | ₹699 | /gifts/Plants/IMG_4097.JPG |
| 04 | **Fiddle Leaf Fig Compact Indoor Tree** | Broad Violin-Shaped Foliage in Terracotta Planter | ₹899 | /gifts/Plants/IMG_4098.JPG |
| 05 | **Braided Money Tree (Pachira Aquatica)** | Five-Stem Braided Trunk for Prosperity & Good Luck | ₹799 | /gifts/Plants/IMG_4099.JPG |
| 06 | **Golden Pothos in Hanging Macrame Basket** | Trailing Variegated Devil’s Ivy with Cotton Macrame Hanger | ₹499 | /gifts/Plants/IMG_4100.JPG |
| 07 | **Zanzibar Gem (ZZ Plant) Low-Light Champion** | Indestructible Glossy Foliage in Charcoal Planter | ₹649 | /gifts/Plants/IMG_4101.JPG |
| 08 | **Sansevieria Snake Plant in Mid-Century Pot** | Architectural Sword-Shaped Leaves with Yellow Margins | ₹549 | /gifts/Plants/IMG_4102.JPG |
| 09 | **Haworthia Zebra Succulent Terrarium** | Mini Striped Succulent in Geometric Glass Prism | ₹449 | /gifts/Plants/IMG_4103.JPG |
| 10 | **Calathea Orbifolia Giant Striped Foliage** | Exquisite Metallic Silver & Green Oversized Leaves | ₹749 | /gifts/Plants/IMG_4104.JPG |
| 11 | **Bonsai Ficus Ginseng Living Sculpture** | Exposed Aerial Root Trunk in Glazed Ceramic Bonsai Dish | ₹1199 | /gifts/Plants/IMG_4105.JPG |
| 12 | **Heart-Leaf Philodendron Sweetheart Vine** | Romantic Heart-Shaped Climbing Leaves in Pink Pot | ₹399 | /gifts/Plants/IMG_4106.JPG |
| 13 | **Aloe Vera Healing Desk Succulent** | Therapeutic Fresh Aloe Plant in Terracotta Clay Pot | ₹249 | /gifts/Plants/IMG_4107.JPG |
| 14 | **Lucky Bamboo Tiered Pyramid in Ceramic Bowl** | 3-Tier Braided Lucky Bamboo Stems with River Pebbles | ₹349 | /gifts/Plants/IMG_4108.JPG |

##### Aesthetic Stationery & Desk Gifts (27 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Pastel Kawaii Retractable Gel Pen 6-Piece Set** | Cute Anime Bear & Rabbit 0.5mm Quick-Dry Black Ink Pens | ₹249 | /gifts/Stationary items/IMG_4054.JPG |
| 02 | **Aesthetic Gradient Highlighter Marker 6-Pack** | Soft Chisel Tip Pastel Markers (Non-Bleeding) | ₹299 | /gifts/Stationary items/IMG_4055.JPG |
| 03 | **Vintage Debossed Vegan Leather Journal** | A5 Thick Lined Paper with Ribbon Marker & Pen Loop | ₹499 | /gifts/Stationary items/IMG_4056.JPG |
| 04 | **Minimalist Morandi Colour Aesthetic Pen Set** | Nordic Matte Finish 0.5mm Smooth Writing Pens | ₹229 | /gifts/Stationary items/IMG_4057.JPG |
| 05 | **Pastel Sticky Note & Index Tabs Study Kit** | Transparent Waterproof PET Page Markers & Note Pads | ₹199 | /gifts/Stationary items/IMG_4058.JPG |
| 06 | **Cherry Blossom Washi Tape & Sticker Folio** | 10 Rolls of Japanese Masking Tape with Foil Accents | ₹349 | /gifts/Stationary items/IMG_4059.JPG |
| 07 | **Vintage Brass Fountain Pen & Velvet Pouch** | Solid Heavyweight Brass Barrel with Fine Iridium Nib | ₹699 | /gifts/Stationary items/IMG_4060.JPG |
| 08 | **Pastel Corduroy Dual-Zipper Pencil Case** | High-Capacity Multi-Compartment Desk Pouch | ₹399 | /gifts/Stationary items/IMG_4061.JPG |
| 09 | **Aesthetic Desktop Acrylic Memo Board with Pen** | Illuminated Clear Dry-Erase Note Board with Wooden Base | ₹599 | /gifts/Stationary items/IMG_4062.JPG |
| 10 | **Calligraphy Dip Pen & Ink Bottles Collector Set** | Glass Dip Pen with 5 Colors of Shimmer Ink | ₹549 | /gifts/Stationary items/IMG_4063.JPG |
| 11 | **A5 Daily Productivity Planner & Habit Tracker** | Undated Hardcover Time-Management Organizer | ₹449 | /gifts/Stationary items/IMG_4064.JPG |
| 12 | **Pastel Correction Tape & Glue Tape Duo Pack** | Smooth Tear-Free White-Out with Dot Adhesive Roller | ₹179 | /gifts/Stationary items/IMG_4065.JPG |
| 13 | **Cute Astronaut Themed Stationery Gift Box** | Space Notebook, Rocket Pen & Star Eraser Set | ₹499 | /gifts/Stationary items/IMG_4066.JPG |
| 14 | **Rose Gold Wire Desk Organizer & Document Tray** | Stackable Metal Mesh Inbox Tray & Pen Stand | ₹699 | /gifts/Stationary items/IMG_4067.JPG |
| 15 | **Pastel Mechanical Pencil 0.5mm & Lead Set** | 3 Mechanical Pencils with 2 Tubes of HB Polymer Lead | ₹249 | /gifts/Stationary items/IMG_4068.JPG |
| 16 | **Vintage Metal Bookmarks with Floral Pendant** | Antique Bronze Feather Bookmark with Glass Flower Bead | ₹199 | /gifts/Stationary items/IMG_4069.JPG |
| 17 | **Aesthetic Mini Desktop Stapler & Tape Dispenser** | Clear Transparent Acrylic & Rose Gold Hardware | ₹399 | /gifts/Stationary items/IMG_4070.JPG |
| 18 | **Spiral Bound Watercolor Sketchbook (300 GSM)** | Cold-Pressed Heavy Cotton Paper for Artists | ₹399 | /gifts/Stationary items/IMG_4071.JPG |
| 19 | **Pastel Pill Capsule Highlighter Set (6 Pieces)** | Pocket-Sized Vitamin Capsule Shaped Fluorescent Markers | ₹179 | /gifts/Stationary items/IMG_4072.JPG |
| 20 | **Executive Wooden Pen Box with Ballpoint Pen** | Polished Rosewood Twist Pen in Solid Wood Case | ₹599 | /gifts/Stationary items/IMG_4073.JPG |
| 21 | **Pastel Eraser Wheel & Correction Wheel Combo** | Dual-Function Rolling Pencil Eraser & Cleaner | ₹149 | /gifts/Stationary items/IMG_4074.JPG |
| 22 | **Unicorn Fantasy Desk Stationery Suite** | Complete Pastel Desk Collection in Presentation Carton | ₹899 | /gifts/Stationary items/IMG_4075.JPG |
| 23 | **Soft Touch Pastel Gel Pen Multi-Color Set** | Matte Velvet Finish Barrel 0.5mm Pen Collection | ₹229 | /gifts/Stationary items/IMG_4089.JPG |
| 24 | **Kawaii Milk Bottle Correction Tape** | Cute Miniature Milk Carton White-Out Applicator | ₹149 | /gifts/Stationary items/IMG_4090.JPG |
| 25 | **Aesthetic Floral Binder Clips & Push Pins Tin** | Rose Gold & Pastel Enamel Paper Clips in Clear Tin | ₹249 | /gifts/Stationary items/IMG_4091.JPG |
| 26 | **Pocket Sized Hardcover Gratitude Journal** | Gold Foil Stamped Linen Cover with Ribbon Bookmark | ₹299 | /gifts/Stationary items/IMG_4092.JPG |
| 27 | **Pastel Dual-Tip Brush & Fine Liner Pen Set** | Flexible Brush Tip & 0.4mm Fineliner for Lettering | ₹399 | /gifts/Stationary items/IMG_4093.JPG |

##### Precision RC Cars & Racers (11 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Cheetah Pro High-Speed RC Monster Truck** | 1:10 4WD Brushless Off-Road Basher (60+ km/h) | ₹2999 | /gifts/Cars/16bc76fc0d17d19bead5dff49bfe9837.jpg |
| 02 | **Mini-Z Porsche 911 Carrera Gulf Edition** | 1:28 High-Precision RC Drift Car with Alloy Chassis | ₹2499 | /gifts/Cars/5ba9c71057e5ec6f933bc74cdf0d0506.jpg |
| 03 | **Vorteks 4x4 Brushless Stadium Truggy** | All-Terrain Red & Black RC Racer with High-Grip Wheels | ₹2799 | /gifts/Cars/5fc1279709163299bb45e3bbbb1893b4.jpg |
| 04 | **Stealth Matte Black F1 Grand Prix RC Racer** | Aerodynamic Formula 1 RC Car with Ground-Effect Wing | ₹2199 | /gifts/Cars/63bdcc875358f4718dcb6aab2fafa0a4.jpg |
| 05 | **Lamborghini Veneno Red Supercar RC with Remote** | 1:16 Scale Remote Controlled Exotic Hypercar | ₹1299 | /gifts/Cars/6b62d998b4ccc94f8b13d3287e842b8a.jpg |
| 06 | **Desert Dune Buggy High-Torque RC Climber** | Roll Cage Suspension with Real Working Spare Tire | ₹1899 | /gifts/Cars/723370b18e54ad3084e26d359a12b3bd.jpg |
| 07 | **Nissan Skyline GT-R R34 Drift Edition RC** | Smooth Hard-Compound Drift Tires with LED Underglow | ₹1999 | /gifts/Cars/93fed55af7ffb4f4816f1fc10d37c151.jpg |
| 08 | **Cyberpunk Concept Neon RC Speedster** | Futuristic Aerodynamic Bodywork with Cyan LED Accents | ₹1799 | /gifts/Cars/959c919451607828ff727e2593dd8f9c.jpg |
| 09 | **Vintage Classic American Muscle Car RC** | 1969 Dodge Charger Metallic Black Edition | ₹1699 | /gifts/Cars/b84e73f224fdcc64197e7558c15c0f44.jpg |
| 10 | **Extreme 4WD Rock Crawler Trail Explorer** | High-Articulation Solid Axles & Beadlock Wheels | ₹2399 | /gifts/Cars/c1cf641b1e3816aa7fdb3fc941e8f3ab.jpg |
| 11 | **Mercedes-AMG GT3 Track Edition RC Car** | Silver Arrow Livery with Massive Carbon Rear Wing | ₹2299 | /gifts/Cars/d0566bc7f8f5992854f084b313c1956a.jpg |



##### Fine Jewellery, Bags & Luxury Watches (67 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Champagne Quilted Vegan Leather Crossbody Bag** | Gold Chain Shoulder Strap with Signature Turnlock | ₹1299 | /gifts/Jewellery/Bags/IMG_3982.JPG |
| 02 | **Artisanal Woven Structured Summer Tote** | Hand-Braided Body with Silk Printed Twilly Scarf | ₹1099 | /gifts/Jewellery/Bags/IMG_3983.JPG |
| 03 | **Ivory Pearl Handle Mini Evening Clutch** | Lustrous Freshwater Pearl Arc Top Handle and Gold Frame | ₹1399 | /gifts/Jewellery/Bags/IMG_3984.JPG |
| 04 | **Caramel Croc-Embossed Baguette Shoulder Bag** | 90s Vintage Silhouette with Gleaming Brass Buckle | ₹1199 | /gifts/Jewellery/Bags/IMG_3985.JPG |
| 05 | **Vintage Box Satchel with Dual Straps** | Structured Everyday Companion with Magnetic Snap Flap | ₹1249 | /gifts/Jewellery/Bags/IMG_3986.JPG |
| 06 | **Minimalist Slate Grey Flap Handbag** | Matte Finish Saffiano Texture with Interior Organizer | ₹999 | /gifts/Jewellery/Bags/IMG_3987.JPG |
| 07 | **Cloud Dumpling Pleated Clutch with Chunky Chain** | Buttery Soft Ruched Leather in Powder Cream | ₹1149 | /gifts/Jewellery/Bags/IMG_3988.JPG |
| 08 | **Blush Rose Geometric Trapezoid Handbag** | Architectural Sculpted Top Handle Purse with Crossbody Strap | ₹1349 | /gifts/Jewellery/Bags/IMG_3989.JPG |
| 09 | **18K Gold-Plated Paperclip Chain Choker** | Bold Elongated Links with Secure Lobster Clasp | ₹699 | /gifts/Jewellery/Chains/IMG_3990.JPG |
| 10 | **Solitaire Teardrop Zirconia Pendant Necklace** | Faceted AAA Cubic Zirconia on Dainty Cable Chain | ₹549 | /gifts/Jewellery/Chains/IMG_3991.JPG |
| 11 | **Celestial Crescent Moon and Star Layered Chain** | Dual-Strand Gold Necklace with Pave Star Accents | ₹649 | /gifts/Jewellery/Chains/IMG_3992.JPG |
| 12 | **Vintage Medallion Sunburst Coin Pendant** | Embossed Radiant Sun Face on Antiqued Rope Chain | ₹599 | /gifts/Jewellery/Chains/IMG_3993.JPG |
| 13 | **Emerald Cut Green Crystal Statement Necklace** | Deep Forest Emerald Crystal Framed in Gold Prongs | ₹749 | /gifts/Jewellery/Chains/IMG_3994.JPG |
| 14 | **Dainty Rose Gold Sweetheart Lock Pendant** | Micro-Pave Crystal Heart Lock on Shimmer Chain | ₹529 | /gifts/Jewellery/Chains/IMG_3996.JPG |
| 15 | **Liquid Gold Herringbone Snake Chain** | High-Shine Flat Flexible 4mm Chain Necklace | ₹699 | /gifts/Jewellery/Chains/IMG_3997.JPG |
| 16 | **Freshwater Pearl and Zircon Y-Lariat Necklace** | Drop Lariat Design with Natural Baroque Pearl Finial | ₹799 | /gifts/Jewellery/Chains/IMG_3998.JPG |
| 17 | **Filigree Floral Lace Medallion Pendant** | Intricate Openwork Floral Art in 18K Yellow Gold Dip | ₹599 | /gifts/Jewellery/Chains/IMG_3999.JPG |
| 18 | **Minimalist Geometric Bar Layering Necklace** | Polished Horizontal Rose Gold Bar with Beveled Edges | ₹499 | /gifts/Jewellery/Chains/IMG_4001.JPG |
| 19 | **Opal Aurora Teardrop Crystal Choker** | Iridescent Flashing Opal Simulant on Delicate Link | ₹579 | /gifts/Jewellery/Chains/IMG_4002.JPG |
| 20 | **Royal Sapphire Blue Halo Pendant Chain** | Cobalt Blue Brilliant Cut Gem Surrounded by Crystal Halo | ₹729 | /gifts/Jewellery/Chains/IMG_4003.JPG |
| 21 | **Twin Interlocking Circles Infinity Necklace** | Eternity Rings Symbolizing Everlasting Friendship and Love | ₹549 | /gifts/Jewellery/Chains/IMG_4006.JPG |
| 22 | **Fluttering Butterfly Charm Rose Gold Chain** | Articulated Wing Butterfly with Sparkling Zirconia | ₹519 | /gifts/Jewellery/Chains/IMG_4007.JPG |
| 23 | **Sparkling Tennis Crystal Choker Necklace** | Continuous Line of Bezel-Set Brilliant Cut Crystals | ₹899 | /gifts/Jewellery/Chains/IMG_4046.JPG |
| 24 | **Golden Key of Wonder Filigree Pendant** | Intricate Crown Key Charm Symbolizing Love and Trust | ₹549 | /gifts/Jewellery/Chains/IMG_4047.JPG |
| 25 | **Four-Leaf Clover Mother-of-Pearl Chain** | Lucky Clover Motif Inlaid with Lustrous White Shell | ₹699 | /gifts/Jewellery/Chains/IMG_4048.JPG |
| 26 | **Zodiac Constellation Star Coin Necklace** | Celestial Horoscope Map Engraved on Matte Disc | ₹499 | /gifts/Jewellery/Chains/IMG_4049.JPG |
| 27 | **Baguette Cut Diamond-Simulant Bar Pendant** | Modern Clean-Line Baguette Stones in Platinum Setting | ₹649 | /gifts/Jewellery/Chains/IMG_4050.JPG |
| 28 | **Layered Twist Rope and Smooth Disc Duo Set** | Two Complementary Necklaces for Effortless Layering | ₹749 | /gifts/Jewellery/Chains/IMG_4051.JPG |
| 29 | **Vintage Roman Numeral Circle Pendant Chain** | Timeless Watch-Bezel Inspired Dial with Crystal Center | ₹599 | /gifts/Jewellery/Chains/IMG_4052.JPG |
| 30 | **Dainty Beaded Satellite Chain Choker** | Tiny Polished Gold Beads Spaced Along Cable Link | ₹479 | /gifts/Jewellery/Chains/IMG_4053.JPG |
| 31 | **Baroque Pearl Drop Huggie Earrings** | Natural Luster Freshwater Pearls on Gold Huggie Hoops | ₹599 | /gifts/Jewellery/Earrings/IMG_4016.JPG |
| 32 | **Floral Zirconia Cluster Stud Earrings** | Blossom Petal Arrangement with Brilliant Center Stone | ₹449 | /gifts/Jewellery/Earrings/IMG_4017.JPG |
| 33 | **Chunky Twisted Gold Hoop Earrings** | Bold Croissant Texture 18K Gold Plated Lightweight Hoops | ₹549 | /gifts/Jewellery/Earrings/IMG_4018.JPG |
| 34 | **Cascading Crystal Chandelier Drop Earrings** | Art Deco Shimmering Dangles with Pave Zirconia | ₹699 | /gifts/Jewellery/Earrings/IMG_4020.JPG |
| 35 | **Solitaire Oval Cut Zirconia Promise Ring** | Classic 4-Prong Basket Setting with Slender Polished Band | ₹599 | /gifts/Jewellery/Rings/IMG_4144.JPG |
| 36 | **Stackable Micro-Pave Eternity Band** | Continuous Halo of Shimmering Crystals in Rose Gold | ₹499 | /gifts/Jewellery/Rings/IMG_4145.JPG |
| 37 | **Vintage Milgrain Floral Halo Ring** | Heirloom Filigree Detailing Framing a Cushion Center | ₹649 | /gifts/Jewellery/Rings/IMG_4146.JPG |
| 38 | **Adjustable Dual-Band Open Cuff Ring** | Modern Wrap Ring with Twin Sparkling Marquise Tips | ₹449 | /gifts/Jewellery/Rings/IMG_4147.JPG |
| 39 | **Iridescent Opal Teardrop Cocktail Ring** | Play-of-Color Simulated Opal Surrounded by Zircon Halo | ₹629 | /gifts/Jewellery/Rings/IMG_4148.JPG |
| 40 | **Geometric Hexagon Signet Statement Ring** | Polished Flat Top Beveled Ring with Side Inset Crystals | ₹549 | /gifts/Jewellery/Rings/IMG_4149.JPG |
| 41 | **Entwined Twisted Vine Crystal Ring** | Organic Botanical Vines Interlocking in 18K Yellow Gold | ₹519 | /gifts/Jewellery/Rings/IMG_4150.JPG |
| 42 | **Baguette Cut Multi-Stone Stacking Band** | Alternating Round and Baguette Cut Stones in Channel Set | ₹589 | /gifts/Jewellery/Rings/IMG_4151.JPG |
| 43 | **Starburst Celestial Diamond-Simulant Ring** | Explosive Light Reflection with Tapered Sunburst Prongs | ₹679 | /gifts/Jewellery/Rings/IMG_4152.JPG |
| 44 | **Triple Wave Hammered Gold Accent Ring** | Fluid Sculptural Waves with High Polish Textured Surface | ₹489 | /gifts/Jewellery/Rings/IMG_4153.JPG |
| 45 | **Emerald Cut Solitaire Ring in Platinum Finish** | Sophisticated Art Deco Step-Cut Center Gemstone | ₹699 | /gifts/Jewellery/Rings/IMG_4154.JPG |
| 46 | **Romantic Rose Quartz Cushion Statement Ring** | Soft Pink Translucent Gemstone in Scalloped Crown Bezel | ₹599 | /gifts/Jewellery/Rings/IMG_4155.JPG |
| 47 | **Rose Gold Milanese Mesh Strap Luxury Watch** | Ultra-Slim Bezel with Sunray Dial and Magnetic Clasp | ₹1499 | /gifts/Jewellery/Watch and bracelets/IMG_4133.JPG |
| 48 | **Mother of Pearl Dial Watch with Matching Bangle** | Curated Gift Set Featuring Shimmering Dial and Pave Cuff | ₹1799 | /gifts/Jewellery/Watch and bracelets/IMG_4134.JPG |
| 49 | **Classic Tennis Bracelet with Cubic Zirconia** | Seamless Continuous Strand with Double Safety Clasp | ₹799 | /gifts/Jewellery/Watch and bracelets/IMG_4135.JPG |
| 50 | **Paperclip Link Charm Bracelet with Heart Lock** | 18K Gold Plated Chain with Engraved Heart Charm | ₹649 | /gifts/Jewellery/Watch and bracelets/IMG_4136.JPG |
| 51 | **Minimalist Stainless Steel Quartz Timepiece** | Crisp White Dial with Rose Gold Baton Hands | ₹1299 | /gifts/Jewellery/Watch and bracelets/IMG_4137.JPG |
| 52 | **Evil Eye Protective Blue Crystal Bangle** | Enamel and Zircon Evil Eye Motif on Hinged Gold Cuff | ₹599 | /gifts/Jewellery/Watch and bracelets/IMG_4138.JPG |
| 53 | **Dainty Rose Gold Beaded Slider Bracelet** | Adjustable Bolotie Slider with High Polish Beads | ₹499 | /gifts/Jewellery/Watch and bracelets/IMG_4139.JPG |
| 54 | **Roman Numeral Beveled Dial Leather Watch** | Genuine Leather Strap with Textured Cream Dial | ₹1399 | /gifts/Jewellery/Watch and bracelets/IMG_4140.JPG |
| 55 | **Chunky Curb Link Statement Wrist Bracelet** | Substantial Polished Brass Curb Chain with Ring Clasp | ₹699 | /gifts/Jewellery/Watch and bracelets/IMG_4141.JPG |
| 56 | **Celestial Star Charm Layered Bangle Set** | Stack of 3 Complementary Bangles with Star Dust Texture | ₹749 | /gifts/Jewellery/Watch and bracelets/IMG_4142.JPG |
| 57 | **Emerald Green Dial Dress Watch with Gold Bracelet** | Deep Forest Jewel Dial with 5-Link Stainless Bracelet | ₹1599 | /gifts/Jewellery/Watch and bracelets/IMG_4143.JPG |
| 58 | **Double Wrap Leather Buckle Wrist Strap** | Supple Tan Leather Wrap Around with Golden Hardware | ₹649 | /gifts/Jewellery/Watch and bracelets/IMG_4156.JPG |
| 59 | **Solitaire Crystal Cuff Bracelet with Ball Finials** | Flexible Open Torque Bangle with Brilliant End Crystals | ₹549 | /gifts/Jewellery/Watch and bracelets/IMG_4157.JPG |
| 60 | **Duo Timepiece and Pearl Bangle Gift Suite** | Elegant Watch Paired with Lustrous Cultured Pearl Bangle | ₹1899 | /gifts/Jewellery/Watch and bracelets/IMG_4158.JPG |
| 61 | **Radiant Sunray Dial Slim Luxury Watch** | Pastel Pink Sunray Reflection with Vegan Leather Strap | ₹1199 | /gifts/Jewellery/Watch and bracelets/IMG_4159.JPG |
| 62 | **Interlocking Rings Adjustable Cord Bracelet** | Symbol of Connection on Waterproof Braided Silk Cord | ₹449 | /gifts/Jewellery/Watch and bracelets/IMG_4160.JPG |
| 63 | **Infinity Knot Rose Gold Bangle** | Graceful Infinity Loop Sculpture in Mirror Finish Rose Gold | ₹699 | /gifts/Jewellery/Watch and bracelets/IMG_4161.JPG |
| 64 | **Vintage Tortoiseshell Accent Quartz Watch** | Acetate Links Interwoven with Polished Gold Metal | ₹1449 | /gifts/Jewellery/Watch and bracelets/IMG_4162.JPG |
| 65 | **Micro-Pave Bar Slide Charm Bracelet** | Minimalist Curved Bar Set with 20 Micro Zirconia | ₹529 | /gifts/Jewellery/Watch and bracelets/IMG_4163.JPG |
| 66 | **Geometric Mesh Chronograph Style Dress Watch** | Multi-Subdial Aesthetic with Sapphire Crystal Glass | ₹1699 | /gifts/Jewellery/Watch and bracelets/IMG_4164.JPG |
| 67 | **Sparkling Tennis Bangle with Safety Clasp** | Hinged Oval Bangle Encrusted with Channel Set Stones | ₹849 | /gifts/Jewellery/Watch and bracelets/IMG_4165.JPG |

##### Travel Accessories & Bags (7 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Cognac Saffiano Leather Travel Organizer Pouch** | Multi-Pocket Cable, Passport and Grooming Travel Case | ₹899 | /gifts/Traveling item/4c0e81a58e8b4668a6a21fd2d74ee247.jpg |
| 02 | **Hardshell Monogram Cosmetic Vanity Case** | Portable Shockproof Travel Beauty Organizer | ₹1199 | /gifts/Traveling item/70a32d78097cda5610ceedc437749b19.jpg |
| 03 | **Weekender Tech and Toiletries Compact Duffel Bag** | Lightweight Water-Repellent Short-Trip Carry-On | ₹1299 | /gifts/Traveling item/bc93fa7f7b87ea425e8bc07609464989.jpg |
| 04 | **Jetsetter Packing Cubes 6-Piece Travel Set** | Breathable Compression Luggage Organizers | ₹799 | /gifts/Traveling item/c5a1e64ae8bef0d5452238b67a254856.jpg |
| 05 | **RFID Blocking Travel Passport and Card Wallet** | Ultra-Slim Genuine Leather Boarding Pass Holder | ₹549 | /gifts/Traveling item/c87c18bc4c73d252a8f6d1321dfea229.jpg |
| 06 | **Quilted Overnight Travel Pouch and Accessory Kit** | Padded Soft-Touch Travel Cosmetic and Essentials Case | ₹649 | /gifts/Traveling item/c95022be7a478a8daa91060252b1fd2a.jpg |
| 07 | **Foldable Hanging Travel Toiletry Washbag** | 360 Swivel Hook Waterproof Multi-Tier Organizer | ₹699 | /gifts/Traveling item/df95ff8b0202438b97986f4e0848b9a2.jpg |

##### Celebration Background Decoration Kits (11 Products)

| # | Product Name in Website | Subtitle / Focus | Price (INR) | Corresponding Image Asset |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Rose Gold Confetti and Balloon Arch Party Kit** | Complete Celebration Backdrop with Metallic Foil Curtains | ₹599 | /gifts/Background decoration kit/229498704778b851a2ae6a867bcb002d.jpg |
| 02 | **Pastel Champagne Fairy Light Decor Suite** | Warm Glow Backdrop with Micro-LED Copper String Lights | ₹699 | /gifts/Background decoration kit/3aacc88a02fadc2a98a33a197e9809e1.jpg |
| 03 | **Sunset Amber Birthday Celebration Garland Kit** | Warm Sunset Tones with Happy Birthday Bunting Banner | ₹499 | /gifts/Background decoration kit/687b4a854ad3c9759c3f5eafc91b83a8.jpg |
| 04 | **Midnight Glamour Silver and Black Backdrop Kit** | Executive Milestone and Cocktail Party Background Set | ₹649 | /gifts/Background decoration kit/815cde78662d415e1f0b9df7892d1603.jpg |
| 05 | **Golden Radiance Milestone Anniversary Kit** | Metallic Chrome Gold Balloon Arch and Shimmer Wall | ₹749 | /gifts/Background decoration kit/8ab1fe315b7ee569cbe4f8a8d10ca6ac.jpg |
| 06 | **Boho Terracotta Botanical Balloon Decor Kit** | Earth Tones with Eucalyptus Leaves and Kraft Bunting | ₹549 | /gifts/Background decoration kit/9037610b179b134173348070c5689ab1.jpg |
| 07 | **Blush Pink and Ivory Romantic Backdrop Set** | Dreamy Floral Accents and Heart Foil Photobooth Kit | ₹599 | /gifts/Background decoration kit/9b8b87112a32ab749eb9bd57b690b158.jpg |
| 08 | **Modern Monochrome Graphic Birthday Decor Kit** | Clean Black, White and Confetti Minimalist Party Pack | ₹449 | /gifts/Background decoration kit/a419c9769dc190445eb3cdb3f9125176.jpg |
| 09 | **Ethereal Peach Cloud and Fairylight Arch Suite** | Double-Stuffed Pastel Balloons with Sparkle Backdrop | ₹799 | /gifts/Background decoration kit/a7d51bddfe784c3a971060e3af02f969.jpg |
| 10 | **Vintage Velvet Lantern and Paper Pom Decor Set** | Eco-Friendly Reusable Honeycomb Lanterns and Streamers | ₹429 | /gifts/Background decoration kit/d3f68451f650f70953489d1ae240ec5b.jpg |
| 11 | **Royal Amber and Gold Shimmer Curtain Party Pack** | Grand Celebration Photobooth with Glitter Accents | ₹499 | /gifts/Background decoration kit/e6114d60a36be6affec3693c5ab74a49.jpg |

### 3.3 AI Gift Finder & Gift Fit Score™ Algorithmic Engine
- Users select recipient relation (*Partner, Mother, Best Friend, Colleague*), occasion (*Birthday, Anniversary, Apology, Milestone*), budget range, and desired vibe (*Romantic, Luxury, Whimsical, Practical*).
- The algorithm calculates a 4-dimensional affinity vector:
  $$\text{Fit Score} = (w_1 \cdot \text{OccasionFit}) + (w_2 \cdot \text{RecipientFit}) + (w_3 \cdot \text{BudgetFit}) + (w_4 \cdot \text{TagAlignment})$$
- Returns personalized matches with dynamically rendered **Gift Fit Score™ badges** (e.g., *98% Match*) and algorithmic reasoning (e.g., *"Matches Partner + Romantic Vibe + Budget ₹1,500–₹3,000"*).

### 3.4 Interactive AI Concierge & Chatbot
- Embedded AI conversationalist accessible from the header and floating assistant widget.
- Capable of answering subjective queries such as:
  - *"What should I get my wife for our 5th anniversary under ₹3,500 that isn't just flowers?"*
  - *"Suggest a subtle apology gift for a close friend."*
- Features direct one-click action cards to add suggested products straight into the user's cart.

### 3.5 Merchant Partner Portal & Studio Management
- Accessible at `/partner` and protected by authentication guards.
- Features:
  - **Live Dispatch Dashboard:** View new orders, orders in prep, and out-for-delivery items.
  - **Catalog Management:** Add new artisanal creations, toggle stock availability, and adjust pricing.
  - **Revenue Analytics:** Real-time calculation of today's earnings, average order value (AOV), and completed order counts.
  - **Store Profile Configuration:** Edit studio branding, operating city/hub, and artisan specialty.

### 3.6 Hyperlocal Delivery, Stealth Delivery & "Meet Me There"
- **Stealth Delivery Mode:** For surprise gifting, suppresses recipient SMS notifications until the delivery agent is within 200 meters of the drop location.
- **"Meet Me There" Feature:** Allows customers to pinpoint exact coordinates on an interactive map (e.g., a café, park bench, or restaurant table) rather than a traditional street address.
- **Live Courier Tracking:** Simulated and real-time GPS coordinate telemetry showing courier progress and ETA countdowns.

### 3.7 Custom Hamper & Gift Box Builder
- A 4-step wizard interface located at `/custom-builder`:
  1. **Container Selection:** Pick between luxury wooden chests, velvet hatboxes, eco-friendly jute totes, or minimalist rigid boxes.
  2. **Item Curation:** Add flowers, sweets, keepsakes, and perfumes with real-time price tallying and container capacity visualization.
  3. **Greeting Card & Wax Seal:** Write personal messages, pick font styles, and choose wax seal colors.
  4. **Final Assembly & Review:** 3D-inspired preview before adding the custom SKU to the checkout bag.

### 3.8 Indian Occasion Calendar & Gift DNA / Gift Memory
- Comprehensive calendar of major Indian festivals and cultural milestones (Diwali, Raksha Bandhan, Karwa Chauth, Eid, Durga Puja, New Year).
- **Gift Memory:** Records past gifts sent to prevent duplicate gift faux pas.
- **Reminders Engine:** SMS and email alerts configured 7 days, 3 days, and 24 hours prior to recurring dates.

### 3.9 End-to-End Commerce, Cart & Payment Gateway
- Persistent cart state synchronized across browser tabs.
- Full checkout workflow including promo code redemption, delivery date/time slot selection, and Razorpay integration.
- Instant automated order confirmation receipts and tracking IDs.

---

## 4. Technical Approaches & Architectural Decisions

### 4.1 Headless Decoupled Client-Server Model
- **Rationale:** Separating the Next.js frontend from the Django backend allows the user interface to iterate rapidly, leverage React Server Components and edge caching, while Django manages high-integrity database transactions, authentication security, and business rules.
- **Communication Contract:** The frontend consumes clean JSON REST endpoints documented in `backend/config/urls.py` via typed service clients in `frontend/lib/api/services/`.

### 4.2 Resilient Backend-First with Offline Local Store Fallback
- **Problem:** When demonstrating locally, network conditions or backend server restarts should not disrupt the visual frontend experience.
- **Solution:** `sellerStore.ts` and `store.ts` implement an optimistic pattern:
  1. Requests attempt the live Django REST backend first.
  2. On success, local browser storage is updated with the verified remote state.
  3. If the backend is temporarily unreachable, the frontend gracefully falls back to structured mock data and cached local storage, notifying the user rather than failing with white-screen crashes.

### 4.3 Custom Email-Based Authentication & Dual-Keyword Auth
- **Design:** Django’s default `AbstractUser` requires a `username`. Bloomora overrides this with `CustomUserManager` and sets `USERNAME_FIELD = 'email'`, removing the redundant username concept.
- **Dual-Keyword Auth:** Django's `authenticate()` method natively handles `username` credentials. Bloomora’s `LoginSerializer` intercepts login requests and performs a dual lookup:
  ```python
  user = authenticate(username=data['email'], password=data['password'])
  if not user:
      user = authenticate(email=data['email'], password=data['password'])
  ```
  This ensures compatibility regardless of whether custom backends or standard Django authentication backends are invoked.

### 4.4 Multi-Factor Recommendation Algorithm Design
- Rather than naive SQL `LIKE` searches, Bloomora builds an in-memory normalized product matrix with pre-computed tag affinities.
- Queries are transformed into weights:
  - Primary filter: Exclude products outside the specified budget tier.
  - Secondary filter: Calculate tag overlap against occasion (e.g., `birthday`, `anniversary`) and recipient (e.g., `sister`, `wife`, `colleague`).
  - Score normalizer: Scales raw scores to an intuitive 70%–99% confidence bracket, sorting candidates by relevance.

### 4.5 Responsive Editorial & Luxury Design System
- High visual aesthetics inspired by luxury editorial magazines (Vogue, Kinfolk, Tiffany & Co.).
- Uses curated typography: Cormorant Garamond, Playfair Display, and Inter.
- Curated color system:
  - Canvas Primary: `#FFF8F5` (Warm Alabaster)
  - Card Surfaces: `#FFFFFF` with `#EFE8E4` subtle borders
  - Primary Brand Accent: `#3B172D` (Deep Wine Velvet)
  - Secondary Brand Accent: `#D98C95` (Soft Blushed Peony)
  - Metallic Accent: `#C8A46A` (Aged Champagne Gold)

---

## 5. Exhaustive Technical Questions & Answers (Q&A)

### 5.1 Architecture & Infrastructure

#### Q1: Why was Next.js selected for the frontend over a standard Single Page Application (like Vite + React SPA)?
**Answer:** Next.js App Router provides Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR), which are essential for e-commerce SEO (search engines indexing product descriptions and gift categories). Furthermore, Next.js handles server components, dynamic code-splitting per route, image optimization out-of-the-box, and offers fast initial page loads compared to heavy client-only bundles.

#### Q2: What is the benefit of having 19 separate domain apps in Django instead of one monolithic app?
**Answer:** High modularity and clear separation of concerns. In Django, splitting functionality into discrete apps (`accounts`, `catalog`, `orders`, `recommendations`, `creators`, `delivery`, `ai`) keeps models, serializers, and migrations manageable. If the team decides to extract `delivery` or `recommendations` into an independent microservice in the future, the boundaries and database models are already cleanly decoupled.

#### Q3: How do the frontend and backend communicate in development vs. production?
**Answer:** In development, the frontend runs on `http://localhost:3000` and the backend runs on `http://localhost:8000`. Requests are sent via `fetch` through `frontend/lib/api/client.ts` with `django-cors-headers` allowing the cross-origin requests. In production, an Nginx reverse proxy routes requests to `/api/*` directly to Gunicorn/Uvicorn hosting Django, while root paths route to the Next.js Node.js server.

#### Q4: How is static media (product images) served and managed?
**Answer:** In development, images reside in `frontend/public/` or are hosted via curated Unsplash URLs. Django’s `settings.MEDIA_ROOT` and `settings.MEDIA_URL` handle user-uploaded profile pictures and custom product photos. For production deployments, Django storage backends (such as `django-storages` with AWS S3 or Cloudinary) can be plugged in without changing model fields.

#### Q5: How does the system handle API documentation and contract testing?
**Answer:** Bloomora uses `drf-spectacular` to automatically introspect all DRF ViewSets, Serializers, and URL configurations. It generates an OpenAPI 3.0 compliant schema available at `/api/schema/`, rendered interactively via Swagger UI at `/api/docs/` and ReDoc at `/api/redoc/`.

---

### 5.2 Authentication & Security

#### Q6: How does JWT authentication work in Bloomora?
**Answer:** Bloomora uses `djangorestframework-simplejwt`. When a user submits credentials to `/api/auth/login/`, the server validates the password using PBKDF2 with SHA-256 hashes. Upon success, Django returns a signed `access` token (short-lived, 1 hour) and a `refresh` token (long-lived, 7 days). The frontend stores the access token in memory or secure storage and includes it as an `Authorization: Bearer <token>` header in subsequent requests.

#### Q7: What happens when a user registers as a Seller vs. a Customer?
**Answer:** 
1. When registering as a **Seller**, the request payload contains `role: "seller"`, along with `store_name` and `city`.
2. `RegisterSerializer` creates the `User` record with `role='seller'`.
3. An automated post-creation hook in the serializer instantiates an associated `Seller` model record in `apps.creators.models.Seller`, assigning the business name, city, and initial approval flags.
4. The user is redirected to the Seller Login portal to authenticate with their merchant credentials.
5. When registering as a **Customer**, `role='customer'` is assigned, and no merchant profile is generated.

#### Q8: How is unauthorized access prevented on Seller and Admin routes?
**Answer:**
- **Frontend Protection:** Next.js pages check `useSellerStore()` and `useBloomoraAuth()`. If an unauthenticated user or non-seller navigates to `/partner`, they are redirected to `/auth/login?role=seller`.
- **Backend Protection:** DRF endpoints enforce permissions using `IsAuthenticated` alongside custom role permission classes (e.g., `IsSellerUser`, `IsAdminUser`) that verify `request.user.role == 'seller'`.

#### Q9: How are passwords stored and secured?
**Answer:** Passwords are never stored in plaintext. Django uses cryptographic hashing algorithms (PBKDF2 with a SHA256 hash by default, configured with 720,000 iterations and salt). Passwords cannot be decrypted or reverse-engineered.

#### Q10: How are CORS attacks prevented?
**Answer:** `django-cors-headers` explicitly whitelists only trusted origins (`CORS_ALLOWED_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']`). Arbitrary third-party websites cannot issue authenticated cross-origin requests to Bloomora's backend.

---

### 5.3 Artificial Intelligence & Recommendation Algorithms

#### Q11: How does the AI Gift Recommendation Engine determine the "Gift Fit Score™"?
**Answer:** The Gift Fit Score™ is an algorithmic weighted sum evaluating:
1. **Occasion Relevance (35%):** Keyword and tag matches between the product and the occasion (e.g., roses and champagne score high for *Anniversary*; chocolates and stationery score high for *Appreciation*).
2. **Recipient Persona Fit (30%):** Matches product tags against recipient relations (*Partner*, *Mother*, *Colleague*).
3. **Budget Proximity (20%):** Ensures the product falls within or close to the customer's specified spending band.
4. **Vibe & Aesthetic Alignment (15%):** Matches tone tags (*Luxury*, *Playful*, *Whimsical*, *Minimalist*).
The combined score is normalized to a percentage between 75% and 99% to provide human-readable confidence scores.

#### Q12: How does the AI Concierge handle natural language input?
**Answer:** The conversational AI is powered by Google Gemini (`@google/genai` on the frontend and `google-generativeai` on the backend). A structured system prompt primes the model with Bloomora's brand tone, luxury vocabulary, and product categories. When a user describes a recipient, Gemini extracts structured parameters (budget, recipient relation, emotional vibe) and maps them directly to relevant catalog SKUs.

#### Q13: Does the AI recommendation system fail if the Gemini API key is missing or quota is exhausted?
**Answer:** No. Bloomora incorporates a multi-tier fallback mechanism. If the Gemini API call fails or times out, the system automatically engages the local heuristic recommendation engine in `apps/recommendations/service.py` and `frontend/lib/gemini.ts`. This engine filters the 1,000-product catalog using deterministic metadata scoring, ensuring uninterrupted user experience.

#### Q14: How does the platform generate custom greeting card messages?
**Answer:** When customizing a gift in the Custom Builder or Checkout, users can click "Generate Message with AI". The system passes the occasion, recipient name, and tone (e.g., *Heartfelt*, *Poetic*, *Witty*) to Gemini, which returns three bespoke message options suitable for handwritten card printing.

#### Q15: Can Bloomora recommend gifts for regional Indian festivals?
**Answer:** Yes. Bloomora includes a dedicated `indianOccasions.ts` database mapping festivals like Diwali, Raksha Bandhan, Karwa Chauth, Pongal, and Onam. The recommendation engine applies specific cultural heuristics (e.g., recommending dry fruit hampers, brass lamps, and mithai for Diwali; sacred threads and chocolate boxes for Rakhi).

---

### 5.4 Database, Data Models & Django Backend

#### Q16: How is the database schema organized across apps?
**Answer:**
- `accounts.User`: Core identity, email, phone, role enum (`customer`, `seller`, `admin`, `support`, `delivery_partner`).
- `catalog.Product`: Title, description, price, stock, SKU, category foreign key, image URL, dimensions, tags JSON.
- `catalog.Category`: Category name, slug, parent category, hero image.
- `creators.Seller`: One-to-one link with `User`, store name, approval status, rating, location, commission rate.
- `orders.Order` & `OrderItem`: Order status, customer reference, shipping address, total price, payment reference.
- `delivery.DeliveryTask`: Assigned driver, pickup location, drop coordinates, stealth delivery flag, tracking history.
- `recommendations.GiftPreference`: User gift DNA, tracked preferences, and occasion memories.

#### Q17: Why did we build a custom `CustomUserManager` for Django's User model?
**Answer:** In standard Django, `createsuperuser` and `create_user` expect a mandatory `username` parameter. Because Bloomora uses `email` as the sole unique identifier (`USERNAME_FIELD = 'email'`), trying to run `manage.py createsuperuser` or register via email without a custom manager throws an error. `CustomUserManager` overrides `create_user` and `create_superuser` to normalize and validate email addresses without requiring a username.

#### Q18: How was the 1,000-product catalog generated and seeded?
**Answer:** A dedicated script (`backend/generate_1000_products.py`) and Django management command (`seed_bloomora.py`) systematically generated 1,000 realistic, unique gifting products. It balanced catalog distribution across 10 distinct categories, assigned high-resolution imagery, calculated price distributions from ₹299 to ₹12,999, and pre-tagged every item with recipient and occasion tags for algorithmic retrieval.

#### Q19: How are database transactions handled during order placement?
**Answer:** In `apps/orders/`, checkout creation is wrapped inside Django's `transaction.atomic()` block. If any step fails (e.g., stock deduction or payment record creation), all intermediate database operations are rolled back, preventing orphaned orders or incorrect inventory counts.

#### Q20: Can SQLite easily be migrated to PostgreSQL in production?
**Answer:** Yes. Because all database interactions use Django's ORM without raw SQLite-specific SQL queries, switching to PostgreSQL requires only updating `DATABASES['default']` in `backend/config/settings/production.py` to use `django.db.backends.postgresql` and installing `psycopg2-binary`. Running `python manage.py migrate` builds the identical schema on PostgreSQL.

---

### 5.5 Frontend State Management, Rendering & Performance

#### Q21: What state management pattern is utilized on the frontend?
**Answer:** Bloomora employs a modern, lightweight state architecture combining:
1. **React Context (`authContext.tsx`):** Provides global authentication state, user identity, and session tokens.
2. **Local Reactive Stores (`sellerStore.ts`, `store.ts`):** Custom reactive stores with subscriber patterns and `localStorage` persistence for the active role, cart items, seller metrics, and store preferences.
3. **URL State via `useSearchParams`:** Keeps filters, active tabs, and roles reflected in the URL for shareability and deep-linking.

#### Q22: Why were components wrapped with React `<Suspense>`?
**Answer:** In Next.js App Router, using hooks like `useSearchParams()` in client components causes Next.js to de-opt into client-side rendering for the entire page if not wrapped in `<Suspense>`. Adding `<Suspense fallback={<Loader />}>` boundaries allows Next.js to prerender page shells statically while streaming query parameter hydration asynchronously.

#### Q23: How are images optimized to avoid slow page loads?
**Answer:** 
- Next.js `<Image>` component automatically converts assets to modern `.webp` and `.avif` formats.
- Images include explicit width, height, and `sizes` attributes for responsive viewport loading.
- Off-screen images use native lazy loading (`loading="lazy"`).
- CDN images use quality query params (`q=80`, `auto=format`) to reduce file size while preserving high visual fidelity.

#### Q24: How was the Next.js development indicator icon removed from the UI?
**Answer:** In `frontend/next.config.ts`, `devIndicators: false` was set. Additionally, global CSS rules targeting Next.js portal selectors (`nextjs-portal`, `[data-nextjs-dev-indicator]`) were added in `frontend/app/globals.css` with `display: none !important;` to ensure complete suppression during local testing.

#### Q25: How does Bloomora achieve a smooth 60fps animation experience?
**Answer:** Framer Motion animations animate hardware-accelerated CSS properties (`transform`, `opacity`, `scale`) rather than layout-triggering properties (`width`, `height`, `margin`). This avoids browser reflows and ensures butter-smooth animations even on low-power mobile devices.

---

### 5.6 Commerce, Payments & Order Fulfillment

#### Q26: How does Razorpay payment processing work end-to-end?
**Answer:**
1. Customer reviews items in `/checkout` and clicks "Proceed to Payment".
2. Frontend calls `/api/payments/create-order/` on the Django backend.
3. Django uses the official `razorpay` Python SDK to create an order with Razorpay's API, returning a `razorpay_order_id`.
4. The frontend initializes the Razorpay modal (`new window.Razorpay(options)`).
5. The customer completes payment via UPI, card, or net banking.
6. Razorpay returns `razorpay_payment_id` and `razorpay_signature`.
7. Frontend sends these verification details to `/api/payments/verify/`.
8. Django cryptographically verifies the signature using HMAC-SHA256 and the Razorpay Key Secret. If valid, order status updates to `PAID` and order fulfillment begins.

#### Q27: What is the "Stealth Delivery" feature and how is it technically implemented?
**Answer:** In conventional e-commerce, recipients receive SMS updates with tracking links. For surprise gifts, this ruins the surprise. When the "Stealth Delivery" checkbox is selected:
- The `Order` and `DeliveryTask` models set `is_stealth = True`.
- Notification services suppress delivery dispatch SMS to the recipient.
- The delivery courier receives instructions to avoid ringing calling numbers until physically arriving at the coordinates.
- Only the buyer receives real-time tracking updates.

#### Q28: How does the "Meet Me There" coordinate delivery work?
**Answer:** 
- Using `@vis.gl/react-google-maps`, customers drag a pin to pinpoint exact GPS latitude and longitude (e.g., a specific park pavilion or restaurant table).
- These coordinates are captured in the payload and stored in `DeliveryTask.drop_latitude` and `DeliveryTask.drop_longitude`.
- The courier portal displays a direct Google Maps navigation deep-link directly to those coordinates rather than relying solely on ambiguous postal addresses.

#### Q29: How does the Custom Hamper Builder prevent customers from exceeding box capacities?
**Answer:** Each container model has a defined `volume_capacity` (e.g., *Hatbox = 4 units*, *Heirloom Chest = 8 units*). Each gift item has a `unit_size` (e.g., *Chocolate Bar = 1 unit*, *Large Champagne Bottle = 3 units*). As items are added, the client calculates total units in real time, visually fills a capacity bar, and disables items that would overflow the container dimensions.

#### Q30: How are refunds or order cancellations handled?
**Answer:** When an order is cancelled by an authorized user prior to dispatch, Django issues an API call to `razorpay.payment.refund(payment_id, {'amount': amount})`. Upon confirmation, the order status transitions to `CANCELLED`, inventory quantities are restored in the database, and an automated email receipt is generated.

---

## 6. Conclusion

The **Bloomora** platform represents a harmonious synthesis of modern web engineering:
- **Scalable Architecture:** Clean decoupling between Next.js 16 and Django 5 REST Framework.
- **Cognitive Intelligence:** Contextual AI gift matching using Google Gemini and multi-factor algorithmic scoring.
- **Hyperlocal Precision:** Live GPS tracking, stealth delivery protocols, and artisan merchant empowerment.
- **Enterprise-Grade Craftsmanship:** Rigorous type safety, robust RBAC authentication, and a responsive editorial visual identity.
