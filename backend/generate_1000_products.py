"""
Bloomora 1,000 Unique Products Generator
Generates strictly 1,000 unique products across 17 categories with strictly 1,000 unique images.
Zero duplication, zero repetition.
"""
import json
import random
import urllib.request
import re

CATEGORIES_DEF = [
    {
        "slug": "flowers",
        "name": "Floral Arrangements",
        "count": 59,
        "base_price": 599,
        "price_range": (199, 1499),
        "interests": ["flowers", "romance", "decor"],
        "adjectives": ["Artisanal", "Radiant", "Graceful", "Imperial", "Velvet", "Enchanted", "Serene", "Classic", "Luxe", "Opulent", "Blushing", "Sun-Drenched", "Ethereal", "Vintage", "Dreamy", "Whimsical", "Regal", "Midnight", "Charmed", "Botanical"],
        "cores": ["Dutch Crimson Roses", "Ivory Casablanca Lilies", "Pastel Peonies & Hydrangeas", "Sunburst Yellow Tulips", "White Orchid Cascade", "Blush Pink Carnations", "Scarlet Gardenia Bouquet", "Lavender Sprig Arrangement", "Royal Blue Iris Sheaf", "Golden Meadow Wildflowers", "Peach Buttercup Symphony", "Champagne Rose Cluster", "Cherry Blossom Spray", "Magenta Dahlia Posy", "Emerald Fern & Ranunculus"],
        "finishes": ["in Hand-Tied Matte Wrap", "with Gold Velvet Ribbon", "in Fluted Ceramic Vessel", "in Rustic Burlap Wrap", "with Satin Bow Accents", "in Signature Cylindrical Box", "with Crystal Water Tube", "in Eco Kraft Sheaf", "with Eucalyptus Sprigs", "with Gypsophila Mist"]
    },
    {
        "slug": "bouquets",
        "name": "Velvet Box Bouquets",
        "count": 59,
        "base_price": 1299,
        "price_range": (699, 2999),
        "interests": ["luxury", "romance", "flowers"],
        "adjectives": ["Signature", "Royal", "Midnight", "Elysian", "Grand", "Château", "Velour", "Prestige", "Majestic", "Opulent", "Sovereign", "Gilded", "Eternal", "Baroque", "Lumière", "Crown", "Aristocrat", "Celeste", "Noble", "Haute"],
        "cores": ["Cylindrical Emerald Hatbox", "Burgundy Velvet Rose Box", "Pearl White Bloom Cylinder", "Sapphire Silk Floral Casket", "Blush Pink Suede Urn", "Midnight Black Velvet Dome", "Champagne Satin Rose Box", "Rose Gold Mirrored Chest", "Diamond Quilted Bloom Box", "Pastel Lilac Suede Tier", "Obsidian Velvet Blossom Case", "Ivory Velour Keepsake Chest", "Crimson Monogrammed Box", "Petal Pink Velvet Coffer", "Scarlet Silk Floral Capsule"],
        "finishes": ["with Preserved Dutch Blooms", "with Satin Ribbon Closure", "with 24k Gold Foil Embellishment", "with Pearlescent Accents", "with Monogrammed Ribbon", "with Hidden Pull-Out Drawer", "with Crystal Bow Clasp", "with Ambient Fairy Glow", "with Velvet Liner Seal", "with Mirrored Lid Interior"]
    },
    {
        "slug": "cakes",
        "name": "Gourmet Bento Cakes",
        "count": 59,
        "base_price": 349,
        "price_range": (199, 899),
        "interests": ["baking", "sweets", "celebration"],
        "adjectives": ["Petite", "Artisanal", "Velvety", "Decadent", "Pastel", "Single-Portion", "Whipped", "Glazed", "Golden", "Sweet", "Rich", "Silken", "Chocolatier", "Frosted", "Gourmet", "Layered", "Fluffy", "Crisp", "Creamy", "Deluxe"],
        "cores": ["Belgian Chocolate Truffle Bento", "Madagascar Vanilla Bean Mini Cake", "Red Velvet Cream Cheese Bento", "Salted Butter Caramel Gateau", "Matcha Pistachio Chiffon Cake", "Wild Berry Mascarpone Bento", "Espresso Mocha Fudge Mini", "Almond Praline Buttercream Cake", "Lotus Biscoff Crunch Bento", "Dark Forest Cherry Mini Cake", "Mango Passionfruit Coulis Bento", "Hazelnut Nutella Swirl Cake", "Tiramisu Cocoa Dust Bento", "Lemon Curd Poppyseed Mini", "Coconut Milk Berry Gateau"],
        "finishes": ["with Gold Leaf Flakes", "with Wooden Tasting Fork", "in Biodegradable Sugarcane Box", "with Birthday Candle & Matchbox", "with Hand-Piped Buttercream Flora", "with Cocoa Nibs & Berries", "with Custom Fondant Lettering", "with Edible Pressed Flowers", "with Satin Ribbon Wrap", "with White Chocolate Shavings"]
    },
    {
        "slug": "chocolate-bouquets",
        "name": "Chocolate Bouquets",
        "count": 59,
        "base_price": 699,
        "price_range": (299, 1799),
        "interests": ["chocolate", "sweets", "romance"],
        "adjectives": ["Decadent", "Golden", "Sweet", "Truffle-Laden", "Artisanal", "Luxe", "Indulgent", "Velvet", "Gourmet", "Handcrafted", "Chocolatier", "Rich", "Festive", "Gilded", "Irresistible", "Blissful", "Heavenly", "Divine", "Celebratory", "Delightful"],
        "cores": ["Ferrero Rocher & Red Silk Roses Bouquet", "Swiss Lindt Lindor Blossom Cone", "Artisanal Dark Truffle Hand Bouquet", "Cadbury Dairy Milk Silk Floral Medley", "Belgian Dark Praline & Carnation Sheaf", "Ghirardelli Caramel & Gold Rose Fan", "Godiva Ganache Hearts & Orchid Spray", "Hazelnut Crunch Truffle Arrangement", "Ruby Cocoa & White Lily Symphony", "White Chocolate Raspberry Floral Sheaf", "Almond Rocher & Velvet Rose Wand", "Pistachio Truffle Petal Posy", "Toffee Crisp & Scarlet Rose Cluster", "Mocha Truffle & Dried Lavender Bundle", "Assorted Master Chocolatier Bouquet"],
        "finishes": ["in Multi-Layered Organza Wrap", "with Golden Star Picks", "with Signature Velvet Bow", "in Metallic Kraft Flute", "with Satin Petal Accents", "with Greeting Scroll", "with Twinkling Wire Lights", "with Gold Lace Border", "with Chocolate Drizzle Theme", "with Decorative Berry Sprigs"]
    },
    {
        "slug": "personalized",
        "name": "Personalized Keepsakes",
        "count": 59,
        "base_price": 799,
        "price_range": (249, 1999),
        "interests": ["keepsakes", "memories", "custom"],
        "adjectives": ["Custom-Engraved", "Illuminated", "Handcrafted", "Bespoke", "Timeless", "Eternal", "Personalized", "Artistic", "Nostalgic", "Polished", "Cherished", "Heirloom", "Warm-Glow", "Sentimental", "Laser-Etched", "Carved", "Gilded", "Signature", "Framed", "Treasured"],
        "cores": ["Acrylic Song Code LED Lamp", "Constellation Star Map Timber Plaque", "Rotary Wood Memory Photo Reel", "3D Crystal Laser Portrait Cube", "Engraved Walnut Wood Milestone Plaque", "Illuminated Polarized Spotify Plaque", "Custom Coordinates Brass Compass", "Heart Collage Floating Glass Frame", "Watercolor Couple Silhouette Print", "Handmade Pine Photo Calendar Block", "Engraved Leather Memory Keepsake Box", "Illuminated Infinity Mirror Name Sign", "Custom City Map Foil Art Plaque", "Personalized Soundwave Voiceprint Art", "Vintage Brass Photo Locket Stand"],
        "finishes": ["with Warm Ambient USB Base", "in Luxury Felt-Lined Gift Box", "with Custom Laser Typography", "with Solid Teak Stand", "with Brass Hardware Accents", "with High-Gloss Acrylic Polish", "with Anti-UV Glare Protection", "with Certificate of Authenticity", "with Braided Silk Cord", "with Personalized Engraved Message"]
    },
    {
        "slug": "custom-gifts",
        "name": "Custom Keepsakes & Mugs",
        "count": 59,
        "base_price": 299,
        "price_range": (149, 699),
        "interests": ["coffee", "tea", "home", "lifestyle"],
        "adjectives": ["Hand-Glazed", "Custom-Printed", "High-Fired", "Artisan", "Ceramic", "Monogrammed", "Stoneware", "Minimalist", "Ergonomic", "Insulated", "Glossy", "Matte", "Vintage", "Nordic", "Cozy", "Textured", "Charming", "Speckled", "Rustic", "Sleek"],
        "cores": ["Stoneware Latte Mug with Bamboo Spoon", "Magic Thermal Heat-Reveal Ceramic Cup", "Double-Walled Glass Heart Tumbler", "Nordic Speckled Cappuccino Mug", "Debossed Couple Name Ceramic Tumbler", "Stainless Steel Travel Thermos Flask", "Handmade Terracotta Tea Kulhad Set", "Vintage Enamel Campfire Coffee Mug", "Pastel Frosted Mason Jar with Straw", "Marble Texture Gold Trim Ceramic Mug", "Japanese Ribbed Matcha Drinking Bowl", "Calligraphy Monogram Tea Mug", "Boho Terracotta Clay Espresso Cup", "Custom Photo Collage Breakfast Mug", "Insulated Vacuum Water Canteen"],
        "finishes": ["with Matching Wood Lid", "with Stirring Spoon Included", "in Protective Matte Gift Carton", "with Cork Anti-Slip Base", "with Gold Leaf Lettering", "with Food-Grade Silicone Seal", "with Ergonomic Thumb Rest", "with Ceramic Coaster Set", "with Silk Ribbon Pull", "with Microwave-Safe Glaze"]
    },
    {
        "slug": "jewellery",
        "name": "Jewellery & Accessories",
        "count": 59,
        "base_price": 1199,
        "price_range": (399, 3999),
        "interests": ["jewellery", "fashion", "luxury", "romance"],
        "adjectives": ["Sterling Silver 925", "Gleaming", "Dainty", "Shimmering", "Solitaire", "Zirconia-Studded", "Infinity", "Rose Gold Plated", "Celestial", "Hand-Polished", "Fine", "Delicate", "Brilliant", "Radiant", "Graceful", "Filigree", "Bejeweled", "Subtle", "Sparkling", "Ethereal"],
        "cores": ["Four-Leaf Clover Magnetic Pendant", "Solitaire Moissanite Charm Bracelet", "Adjustable Butterfly Silver Anklet", "Eternal Knot Rose Gold Ring", "Freshwater Pearl Teardrop Earrings", "Interlocking Double Circle Choker", "Constellation Zodiac Silver Necklace", "Baguette Cut Tennis Crystal Bangle", "Layered Moon & Star Silver Chain", "Heart-in-Heart Zirconia Locket", "Minimalist Bar Chain Bracelet", "Vintage Filigree Flower Ring", "Twisted Rope Silver Cuff", "Aurora Borealis Crystal Drop Studs", "Initial Letter Crown Silver Pendant"],
        "finishes": ["in Illuminated LED Jewellery Box", "with Velvet Ring Cushion", "with Authenticity & Silver Purity Card", "with Anti-Tarnish Suede Pouch", "with Polishing Cloth & Warranty", "with Silk Ribbon Bow Presentation", "with Magnetic Flap Keepsake Box", "with Rose Gold Embossed Casket", "with Delicate Pearl Clasp", "with Extender Link Chain"]
    },
    {
        "slug": "fragrances-candles",
        "name": "Luxury Fragrances & Candles",
        "count": 59,
        "base_price": 599,
        "price_range": (199, 1699),
        "interests": ["aromatherapy", "home", "relaxation", "decor"],
        "adjectives": ["Aromatic", "Pure Soy Wax", "Artisanal", "Botanical", "Sensory", "Soothing", "Warm", "Amber-Infused", "Hand-Poured", "Smokeless", "Therapeutic", "Velvety", "Sublime", "Golden", "Bespoke", "Enchanting", "Calming", "Blissful", "Organic", "Rich"],
        "cores": ["French Lavender & Chamomile Soy Candle", "Smoked Amber & Vanilla Pod Glass Jar", "Royal Oud & Dark Rose Wax Vessel", "White Tea & Citrus Blossom Tin", "Sandalwood & Frankincense Therapy Candle", "Wild Bergamot & Cedarwood Pillar", "Crushed Peony & Jasmine Scented Pot", "Cinnamon Spice & Honeycomb Wax Jar", "Eucalyptus & Peppermint Spa Diffuser", "Palo Santo & Sage Cleansing Candle", "Tonka Bean & Dark Cocoa Glass Tumbler", "Fresh Cotton Linen Fragrance Tablet", "Rosewater & White Musk Soy Tumbler", "Sea Salt & Driftwood Coastal Candle", "Vetiver & Green Fig Botanical Candle"],
        "finishes": ["with Wooden Crackle Wick", "in Frosted Amber Glass Jar", "with Engraved Brass Metal Snuffer", "with Pressed Dried Flower Petals", "with Cork Stopper & Matches", "in Ribbed Ceramic Container", "with Long-Stem Wooden Matches", "with Cotton Lead-Free Wick", "with Gold Stamped Dust Cover", "in Rigid Luxury Paper Tube"]
    },
    {
        "slug": "beauty-wellness",
        "name": "Beauty & Self-Care Spa Kits",
        "count": 59,
        "base_price": 999,
        "price_range": (299, 2499),
        "interests": ["self-care", "wellness", "relaxation", "beauty"],
        "adjectives": ["Holistic", "Nourishing", "Botanical", "Organic", "Pure", "Restorative", "Therapeutic", "Velvet-Touch", "Handmade", "Indulgent", "Pampering", "Herbal", "Calming", "Detoxifying", "Luxe", "Revitalizing", "Silken", "Aromatic", "Blissful", "Soothing"],
        "cores": ["Himalayan Pink Salt & Rose Bath Soak", "Cold-Pressed Sweet Almond Body Elixir", "Artisanal Shea Butter Soap Trio", "Organic Damask Rose Facial Mist", "Lavender Essential Oil Calming Spray", "Brown Sugar & Arabica Coffee Body Polish", "Dead Sea Mineral Clay Mud Mask", "Rose Quartz Facial Roller & Gua Sha", "Vanilla Bean Whipped Body Butter", "Soothing Green Tea & Mint Foot Bath", "Chamomile Infused Silk Sleep Mask", "Botanical Herb Infused Bath Bomb Set", "Wild Honey & Oat Gentle Face Polish", "Bamboo Hairbrush & Head Massage Comb", "Bergamot Body Butter & Pumice Scrub"],
        "finishes": ["in Handwoven Bamboo Caddy", "with Organic Cotton Muslin Washcloth", "with Bamboo Application Spoon", "in Signature Linen Drawstring Bag", "with Satin Pillowcase & Card", "in Matte White Vanity Box", "with Botanical Bath Sponge", "with Gold Foil Product Guide", "with Aromatherapy Candlelet", "with Wooden Scoop & Scrub Mitt"]
    },
    {
        "slug": "plants",
        "name": "Plants & Eco Living",
        "count": 59,
        "base_price": 499,
        "price_range": (149, 1499),
        "interests": ["plants", "nature", "decor", "home"],
        "adjectives": ["Lush", "Living", "Evergreen", "Pet-Friendly", "Air-Purifying", "Miniature", "Sculptural", "Potted", "Resilient", "Feng-Shui", "Vibrant", "Verdant", "Thriving", "Eco-Friendly", "Graceful", "Harmonious", "Calming", "Zen", "Grounded", "Fresh"],
        "cores": ["Ginseng Ficus Bonsai in Oval Tray", "Lucky Bamboo 3-Tier Braided Tower", "Variegated Jade Succulent in Terracotta", "Zanzibar Gem ZZ Plant in Ceramic Pot", "Golden Pothos in Hanging Macrame Basket", "Peace Lily in Self-Watering Glazed Planter", "Sansevieria Snake Plant in Fluted Ceramic", "Haworthia Zebra Succulent in Stone Cup", "Bird's Nest Fern in Handcrafted Urn", "Aloe Vera Barbadensis in White Stoneware", "Money Tree Pachira Aquatica Braided Trunk", "String of Pearls Succulent in Teacup Planter", "Calathea Peacock Prayer Plant in Matte Pot", "Peperomia Watermelon in Earthware Pot", "Syngonium Pink Arrowhead in Ceramic Base"],
        "finishes": ["in Minimalist White Ceramic Pot", "with Handcrafted Wood Saucer", "with Polished River Pebbles", "with Mini Brass Plant Mister", "with Plant Care Caretaker Card", "in Handwoven Jute Planter Basket", "with Copper Soil Moisture Probe", "with Ceramic Plant Name Marker", "with Decorative Moss Topping", "in Eco-Friendly Terracotta Saucer"]
    },
    {
        "slug": "books-stationery",
        "name": "Books, Stationery & Journals",
        "count": 59,
        "base_price": 499,
        "price_range": (149, 1299),
        "interests": ["reading", "writing", "stationery", "productivity"],
        "adjectives": ["Debossed", "Artisanal", "Hardbound", "Vegan Leather", "Refined", "Gilded-Edge", "Calligraphic", "Vintage", "Precision", "Archival", "Handmade", "Thread-Bound", "Classic", "Executive", "Textured", "Fountain-Friendly", "Leatherette", "Scholarly", "Inspiring", "Distinguished"],
        "cores": ["A5 Vegan Leather Daily Planner", "Heavyweight Archival Watercolor Journal", "Solid Brass Hexagonal Fountain Pen", "Handmade Deckle-Edge Cotton Paper Diary", "Refillable Travelers Leather Notebook", "Gold-Accented Desk Pen & Pencil Set", "Weekly Habit Tracker & Desk Blotter", "Vintage Wax Seal Stamp & Wax Pellet Kit", "Metallic Calligraphy Brush Pen Set", "Hardcover Lined Ruled Executive Journal", "Botanical Illustration Postcard Portfolio", "Laser-Cut Wooden Bookmark with Silk Tassel", "Brass Ruler & Architect Drawing Compass", "Dot Grid Bullet Journal with Elastic Band", "Fine Nappa Leather Pen Sleeve Organizer"],
        "finishes": ["with Gold Foil Monogrammed Cover", "with Dual Satin Page Ribbon Markers", "with Expandable Inner Document Pocket", "in Solid Black Slide Gift Sleeve", "with 120 GSM Bleed-Proof Pages", "with Magnetic Clasp Closure", "with Brass Hardware Details", "with Personalized Name Embossing", "with Fountain Pen Ink Bottle Included", "with Pen Holder Loop Included"]
    },
    {
        "slug": "corporate-gifts",
        "name": "Corporate & Executive Gifts",
        "count": 59,
        "base_price": 1499,
        "price_range": (499, 3999),
        "interests": ["business", "office", "leadership", "lifestyle"],
        "adjectives": ["Executive", "Boardroom", "Premium", "Tailored", "Distinguished", "Sleek", "Professional", "Bespoke", "Sophisticated", "Debossed", "Architectural", "Polished", "Corporate", "High-Performance", "Discreet", "Ergonomic", "Pristine", "Elite", "Authoritative", "Commanding"],
        "cores": ["Smart Temperature Control Tumbler & Pen Set", "Debossed Leather Portfolio & Padfolio Suite", "Wireless Charging Leather Desk Mat", "Stainless Steel Card Holder & Pen Combo", "Aluminum Laptop Stand & Cable Organizer Caddy", "Executive Wooden Desk Clock & Pen Stand", "Dual-Tone Vegan Leather Travel Wallet", "MagSafe Power Bank & Braided Cable Suite", "High-Grade Matte Black Thermal Mug & Diary", "Noise-Cancelling Desk Headphone Stand", "Crystal Paperweight with Laser 3D Etching", "Double-Walled Steel Water Flask & Carabiner", "Leather RFID Passport & Document Organizer", "Executive Ceramic Mug with Wireless Heater", "Executive USB Drive & Keyring Leather Caddy"],
        "finishes": ["in Matte Black Magnetic Presentation Casket", "with Custom Company Monogram Plate", "with Laser-Engraved Personalized Nameplate", "with High-Density Velvet Foam Inlay", "with Matching Matte Pen Presentation", "with Gold Foil Certificate of Recognition", "with Silk Pull Ribbon Interior", "with Brushed Aluminum Trim", "with Carbon Fiber Texture Accents", "with Embossed Corporate Sleeve"]
    },
    {
        "slug": "kids-gifting",
        "name": "Kids Art, Crafts & DIY",
        "count": 59,
        "base_price": 499,
        "price_range": (199, 1499),
        "interests": ["art", "crafts", "kids", "games"],
        "adjectives": ["Playful", "Creative", "Vibrant", "Tactile", "Educational", "Sparkling", "Eco-Friendly", "Engaging", "Fun-Filled", "Colourful", "Imaginative", "Interactive", "Non-Toxic", "Hands-On", "Whimsical", "Curious", "Bright", "Inventive", "Inspiring", "Enchanting"],
        "cores": ["Watercolor Master Artist Painting Studio", "DIY Ceramic Mug Painting & Glazing Kit", "Wooden Solar Robot Engineering Builder", "Playdough Sculpting Bakery Tool Set", "Felt Animal Hand Puppet Craft Workshop", "Glow-in-the-Dark Constellation Puzzle", "Origami Animals & Japanese Paper Crafts", "Kids Gardening Seedling & Terrarium Jar", "Sparkle Bead Jewellery Making Studio", "Kaleidoscope & Optical Physics Experiment Kit", "Washable Finger Paint & Canvas Easel", "Wooden Magnetic Building Tiles Castle", "DIY Slime Laboratory & Glitter Mixins", "Dinosaur Fossil Excavation Archaeological Kit", "Pop-Up Storybook Creation Activity Kit"],
        "finishes": ["in Bright Illustrated Storage Tin", "with Non-Toxic Child-Safe Certification", "with Step-by-Step Illustrated Comic Guide", "with Clean-Up Washable Art Apron", "with Reusable Plastic Mixing Trays", "with Sturdy Carrying Handle Box", "with Achievement Certificate Inside", "with Wooden Sculpting Tools Included", "with Multi-Colour Sticker Sheets", "with Safety Protective Goggles"]
    },
    {
        "slug": "baby-gifts",
        "name": "Baby & New Parent Hampers",
        "count": 59,
        "base_price": 899,
        "price_range": (299, 2999),
        "interests": ["baby", "parenting", "family", "wellness"],
        "adjectives": ["Gentle", "Organic", "Pure", "Soft-Touch", "Heirloom", "Hypoallergenic", "Pastel", "Nurturing", "Tender", "Snuggly", "Sweet", "Natural", "Cozy", "Lullaby", "Comforting", "Velvety", "Precious", "Cherished", "Delicate", "Serene"],
        "cores": ["Organic Cotton Muslin Swaddle Duo", "Natural Beechwood Rattle & Teething Ring", "First Year Milestone Wooden Cards Set", "Knitted Cotton Bunny Plush Comforter", "Baby Milestone Footprint & Handprint Clay Kit", "Organic Bamboo Hooded Bath Towel & Mitt", "Soft Crochet Booties & Cotton Beanie Set", "Baby Keepsake Memory Journal & Folder", "Gentle Calendula & Oatmeal Baby Bath Duo", "Plush White Lamb Nursery Sound Machine", "Wooden Alphabet Learning Sensory Blocks", "Breathable Muslin Crib Sheet & Dribble Bibs", "Silicone Suction Weaning Bowl & Spoon", "Nursery Stars Night Light Music Projector", "New Mom Lavender Recovery Care Basket"],
        "finishes": ["in Handwoven White Willow Basket", "with Cotton Canvas Drawstring Bag", "with Satin Ribbon & Cloud Greeting Card", "with GOTS Certified Organic Cotton Tag", "with Soft Pastel Tissue Paper Lining", "with Beechwood Keepsake Crate", "with Hand-Embroidered Name Accents", "with Non-Toxic Food-Grade Seal", "with Golden Baby Footprint Stamp", "with Keepsake Hinged Wooden Case"]
    },
    {
        "slug": "premium-gifts",
        "name": "Royal Reserve Hampers",
        "count": 58,
        "base_price": 2499,
        "price_range": (1499, 5999),
        "interests": ["luxury", "gourmet", "royalty", "keepsakes"],
        "adjectives": ["Royal", "Imperial", "Heritage", "Sovereign", "Grand", "Château", "Opulent", "Aristocratic", "Gilded", "Heirloom", "Bespoke", "Majestic", "Supreme", "Palatial", "Prestige", "Baronial", "Monarch", "Crown", "Dynasty", "Luxe"],
        "cores": ["Solid Sheesham Wood Brass Inlay Chest", "Handcrafted Velvet Trunk with Gold Clasps", "Imperial Leatherette Dual-Tier Hamper", "Mahogany Finish Wine & Goblet Casket", "Regal Hand-Carved Teak Heritage Hamper", "Sovereign Gold-Embossed Treasure Coffer", "Gilded Moroccan Filigree Metal Box", "Vintage Leatherette Picnic Basket with Straps", "Emperor's Lacquered Black Trinket Trunk", "Royal Crest Solid Pine Wood Chest", "Victorian Velvet Lined Keepsake Casket", "Persian Floral Brass Inlaid Box", "Baroque Antique Gold Treasure Trunk", "Palace Arch Wooden Keepsake Box", "Crown Jeweled Velvet Hatbox Hamper"],
        "finishes": ["Filled with Rare Belgian Truffles & Nuts", "with 24k Gold Foil Champagne Glasses", "with Pure Brass Vintage Lock & Key", "with Velvet Quilted Interior Lining", "with Hand-Poured Scented Glass Candle", "with Silver Plated Serving Cutlery", "with Certified Cashmere Wool Stole", "with Pure Saffron & Raw Honey Jars", "with Monogrammed Solid Brass Seal", "with Custom Calligraphy Dedication Scroll"]
    },
    {
        "slug": "gourmet-hampers",
        "name": "Gourmet & Sweets Hampers",
        "count": 58,
        "base_price": 899,
        "price_range": (399, 2499),
        "interests": ["gourmet", "food", "sweets", "celebration"],
        "adjectives": ["Artisanal", "Roasted", "Handpicked", "Gourmet", "Rich", "Organic", "Golden", "Delicious", "Savory", "Crunchy", "Decadent", "Harvest", "Flavored", "Festive", "Spiced", "Sweet", "Wholesome", "Premium", "Traditional", "Indulgent"],
        "cores": ["California Almonds & Persian Pistachio Tray", "Artisanal Single-Estate Wild Honey Jar Duo", "Belgian Dark Chocolate Sea Salt Bark", "Smoked Paprika Cashews & Spiced Almonds", "Kashmiri Dried Figs & Saffron Walnut Basket", "Assorted Baklava & Rose Turkish Delight Box", "Handmade Florentine Honey Nut Cookies", "Roasted Macadamia & Cocoa Dusted Hazelnuts", "Gourmet Date Palms Stuffed with Nuts", "Pure Maple Granola & Berry Nut Clusters", "Artisanal Cheese Crackers & Olive Tapenade", "Rose Petal Honey & Cold Pressed Olive Oil", "Sun-Dried Apricots & Cranberry Medley", "Spiced Masala Chai & Dark Chocolate Flakes", "Caramelized Pecans & Coconut Crisps"],
        "finishes": ["in Handcrafted Brass Urli Serving Tray", "in Woven Seagrass Picnic Basket", "with Eco Glass Jars with Cork Lids", "with Bamboo Serving Tongs & Spoon", "with Festive Zari Ribbon Wrap", "in Hexagonal Wooden Gift Box", "with Jute Rope & Dried Orange Slice", "with Gold Foil Gift Band", "with Reusable Kitchen Glass Canisters", "with Handwritten Recipe Card"]
    },
    {
        "slug": "mini-gifts",
        "name": "Pocket Surprises & Gestures",
        "count": 58,
        "base_price": 149,
        "price_range": (49, 199),
        "interests": ["chocolate", "romance", "sweets", "friendship"],
        "adjectives": ["Pocket-Sized", "Charming", "Spontaneous", "Sweet", "Heartfelt", "Miniature", "Cheerful", "Playful", "Cute", "Thoughtful", "Tiny", "Little", "Warm", "Bright", "Affectionate", "Surprise", "Pocket-Friendly", "Delightful", "Joyful", "Loving"],
        "cores": ["Single Dutch Red Rose & Dairy Milk Silk", "Miniature Teddy Bear with Heart Pillow", "Wishing Bottle with Golden Foil Message Scroll", "Heart-Shaped Ferrero Rocher Duo Cone", "Pocket Scented Soy Candle in Travel Tin", "Custom Polaroid Style Photo Keychain", "Origami Star Jar with 50 Reasons Why", "Single Sunflower with Handwritten Mini Card", "Heart Shaped Milk Chocolate Lollipop Duo", "Pocket Ceramic Succulent in Tiny Pot", "Mini Hand Cream & Rose Lip Butter Tube", "Vintage Brass Bookmark with Wax Seal", "Tiny Box of Dark Cocoa Truffles", "Mini Wooden Music Box 'You Are My Sunshine'", "Scratch-Off Romantic Coupon Token Card"],
        "finishes": ["with Red Velvet Organza Pouch", "with Mini Gold Clothespeg Clip", "with Kraft Paper Greeting Tag", "with Satin Ribbon Knot", "with Tiny Twinkling Glow Charm", "with Hand-Tied Jute Cord", "with Mini Polka Dot Gift Bag", "with Heart Confetti Sprinkles", "with Wax Seal Greeting Mini Card", "with Sweet Unboxing Pull Tab"]
    }
]

CATEGORY_MAPPING = {
    'flowers': [
        'Category:Flower_bouquets', 'Category:Rose_bouquets', 'Category:Tulips_in_bouquets',
        'Category:Flower_arrangements', 'Category:Roses', 'Category:Tulips'
    ],
    'bouquets': [
        'Category:Flower_arrangements', 'Category:Roses_in_art', 'Category:Flower_boxes',
        'Category:Roses_in_vases'
    ],
    'cakes': [
        'Category:Birthday_cakes', 'Category:Chocolate_cakes', 'Category:Cupcakes', 'Category:Pastries'
    ],
    'chocolate-bouquets': [
        'Category:Chocolate_truffles', 'Category:Pralines', 'Category:Chocolates',
        'Category:Chocolate_bars', 'Category:Boxes_of_chocolates'
    ],
    'personalized': [
        'Category:Picture_frames', 'Category:Photo_frames', 'Category:Framed_pictures',
        'Category:Picture_frames_by_material', 'Category:Commemorative_plaques'
    ],
    'custom-gifts': [
        'Category:Ceramic_mugs', 'Category:Coffee_mugs', 'Category:Mugs'
    ],
    'jewellery': [
        'Category:Necklaces', 'Category:Pendants_(jewellery)', 'Category:Bracelets', 'Category:Earrings'
    ],
    'fragrances-candles': [
        'Category:Candles', 'Category:Perfume_bottles', 'Category:Scented_candles',
        'Category:Aromatherapy', 'Category:Lit_candles'
    ],
    'beauty-wellness': [
        'Category:Handmade_soaps', 'Category:Soaps', 'Category:Essential_oils',
        'Category:Bath_products', 'Category:Cosmetics'
    ],
    'plants': [
        'Category:Bonsai', 'Category:Succulents', 'Category:Houseplants', 'Category:Potted_plants'
    ],
    'books-stationery': [
        'Category:Fountain_pens', 'Category:Notebooks', 'Category:Diaries', 'Category:Stationery'
    ],
    'corporate-gifts': [
        'Category:Pens', 'Category:Desk_accessories', 'Category:Office_equipment',
        'Category:Ballpoint_pens', 'Category:Business_cards'
    ],
    'kids-gifting': [
        'Category:Wooden_toys', 'Category:Painting_materials', 'Category:Creative_toys',
        'Category:Educational_toys'
    ],
    'baby-gifts': [
        'Category:Baby_clothing', 'Category:Baby_toys', 'Category:Infants'
    ],
    'premium-gifts': [
        'Category:Wooden_boxes', 'Category:Jewellery_boxes', 'Category:Caskets',
        'Category:Treasure_chests'
    ],
    'gourmet-hampers': [
        'Category:Edible_nuts', 'Category:Almonds', 'Category:Honey_jars', 'Category:Walnuts',
        'Category:Dry_fruit'
    ],
    'mini-gifts': [
        'Category:Teddy_bears', 'Category:Chocolate_bars', 'Category:Single_roses',
        'Category:Plush_toys', 'Category:Small_boxes'
    ]
}

def fetch_category_images():
    import urllib.parse
    print("Collecting topic-matched images directly from curated categories...")
    global_seen_urls = set()
    category_image_pools = {}

    for cat_slug, wiki_cats in CATEGORY_MAPPING.items():
        pool = []
        for wc in wiki_cats:
            url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(wc)}&gcmtype=file&gcmlimit=40&prop=imageinfo&iiprop=url|mime&format=json"
            req = urllib.request.Request(url, headers={"User-Agent": "BloomoraCurator/5.0 (contact@bloomora.test)"})
            try:
                with urllib.request.urlopen(req, timeout=6) as res:
                    data = json.loads(res.read().decode("utf-8"))
                    pages = data.get("query", {}).get("pages", {})
                    for p in pages.values():
                        if "imageinfo" in p and p["imageinfo"]:
                            info = p["imageinfo"][0]
                            mime = info.get("mime", "")
                            u = info.get("url", "")
                            if mime in ["image/jpeg", "image/png"] and u not in global_seen_urls:
                                pool.append(u)
                                global_seen_urls.add(u)
            except Exception:
                pass
        category_image_pools[cat_slug] = pool
        print(f"  - {cat_slug}: collected {len(pool)} verified category images")

    return category_image_pools

def generate_1000():
    category_image_pools = fetch_category_images()

    # Verify total target count across categories
    total_target = sum(c["count"] for c in CATEGORIES_DEF)
    assert total_target == 1000, f"Expected sum of counts to be 1000, got {total_target}"

    occasions_list = ["birthday", "anniversary", "love", "proposal", "congratulations", "thank-you", "wedding", "friendship"]
    recipient_tags = ["for-her", "for-him", "for-parents", "for-friends", "for-colleagues"]
    emotions_pool = ["loved", "appreciated", "surprised", "cherished", "delighted", "celebrated", "inspired"]

    products = []
    used_names = set()
    used_images = set()
    prod_counter = 1

    for cat_idx, cat in enumerate(CATEGORIES_DEF):
        cat_slug = cat["slug"]
        cat_name = cat["name"]
        cat_count = cat["count"]
        interests = cat["interests"]
        min_p, max_p = cat["price_range"]

        adjs = cat["adjectives"]
        cores = cat["cores"]
        finishes = cat["finishes"]

        pool = category_image_pools.get(cat_slug, [])
        assert len(pool) >= cat_count, f"Category {cat_slug} has only {len(pool)} images, needed {cat_count}"

        # Generate unique product names for this category
        for i in range(cat_count):
            adj = adjs[i % len(adjs)]
            core = cores[(i // len(adjs) + i) % len(cores)]
            finish = finishes[(i + cat_idx) % len(finishes)]

            # Form distinct naming patterns
            variant_pattern = i % 4
            if variant_pattern == 0:
                name = f"{adj} {core} {finish}"
            elif variant_pattern == 1:
                name = f"The {adj} {core}"
            elif variant_pattern == 2:
                name = f"{core} — {adj} Edition"
            else:
                name = f"{adj} Edition: {core}"

            # Ensure 100% uniqueness
            collision_counter = 1
            original_name = name
            while name in used_names:
                name = f"{original_name} Vol. {collision_counter}"
                collision_counter += 1
            used_names.add(name)

            # Price calculation
            step = (max_p - min_p) / max(1, cat_count - 1)
            raw_price = int(min_p + step * i)
            # Round nicely to ₹9 ending or ₹49/₹99
            if raw_price < 200:
                price = (raw_price // 10) * 10 + 9
                budget_tier = "under-199"
            elif raw_price < 300:
                price = (raw_price // 10) * 10 + 9
                budget_tier = "200-299"
            elif raw_price < 500:
                price = (raw_price // 50) * 50 + 49
                budget_tier = "300-499"
            elif raw_price < 1000:
                price = (raw_price // 50) * 50 + 49
                budget_tier = "500-999"
            else:
                price = (raw_price // 100) * 100 + 99
                budget_tier = "1000-plus"

            original_price = int(price * random.choice([1.18, 1.25, 1.30]))

            prod_id = f"prod-{prod_counter}"
            prod_counter += 1
            image_url = pool[i]
            used_images.add(image_url)

            # Realistic recipient assignment based on category and index
            if cat_slug in ["flowers", "jewellery", "bouquets"]:
                recipient_tag = "for-her" if (i % 3 != 0) else "for-friends"
            elif cat_slug in ["corporate-gifts"]:
                recipient_tag = "for-colleagues"
            elif cat_slug in ["baby-gifts", "premium-gifts"]:
                recipient_tag = "for-parents" if (i % 2 == 0) else "for-colleagues"
            elif cat_slug in ["mini-gifts", "cakes"]:
                recipient_tag = recipient_tags[i % len(recipient_tags)]
            else:
                recipient_tag = recipient_tags[(i + cat_idx) % len(recipient_tags)]

            # Occasion assignment
            selected_occasions = [
                occasions_list[(i + cat_idx) % len(occasions_list)],
                occasions_list[(i + cat_idx + 2) % len(occasions_list)]
            ]
            if "love" not in selected_occasions and cat_slug in ["flowers", "bouquets", "chocolate-bouquets"]:
                selected_occasions.append("love")

            # Emotions
            selected_emotions = [
                emotions_pool[(i) % len(emotions_pool)],
                emotions_pool[(i + 3) % len(emotions_pool)]
            ]

            subtitle = f"{core} paired {finish.lower()}"
            description = (
                f"Exquisitely crafted {name.lower()}. Features premium {core.lower()}, "
                f"accentuated {finish.lower()}. Designed by Bloomora's master artisans to convey genuine emotion and memorable celebration."
            )
            story = f"Hand-assembled in artisanal small batches, each element is carefully vetted to guarantee unforgettable unboxing joy."

            packaging_items = [
                f"Signature Bloomora {cat_name.split()[0]} Presentation Box",
                "Hand-Tied Silk Satin Ribbon",
                "Custom Gold-Embossed Dedication Note"
            ]

            is_best_seller = (i % 7 == 0)
            is_trending = (i % 5 == 1)
            is_seasonal = (i % 11 == 2)
            is_featured = (i % 13 == 3) or is_best_seller

            rating = round(4.65 + (i % 35) * 0.01, 2)
            if rating > 5.0:
                rating = 4.98
            review_count = 12 + (i * 7) % 240

            product_obj = {
                "id": prod_id,
                "name": name,
                "subtitle": subtitle,
                "description": description,
                "story": story,
                "price": price,
                "originalPrice": original_price,
                "category": cat_slug,
                "occasion": selected_occasions,
                "recipientTag": recipient_tag,
                "budgetTier": budget_tier,
                "images": [image_url],
                "packagingItems": packaging_items,
                "rating": rating,
                "reviewCount": review_count,
                "isBestSeller": is_best_seller,
                "isTrending": is_trending,
                "isSeasonal": is_seasonal,
                "isFeatured": is_featured,
                "inStock": True,
                "preparationTimeMinutes": 15 if cat_slug in ["mini-gifts", "flowers"] else 30,
                "aiRecommendationReason": f"Perfect pairing of {cat_name} for {recipient_tag.replace('-', ' ')} on {selected_occasions[0]} within {budget_tier.replace('-', ' ')} budget.",
                "tags": [cat_slug, recipient_tag, budget_tier] + selected_occasions + interests,
                "customizable": cat_slug in ["personalized", "custom-gifts", "cakes", "corporate-gifts"],
                "partnerId": "shop-aditya-1" if i % 2 == 0 else "shop-rajahmundry-1",
                "isBloomoraProduct": True
            }
            products.append(product_obj)

    assert len(products) == 1000, f"Expected 1000 products, got {len(products)}"
    assert len(set(p["id"] for p in products)) == 1000, "IDs not unique"
    assert len(set(p["name"] for p in products)) == 1000, "Names not unique"
    assert len(set(p["images"][0] for p in products)) == 1000, "Images not unique"

    print("SUCCESS: 1,000 unique products generated!")
    print(f"- Total Products: {len(products)}")
    print(f"- Unique IDs: {len(set(p['id'] for p in products))}")
    print(f"- Unique Names: {len(set(p['name'] for p in products))}")
    print(f"- Unique Images: {len(set(p['images'][0] for p in products))}")

    # Write to frontend/lib/products1000.json
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    frontend_path = os.path.join(base_dir, "frontend", "lib", "products1000.json")
    os.makedirs(os.path.dirname(frontend_path), exist_ok=True)
    with open(frontend_path, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print(f"Saved to {frontend_path}")

    # Seed into Django SQLite DB
    try:
        import sys
        sys.path.insert(0, os.path.join(base_dir, "backend"))
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
        import django
        django.setup()
        from django.db import transaction
        from apps.catalog.models import Product, Category, Occasion
        from apps.creators.models import Seller
        from apps.taxonomy.models import GiftType

        seller = Seller.objects.first()
        category_map = {c.slug: c for c in Category.objects.all()}
        occasion_map = {o.slug: o for o in Occasion.objects.all()}

        print("Clearing existing products in database...")
        Product.objects.all().delete()

        print("Seeding strictly 1,000 products into Django database...")
        with transaction.atomic():
            for p in products:
                cat = category_map.get(p["category"])
                if not cat:
                    continue

                prod_instance = Product.objects.create(
                    seller=seller,
                    category=cat,
                    name=p["name"],
                    subtitle=p["subtitle"],
                    description=p["description"],
                    story=p["story"],
                    price=p["price"],
                    original_price=p["originalPrice"],
                    stock=50,
                    images=p["images"],
                    tags=p["tags"],
                    emotions=p["tags"][:3],
                    recipient_types=[p["recipientTag"]],
                    interests=[p["category"]],
                    budget_tier=p["budgetTier"],
                    customizable=p["customizable"],
                    same_day_available=True,
                    delivery_time_hours=2 if p["category"] in ["flowers", "mini-gifts"] else 24,
                    preparation_time_minutes=p["preparationTimeMinutes"],
                    is_best_seller=p["isBestSeller"],
                    is_trending=p["isTrending"],
                    is_seasonal=p["isSeasonal"],
                    featured=p["isFeatured"],
                    ai_recommendation_reason=p["aiRecommendationReason"],
                    location="Surampalem, Rajahmundry, Vijayawada",
                    active=True
                )

                for occ_slug in p["occasion"]:
                    if occ_slug in occasion_map:
                        prod_instance.occasions.add(occasion_map[occ_slug])

                matching_types = GiftType.objects.filter(slug__iexact=p["category"])
                if matching_types.exists():
                    prod_instance.gift_types.set(matching_types)

        db_count = Product.objects.count()
        print(f"Django Database seeded successfully! Total Products: {db_count}")
        assert db_count == 1000, f"Expected 1000 in DB, got {db_count}"
    except Exception as e:
        print(f"Error during Django DB seeding: {e}")

    return products

if __name__ == "__main__":
    generate_1000()

