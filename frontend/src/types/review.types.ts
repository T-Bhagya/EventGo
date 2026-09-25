export type Review = {
  id: string;
  eventId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string | number;
};

export type CreateReviewInput = Omit<Review, "id" | "createdAt">;
export type UpdateReviewInput = Partial<Pick<Review, "rating" | "comment">>;
