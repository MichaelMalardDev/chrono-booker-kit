import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, User, Mail, Phone, Download } from "lucide-react";
import { BookingData } from "./BookingForm";

interface BookingConfirmationProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  bookingData: BookingData;
  onNewBooking: () => void;
}

export const BookingConfirmation = ({
  selectedDate,
  selectedTime,
  bookingData,
  onNewBooking,
}: BookingConfirmationProps) => {
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddToCalendar = () => {
    // Create a simple .ics file content
    const event = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Appointment Booking
DTSTART:${selectedDate?.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DESCRIPTION:Appointment confirmed for ${bookingData.name}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([event], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "appointment.ics";
    link.click();
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground">
            Your appointment has been successfully scheduled. A confirmation email has been sent to your inbox.
          </p>
        </div>
      </div>

      <div className="space-y-4 p-6 bg-secondary rounded-lg">
        <h3 className="font-semibold text-lg">Appointment Details</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(selectedDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{selectedTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{bookingData.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{bookingData.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{bookingData.phone}</p>
            </div>
          </div>

          {bookingData.notes && (
            <div className="flex items-start gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Additional Notes</p>
                <p className="font-medium">{bookingData.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={handleAddToCalendar}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Add to Calendar
        </Button>
        <Button
          onClick={onNewBooking}
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Book Another Appointment
        </Button>
      </div>
    </Card>
  );
};
