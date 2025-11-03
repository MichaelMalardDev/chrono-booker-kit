import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { ChronoBooker, type BookingRecord, type CreateBookingInput } from "@/index";

const Index = () => {
  const fetchBookings = useCallback(async (): Promise<BookingRecord[]> => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .gte("booking_date", new Date().toISOString().split("T")[0]);

    if (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load booking availability");
      throw error;
    }

    return (data as BookingRecord[]) || [];
  }, []);

  const createBooking = useCallback(async ({
    bookingDate,
    bookingTime,
    data,
  }: CreateBookingInput) => {
    const { error } = await supabase.from("bookings").insert({
      booking_date: bookingDate,
      booking_time: bookingTime,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes || null,
    });

    if (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. This time slot may already be taken.");
      throw error;
    }

    toast.success("Booking confirmed successfully!");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ChronoBooker
        fetchBookings={fetchBookings}
        createBooking={createBooking}
      />
    </div>
  );
};

export default Index;
