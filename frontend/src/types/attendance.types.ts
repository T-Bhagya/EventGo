export type AttendanceCheckInStatus = "checked_in" | "pending";
export type CheckInMethod = "pin" | "qr" | "manual";

export type Attendance = {
  id: string;
  eventId: string;
  userId: string;
  checkInStatus: AttendanceCheckInStatus;
  checkInTime?: string;
  checkInMethod?: CheckInMethod;
  createdAt: string | number;
};

export type ParticipantItem = {
  id: string;
  name: string;
  email: string;
  checkInStatus: AttendanceCheckInStatus;
  checkInTime?: string;
  pin?: string;
};

export type CreateAttendanceInput = Omit<Attendance, "id" | "createdAt">;
export type UpdateAttendanceStatusInput = {
  checkInStatus: AttendanceCheckInStatus;
  checkInTime?: string;
  checkInMethod?: CheckInMethod;
};
