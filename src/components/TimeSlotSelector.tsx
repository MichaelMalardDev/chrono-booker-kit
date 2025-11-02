import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Moon, Sunrise, Sun } from "lucide-react";

interface TimeSlot {
  time: string;
  period: "morning" | "afternoon" | "evening";
}

interface TimeSlotSelectorProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

const timeSlots: TimeSlot[] = [
  { time: "06:00 AM", period: "morning" },
  { time: "07:00 AM", period: "morning" },
  { time: "08:00 AM", period: "morning" },
  { time: "09:00 AM", period: "morning" },
  { time: "10:00 AM", period: "morning" },
  { time: "11:00 AM", period: "morning" },
  { time: "12:00 PM", period: "afternoon" },
  { time: "01:00 PM", period: "afternoon" },
  { time: "02:00 PM", period: "afternoon" },
  { time: "03:00 PM", period: "afternoon" },
  { time: "04:00 PM", period: "afternoon" },
  { time: "05:00 PM", period: "evening" },
  { time: "06:00 PM", period: "evening" },
  { time: "07:00 PM", period: "evening" },
  { time: "08:00 PM", period: "evening" },
];

export const TimeSlotSelector = ({ selectedTime, onSelectTime }: TimeSlotSelectorProps) => {
  const periods = [
    { id: "morning", label: "Morning", icon: Sunrise, slots: timeSlots.filter(s => s.period === "morning") },
    { id: "afternoon", label: "Afternoon", icon: Sun, slots: timeSlots.filter(s => s.period === "afternoon") },
    { id: "evening", label: "Evening", icon: Moon, slots: timeSlots.filter(s => s.period === "evening") },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Available Time Slots</h3>
      </div>

      {periods.map((period) => (
        <div key={period.id} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <period.icon className="h-4 w-4" />
            <span>{period.label}</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {period.slots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectTime(slot.time)}
                className={cn(
                  "font-medium",
                  selectedTime === slot.time && "bg-primary text-primary-foreground"
                )}
              >
                {slot.time}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
};
