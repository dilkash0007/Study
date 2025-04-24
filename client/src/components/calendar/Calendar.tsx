import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCalendar } from "@/lib/stores/useCalendar";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "study" | "exam" | "assignment" | "other";
  subjectId?: number;
}

interface CalendarProps {
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    type: "study",
    date: new Date(),
  });

  const { events, addEvent, removeEvent } = useCalendar();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for the selected date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  // Get events for the current month (for highlighting days with events)
  const getDaysWithEvents = () => {
    return events
      .filter((event) => isSameMonth(new Date(event.date), currentMonth))
      .map((event) => format(new Date(event.date), "d"));
  };

  const daysWithEvents = getDaysWithEvents();

  // Handle navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Event handlers
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setNewEvent((prev) => ({ ...prev, date: day }));
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      addEvent({
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description || "",
        date: newEvent.date,
        type: newEvent.type as "study" | "exam" | "assignment" | "other",
        subjectId: newEvent.subjectId,
      });

      setIsEventModalOpen(false);
      setNewEvent({
        title: "",
        description: "",
        type: "study",
        date: selectedDate || new Date(),
      });
    }
  };

  // Event type badges
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "study":
        return <Badge className="bg-blue-500">Study</Badge>;
      case "exam":
        return <Badge className="bg-red-500">Exam</Badge>;
      case "assignment":
        return <Badge className="bg-amber-500">Assignment</Badge>;
      default:
        return <Badge className="bg-gray-500">Other</Badge>;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {format(currentMonth, "MMMM yyyy")}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={prevMonth}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-left"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </Button>
              <Button variant="ghost" size="sm" onClick={nextMonth}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: new Date(monthStart).getDay() }).map(
              (_, i) => (
                <div key={`empty-${i}`} className="h-12 rounded-md"></div>
              )
            )}

            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDate(day);
              const hasEvents = dayEvents.length > 0;

              return (
                <motion.button
                  key={format(day, "d")}
                  className={cn(
                    "h-12 relative flex flex-col items-center justify-center rounded-md transition-all",
                    isToday(day) && "border-2 border-primary",
                    selectedDate &&
                      isSameDay(day, selectedDate) &&
                      "bg-primary/20",
                    !isSameMonth(day, currentMonth) && "text-gray-400",
                    hasEvents && "font-medium"
                  )}
                  whileHover={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day)}
                >
                  <span>{format(day, "d")}</span>

                  {/* Event indicators */}
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((_, i) => (
                        <motion.div
                          key={i}
                          className={cn(
                            "w-1 h-1 rounded-full",
                            i === 0 && "bg-primary",
                            i === 1 && "bg-secondary",
                            i === 2 && "bg-accent"
                          )}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[0.5rem] text-muted-foreground">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected date events display */}
      {selectedDate && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
              <Button size="sm" onClick={() => setIsEventModalOpen(true)}>
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-card/50 rounded-lg border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{event.title}</h3>
                          {getEventTypeBadge(event.type)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEvent(event.id)}
                        className="h-6 w-6 p-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No events for this day. Add one to get started!
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Event Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Event for{" "}
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Event Title
              </label>
              <Input
                value={newEvent.title || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={newEvent.description || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Event Type
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={newEvent.type}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, type: e.target.value as any })
                }
              >
                <option value="study">Study Session</option>
                <option value="exam">Exam</option>
                <option value="assignment">Assignment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEventModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
