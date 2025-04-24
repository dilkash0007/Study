import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { CalendarEvent } from "@/lib/stores/useCalendar";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: CalendarEvent;
  selectedDate?: Date;
  title?: string;
}

export function EventModal({
  isOpen,
  onClose,
  initialEvent,
  selectedDate,
  title,
}: EventModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {title || (initialEvent ? "Edit Event" : "Create Event")}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          initialEvent={initialEvent}
          selectedDate={selectedDate}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
