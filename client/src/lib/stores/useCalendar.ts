import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type EventType = "task" | "reminder" | "deadline" | "meeting" | "other";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  reminderTime?: Date;
  type: EventType;
  completed?: boolean;
  subjectId?: string;
}

interface CalendarState {
  events: CalendarEvent[];
  selectedDate: Date | null;

  // Actions
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: Date) => CalendarEvent[];
  getEventsByDateRange: (startDate: Date, endDate: Date) => CalendarEvent[];
  getEventsBySubject: (subjectId: string) => CalendarEvent[];
  setSelectedDate: (date: Date | null) => void;
  toggleEventCompleted: (id: string) => void;
}

export const useCalendar = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      selectedDate: null,

      addEvent: (eventData) => {
        const event: CalendarEvent = {
          ...eventData,
          id: uuidv4(),
          date: new Date(eventData.date),
        };

        set((state) => ({
          events: [...state.events, event],
        }));
      },

      updateEvent: (updatedEvent) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },

      getEventsByDate: (date) => {
        const { events } = get();
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        return events.filter((event) => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === targetDate.getTime();
        });
      },

      getEventsByDateRange: (startDate, endDate) => {
        const { events } = get();
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= start && eventDate <= end;
        });
      },

      getEventsBySubject: (subjectId) => {
        const { events } = get();
        return events.filter((event) => event.subjectId === subjectId);
      },

      setSelectedDate: (date) => {
        set({ selectedDate: date });
      },

      toggleEventCompleted: (id) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, completed: !event.completed } : event
          ),
        }));
      },
    }),
    {
      name: "calendar-storage",
    }
  )
);
