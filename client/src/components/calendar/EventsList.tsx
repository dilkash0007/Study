import React, { useState } from "react";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { CalendarEvent, useCalendar } from "@/lib/stores/useCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EventModal } from "./EventModal";
import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";

interface EventsListProps {
  title?: string;
  dayRange?: number;
  maxEvents?: number;
  showHeader?: boolean;
  filterType?: string;
  subjectId?: string;
}

export function EventsList({
  title = "Upcoming Events",
  dayRange = 7,
  maxEvents = 10,
  showHeader = true,
  filterType,
  subjectId,
}: EventsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  );

  const { getEventsByDateRange, toggleEventCompleted, deleteEvent } =
    useCalendar();

  const today = new Date();
  const endDate = addDays(today, dayRange);

  let events = getEventsByDateRange(today, endDate);

  // Apply additional filters if needed
  if (filterType) {
    events = events.filter((event) => event.type === filterType);
  }

  if (subjectId) {
    events = events.filter((event) => event.subjectId === subjectId);
  }

  // Sort events by date
  events = events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, maxEvents);

  const handleToggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleEventCompleted(id);
  };

  const handleDeleteEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEvent(id);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(undefined);
  };

  const formatEventDate = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "EEE, MMM d");
    }
  };

  return (
    <>
      <Card className="w-full">
        {showHeader && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No upcoming events
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "border p-3 rounded-md transition hover:bg-accent/50 cursor-pointer relative",
                    event.completed && "bg-muted/30"
                  )}
                  onClick={() => handleEditEvent(event)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={event.completed}
                      onCheckedChange={() => {}}
                      onClick={(e) => handleToggleComplete(event.id, e)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            "font-medium line-clamp-1",
                            event.completed &&
                              "line-through text-muted-foreground"
                          )}
                        >
                          {event.title}
                        </p>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              event.type === "task" && "bg-blue-100",
                              event.type === "deadline" && "bg-red-100",
                              event.type === "meeting" && "bg-green-100",
                              event.type === "reminder" && "bg-yellow-100"
                            )}
                          >
                            {event.type}
                          </Badge>
                        </div>
                      </div>

                      {event.description && (
                        <p
                          className={cn(
                            "text-sm text-muted-foreground mt-1 line-clamp-2",
                            event.completed && "line-through"
                          )}
                        >
                          {event.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatEventDate(new Date(event.date))}
                          {event.reminderTime &&
                            ` • ${format(
                              new Date(event.reminderTime),
                              "h:mm a"
                            )}`}
                        </span>

                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={(e) => handleDeleteEvent(event.id, e)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialEvent={selectedEvent}
      />
    </>
  );
}
