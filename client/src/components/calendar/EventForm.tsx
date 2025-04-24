import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarEvent, useCalendar } from "@/lib/stores/useCalendar";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  type: z.enum(["task", "reminder", "deadline", "meeting", "other"]),
  completed: z.boolean().default(false),
  subjectId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  initialEvent?: CalendarEvent;
  selectedDate?: Date;
  onClose?: () => void;
}

export function EventForm({
  initialEvent,
  selectedDate,
  onClose,
}: EventFormProps) {
  const { addEvent, updateEvent } = useCalendar();

  const defaultValues: Partial<FormValues> = {
    title: "",
    description: "",
    date: selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
    time: "",
    type: "task",
    completed: false,
    subjectId: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialEvent) {
      const eventDate = new Date(initialEvent.date);

      form.reset({
        title: initialEvent.title,
        description: initialEvent.description || "",
        date: format(eventDate, "yyyy-MM-dd"),
        time: initialEvent.reminderTime
          ? format(new Date(initialEvent.reminderTime), "HH:mm")
          : "",
        type: initialEvent.type || "task",
        completed: initialEvent.completed || false,
        subjectId: initialEvent.subjectId || "",
      });
    } else if (selectedDate) {
      form.setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [initialEvent, selectedDate, form]);

  const onSubmit = (values: FormValues) => {
    const dateObj = new Date(values.date);

    if (values.time) {
      const [hours, minutes] = values.time.split(":").map(Number);
      dateObj.setHours(hours, minutes);
    }

    const eventData: Omit<CalendarEvent, "id"> = {
      title: values.title,
      description: values.description,
      date: dateObj,
      type: values.type,
      completed: values.completed,
    };

    if (values.time) {
      const reminderTime = new Date(dateObj);
      eventData.reminderTime = reminderTime;
    }

    if (values.subjectId && values.subjectId.trim() !== "") {
      eventData.subjectId = values.subjectId;
    }

    if (initialEvent) {
      updateEvent({ ...eventData, id: initialEvent.id });
    } else {
      addEvent(eventData);
    }

    form.reset(defaultValues);
    if (onClose) onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialEvent ? "Edit Event" : "Create Event"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Time (optional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject ID (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Associate this event with a specific subject or course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as completed</FormLabel>
                    <FormDescription>
                      Check this if the event has been completed
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialEvent ? "Update" : "Create"} Event
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
