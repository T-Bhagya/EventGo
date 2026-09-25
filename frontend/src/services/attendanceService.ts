import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../config/firebase";
import {
  Attendance,
  CreateAttendanceInput,
} from "../types/attendance.types";

export const ATTENDANCE_COLLECTION = "attendance";

/**
 * Creates a new attendance record in Firestore.
 */
export async function createAttendance(
  attendanceData: CreateAttendanceInput
): Promise<Attendance> {
  try {
    const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
    const newDocData = {
      ...attendanceData,
      checkInStatus: attendanceData.checkInStatus ?? "pending",
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(attendanceRef, newDocData);

    return {
      id: docRef.id,
      ...newDocData,
    };
  } catch (error) {
    console.error("[attendanceService] Error creating attendance:", error);
    throw error;
  }
}

/**
 * Retrieves a single attendance record by its document ID.
 */
export async function getAttendanceById(
  attendanceId: string
): Promise<Attendance | null> {
  try {
    const docRef = doc(db, ATTENDANCE_COLLECTION, attendanceId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<Attendance, "id">),
    };
  } catch (error) {
    console.error(
      `[attendanceService] Error fetching attendance ${attendanceId}:`,
      error
    );
    throw error;
  }
}

/**
 * Retrieves all attendance records for a specific user.
 */
export async function getAttendanceByUser(
  userId: string
): Promise<Attendance[]> {
  try {
    const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
    const q = query(attendanceRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const records: Attendance[] = [];
    querySnapshot.forEach((docSnap) => {
      records.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Attendance, "id">),
      });
    });

    return records;
  } catch (error) {
    console.error(
      `[attendanceService] Error fetching attendance for user ${userId}:`,
      error
    );
    throw error;
  }
}

/**
 * Retrieves all attendance records for a specific event.
 */
export async function getAttendanceByEvent(
  eventId: string
): Promise<Attendance[]> {
  try {
    const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
    const q = query(attendanceRef, where("eventId", "==", eventId));
    const querySnapshot = await getDocs(q);

    const records: Attendance[] = [];
    querySnapshot.forEach((docSnap) => {
      records.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Attendance, "id">),
      });
    });

    return records;
  } catch (error) {
    console.error(
      `[attendanceService] Error fetching attendance for event ${eventId}:`,
      error
    );
    throw error;
  }
}

/**
 * Helper query to retrieve attendance records matching both userId and eventId.
 */
export async function getAttendanceByUserAndEvent(
  userId: string,
  eventId: string
): Promise<Attendance[]> {
  try {
    const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
    const q = query(
      attendanceRef,
      where("userId", "==", userId),
      where("eventId", "==", eventId)
    );
    const querySnapshot = await getDocs(q);

    const records: Attendance[] = [];
    querySnapshot.forEach((docSnap) => {
      records.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Attendance, "id">),
      });
    });

    return records;
  } catch (error) {
    console.error(
      `[attendanceService] Error querying attendance for user ${userId} and event ${eventId}:`,
      error
    );
    throw error;
  }
}

/**
 * Updates specific fields of an existing attendance record (e.g. checkInStatus, checkInTime, checkInMethod).
 */
export async function updateAttendance(
  attendanceId: string,
  updates: Partial<Omit<Attendance, "id">>
): Promise<void> {
  try {
    const docRef = doc(db, ATTENDANCE_COLLECTION, attendanceId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error(
      `[attendanceService] Error updating attendance ${attendanceId}:`,
      error
    );
    throw error;
  }
}

/**
 * Deletes an attendance record from Firestore.
 */
export async function deleteAttendance(attendanceId: string): Promise<void> {
  try {
    const docRef = doc(db, ATTENDANCE_COLLECTION, attendanceId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(
      `[attendanceService] Error deleting attendance ${attendanceId}:`,
      error
    );
    throw error;
  }
}
