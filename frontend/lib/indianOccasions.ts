/**
 * Indian Festivals & Occasion Calendar
 * Dynamically computes upcoming Indian celebrations, filters past events,
 * and updates countdowns ("Today!", "Tomorrow", "X Days Left") relative to the current day.
 */

export interface IndianOccasion {
  id: string;
  name: string;
  tagline: string;
  image: string;
  // Exact dates across years for Panchang-based festivals
  dates: Record<number, { month: number; day: number }>; // month is 1-indexed (1 = Jan, 12 = Dec)
}

export interface UpcomingOccasionDisplay {
  id: string;
  name: string;
  date: string;
  countdown: string;
  tagline: string;
  image: string;
  daysLeft: number;
  fullDate: Date;
}

export const INDIAN_FESTIVALS: IndianOccasion[] = [
  {
    id: 'navratri',
    name: 'Navratri & Durga Puja',
    tagline: 'Garba Nights, Velvet Sweets & Fresh Floral Baskets',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
    dates: {
      2024: { month: 10, day: 3 },
      2025: { month: 9, day: 22 },
      2026: { month: 10, day: 11 },
      2027: { month: 9, day: 30 },
      2028: { month: 10, day: 18 },
    },
  },
  {
    id: 'dussehra',
    name: 'Dussehra (Vijayadashami)',
    tagline: 'Auspicious Silver Keepsakes & Royal Dry Fruit Chests',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    dates: {
      2024: { month: 10, day: 12 },
      2025: { month: 10, day: 2 },
      2026: { month: 10, day: 20 },
      2027: { month: 10, day: 9 },
      2028: { month: 10, day: 27 },
    },
  },
  {
    id: 'karwa-chauth',
    name: 'Karwa Chauth',
    tagline: 'Sargi Hampers, Preserved Red Roses & Jewelry Boxes',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80',
    dates: {
      2024: { month: 10, day: 20 },
      2025: { month: 10, day: 10 },
      2026: { month: 10, day: 29 },
      2027: { month: 10, day: 18 },
      2028: { month: 11, day: 5 },
    },
  },
  {
    id: 'dhanteras',
    name: 'Dhanteras Shagun',
    tagline: 'Prosperity Silver Coins, Laxmi Diyas & Sweets',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    dates: {
      2024: { month: 10, day: 29 },
      2025: { month: 10, day: 18 },
      2026: { month: 11, day: 6 },
      2027: { month: 10, day: 27 },
      2028: { month: 11, day: 15 },
    },
  },
  {
    id: 'diwali',
    name: 'Diwali (Deepavali)',
    tagline: 'Festival of Lights, Artisanal Diya Hampers & Belgian Chocolates',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    dates: {
      2024: { month: 11, day: 1 },
      2025: { month: 10, day: 20 },
      2026: { month: 11, day: 8 },
      2027: { month: 10, day: 29 },
      2028: { month: 11, day: 17 },
    },
  },
  {
    id: 'bhai-dooj',
    name: 'Bhai Dooj',
    tagline: 'Sibling Love, Handcrafted Roli Chawal & Sweet Boxes',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    dates: {
      2024: { month: 11, day: 3 },
      2025: { month: 10, day: 22 },
      2026: { month: 11, day: 10 },
      2027: { month: 10, day: 31 },
      2028: { month: 11, day: 19 },
    },
  },
  {
    id: 'christmas',
    name: 'Christmas Celebrations',
    tagline: 'Rich Plum Cakes, Pine Baskets & Velvet Gift Boxes',
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=600&q=80',
    dates: {
      2024: { month: 12, day: 25 },
      2025: { month: 12, day: 25 },
      2026: { month: 12, day: 25 },
      2027: { month: 12, day: 25 },
      2028: { month: 12, day: 25 },
    },
  },
  {
    id: 'new-year',
    name: 'New Year Celebrations',
    tagline: 'Midnight Surprise Cakes & Luxury Sparkling Hampers',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    dates: {
      2024: { month: 12, day: 31 },
      2025: { month: 12, day: 31 },
      2026: { month: 12, day: 31 },
      2027: { month: 12, day: 31 },
      2028: { month: 12, day: 31 },
    },
  },
  {
    id: 'makar-sankranti',
    name: 'Makar Sankranti & Pongal',
    tagline: 'Harvest Blessings, Tilgur Sweets & Traditional Brass Sets',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    dates: {
      2025: { month: 1, day: 14 },
      2026: { month: 1, day: 14 },
      2027: { month: 1, day: 14 },
      2028: { month: 1, day: 15 },
    },
  },
  {
    id: 'republic-day',
    name: 'Republic Day',
    tagline: 'Tricolor Floral Bouquets & Executive Corporate Sets',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    dates: {
      2025: { month: 1, day: 26 },
      2026: { month: 1, day: 26 },
      2027: { month: 1, day: 26 },
      2028: { month: 1, day: 26 },
    },
  },
  {
    id: 'valentines-day',
    name: 'Valentine’s Day',
    tagline: '100 Red Dutch Roses, Velvet Bento Cakes & Love Letters',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    dates: {
      2025: { month: 2, day: 14 },
      2026: { month: 2, day: 14 },
      2027: { month: 2, day: 14 },
      2028: { month: 2, day: 14 },
    },
  },
  {
    id: 'maha-shivratri',
    name: 'Maha Shivratri',
    tagline: 'Pure Ghee Sweets, Dry Fruits & Fragrant White Lilies',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    dates: {
      2025: { month: 2, day: 26 },
      2026: { month: 2, day: 15 },
      2027: { month: 3, day: 6 },
      2028: { month: 2, day: 24 },
    },
  },
  {
    id: 'holi',
    name: 'Holi (Festival of Colours)',
    tagline: 'Organic Herbal Gulal, Gourmet Gujiya & Thandai Sets',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
    dates: {
      2025: { month: 3, day: 14 },
      2026: { month: 3, day: 3 },
      2027: { month: 3, day: 23 },
      2028: { month: 3, day: 11 },
    },
  },
  {
    id: 'ugadi',
    name: 'Ugadi & Gudi Padwa',
    tagline: 'Telugu & Marathi New Year Sweets, Mango Leaves & Dry Fruits',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    dates: {
      2025: { month: 3, day: 30 },
      2026: { month: 3, day: 19 },
      2027: { month: 4, day: 7 },
      2028: { month: 3, day: 27 },
    },
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    tagline: 'Designer Silver Rakhis, Belgian Truffles & Keepsakes',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    dates: {
      2025: { month: 8, day: 9 },
      2026: { month: 8, day: 28 },
      2027: { month: 8, day: 17 },
      2028: { month: 8, day: 5 },
    },
  },
  {
    id: 'janmashtami',
    name: 'Krishna Janmashtami',
    tagline: 'Artisanal Makhan Mishri, Flute Hampers & Fresh Flowers',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    dates: {
      2025: { month: 8, day: 16 },
      2026: { month: 9, day: 4 },
      2027: { month: 8, day: 24 },
      2028: { month: 8, day: 13 },
    },
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    tagline: 'Artisanal Modak Boxes, Hibiscus Bouquets & Brass Idols',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
    dates: {
      2025: { month: 8, day: 27 },
      2026: { month: 9, day: 14 },
      2027: { month: 9, day: 4 },
      2028: { month: 8, day: 24 },
    },
  },
];

/**
 * Resolves the next upcoming date for a festival relative to a given date.
 */
function resolveNextFestivalDate(festival: IndianOccasion, now: Date): Date {
  const currentYear = now.getFullYear();

  // Try current year first
  if (festival.dates[currentYear]) {
    const { month, day } = festival.dates[currentYear];
    const d = new Date(currentYear, month - 1, day, 23, 59, 59);
    if (d.getTime() >= now.getTime()) {
      return new Date(currentYear, month - 1, day);
    }
  }

  // Next year
  const nextYear = currentYear + 1;
  if (festival.dates[nextYear]) {
    const { month, day } = festival.dates[nextYear];
    return new Date(nextYear, month - 1, day);
  }

  // Fallback: subsequent years
  for (let yr = nextYear + 1; yr <= currentYear + 5; yr++) {
    if (festival.dates[yr]) {
      const { month, day } = festival.dates[yr];
      return new Date(yr, month - 1, day);
    }
  }

  // Ultimate fallback to prevent undefined
  return new Date(currentYear + 1, 9, 15);
}

/**
 * Returns strictly upcoming Indian festivals, filtered to eliminate any completed events,
 * and sorted chronologically with exact everyday countdowns.
 */
export function getUpcomingIndianOccasions(limit = 4, referenceDate = new Date()): UpcomingOccasionDisplay[] {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const upcomingList: UpcomingOccasionDisplay[] = [];

  for (const fest of INDIAN_FESTIVALS) {
    const targetDate = resolveNextFestivalDate(fest, today);
    const targetMidnight = new Date(targetDate);
    targetMidnight.setHours(0, 0, 0, 0);

    const diffMs = targetMidnight.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // STRICT CHECK: Discard completed events
    if (diffDays < 0) continue;

    let countdownStr = '';
    if (diffDays === 0) {
      countdownStr = 'Today! 🎉';
    } else if (diffDays === 1) {
      countdownStr = 'Tomorrow ⏳';
    } else {
      countdownStr = `${diffDays} Days Left`;
    }

    const formattedDate = targetDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });

    upcomingList.push({
      id: fest.id,
      name: fest.name,
      date: formattedDate,
      countdown: countdownStr,
      tagline: fest.tagline,
      image: fest.image,
      daysLeft: diffDays,
      fullDate: targetDate,
    });
  }

  // Sort by closest upcoming festival first
  upcomingList.sort((a, b) => a.daysLeft - b.daysLeft);

  return upcomingList.slice(0, limit);
}
