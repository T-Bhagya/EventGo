export type RegistrationStatus = "confirmed" | "cancelled";

export type Registration = {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  registeredAt: string | number;
};

export type CreateRegistrationInput = Omit<Registration, "id" | "registeredAt"> & {
  status?: RegistrationStatus;
};

export type RegistrationWithEvent = Registration & {
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventImageUrl?: string;
  price?: string;
  pinCode?: string;
  qrPayload?: string;
};
