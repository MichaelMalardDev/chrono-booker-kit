import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface BookingRecord {
  id?: string;
  booking_date: string;
  booking_time: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string | null;
  [key: string]: unknown;
}

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export type BookingStep = "calendar" | "timeslot" | "details" | "confirmation";

export interface TimeSlotDefinition {
  time: string;
  period: string;
}

export interface TimeSlotPeriodConfig {
  label: string;
  icon: LucideIcon;
}

export interface CreateBookingInput {
  bookingDate: string;
  bookingTime: string;
  data: BookingData;
}

export type FetchBookingsHandler = () => Promise<BookingRecord[]> | BookingRecord[];

export type CreateBookingHandler = (input: CreateBookingInput) => Promise<void> | void;

export interface BookingConfirmationPayload {
  bookingDate: string;
  bookingTime: string;
  data: BookingData;
}

export interface ChronoBookerCopy {
  headerTitle: string;
  headerDescription: string;
  calendarTitle: string;
  calendarSubtitle: string;
  continueToTime: string;
  timeTitle: string;
  timeSubtitle: string;
  continueToDetails: string;
  backLabel: string;
  bookingSubmitLabel: string;
  bookingFormTitle: string;
  bookingFormSubtitle: string;
  confirmationTitle: string;
  confirmationDescription: string;
  newBookingButton: string;
  addToCalendarButton: string;
  appointmentDetailsHeading: string;
  fetchError: string;
  submitError: string;
  loadingAvailability: string;
}

export interface ChronoBookerProps {
  fetchBookings: FetchBookingsHandler;
  createBooking: CreateBookingHandler;
  onBookingConfirmed?: (payload: BookingConfirmationPayload) => void;
  timeSlots?: TimeSlotDefinition[];
  minDate?: Date;
  copy?: Partial<ChronoBookerCopy>;
  className?: string;
  autoFetchOnMount?: boolean;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
}
