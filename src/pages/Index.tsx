import { useState, useEffect } from "react";
import { BookingCalendar } from "@/components/BookingCalendar";
import { TimeSlotSelector } from "@/components/TimeSlotSelector";
import { BookingForm, BookingData } from "@/components/BookingForm";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type BookingStep = "calendar" | "timeslot" | "details" | "confirmation";

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
}

const Index = () => {
  const [step, setStep] = useState<BookingStep>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .gte("booking_date", new Date().toISOString().split("T")[0]);

    if (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load booking availability");
      return;
    }

    setExistingBookings(data || []);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

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

    const bookingDate = selectedDate.toISOString().split("T")[0];

    const { error } = await supabase.from("bookings").insert({
      booking_date: bookingDate,
      booking_time: selectedTime,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes || null,
    });

    if (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. This time slot may already be taken.");
      return;
    }

    setBookingData(data);
    await fetchBookings(); // Refresh bookings
    setStep("confirmation");
    toast.success("Booking confirmed successfully!");
  };

  const handleNewBooking = () => {
    setStep("calendar");
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingData(null);
  };

  const handleBackToCalendar = () => {
    setStep("calendar");
  };

  const handleBackToTimeSlot = () => {
    setStep("timeslot");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Appointment Booking</h1>
              <p className="text-sm text-muted-foreground">Schedule your appointment in minutes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {step === "calendar" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Select a Date</h2>
              <p className="text-muted-foreground">Choose your preferred appointment date</p>
            </div>
            
            <BookingCalendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              existingBookings={existingBookings}
            />
            
            <Button
              onClick={handleContinueToTimeSlot}
              disabled={!selectedDate}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              Continue to Time Selection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {step === "timeslot" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Choose a Time</h2>
              <p className="text-muted-foreground">Select your preferred time slot</p>
            </div>

            <TimeSlotSelector
              selectedTime={selectedTime}
              onSelectTime={handleTimeSelect}
              selectedDate={selectedDate}
              existingBookings={existingBookings}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBackToCalendar}
                className="flex-1"
                size="lg"
              >
                Back
              </Button>
              <Button
                onClick={handleContinueToDetails}
                disabled={!selectedTime}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
              >
                Continue to Details
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
            />
          </div>
        )}

        {step === "confirmation" && bookingData && (
          <BookingConfirmation
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            bookingData={bookingData}
            onNewBooking={handleNewBooking}
          />
        )}
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Appointment Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
