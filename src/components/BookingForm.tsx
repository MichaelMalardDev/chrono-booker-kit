import { useState } from "react";
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import type { BookingData } from "../lib/types";
export type { BookingData } from "../lib/types";

interface BookingFormProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSubmit: (data: BookingData) => void;
  onBack: () => void;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  backLabel?: string;
  isSubmitting?: boolean;
}

export const BookingForm = ({
  selectedDate,
  selectedTime,
  onSubmit,
  onBack,
  title = "Booking Details",
  subtitle = "Complete your appointment information",
  submitLabel = "Confirm Booking",
  backLabel = "Back",
  isSubmitting = false,
}: BookingFormProps) => {
  const [formData, setFormData] = useState<BookingData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="space-y-3 p-4 bg-secondary rounded-lg">
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium">{formatDate(selectedDate)}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-medium">{selectedTime}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Additional Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special requests or information..."
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            {backLabel}
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
};
