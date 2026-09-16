"""
Bloomora Seed Command
Seeds the database with categories, occasions, sellers, and products from mockData.
Usage: python manage.py seed_bloomora
"""
from django.core.management.base import BaseCommand
from django.db import transaction


CATEGORIES = [
    {"name": "Floral Arrangements", "slug": "flowers", "icon": "Flower2", "description": "Hand-arranged luxury blooms", "sort_order": 1},
    {"name": "Velvet Box Bouquets", "slug": "bouquets", "icon": "Gift", "description": "Handcrafted floral art in signature velvet presentation boxes", "sort_order": 2},
    {"name": "Gourmet Bento Cakes", "slug": "cakes", "icon": "Cake", "description": "Artisanal chocolate truffle mini cakes & celebratory sweets", "sort_order": 3},
    {"name": "Chocolate Bouquets", "slug": "chocolate-bouquets", "icon": "Sparkles", "description": "Artisanal truffles wrapped in velvet", "sort_order": 4},
    {"name": "Corporate & Executive", "slug": "corporate-gifts", "icon": "Briefcase", "description": "Luxury branded diaries, pens, onboarding kits & client sets", "sort_order": 5},
    {"name": "Kids Art & Craft Hampers", "slug": "kids-gifting", "icon": "Palette", "description": "Age-tiered creative hampers fostering tactile exploration & DIY", "sort_order": 6},
    {"name": "Royal Reserve Hampers", "slug": "premium-gifts", "icon": "Crown", "description": "Handcrafted wooden chests, gourmet nuts & Belgian chocolates", "sort_order": 7},
    {"name": "Custom Keepsakes & Mugs", "slug": "custom-gifts", "icon": "Coffee", "description": "Handcrafted ceramic mugs and personalized memory keepsakes", "sort_order": 8},
    {"name": "Curated Hampers", "slug": "gift-hampers", "icon": "ShoppingBag", "description": "Multi-item emotional experiences", "sort_order": 9},
]

OCCASIONS = [
    {"name": "Birthday Celebration", "slug": "birthday", "emoji": "🎉"},
    {"name": "Love & Romance", "slug": "love", "emoji": "❤️"},
    {"name": "Anniversary Milestone", "slug": "anniversary", "emoji": "🥂"},
    {"name": "Proposal Moment", "slug": "proposal", "emoji": "💍"},
    {"name": "Congratulations", "slug": "congratulations", "emoji": "🌟"},
    {"name": "Gratitude & Care", "slug": "thank-you", "emoji": "🙏"},
    {"name": "Wedding Gift", "slug": "wedding", "emoji": "👰"},
    {"name": "Graduation Gift", "slug": "graduation", "emoji": "🎓"},
    {"name": "Friendship Day", "slug": "friendship", "emoji": "🤝"},
    {"name": "Apology Gift", "slug": "sorry", "emoji": "🌸"},
]

PRODUCTS_DATA = [
    {
        "name": "A Beautiful Birthday Surprise",
        "subtitle": "2 Dutch Red Roses + Dairy Milk Silk + Gold Ribbon",
        "description": "Two long-stem Dutch red roses paired with Cadbury Dairy Milk Silk, wrapped in soft ivory matte paper with signature gold velvet ribbon and custom gold foil greeting card.",
        "story": "Designed to transform a modest budget into a moment of pure unboxing joy.",
        "price": 249,
        "original_price": 349,
        "category_slug": "flowers",
        "stock": 50,
        "images": ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"],
        "tags": ["roses", "chocolate", "birthday", "love", "budget-friendly"],
        "occasions": ["birthday", "love", "proposal", "anniversary"],
        "emotions": ["loved", "appreciated", "surprised"],
        "recipient_types": ["for-her"],
        "interests": ["flowers", "chocolate"],
        "budget_tier": "200-299",
        "customizable": True,
        "same_day_available": True,
        "delivery_time_hours": 2,
        "preparation_time_minutes": 15,
        "is_best_seller": True,
        "is_trending": True,
        "ai_recommendation_reason": "Optimal visual balance of flowers & chocolates within Rs.250 budget.",
        "location": "Surampalem, Rajahmundry, Vijayawada",
    },
    {
        "name": "The Golden Truffle & Satin Treasure",
        "subtitle": "16 Golden Ferrero Truffles in Cylinder Box",
        "description": "16 golden Ferrero Rocher pralines intricately woven with artificial cream satin roses in a rigid midnight black and gold foil cylinder box.",
        "story": "Created for grand milestones. Loved for anniversaries and celebrations.",
        "price": 899,
        "original_price": 1199,
        "category_slug": "chocolate-bouquets",
        "stock": 25,
        "images": ["https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80"],
        "tags": ["ferrero", "luxury", "satin", "anniversary", "premium"],
        "occasions": ["anniversary", "birthday", "wedding", "congratulations"],
        "emotions": ["loved", "celebrated", "appreciated"],
        "recipient_types": ["for-her"],
        "interests": ["chocolate", "luxury"],
        "budget_tier": "500-999",
        "customizable": False,
        "same_day_available": True,
        "delivery_time_hours": 4,
        "preparation_time_minutes": 20,
        "is_best_seller": True,
        "is_trending": True,
        "ai_recommendation_reason": "Highest luxury rating for milestone anniversaries.",
        "location": "Rajahmundry, Surampalem",
    },
    {
        "name": "The Gentle Pocket Gesture",
        "subtitle": "1 Dutch Rose + Cadbury Chocolate + Mini Card",
        "description": "One hand-picked Dutch Rose with Dairy Milk wrapped in soft blush paper.",
        "story": "Small in price, massive in warmth. Designed for quick pickups and spontaneous smiles.",
        "price": 149,
        "original_price": 199,
        "category_slug": "mini-gifts",
        "stock": 100,
        "images": ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"],
        "tags": ["pocket-friendly", "rose", "chocolate", "student", "mini"],
        "occasions": ["thank-you", "sorry", "birthday", "love"],
        "emotions": ["appreciated", "forgiven", "thanked"],
        "recipient_types": ["for-friends", "for-her"],
        "interests": ["flowers", "chocolate"],
        "budget_tier": "under-199",
        "customizable": False,
        "same_day_available": True,
        "delivery_time_hours": 1,
        "preparation_time_minutes": 10,
        "is_best_seller": False,
        "is_trending": False,
        "ai_recommendation_reason": "Best pocket-friendly surprise under Rs.150 for student budgets.",
        "location": "Surampalem, Rajahmundry, Vijayawada",
    },
    {
        "name": "Eternal Rose & Vanilla Soy Candle Chest",
        "subtitle": "Everlasting Preserved Rose in Carved Wooden Box",
        "description": "An everlasting preserved red velvet rose paired with a French vanilla scented soy candle in an engraved wooden gift chest.",
        "story": "A timeless keepsake designed to last for years.",
        "price": 1299,
        "original_price": 1699,
        "category_slug": "luxury-boxes",
        "stock": 15,
        "images": ["https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80"],
        "tags": ["preserved-rose", "luxury", "keepsake", "candle", "anniversary", "wooden-box"],
        "occasions": ["anniversary", "wedding", "proposal", "love"],
        "emotions": ["loved", "cherished", "surprised"],
        "recipient_types": ["for-her"],
        "interests": ["flowers", "luxury", "home-decor"],
        "budget_tier": "1000-plus",
        "customizable": True,
        "same_day_available": False,
        "delivery_time_hours": 24,
        "preparation_time_minutes": 25,
        "is_best_seller": True,
        "is_trending": True,
        "ai_recommendation_reason": "Everlasting preserved keepsake with high emotional retention.",
        "location": "Rajahmundry, Vijayawada",
    },
    {
        "name": "Sweet Celebration Gift Tray",
        "subtitle": "3 Roses + Cadbury Celebrations + Sparkler",
        "description": "Three vibrant Dutch roses, Cadbury Celebrations pack, a luxury birthday greeting card, and a golden party sparkler.",
        "story": "Everything needed to light up someone's birthday instantly.",
        "price": 449,
        "original_price": 599,
        "category_slug": "gift-hampers",
        "stock": 35,
        "images": ["https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"],
        "tags": ["birthday", "celebration", "roses", "sparkler", "hamper"],
        "occasions": ["birthday", "congratulations"],
        "emotions": ["celebrated", "surprised", "happy"],
        "recipient_types": ["for-friends", "for-her"],
        "interests": ["chocolate", "flowers", "parties"],
        "budget_tier": "300-499",
        "customizable": False,
        "same_day_available": True,
        "delivery_time_hours": 3,
        "preparation_time_minutes": 15,
        "is_best_seller": True,
        "is_trending": True,
        "ai_recommendation_reason": "Top rated birthday celebration combo with golden party sparkler.",
        "location": "Surampalem, Rajahmundry, Vijayawada",
    },
    {
        "name": "Illuminated Acrylic Memory Frame Set",
        "subtitle": "LED Photo Acrylic Frame + 4 Red Roses Box",
        "description": "An LED illuminated clear acrylic frame customized with your favorite photo & message, surrounded by 4 red roses in an ivory box.",
        "story": "Turn a photograph into an illuminated masterpiece.",
        "price": 799,
        "original_price": 999,
        "category_slug": "personalized",
        "stock": 20,
        "images": ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"],
        "tags": ["photo", "personalized", "LED", "acrylic", "memory", "anniversary"],
        "occasions": ["anniversary", "birthday", "love", "graduation"],
        "emotions": ["cherished", "remembered", "loved"],
        "recipient_types": ["for-him", "for-her"],
        "interests": ["photography", "memories", "personalized"],
        "budget_tier": "500-999",
        "customizable": True,
        "supports_photo_customization": True,
        "supports_text_customization": True,
        "same_day_available": False,
        "delivery_time_hours": 48,
        "preparation_time_minutes": 30,
        "is_best_seller": False,
        "is_trending": True,
        "ai_recommendation_reason": "Custom photo LED illumination for personalized memory preservation.",
        "location": "Rajahmundry, Vijayawada",
    },
]


class Command(BaseCommand):
    help = "Seed Bloomora database with categories, occasions, sellers, and products"

    @transaction.atomic
    def handle(self, *args, **options):
        from apps.catalog.models import Category, Occasion, Product
        from apps.creators.models import Seller
        from apps.accounts.models import User

        self.stdout.write(self.style.SUCCESS("[Bloomora] Seeding database..."))

        # 1. Categories
        self.stdout.write("  Creating categories...")
        category_map = {}
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(
                slug=cat_data["slug"],
                defaults={
                    "name": cat_data["name"],
                    "icon": cat_data["icon"],
                    "description": cat_data["description"],
                    "sort_order": cat_data["sort_order"],
                    "active": True,
                }
            )
            category_map[cat_data["slug"]] = cat
            if created:
                self.stdout.write(f"    + Category: {cat.name}")

        # 2. Occasions
        self.stdout.write("  Creating occasions...")
        occasion_map = {}
        for occ_data in OCCASIONS:
            occ, created = Occasion.objects.get_or_create(
                slug=occ_data["slug"],
                defaults={"name": occ_data["name"], "emoji": occ_data["emoji"], "active": True}
            )
            occasion_map[occ_data["slug"]] = occ
            if created:
                self.stdout.write(f"    + Occasion: {occ.name}")

        # 3. Demo Seller
        self.stdout.write("  Creating demo seller...")
        seller_user, _ = User.objects.get_or_create(
            email="seller@bloomora.com",
            defaults={
                "first_name": "Bloomora",
                "last_name": "Creator",
                "role": "seller",
                "is_active": True,
            }
        )
        if not seller_user.has_usable_password():
            seller_user.set_password("Bloomora@2026")
            seller_user.save()

        seller, _ = Seller.objects.get_or_create(
            user=seller_user,
            defaults={
                "business_name": "Bloomora Signature Collection",
                "description": "Bloomora's own curated collection of premium gifts.",
                "location": "Rajahmundry, Andhra Pradesh",
                "approved": True,
                "creator_story": "Bloomora's founding collection, curated with love from the heartland of Andhra Pradesh.",
                "handmade": True,
                "supports_customization": True,
                "supports_same_day": True,
                "lead_time_hours": 2,
                "rating": 4.95,
                "total_orders": 847,
            }
        )
        self.stdout.write(f"    + Seller: {seller.business_name}")

        # 4. Products
        self.stdout.write("  Creating products...")
        for prod_data in PRODUCTS_DATA:
            category = category_map.get(prod_data["category_slug"])
            if not category:
                continue

            product, created = Product.objects.get_or_create(
                name=prod_data["name"],
                seller=seller,
                defaults={
                    "subtitle": prod_data.get("subtitle", ""),
                    "description": prod_data["description"],
                    "story": prod_data.get("story", ""),
                    "price": prod_data["price"],
                    "original_price": prod_data.get("original_price"),
                    "category": category,
                    "stock": prod_data["stock"],
                    "images": prod_data["images"],
                    "tags": prod_data["tags"],
                    "emotions": prod_data.get("emotions", []),
                    "recipient_types": prod_data.get("recipient_types", []),
                    "interests": prod_data.get("interests", []),
                    "budget_tier": prod_data.get("budget_tier", ""),
                    "customizable": prod_data.get("customizable", False),
                    "supports_photo_customization": prod_data.get("supports_photo_customization", False),
                    "supports_text_customization": prod_data.get("supports_text_customization", False),
                    "same_day_available": prod_data.get("same_day_available", False),
                    "delivery_time_hours": prod_data.get("delivery_time_hours", 24),
                    "preparation_time_minutes": prod_data.get("preparation_time_minutes", 30),
                    "is_best_seller": prod_data.get("is_best_seller", False),
                    "is_trending": prod_data.get("is_trending", False),
                    "ai_recommendation_reason": prod_data.get("ai_recommendation_reason", ""),
                    "location": prod_data.get("location", ""),
                    "active": True,
                    "featured": prod_data.get("is_best_seller", False),
                }
            )

            if created:
                # Add occasions
                for occ_slug in prod_data.get("occasions", []):
                    if occ_slug in occasion_map:
                        product.occasions.add(occasion_map[occ_slug])
                self.stdout.write(f"    + Product: {product.name} (Rs.{product.price})")

        # 5. Demo customer
        self.stdout.write("  Creating demo customer...")
        customer, _ = User.objects.get_or_create(
            email="customer@bloomora.com",
            defaults={"first_name": "Sriram", "last_name": "Reddy", "role": "customer", "is_active": True}
        )
        if not customer.has_usable_password():
            customer.set_password("Bloomora@2026")
            customer.save()

        # 6. Admin
        self.stdout.write("  Creating admin user...")
        admin, _ = User.objects.get_or_create(
            email="admin@bloomora.com",
            defaults={"first_name": "Bloomora", "last_name": "Admin", "role": "admin", "is_staff": True, "is_superuser": True, "is_active": True}
        )
        if not admin.has_usable_password():
            admin.set_password("Bloomora@2026")
            admin.save()

        self.stdout.write(self.style.SUCCESS("\nBloomora database seeded successfully!"))
        self.stdout.write(self.style.SUCCESS("   Admin: admin@bloomora.com / Bloomora@2026"))
        self.stdout.write(self.style.SUCCESS("   Seller: seller@bloomora.com / Bloomora@2026"))
        self.stdout.write(self.style.SUCCESS("   Customer: customer@bloomora.com / Bloomora@2026"))
