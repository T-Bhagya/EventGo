import * as attendanceService from "../services/attendanceService";
import {
  Attendance,
  CreateAttendanceInput,
} from "../types/attendance.types";

/**
 * AttendanceRepository
 * Provides clean data access for Event Attendance and Rosters.
 */

export async function createAttendance(
  attendanceData: CreateAttendanceInput
): Promise<Attendance> {
  return attendanceService.createAttendance(attendanceData);
}

export async function getAttendanceById(
  attendanceId: string
): Promise<Attendance | null> {
  return attendanceService.getAttendanceById(attendanceId);
}

export async function getAttendanceByUser(
  userId: string
): Promise<Attendance[]> {
  return attendanceService.getAttendanceByUser(userId);
}

export async function getAttendanceByEvent(
  eventId: string
): Promise<Attendance[]> {
  return attendanceService.getAttendanceByEvent(eventId);
}

export async function getAttendanceByUserAndEvent(
  userId: string,
  eventId: string
): Promise<Attendance[]> {
  return attendanceService.getAttendanceByUserAndEvent(userId, eventId);
}

export async function updateAttendance(
  attendanceId: string,
  updates: Partial<Omit<Attendance, "id">>
): Promise<void> {
  return attendanceService.updateAttendance(attendanceId, updates);
}

export async function deleteAttendance(
  attendanceId: string
): Promise<void> {
  return attendanceService.deleteAttendance(attendanceId);
}
