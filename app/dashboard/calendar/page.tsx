"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addRow, listRows, updateRow, deleteRow } from "@/app/lib/db";
import { getUser, getErrorMessage } from "@/app/lib/auth";
import { Query } from "@/app/lib/appwrite";

const CALENDAR_TABLE_ID = process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_TABLE_ID!;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface CalendarEvent {
  $id: string;
  title: string;
  date: string;
  note: string;
}

/** Parse stored date (YYYY-MM-DD or ISO string) as local calendar date so the event shows on the correct day in all timezones. */
function parseEventDate(dateStr: string): Date {
  const dateOnly = dateStr.slice(0, 10);
  const [y, m, d] = dateOnly.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  // ---------- Init user ----------
  useEffect(() => {
    (async () => {
      const result = await getUser();
      if (result.success && result.data) {
        setUserId(result.data.rows[0].$id);
      }
    })();
  }, []);

  // ---------- Fetch events ----------
  const fetchEvents = useCallback(async () => {
    if (!userId) return;
    setFetching(true);
    try {
      const result = await listRows(CALENDAR_TABLE_ID, [
        Query.equal("owner", userId),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setEvents((result as any).rows ?? []);
    } catch (err) {
      console.error("Failed to fetch calendar events:", err);
    } finally {
      setFetching(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ---------- Calendar grid ----------
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek =
    (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Mon = 0

  const gridCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) gridCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) gridCells.push(d);
  while (gridCells.length % 7 !== 0) gridCells.push(null);

  const isTodayCell = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const getEventsForDay = (day: number) =>
    events.filter((e) => {
      const d = parseEventDate(e.date);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

  // ---------- Navigation ----------
  const prevMonth = () => {
    setSelectedDay(null);
    resetForm();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    setSelectedDay(null);
    resetForm();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(null);
    resetForm();
  };

  // ---------- Form helpers ----------
  const resetForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setTitle("");
    setNote("");
    setError("");
  };

  const handleDayClick = (day: number) => {
    if (selectedDay === day && !showForm) {
      setSelectedDay(null);
      resetForm();
    } else {
      setSelectedDay(day);
      resetForm();
    }
  };

  const startAdd = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingEvent(null);
    setTitle("");
    setNote("");
    setShowForm(true);
    setError("");
  };

  const startEdit = (event: CalendarEvent, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingEvent(event);
    setTitle(event.title);
    setNote(event.note || "");
    setShowForm(true);
    setError("");
  };

  // ---------- CRUD ----------
  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!selectedDay || !userId) return;

    setSaving(true);
    setError("");
    try {
      const dateOnly = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

      if (editingEvent) {
        await updateRow(CALENDAR_TABLE_ID, editingEvent.$id, {
          title: title.trim(),
          note: note.trim(),
          date: dateOnly,
        });
      } else {
        await addRow(CALENDAR_TABLE_ID, {
          title: title.trim(),
          note: note.trim(),
          date: dateOnly,
          owner: userId,
        });
      }

      resetForm();
      await fetchEvents();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSaving(true);
    try {
      await deleteRow(CALENDAR_TABLE_ID, eventId);
      await fetchEvents();
      resetForm();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // ---------- Upcoming events ----------
  const upcomingEvents = events
    .filter((e) => {
      const d = parseEventDate(e.date);
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      return d >= todayStart;
    })
    .sort((a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime())
    .slice(0, 5);

  // ---------- Render ----------
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
            Calendar
          </h1>
          <p className="text-muted-foreground">
            Plan and schedule your content ahead.
          </p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={prevMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={goToToday}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={nextMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS.map((d) => (
            <div
              key={d}
              className="p-3 text-xs font-semibold text-muted-foreground text-center"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date Cells */}
        <div className="grid grid-cols-7">
          {gridCells.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[100px] p-2 border-b border-r border-border bg-muted/20 last:border-r-0"
                />
              );
            }

            const dayEvents = getEventsForDay(day);
            const isSelected = selectedDay === day;
            const isToday = isTodayCell(day);

            return (
              <div
                key={day}
                className={`min-h-[100px] p-2 border-b border-r border-border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-brand/10 ring-2 ring-brand/50 ring-inset"
                    : "hover:bg-muted/50"
                } ${isToday && !isSelected ? "bg-brand/5" : ""}`}
                onClick={() => handleDayClick(day)}
              >
                {/* Day number + add button */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-medium ${
                      isToday
                        ? "bg-brand text-white w-6 h-6 rounded-full inline-flex items-center justify-center"
                        : "text-foreground"
                    }`}
                  >
                    {day}
                  </span>
                  {isSelected && (
                    <button
                      onClick={startAdd}
                      className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand/80 transition-colors"
                      title="Add event"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Event chips */}
                <div className="space-y-1">
                  {dayEvents
                    .slice(0, isSelected ? dayEvents.length : 2)
                    .map((event) => (
                      <div
                        key={event.$id}
                        className="group bg-brand/10 border border-brand/20 rounded-md px-1.5 py-0.5 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDay(day);
                          startEdit(event, e);
                        }}
                      >
                        <p className="text-[11px] font-medium text-foreground truncate flex-1">
                          {event.title}
                        </p>
                        <button
                          onClick={(e) => handleDelete(event.$id, e)}
                          className="hidden group-hover:flex w-4 h-4 items-center justify-center rounded text-muted-foreground hover:text-red-500 shrink-0"
                          title="Delete"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  {!isSelected && dayEvents.length > 2 && (
                    <p className="text-[10px] text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Day Panel */}
        {selectedDay !== null && (
          <div className="border-t border-border p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                {MONTH_NAMES[currentMonth]} {selectedDay}, {currentYear}
              </h3>
              <div className="flex items-center gap-2">
                {!showForm && (
                  <Button
                    size="sm"
                    className="bg-brand hover:bg-brand/90 text-white text-xs gap-1 h-7"
                    onClick={startAdd}
                  >
                    <Plus className="w-3 h-3" />
                    Add Event
                  </Button>
                )}
                <button
                  onClick={() => {
                    setSelectedDay(null);
                    resetForm();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Events list for selected day */}
            {(() => {
              const dayEvents = getEventsForDay(selectedDay);
              if (dayEvents.length === 0 && !showForm) {
                return (
                  <p className="text-sm text-muted-foreground">
                    No events on this day.{" "}
                    <button
                      onClick={startAdd}
                      className="text-brand hover:underline"
                    >
                      Add one
                    </button>
                  </p>
                );
              }
              return (
                <div className="space-y-2 mb-3">
                  {dayEvents.map((event) => (
                    <div
                      key={event.$id}
                      className={`flex items-start gap-3 bg-card border rounded-lg p-3 ${
                        editingEvent?.$id === event.$id
                          ? "border-brand"
                          : "border-border"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {event.title}
                        </p>
                        {event.note && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {event.note}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground h-7 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(event, e);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-red-500"
                          onClick={(e) => handleDelete(event.$id, e)}
                          disabled={saving}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Add / Edit form */}
            {showForm && (
              <div className="bg-card border border-border rounded-lg p-4 max-w-md">
                <h4 className="text-xs font-semibold text-foreground mb-3">
                  {editingEvent ? "Edit Event" : "New Event"}
                </h4>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-muted border border-border rounded-md px-3 py-2 mb-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                />
                <textarea
                  placeholder="Note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-muted border border-border rounded-md px-3 py-2 mb-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
                />
                {error && (
                  <p className="text-xs text-red-500 mb-2">{error}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-brand hover:bg-brand/90 text-white text-xs h-8"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : editingEvent ? (
                      "Update"
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand" />
          Upcoming Events
        </h3>
        {fetching ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No upcoming events. Click on a day to schedule one.
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingEvents.map((event) => {
              const d = parseEventDate(event.date);
              return (
                <div
                  key={event.$id}
                  className="flex items-center gap-3 bg-card border border-border rounded-lg p-3"
                >
                  <div className="w-9 h-9 bg-brand/10 rounded-lg flex items-center justify-center text-brand text-xs font-bold">
                    {d.getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {event.title}
                    </p>
                    {event.note && (
                      <p className="text-xs text-muted-foreground truncate">
                        {event.note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={() => {
                        setCurrentMonth(d.getMonth());
                        setCurrentYear(d.getFullYear());
                        setSelectedDay(d.getDate());
                        startEdit(event);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500"
                      onClick={(e) => handleDelete(event.$id, e)}
                      disabled={saving}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
