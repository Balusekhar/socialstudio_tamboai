import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const scheduledPosts = [
  { day: 3, title: "Summer vibes reel", time: "10:00 AM" },
  { day: 5, title: "Behind the scenes", time: "2:30 PM" },
  { day: 10, title: "Product showcase", time: "6:00 PM" },
  { day: 14, title: "Tutorial clip", time: "11:00 AM" },
  { day: 19, title: "Q&A reel", time: "4:00 PM" },
  { day: 22, title: "Collab announcement", time: "9:00 AM" },
  { day: 27, title: "Weekly recap", time: "1:00 PM" },
];

function getDaysInGrid() {
  const cells = [];
  for (let i = 1; i <= 28; i++) {
    cells.push(i);
  }
  return cells;
}

export default function CalendarPage() {
  const gridDays = getDaysInGrid();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
            Calendar
          </h1>
          <p className="text-muted-foreground">
            Plan and schedule your reels for the week ahead.
          </p>
        </div>
        <Button className="bg-brand hover:bg-brand/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          Schedule Reel
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">February 2026</h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Today
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {days.map((day) => (
            <div
              key={day}
              className="p-3 text-xs font-semibold text-muted-foreground text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Date Cells */}
        <div className="grid grid-cols-7">
          {gridDays.map((day) => {
            const post = scheduledPosts.find((p) => p.day === day);
            const isToday = day === 6;

            return (
              <div
                key={day}
                className={`min-h-[90px] p-2 border-b border-r border-border last:border-r-0 hover:bg-muted/50 transition-colors cursor-pointer ${
                  isToday ? "bg-brand/5" : ""
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isToday
                      ? "bg-brand text-white w-6 h-6 rounded-full inline-flex items-center justify-center"
                      : "text-foreground"
                  }`}
                >
                  {day}
                </span>
                {post && (
                  <div className="mt-1.5 bg-brand/10 border border-brand/20 rounded-md p-1.5">
                    <p className="text-[11px] font-medium text-foreground truncate">
                      {post.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {post.time}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand" />
          Upcoming Posts
        </h3>
        <div className="space-y-2">
          {scheduledPosts.slice(0, 4).map((post) => (
            <div
              key={post.day}
              className="flex items-center gap-3 bg-card border border-border rounded-lg p-3"
            >
              <div className="w-9 h-9 bg-brand/10 rounded-lg flex items-center justify-center text-brand text-xs font-bold">
                {post.day}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground">{post.time}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                Edit
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
