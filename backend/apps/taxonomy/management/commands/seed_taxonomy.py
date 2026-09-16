"""
Management command: seed_taxonomy
Seeds all Gift Types, Occasion Types, Recipient Types, and Gift Intent Tags.

Idempotent — running multiple times will not create duplicates.

Usage:
    python manage.py seed_taxonomy
    python manage.py seed_taxonomy --clear   # clears existing data first
"""
from django.core.management.base import BaseCommand
from apps.taxonomy.models import GiftType, OccasionType, RecipientType, GiftIntentTag


# ─── GIFT TYPES ────────────────────────────────────────────────────────────────

GIFT_TYPES = [
    {
        'name': 'Flowers & Floral Gifts', 'slug': 'flowers', 'icon': '🌸',
        'display_order': 1, 'is_featured': True,
        'subs': [
            ('Bouquets', 'bouquets', '💐'),
            ('Roses', 'roses', '🌹'),
            ('Mixed Flowers', 'mixed-flowers', '🌷'),
            ('Preserved Flowers', 'preserved-flowers', '🌺'),
            ('Dried Flowers', 'dried-flowers', '🍂'),
            ('Flower Boxes', 'flower-boxes', '📦'),
            ('Flower Baskets', 'flower-baskets', '🧺'),
            ('Floral Arrangements', 'floral-arrangements', '🌻'),
            ('Premium Flowers', 'premium-flowers', '💎'),
            ('Personalized Floral Gifts', 'personalized-floral', '✨'),
        ]
    },
    {
        'name': 'Cakes & Desserts', 'slug': 'cakes-desserts', 'icon': '🎂',
        'display_order': 2, 'is_featured': True,
        'subs': [
            ('Birthday Cakes', 'birthday-cakes', '🎂'),
            ('Anniversary Cakes', 'anniversary-cakes', '💑'),
            ('Designer Cakes', 'designer-cakes', '🎨'),
            ('Photo Cakes', 'photo-cakes', '📸'),
            ('Custom Cakes', 'custom-cakes', '✨'),
            ('Cupcakes', 'cupcakes', '🧁'),
            ('Brownies', 'brownies', '🍫'),
            ('Cheesecakes', 'cheesecakes', '🍰'),
            ('Chocolates', 'chocolates', '🍫'),
            ('Cookies', 'cookies', '🍪'),
            ('Mithai & Sweets', 'mithai-sweets', '🍬'),
            ('Dessert Hampers', 'dessert-hampers', '🎁'),
        ]
    },
    {
        'name': 'Gift Hampers & Boxes', 'slug': 'gift-hampers', 'icon': '🎁',
        'display_order': 3, 'is_featured': True,
        'subs': [
            ('Birthday Hampers', 'birthday-hampers', '🎂'),
            ('Anniversary Hampers', 'anniversary-hampers', '💕'),
            ('Self-Care Hampers', 'self-care-hampers', '🛁'),
            ('Chocolate Hampers', 'chocolate-hampers', '🍫'),
            ('Snack Hampers', 'snack-hampers', '🍿'),
            ('Beauty Hampers', 'beauty-hampers', '💄'),
            ('Wellness Hampers', 'wellness-hampers', '🌿'),
            ('Luxury Hampers', 'luxury-hampers', '✨'),
            ('Personalized Hampers', 'personalized-hampers', '📝'),
            ('Couple Hampers', 'couple-hampers', '💑'),
            ('Corporate Hampers', 'corporate-hampers', '🏢'),
            ('Festival Hampers', 'festival-hampers', '🎆'),
            ('Kids Hampers', 'kids-hampers', '🧸'),
            ('Custom Gift Boxes', 'custom-gift-boxes', '📦'),
        ]
    },
    {
        'name': 'Personalized Gifts', 'slug': 'personalized-gifts', 'icon': '✨',
        'display_order': 4, 'is_featured': True,
        'subs': [
            ('Photo Gifts', 'photo-gifts', '📸'),
            ('Name Gifts', 'name-gifts', '🔤'),
            ('Initial Gifts', 'initial-gifts', '🔡'),
            ('Message Gifts', 'message-gifts', '💌'),
            ('Custom Portraits', 'custom-portraits', '🎨'),
            ('Custom Illustration', 'custom-illustration', '✏️'),
            ('Personalized Mugs', 'personalized-mugs', '☕'),
            ('Personalized Frames', 'personalized-frames', '🖼️'),
            ('Personalized Cushions', 'personalized-cushions', '🛋️'),
            ('Personalized Clothing', 'personalized-clothing', '👕'),
            ('Personalized Jewellery', 'personalized-jewellery', '💍'),
            ('Personalized Home Decor', 'personalized-home-decor', '🏡'),
            ('Custom Gift Boxes', 'custom-personalized-boxes', '🎁'),
            ('Custom Handmade Gifts', 'custom-handmade', '🤲'),
        ]
    },
    {
        'name': 'Handmade & Artisan Gifts', 'slug': 'handmade-artisan', 'icon': '🤲',
        'display_order': 5, 'is_featured': True,
        'subs': [
            ('Handmade Crafts', 'handmade-crafts', '🖐️'),
            ('Hand-Painted Gifts', 'hand-painted', '🎨'),
            ('Artisan Decor', 'artisan-decor', '🏺'),
            ('Handmade Jewellery', 'handmade-jewellery', '📿'),
            ('Handmade Candles', 'handmade-candles', '🕯️'),
            ('Handmade Soaps', 'handmade-soaps', '🧼'),
            ('Pottery', 'pottery', '🏺'),
            ('Ceramics', 'ceramics', '🫙'),
            ('Woodcraft', 'woodcraft', '🪵'),
            ('Handwoven Products', 'handwoven', '🧵'),
            ('Traditional Crafts', 'traditional-crafts', '🏛️'),
            ('Local Artisan Products', 'local-artisan', '🌍'),
        ]
    },
    {
        'name': 'Chocolates & Confectionery', 'slug': 'chocolates', 'icon': '🍫',
        'display_order': 6, 'is_featured': True,
        'subs': [
            ('Chocolate Boxes', 'chocolate-boxes', '📦'),
            ('Premium Chocolates', 'premium-chocolates', '✨'),
            ('Handmade Chocolates', 'handmade-chocolates', '🤲'),
            ('Truffles', 'truffles', '🍬'),
            ('Chocolate Bouquets', 'chocolate-bouquets', '💐'),
            ('Personalized Chocolates', 'personalized-chocolates', '✨'),
            ('Gourmet Chocolates', 'gourmet-chocolates', '🍽️'),
            ('Sugar-Free Chocolates', 'sugar-free-chocolates', '🌿'),
        ]
    },
    {
        'name': 'Jewellery', 'slug': 'jewellery', 'icon': '💍',
        'display_order': 7, 'is_featured': True,
        'subs': [
            ('Necklaces', 'necklaces', '📿'),
            ('Bracelets', 'bracelets', '💛'),
            ('Earrings', 'earrings', '👂'),
            ('Rings', 'rings', '💍'),
            ('Pendants', 'pendants', '🔮'),
            ('Couple Jewellery', 'couple-jewellery', '💑'),
            ('Personalized Jewellery', 'personalized-jewellery-cat', '✨'),
            ('Minimal Jewellery', 'minimal-jewellery', '⭕'),
            ('Handmade Jewellery', 'handmade-jewellery-cat', '🤲'),
            ('Premium Jewellery', 'premium-jewellery', '💎'),
        ]
    },
    {
        'name': 'Fashion & Accessories', 'slug': 'fashion-accessories', 'icon': '👜',
        'display_order': 8,
        'subs': [
            ('Bags', 'bags', '👜'),
            ('Wallets', 'wallets', '👛'),
            ('Watches', 'watches', '⌚'),
            ('Sunglasses', 'sunglasses', '🕶️'),
            ('Scarves', 'scarves', '🧣'),
            ('Clothing', 'clothing', '👗'),
            ('Fashion Accessories', 'fashion-accessories-cat', '💫'),
        ]
    },
    {
        'name': 'Beauty & Self-Care', 'slug': 'beauty-self-care', 'icon': '💆',
        'display_order': 9, 'is_featured': True,
        'subs': [
            ('Skincare', 'skincare', '✨'),
            ('Bath & Body', 'bath-body', '🛁'),
            ('Fragrances', 'fragrances', '🌸'),
            ('Makeup', 'makeup', '💄'),
            ('Grooming', 'grooming', '✂️'),
            ('Spa Kits', 'spa-kits', '🧖'),
            ('Self-Care Kits', 'self-care-kits', '💆'),
            ('Wellness Kits', 'wellness-kits', '🌿'),
            ('Relaxation Gifts', 'relaxation-gifts', '😌'),
        ]
    },
    {
        'name': 'Home & Living', 'slug': 'home-living', 'icon': '🏡',
        'display_order': 10,
        'subs': [
            ('Home Decor', 'home-decor', '🏠'),
            ('Candles', 'candles', '🕯️'),
            ('Lamps', 'lamps', '🪔'),
            ('Cushions', 'cushions', '🛋️'),
            ('Photo Frames', 'photo-frames', '🖼️'),
            ('Wall Art', 'wall-art', '🖼️'),
            ('Decorative Items', 'decorative-items', '🎨'),
            ('Kitchen Gifts', 'kitchen-gifts', '🍳'),
            ('Tableware', 'tableware', '🍽️'),
            ('Luxury Home Gifts', 'luxury-home', '✨'),
        ]
    },
    {
        'name': 'Plants & Green Gifts', 'slug': 'plants', 'icon': '🌱',
        'display_order': 11,
        'subs': [
            ('Indoor Plants', 'indoor-plants', '🌿'),
            ('Succulents', 'succulents', '🌵'),
            ('Bonsai', 'bonsai', '🌳'),
            ('Flowering Plants', 'flowering-plants', '🌸'),
            ('Desk Plants', 'desk-plants', '🪴'),
            ('Plant Hampers', 'plant-hampers', '🎁'),
            ('Personalized Planters', 'personalized-planters', '✨'),
            ('Eco-Friendly Gifts', 'eco-friendly', '♻️'),
        ]
    },
    {
        'name': 'Books & Stationery', 'slug': 'books-stationery', 'icon': '📚',
        'display_order': 12,
        'subs': [
            ('Books', 'books', '📖'),
            ('Journals', 'journals', '📓'),
            ('Notebooks', 'notebooks', '📔'),
            ('Planners', 'planners', '📅'),
            ('Personalized Stationery', 'personalized-stationery', '✨'),
            ('Art Supplies', 'art-supplies', '🎨'),
        ]
    },
    {
        'name': 'Toys & Games', 'slug': 'toys-games', 'icon': '🧸',
        'display_order': 13,
        'subs': [
            ('Kids Toys', 'kids-toys', '🧸'),
            ('Educational Toys', 'educational-toys', '🔬'),
            ('Board Games', 'board-games', '♟️'),
            ('Puzzles', 'puzzles', '🧩'),
            ('Plush Toys', 'plush-toys', '🧸'),
            ('Couple Games', 'couple-games', '💑'),
        ]
    },
    {
        'name': 'Food & Gourmet', 'slug': 'food-gourmet', 'icon': '🍽️',
        'display_order': 14,
        'subs': [
            ('Gourmet Foods', 'gourmet-foods', '🍴'),
            ('Snacks', 'snacks', '🍿'),
            ('Dry Fruits & Nuts', 'dry-fruits', '🥜'),
            ('Tea & Coffee', 'tea-coffee', '☕'),
            ('Healthy Foods', 'healthy-foods', '🥗'),
            ('Food Hampers', 'food-hampers', '🎁'),
        ]
    },
    {
        'name': 'Experiences', 'slug': 'experiences', 'icon': '🎭',
        'display_order': 15, 'is_featured': True,
        'subs': [
            ('Dining Experiences', 'dining', '🍽️'),
            ('Spa & Wellness', 'spa-wellness', '🧖'),
            ('Workshops', 'workshops', '🎨'),
            ('Adventure', 'adventure', '🏔️'),
            ('Couple Experiences', 'couple-experiences', '💑'),
            ('Family Experiences', 'family-experiences', '👨‍👩‍👧‍👦'),
        ]
    },
    {
        'name': 'Digital Gifts', 'slug': 'digital-gifts', 'icon': '💻',
        'display_order': 16,
        'subs': [
            ('Digital Gift Cards', 'digital-gift-cards', '🎁'),
            ('E-Gifts', 'e-gifts', '📧'),
            ('Digital Artwork', 'digital-artwork', '🎨'),
            ('Personalized Digital Messages', 'digital-messages', '💌'),
        ]
    },
    {
        'name': 'Memory & Keepsake Gifts', 'slug': 'memory-keepsake', 'icon': '📸',
        'display_order': 17, 'is_featured': True,
        'subs': [
            ('Photo Albums', 'photo-albums', '📷'),
            ('Scrapbooks', 'scrapbooks', '📚'),
            ('Memory Boxes', 'memory-boxes', '📦'),
            ('Custom Portraits', 'memory-portraits', '🎨'),
            ('Message Books', 'message-books', '📕'),
            ('Couple Keepsakes', 'couple-keepsakes', '💑'),
        ]
    },
    {
        'name': 'Sustainable & Eco-Friendly', 'slug': 'eco-friendly-gifts', 'icon': '♻️',
        'display_order': 18,
        'subs': [
            ('Reusable Products', 'reusable-products', '🔄'),
            ('Organic Products', 'organic-products', '🌿'),
            ('Zero-Waste Gifts', 'zero-waste', '♻️'),
            ('Plant-Based Gifts', 'plant-based', '🌱'),
        ]
    },
    {
        'name': 'Luxury & Premium Gifts', 'slug': 'luxury-premium', 'icon': '👑',
        'display_order': 19, 'is_featured': True,
        'subs': [
            ('Premium Hampers', 'premium-hampers-cat', '✨'),
            ('Luxury Jewellery', 'luxury-jewellery', '💎'),
            ('Premium Experiences', 'premium-experiences', '🌟'),
            ('Designer Gifts', 'designer-gifts', '🎨'),
        ]
    },
    {
        'name': 'Corporate Gifts', 'slug': 'corporate-gifts', 'icon': '🏢',
        'display_order': 20,
        'subs': [
            ('Employee Gifts', 'employee-gifts', '👥'),
            ('Client Gifts', 'client-gifts', '🤝'),
            ('Executive Gifts', 'executive-gifts', '💼'),
            ('Festival Corporate Gifts', 'festival-corporate', '🎆'),
            ('Custom Branded Gifts', 'branded-gifts', '🏷️'),
            ('Bulk Gifts', 'bulk-gifts', '📦'),
        ]
    },
    {
        'name': 'Baby & New Parent Gifts', 'slug': 'baby-gifts', 'icon': '👶',
        'display_order': 21,
        'subs': [
            ('Baby Clothing', 'baby-clothing', '👶'),
            ('Baby Toys', 'baby-toys', '🧸'),
            ('Newborn Hampers', 'newborn-hampers', '🎁'),
            ('Personalized Baby Gifts', 'personalized-baby', '✨'),
        ]
    },
    {
        'name': 'Custom / Build Your Own Gift', 'slug': 'custom-gift-builder', 'icon': '🛠️',
        'display_order': 22,
        'subs': [
            ('Build a Gift Box', 'build-gift-box', '📦'),
            ('Create Surprise Box', 'create-surprise-box', '🎁'),
        ]
    },
]

# ─── OCCASION TYPES ────────────────────────────────────────────────────────────

OCCASION_TYPES = [
    {
        'name': 'Birthdays', 'slug': 'birthday', 'emoji': '🎂', 'icon': '🎂',
        'display_order': 1, 'is_featured': True,
        'subs': [
            ('Child Birthday', 'child-birthday', '🧒', False),
            ('Teen Birthday', 'teen-birthday', '👦', False),
            ('Adult Birthday', 'adult-birthday', '🎉', False),
            ('Milestone Birthday', 'milestone-birthday', '🌟', False),
            ('18th Birthday', '18th-birthday', '1️⃣8️⃣', False),
            ('21st Birthday', '21st-birthday', '2️⃣1️⃣', False),
            ('30th Birthday', '30th-birthday', '3️⃣0️⃣', False),
            ('50th Birthday', '50th-birthday', '5️⃣0️⃣', False),
            ('Surprise Birthday', 'surprise-birthday', '🎊', False),
        ]
    },
    {
        'name': 'Anniversaries', 'slug': 'anniversary', 'emoji': '💑', 'icon': '💑',
        'display_order': 2, 'is_featured': True,
        'subs': [
            ('Wedding Anniversary', 'wedding-anniversary', '💒', False),
            ('First Anniversary', 'first-anniversary', '1️⃣', False),
            ('Relationship Anniversary', 'relationship-anniversary', '❤️', False),
            ('Silver Anniversary', 'silver-anniversary', '🥈', False),
            ('Golden Anniversary', 'golden-anniversary', '🥇', False),
        ]
    },
    {
        'name': 'Romance & Love', 'slug': 'romance-love', 'emoji': '❤️', 'icon': '❤️',
        'display_order': 3, 'is_featured': True,
        'subs': [
            ("Valentine's Day", 'valentines-day', '💝', True),
            ('Proposal', 'proposal', '💍', False),
            ('Engagement', 'engagement-romance', '💎', False),
            ('Romantic Surprise', 'romantic-surprise', '🌹', False),
            ('Just Because Love', 'just-because-love', '💌', False),
            ('Long-Distance Relationship', 'long-distance', '✈️', False),
        ]
    },
    {
        'name': 'Weddings', 'slug': 'wedding', 'emoji': '💒', 'icon': '💒',
        'display_order': 4, 'is_featured': True,
        'subs': [
            ('Wedding Gift', 'wedding-gift', '💒', False),
            ('Bride Gift', 'bride-gift', '👰', False),
            ('Groom Gift', 'groom-gift', '🤵', False),
            ('Newly Married', 'newly-married', '🥂', False),
        ]
    },
    {
        'name': 'Engagement', 'slug': 'engagement', 'emoji': '💍', 'icon': '💍',
        'display_order': 5,
        'subs': [
            ('Engagement Party', 'engagement-party', '🎉', False),
            ('Ring Ceremony', 'ring-ceremony', '💍', False),
        ]
    },
    {
        'name': 'Friendship', 'slug': 'friendship', 'emoji': '👫', 'icon': '👫',
        'display_order': 6, 'is_featured': True,
        'subs': [
            ('Best Friend', 'best-friend', '💙', False),
            ('Friendship Day', 'friendship-day', '👫', True),
            ('Friend Appreciation', 'friend-appreciation', '🤗', False),
            ('Reunion', 'reunion', '🎊', False),
            ('Long-Distance Friend', 'long-distance-friend', '✈️', False),
        ]
    },
    {
        'name': 'Family', 'slug': 'family', 'emoji': '👨‍👩‍👧‍👦', 'icon': '👨‍👩‍👧‍👦',
        'display_order': 7,
        'subs': [
            ('For Mother', 'for-mother', '👩', False),
            ('For Father', 'for-father', '👨', False),
            ('For Brother', 'for-brother', '👦', False),
            ('For Sister', 'for-sister', '👧', False),
            ('For Grandparents', 'for-grandparents', '👴', False),
            ('Family Celebration', 'family-celebration', '🎉', False),
        ]
    },
    {
        'name': "Mother's Day", 'slug': 'mothers-day', 'emoji': '💐', 'icon': '💐',
        'display_order': 8, 'is_featured': True, 'is_seasonal': True,
        'subs': [
            ('For Mother', 'mothers-day-mother', '👩', False),
            ('For Grandmother', 'mothers-day-grandma', '👵', False),
            ('For New Mother', 'mothers-day-new-mom', '🤱', False),
        ]
    },
    {
        'name': "Father's Day", 'slug': 'fathers-day', 'emoji': '👔', 'icon': '👔',
        'display_order': 9, 'is_featured': True, 'is_seasonal': True,
        'subs': [
            ('For Father', 'fathers-day-father', '👨', False),
            ('For Grandfather', 'fathers-day-grandpa', '👴', False),
            ('For New Father', 'fathers-day-new-dad', '👶', False),
        ]
    },
    {
        'name': 'Graduation', 'slug': 'graduation', 'emoji': '🎓', 'icon': '🎓',
        'display_order': 10,
        'subs': [
            ('School Graduation', 'school-graduation', '🏫', False),
            ('College Graduation', 'college-graduation', '🎓', False),
            ('First Job', 'first-job', '💼', False),
            ('Academic Achievement', 'academic-achievement', '🏆', False),
        ]
    },
    {
        'name': 'New Baby & Parenthood', 'slug': 'new-baby', 'emoji': '👶', 'icon': '👶',
        'display_order': 11,
        'subs': [
            ('New Baby', 'new-baby-gift', '👶', False),
            ('Baby Shower', 'baby-shower', '🚿', False),
            ('First Birthday', 'first-birthday', '🎂', False),
            ('Naming Ceremony', 'naming-ceremony', '📜', False),
        ]
    },
    {
        'name': 'Housewarming', 'slug': 'housewarming', 'emoji': '🏡', 'icon': '🏡',
        'display_order': 12,
        'subs': [
            ('New Home', 'new-home', '🏠', False),
            ('New Apartment', 'new-apartment', '🏢', False),
            ('New Office', 'new-office', '🏢', False),
        ]
    },
    {
        'name': 'Congratulations', 'slug': 'congratulations', 'emoji': '🎉', 'icon': '🎉',
        'display_order': 13,
        'subs': [
            ('New Job', 'new-job', '💼', False),
            ('Promotion', 'promotion', '📈', False),
            ('Business Success', 'business-success', '🏆', False),
            ('Exam Success', 'exam-success', '📝', False),
            ('New Business', 'new-business', '🚀', False),
        ]
    },
    {
        'name': 'Thank You', 'slug': 'thank-you', 'emoji': '🙏', 'icon': '🙏',
        'display_order': 14,
        'subs': [
            ('Personal Thank You', 'personal-thank-you', '💌', False),
            ('Professional Thank You', 'professional-thank-you', '🤝', False),
            ('Teacher Appreciation', 'teacher-appreciation', '👩‍🏫', False),
            ('Customer Appreciation', 'customer-appreciation', '🛍️', False),
        ]
    },
    {
        'name': 'Get Well Soon', 'slug': 'get-well-soon', 'emoji': '🌸', 'icon': '🌸',
        'display_order': 15,
        'subs': [
            ('Recovery Gift', 'recovery-gift', '🏥', False),
            ('Care Package', 'care-package', '📦', False),
            ('Emotional Support', 'emotional-support', '🤗', False),
        ]
    },
    {
        'name': 'Farewell & Goodbye', 'slug': 'farewell', 'emoji': '👋', 'icon': '👋',
        'display_order': 16,
        'subs': [
            ('Colleague Farewell', 'colleague-farewell', '🤝', False),
            ('Relocation', 'relocation', '🚚', False),
            ('Retirement', 'retirement', '🌅', False),
        ]
    },
    {
        'name': 'Festivals & Celebrations', 'slug': 'festivals', 'emoji': '🎆', 'icon': '🎆',
        'display_order': 17, 'is_featured': True,
        'subs': [
            ('Diwali', 'diwali', '🪔', True),
            ('Holi', 'holi', '🎨', True),
            ('Raksha Bandhan', 'raksha-bandhan', '🪢', True),
            ('Dussehra', 'dussehra', '🎉', True),
            ('Eid', 'eid', '🌙', True),
            ('Christmas', 'christmas', '🎄', True),
            ('New Year', 'new-year', '🎆', True),
            ('Pongal', 'pongal', '🌾', True),
            ('Onam', 'onam', '🌸', True),
            ('Navratri', 'navratri', '💃', True),
            ('Ganesh Chaturthi', 'ganesh-chaturthi', '🐘', True),
            ('Baisakhi', 'baisakhi', '🌾', True),
            ('Karwa Chauth', 'karwa-chauth', '🌙', True),
            ('Durga Puja', 'durga-puja', '🙏', True),
        ]
    },
    {
        'name': 'Corporate Occasions', 'slug': 'corporate', 'emoji': '🏢', 'icon': '🏢',
        'display_order': 18,
        'subs': [
            ('Employee Joining', 'employee-joining', '👋', False),
            ('Work Anniversary', 'work-anniversary', '📅', False),
            ('Retirement', 'corporate-retirement', '🌅', False),
            ('Company Milestone', 'company-milestone', '🏆', False),
            ('Team Celebration', 'team-celebration', '🎉', False),
        ]
    },
    {
        'name': "Teacher & Mentor Appreciation", 'slug': 'teacher-appreciation', 'emoji': '👩‍🏫', 'icon': '👩‍🏫',
        'display_order': 19,
        'subs': [
            ("Teachers' Day", 'teachers-day', '🏫', True),
            ('Mentor Appreciation', 'mentor-appreciation', '🌟', False),
        ]
    },
    {
        'name': 'Personal Milestones', 'slug': 'personal-milestones', 'emoji': '🌟', 'icon': '🌟',
        'display_order': 20,
        'subs': [
            ('New Job', 'milestone-new-job', '💼', False),
            ('Promotion', 'milestone-promotion', '📈', False),
            ('Achievement', 'personal-achievement', '🏆', False),
            ('Fitness Achievement', 'fitness-achievement', '💪', False),
        ]
    },
    {
        'name': 'Apology & Reconciliation', 'slug': 'apology', 'emoji': '💔', 'icon': '💔',
        'display_order': 21,
        'subs': [
            ('Saying Sorry', 'saying-sorry', '🙏', False),
            ('Making Up', 'making-up', '🤝', False),
        ]
    },
    {
        'name': 'Just Because', 'slug': 'just-because', 'emoji': '✨', 'icon': '✨',
        'display_order': 22, 'is_featured': True,
        'subs': [
            ('Thinking of You', 'thinking-of-you', '💭', False),
            ('Missing You', 'missing-you', '💙', False),
            ('Random Surprise', 'random-surprise', '🎁', False),
            ('Make Someone Smile', 'make-someone-smile', '😊', False),
            ('Self Gift', 'self-gift', '🎀', False),
            ('Cheer Someone Up', 'cheer-someone-up', '🌈', False),
            ('Romantic Surprise', 'romantic-surprise-jb', '🌹', False),
        ]
    },
    {
        'name': 'Seasonal', 'slug': 'seasonal', 'emoji': '🍂', 'icon': '🍂',
        'display_order': 23, 'is_seasonal': True,
        'subs': [
            ('New Year', 'seasonal-new-year', '🎆', True),
            ("Valentine's Season", 'valentines-season', '💝', True),
            ('Summer Gifts', 'summer-gifts', '☀️', True),
            ('Monsoon Gifts', 'monsoon-gifts', '🌧️', True),
            ('Holiday Season', 'holiday-season', '🎄', True),
        ]
    },
]

# ─── RECIPIENT TYPES ──────────────────────────────────────────────────────────

RECIPIENT_TYPES = [
    ('Partner', 'partner', '❤️', 1),
    ('Spouse', 'spouse', '💑', 2),
    ('Boyfriend', 'boyfriend', '👦', 3),
    ('Girlfriend', 'girlfriend', '👧', 4),
    ('Husband', 'husband', '🤵', 5),
    ('Wife', 'wife', '👰', 6),
    ('Fiancé', 'fiance', '💍', 7),
    ('Mother', 'mother', '👩', 8),
    ('Father', 'father', '👨', 9),
    ('Parents', 'parents', '👨‍👩‍👧‍👦', 10),
    ('Brother', 'brother', '👦', 11),
    ('Sister', 'sister', '👧', 12),
    ('Son', 'son', '👶', 13),
    ('Daughter', 'daughter', '👶', 14),
    ('Grandparent', 'grandparent', '👴', 15),
    ('Friend', 'friend', '👫', 16),
    ('Best Friend', 'best-friend-recipient', '💙', 17),
    ('Colleague', 'colleague', '🤝', 18),
    ('Boss', 'boss', '💼', 19),
    ('Employee', 'employee', '👥', 20),
    ('Client', 'client', '🤝', 21),
    ('Teacher', 'teacher', '👩‍🏫', 22),
    ('Mentor', 'mentor', '🌟', 23),
    ('Child', 'child', '🧒', 24),
    ('Baby', 'baby', '👶', 25),
    ('Teenager', 'teenager', '🧑', 26),
    ('Self', 'self', '💆', 27),
    ('Pet', 'pet', '🐾', 28),
    ('Other', 'other', '🎁', 99),
]

# ─── GIFT INTENT TAGS ─────────────────────────────────────────────────────────

GIFT_INTENTS = [
    ('Romantic', 'romantic', 'Make someone feel deeply loved and desired.'),
    ('Emotional', 'emotional', 'Touch the heart and evoke deep feelings.'),
    ('Appreciation', 'appreciation', 'Show gratitude and recognition.'),
    ('Celebration', 'celebration', 'Mark a joyful event or achievement.'),
    ('Surprise', 'surprise', 'Unexpected, delightful gesture.'),
    ('Luxury', 'luxury', 'Premium, indulgent, high-end gifting.'),
    ('Practical', 'practical', 'Useful, functional gifts for everyday life.'),
    ('Funny', 'funny', 'Playful, humorous, lighthearted gifts.'),
    ('Cute', 'cute', 'Adorable, sweet, wholesome gifts.'),
    ('Sentimental', 'sentimental', 'Meaningful, memory-driven, nostalgic.'),
    ('Memorable', 'memorable', 'Creates a lasting memory or experience.'),
    ('Personalized', 'personalized', 'Customized with names, photos, or messages.'),
    ('Wellness', 'wellness', 'Promotes health, relaxation, and self-care.'),
    ('Spiritual', 'spiritual', 'Respectful of faith, culture, or spiritual beliefs.'),
    ('Professional', 'professional', 'Appropriate for workplace or business context.'),
    ('Family', 'family', 'Warm, inclusive, family-oriented gifts.'),
    ('Friendship', 'friendship-intent', 'Celebrates friendship and bonds.'),
    ('Self-Care', 'self-care-intent', 'Encourages looking after oneself.'),
    ('Experience', 'experience-intent', 'An activity or memory rather than a physical item.'),
    ('Last-Minute', 'last-minute', 'Available quickly, digital or same-day delivery.'),
    ('Budget-Friendly', 'budget-friendly', 'Thoughtful but affordable gifts.'),
    ('Premium', 'premium', 'High quality, well-presented, impressive gifts.'),
]


class Command(BaseCommand):
    help = 'Seed Bloomora taxonomy: Gift Types, Occasion Types, Recipient Types, Gift Intent Tags.'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing taxonomy before seeding.')

    def handle(self, *args, **options):
        if options.get('clear'):
            self.stdout.write('Clearing existing taxonomy data...')
            GiftType.objects.all().delete()
            OccasionType.objects.all().delete()
            RecipientType.objects.all().delete()
            GiftIntentTag.objects.all().delete()

        self.stdout.write('Seeding Gift Types...')
        self._seed_gift_types()
        self.stdout.write('Seeding Occasion Types...')
        self._seed_occasion_types()
        self.stdout.write('Seeding Recipient Types...')
        self._seed_recipient_types()
        self.stdout.write('Seeding Gift Intent Tags...')
        self._seed_gift_intents()
        self.stdout.write(self.style.SUCCESS('✅ Taxonomy seeded successfully!'))

    def _seed_gift_types(self):
        for i, gt in enumerate(GIFT_TYPES):
            parent, created = GiftType.objects.get_or_create(
                slug=gt['slug'],
                defaults={
                    'name': gt['name'],
                    'icon': gt.get('icon', ''),
                    'display_order': gt.get('display_order', i),
                    'is_active': True,
                    'is_featured': gt.get('is_featured', False),
                    'parent': None,
                }
            )
            if not created:
                parent.name = gt['name']
                parent.icon = gt.get('icon', '')
                parent.is_featured = gt.get('is_featured', False)
                parent.save()

            for j, sub in enumerate(gt.get('subs', [])):
                name, slug, icon = sub[0], sub[1], sub[2]
                obj, _ = GiftType.objects.get_or_create(
                    slug=slug,
                    defaults={'name': name, 'icon': icon, 'parent': parent, 'display_order': j, 'is_active': True}
                )
                if not _:
                    obj.name = name
                    obj.icon = icon
                    obj.parent = parent
                    obj.save()

    def _seed_occasion_types(self):
        for i, ot in enumerate(OCCASION_TYPES):
            parent, created = OccasionType.objects.get_or_create(
                slug=ot['slug'],
                defaults={
                    'name': ot['name'],
                    'emoji': ot.get('emoji', ''),
                    'icon': ot.get('icon', ''),
                    'display_order': ot.get('display_order', i),
                    'is_active': True,
                    'is_featured': ot.get('is_featured', False),
                    'is_seasonal': ot.get('is_seasonal', False),
                    'parent': None,
                }
            )
            if not created:
                parent.name = ot['name']
                parent.emoji = ot.get('emoji', '')
                parent.is_featured = ot.get('is_featured', False)
                parent.save()

            for j, sub in enumerate(ot.get('subs', [])):
                name, slug, emoji, seasonal = sub[0], sub[1], sub[2], sub[3]
                obj, _ = OccasionType.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'name': name, 'emoji': emoji, 'parent': parent,
                        'display_order': j, 'is_active': True, 'is_seasonal': seasonal
                    }
                )
                if not _:
                    obj.name = name
                    obj.emoji = emoji
                    obj.parent = parent
                    obj.is_seasonal = seasonal
                    obj.save()

    def _seed_recipient_types(self):
        for name, slug, emoji, order in RECIPIENT_TYPES:
            obj, _ = RecipientType.objects.get_or_create(
                slug=slug,
                defaults={'name': name, 'emoji': emoji, 'display_order': order, 'is_active': True}
            )
            if not _:
                obj.name = name
                obj.emoji = emoji
                obj.display_order = order
                obj.save()

    def _seed_gift_intents(self):
        for name, slug, desc in GIFT_INTENTS:
            obj, _ = GiftIntentTag.objects.get_or_create(
                slug=slug,
                defaults={'name': name, 'description': desc, 'is_active': True}
            )
            if not _:
                obj.name = name
                obj.description = desc
                obj.save()
