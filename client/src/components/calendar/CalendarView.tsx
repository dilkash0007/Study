import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CalendarEvent, useCalendar } from "@/lib/stores/useCalendar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventModal } from "./EventModal";

interface CalendarViewProps {
  onSelectDate?: (date: Date) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
}

export function CalendarView({
  onSelectDate,
  onSelectEvent,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { getEventsByDate } = useCalendar();

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setSelectedDate(new Date());
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);

    if (onSelectEvent) {
      onSelectEvent(event);
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedEvent(undefined);
    setSelectedDate(day);
    setIsModalOpen(true);

    if (onSelectDate) {
      onSelectDate(day);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(undefined);
    setSelectedDate(null);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create 7 days of week headers (Sun-Sat)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderDay = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isSelected = isToday(day);
    const dayEvents = getEventsByDate(day);
    const hasEvents = dayEvents.length > 0;

    return (
      <div
        key={day.toString()}
        className={cn(
          "flex flex-col h-[80px] border border-border p-1 transition-colors cursor-pointer",
          isCurrentMonth ? "bg-card" : "bg-muted/20 text-muted-foreground",
          isSelected && "bg-accent/50"
        )}
        onClick={() => handleDayClick(day)}
      >
        <div className="text-right">
          <span
            className={cn(
              "inline-flex items-center justify-center",
              isToday(day) &&
                "bg-primary text-primary-foreground rounded-full h-6 w-6 font-medium"
            )}
          >
            {format(day, "d")}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {hasEvents && (
            <div className="flex flex-col gap-1 mt-1">
              {dayEvents.slice(0, 2).map((event) => (
                <Badge
                  key={event.id}
                  variant="outline"
                  className={cn(
                    "text-xs truncate cursor-pointer",
                    event.completed && "line-through opacity-50",
                    event.type === "task" && "bg-blue-100",
                    event.type === "deadline" && "bg-red-100",
                    event.type === "meeting" && "bg-green-100",
                    event.type === "reminder" && "bg-yellow-100"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEvent(event);
                  }}
                >
                  {event.title}
                </Badge>
              ))}
              {dayEvents.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{dayEvents.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">
            {format(currentMonth, "MMMM yyyy")}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" onClick={handleCreateEvent}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
            {daysInMonth.map(renderDay)}
          </div>
        </CardContent>
      </Card>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialEvent={selectedEvent}
        selectedDate={selectedDate || undefined}
      />
    </>
  );
}
