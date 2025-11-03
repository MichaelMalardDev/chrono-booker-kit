import { useMemo } from "react";

import { Clock } from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { DEFAULT_PERIOD_CONFIG, DEFAULT_TIME_SLOTS, FALLBACK_PERIOD_CONFIG } from "../lib/constants";
import type { BookingRecord, TimeSlotDefinition } from "../lib/types";

export interface TimeSlotSelectorProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  selectedDate: Date | null;
  existingBookings: BookingRecord[];
  timeSlots?: TimeSlotDefinition[];
}

const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const TimeSlotSelector = ({
  selectedTime,
  onSelectTime,
  selectedDate,
  existingBookings,
  timeSlots = DEFAULT_TIME_SLOTS,
}: TimeSlotSelectorProps) => {
  const groupedSlots = useMemo(() => {
    return timeSlots.reduce<Record<string, TimeSlotDefinition[]>>((acc, slot) => {
      acc[slot.period] = acc[slot.period] ? [...acc[slot.period], slot] : [slot];
      return acc;
    }, {});
  }, [timeSlots]);

  const getBookedTimesForDate = () => {
    if (!selectedDate) return [];

    const dateStr = selectedDate.toISOString().split("T")[0];
    return existingBookings
      .filter((booking) => booking.booking_date === dateStr)
      .map((booking) => booking.booking_time);
  };

  const bookedTimes = getBookedTimesForDate();
  const isTimeBooked = (time: string) => bookedTimes.includes(time);
  const periods = Object.entries(groupedSlots).map(([period, slots]) => ({
    id: period,
    slots,
  }));

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Available Time Slots</h3>
      </div>

      {periods.map((period) => {
        const config = DEFAULT_PERIOD_CONFIG[period.id] ?? {
          label: toTitleCase(period.id),
          icon: FALLBACK_PERIOD_CONFIG.icon,
        };

        const Icon = DEFAULT_PERIOD_CONFIG[period.id]?.icon ?? FALLBACK_PERIOD_CONFIG.icon;

        return (
          <div key={period.id} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span>{config.label}</span>
            </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {period.slots.map((slot) => {
              const isBooked = isTimeBooked(slot.time);
              return (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSelectTime(slot.time)}
                  disabled={isBooked}
                  className={cn(
                    "font-medium",
                    selectedTime === slot.time && "bg-primary text-primary-foreground",
                    isBooked && "opacity-40 cursor-not-allowed"
                  )}
                  title={isBooked ? "Already booked" : ""}
                >
                  {slot.time}
                </Button>
              );
            })}
          </div>
          </div>
        );
      })}
    </Card>
  );
};
