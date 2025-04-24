import React, { useState } from "react";
import { PageLayout } from "@/components/ui/PageLayout";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { EventsList } from "@/components/Calendar/EventsList";
import { CalendarEvent } from "@/lib/stores/useCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventModal } from "@/components/Calendar/EventModal";

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedEvent(undefined);
    setSelectedDate(new Date());
    setIsModalOpen(true);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(undefined);
    setSelectedDate(null);
  };

  return (
    <PageLayout title="Calendar">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Calendar & Events</h1>
          <Button onClick={handleOpenCreateModal}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView
              onSelectDate={handleSelectDate}
              onSelectEvent={handleSelectEvent}
            />
          </div>
          <div>
            <EventsList title="Upcoming Events" dayRange={14} maxEvents={8} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <EventsList
            title="Tasks"
            filterType="task"
            dayRange={30}
            maxEvents={5}
          />
          <EventsList
            title="Deadlines"
            filterType="deadline"
            dayRange={30}
            maxEvents={5}
          />
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialEvent={selectedEvent}
        selectedDate={selectedDate || undefined}
      />
    </PageLayout>
  );
}
