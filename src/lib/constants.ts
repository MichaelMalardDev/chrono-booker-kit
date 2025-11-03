import { Clock, Moon, Sun, Sunrise } from "lucide-react";
import type { TimeSlotDefinition, TimeSlotPeriodConfig } from "./types";

export const DEFAULT_TIME_SLOTS: TimeSlotDefinition[] = [
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

export const DEFAULT_PERIOD_CONFIG: Record<string, TimeSlotPeriodConfig> = {
  morning: { label: "Morning", icon: Sunrise },
  afternoon: { label: "Afternoon", icon: Sun },
  evening: { label: "Evening", icon: Moon },
};

export const FALLBACK_PERIOD_CONFIG: TimeSlotPeriodConfig = {
  label: "Other",
  icon: Clock,
};
