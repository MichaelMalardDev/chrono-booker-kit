import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { BookingCalendar } from "./BookingCalendar";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { BookingForm } from "./BookingForm";
import { BookingConfirmation } from "./BookingConfirmation";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { cn } from "../lib/utils";
import { DEFAULT_TIME_SLOTS } from "../lib/constants";
import type {
  BookingData,
  BookingRecord,
  ChronoBookerCopy,
  ChronoBookerProps,
  BookingStep,
} from "../lib/types";

const defaultCopy: ChronoBookerCopy = {
  headerTitle: "Appointment Booking",
  headerDescription: "Schedule your appointment in minutes",
  calendarTitle: "Select a Date",
  calendarSubtitle: "Choose your preferred appointment date",
  continueToTime: "Continue to Time Selection",
  timeTitle: "Choose a Time",
  timeSubtitle: "Select your preferred time slot",
  continueToDetails: "Continue to Details",
  backLabel: "Back",
  bookingSubmitLabel: "Confirm Booking",
  bookingFormTitle: "Booking Details",
  bookingFormSubtitle: "Complete your appointment information",
  confirmationTitle: "Booking Confirmed!",
  confirmationDescription:
    "Your appointment has been successfully scheduled. A confirmation email has been sent to your inbox.",
  newBookingButton: "Book Another Appointment",
  addToCalendarButton: "Add to Calendar",
  appointmentDetailsHeading: "Appointment Details",
  fetchError: "Failed to load booking availability.",
  submitError: "Failed to create booking. Please try another time slot.",
  loadingAvailability: "Loading availability...",
};

const formatISODate = (date: Date) => date.toISOString().split("T")[0];

export const ChronoBooker = ({
  fetchBookings,
  createBooking,
  onBookingConfirmed,
  timeSlots = DEFAULT_TIME_SLOTS,
  minDate,
  copy,
  className,
  autoFetchOnMount = true,
  headerContent,
  footerContent,
}: ChronoBookerProps) => {
  const [step, setStep] = useState<BookingStep>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [existingBookings, setExistingBookings] = useState<BookingRecord[]>([]);
  const [isFetchingBookings, setIsFetchingBookings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mergedCopy = useMemo(() => ({ ...defaultCopy, ...copy }), [copy]);

  const loadBookings = useCallback(async () => {
    setIsFetchingBookings(true);
    try {
      const result = await Promise.resolve(fetchBookings());
      setExistingBookings(result ?? []);
      setErrorMessage(null);
    } catch (error) {
      console.error("Failed to load bookings", error);
      setErrorMessage(mergedCopy.fetchError);
    } finally {
      setIsFetchingBookings(false);
    }
  }, [fetchBookings, mergedCopy.fetchError]);

  useEffect(() => {
    if (!autoFetchOnMount) return;
    loadBookings();
  }, [autoFetchOnMount, loadBookings]);

  const handleContinueToTimeSlot = () => {
    if (selectedDate) {
      setStep("timeslot");
    }
  };

  const handleContinueToDetails = () => {
    if (selectedTime) {
      setStep("details");
    }
  };

  const handleBookingSubmit = async (data: BookingData) => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const bookingDate = formatISODate(selectedDate);

    try {
      await Promise.resolve(
        createBooking({ bookingDate, bookingTime: selectedTime, data }),
      );
      setBookingData(data);
      await loadBookings();
      setStep("confirmation");
      onBookingConfirmed?.({ bookingDate, bookingTime: selectedTime, data });
    } catch (error) {
      console.error("Failed to submit booking", error);
      setErrorMessage(mergedCopy.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewBooking = () => {
    setStep("calendar");
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingData(null);
    if (!autoFetchOnMount) {
      loadBookings();
    }
  };

  const handleBackToCalendar = () => {
    setStep("calendar");
  };

  const handleBackToTimeSlot = () => {
    setStep("timeslot");
  };

  return (
    <div className={cn("bg-background", className)}>
      {headerContent ?? (
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{mergedCopy.headerTitle}</h1>
                <p className="text-sm text-muted-foreground">{mergedCopy.headerDescription}</p>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="container mx-auto px-4 py-12 space-y-6">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {isFetchingBookings && existingBookings.length === 0 && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{mergedCopy.loadingAvailability}</span>
          </div>
        )}

        {step === "calendar" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">{mergedCopy.calendarTitle}</h2>
              <p className="text-muted-foreground">{mergedCopy.calendarSubtitle}</p>
            </div>

            <BookingCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              existingBookings={existingBookings}
              timeSlots={timeSlots}
              minDate={minDate}
            />

            <Button
              onClick={handleContinueToTimeSlot}
              disabled={!selectedDate || isFetchingBookings}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              {mergedCopy.continueToTime}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {step === "timeslot" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">{mergedCopy.timeTitle}</h2>
              <p className="text-muted-foreground">{mergedCopy.timeSubtitle}</p>
            </div>

            <TimeSlotSelector
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              selectedDate={selectedDate}
              existingBookings={existingBookings}
              timeSlots={timeSlots}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBackToCalendar}
                className="flex-1"
                size="lg"
              >
                {mergedCopy.backLabel}
              </Button>
              <Button
                onClick={handleContinueToDetails}
                disabled={!selectedTime}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
              >
                {mergedCopy.continueToDetails}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="max-w-2xl mx-auto">
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSubmit={handleBookingSubmit}
              onBack={handleBackToTimeSlot}
              title={mergedCopy.bookingFormTitle}
              subtitle={mergedCopy.bookingFormSubtitle}
              submitLabel={mergedCopy.bookingSubmitLabel}
              backLabel={mergedCopy.backLabel}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {step === "confirmation" && bookingData && (
          <BookingConfirmation
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            bookingData={bookingData}
            onNewBooking={handleNewBooking}
            title={mergedCopy.confirmationTitle}
            description={mergedCopy.confirmationDescription}
            detailsHeading={mergedCopy.appointmentDetailsHeading}
            addToCalendarLabel={mergedCopy.addToCalendarButton}
            newBookingLabel={mergedCopy.newBookingButton}
          />
        )}
      </main>

      {footerContent ?? (
        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Appointment Booking. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};
