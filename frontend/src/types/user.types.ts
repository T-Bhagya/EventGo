export type UserRole = "attendee" | "organizer";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  interests?: string[];
  isVerified?: boolean;
  createdAt?: string | number;
};

export type AttendeeProfile = UserProfile & {
  role: "attendee";
  eventsAttended?: number;
  savedEvents?: number;
  reviewsGiven?: number;
};

export type OrganizerProfile = UserProfile & {
  role: "organizer";
  publishedEvents?: number;
  totalAttendees?: number;
  avgRating?: number;
};

export type CreateUserInput = Omit<UserProfile, "createdAt">;
export type UpdateUserInput = Partial<Omit<UserProfile, "uid" | "createdAt">>;
