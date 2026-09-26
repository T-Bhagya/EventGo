export type EventCategory =
  | "All"
  | "Tech"
  | "Design"
  | "Music"
  | "University"
  | "Business"
  | "Sports";

export type EventItem = {
  id: string;
  title: string;
  organizer: string;
  organizerAvatar?: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  isVirtual?: boolean;
  price: string;
  imageUrl: string;
  description: string;
  attendeesCount: number;
  maxCapacity: number;
  status: "upcoming" | "ongoing" | "registered" | "completed";
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  pinCode?: string;
  qrPayload?: string;
};

export const MOCK_CATEGORIES: EventCategory[] = [
  "All",
  "Tech",
  "Design",
  "Music",
  "University",
  "Business",
  "Sports",
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: "evt-101",
    title: "AI & Future Tech Summit 2026",
    organizer: "SLIIT Innovation Hub",
    organizerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    category: "Tech",
    date: "Sep 24, 2026",
    time: "09:00 AM - 04:30 PM",
    location: "Grand Auditorium, Hall B • Colombo",
    isVirtual: false,
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    description:
      "Join world-class engineers, founders, and researchers exploring artificial intelligence advancements, agentic workflows, and future systems design.",
    attendeesCount: 420,
    maxCapacity: 500,
    status: "upcoming",
    featured: true,
    rating: 4.9,
    reviewsCount: 128,
    pinCode: "8492",
    qrPayload: "EVENTGO-REG-101-8492",
  },
  {
    id: "evt-102",
    title: "International Music Night",
    organizer: "Creative Collective SL",
    organizerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    category: "Music",
    date: "Jun 10, 2026",
    time: "07:00 PM - 10:00 PM",
    location: "36 Guildford Crescent, Colombo 07",
    isVirtual: false,
    price: "Rs. 1,500",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
    description:
      "An unforgettable international music night featuring top performers from around the world, live at the heart of Colombo.",
    attendeesCount: 185,
    maxCapacity: 200,
    status: "upcoming",
    featured: true,
    rating: 4.8,
    reviewsCount: 64,
    pinCode: "3104",
    qrPayload: "EVENTGO-REG-102-3104",
  },
  {
    id: "evt-103",
    title: "Minimal Systems & UI Workshop",
    organizer: "Design District",
    category: "Design",
    date: "Oct 12, 2026",
    time: "10:00 AM - 01:00 PM",
    location: "Design District, Pier 27 • Colombo",
    price: "Rs. 2,250",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    description:
      "A deep dive into quiet luxury aesthetics, typography micro-scaling, spatial layout design, and design token architectures.",
    attendeesCount: 120,
    maxCapacity: 200,
    status: "upcoming",
    featured: false,
    rating: 4.9,
    reviewsCount: 120,
  },
  {
    id: "evt-104",
    title: "Sunset Artisan Food Fair",
    organizer: "Embarcadero Plaza Colombo",
    category: "Business",
    date: "Oct 15, 2026",
    time: "04:00 PM - 09:00 PM",
    location: "Embarcadero Plaza • Galle",
    price: "Free Entry",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    description:
      "A vibrant artisan food fair showcasing the best of Sri Lankan cuisine, handcrafted goods, and live entertainment.",
    attendeesCount: 310,
    maxCapacity: 400,
    status: "upcoming",
    featured: false,
    rating: 4.8,
    reviewsCount: 310,
  },
  {
    id: "evt-105",
    title: "Global Student Entrepreneurship Pitchfest",
    organizer: "Venture Club SL",
    category: "Business",
    date: "Oct 18, 2026",
    time: "10:00 AM - 03:00 PM",
    location: "Executive Conference Center • Kandy",
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    description:
      "Watch top student founders pitch innovative startups to angel investors and industry mentors with live voting.",
    attendeesCount: 290,
    maxCapacity: 300,
    status: "upcoming",
    featured: false,
    rating: 4.9,
    reviewsCount: 89,
  },
];
