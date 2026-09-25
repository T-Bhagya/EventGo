export type EventCategory =
  | "All"
  | "Tech"
  | "Design"
  | "Music"
  | "University"
  | "Business"
  | "Sports";

export type EventStatus =
  | "draft"
  | "upcoming"
  | "ongoing"
  | "live"
  | "completed"
  | "cancelled";

export type EventItem = {
  id: string;
  organizerId: string;
  organizer: string;
  organizerAvatar?: string;
  title: string;
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
  status: EventStatus;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  pinCode?: string;
  qrPayload?: string;
  createdAt?: string | number;
};

export type CreateEventInput = Omit<
  EventItem,
  "id" | "attendeesCount" | "rating" | "reviewsCount" | "createdAt"
> & {
  attendeesCount?: number;
};

export type UpdateEventInput = Partial<CreateEventInput>;

export const EVENT_CATEGORIES: EventCategory[] = [
  "All",
  "Tech",
  "Design",
  "Music",
  "University",
  "Business",
  "Sports",
];
