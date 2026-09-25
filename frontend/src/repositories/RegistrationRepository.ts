import * as registrationService from "../services/registrationService";
import {
  CreateRegistrationInput,
  Registration,
} from "../types/registration.types";

/**
 * RegistrationRepository
 * Provides clean data access for Event Registrations.
 */

export async function createRegistration(
  registrationData: CreateRegistrationInput
): Promise<Registration> {
  return registrationService.createRegistration(registrationData);
}

export async function getRegistrationById(
  registrationId: string
): Promise<Registration | null> {
  return registrationService.getRegistrationById(registrationId);
}

export async function getRegistrationsByUser(
  userId: string
): Promise<Registration[]> {
  return registrationService.getRegistrationsByUser(userId);
}

export async function getRegistrationsByEvent(
  eventId: string
): Promise<Registration[]> {
  return registrationService.getRegistrationsByEvent(eventId);
}

export async function updateRegistration(
  registrationId: string,
  updates: Partial<Omit<Registration, "id">>
): Promise<void> {
  return registrationService.updateRegistration(registrationId, updates);
}

export async function deleteRegistration(
  registrationId: string
): Promise<void> {
  return registrationService.deleteRegistration(registrationId);
}
