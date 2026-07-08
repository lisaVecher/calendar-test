"use client";

import type { CalendarCell, DayEntry, MonthStyle } from "@/types";

interface CalendarGridProps {
  cells: CalendarCell[];
  entries: Record<string, DayEntry>;
  style: MonthStyle;
  weekdayLabels: string[];
  labels: {
    calories: string;
    hasEntry: string;
  };
  onOpenDay: (dateKey: string) => void;
}

export function CalendarGrid({ cells, entries, style, weekdayLabels, labels, onOpenDay }: CalendarGridProps) {
  return (
    <section className="paper calendarPaper" style={{ background: style.calendarBg, color: style.textColor }}>
      <div className="calendarWeekdays">
        {weekdayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="calendarGrid" style={{ borderColor: style.lineColor }}>
        {cells.map((cell) => {
          const entry = entries[cell.dateKey];
          const hasDetails = Boolean(entry?.journal || entry?.note || entry?.calorieActual || entry?.caloriePlan || entry?.marker);

          return (
            <button
              key={cell.dateKey}
              className={`dayCell ${cell.isCurrentMonth ? "" : "dayCell--muted"} ${cell.isToday ? "dayCell--today" : ""}`}
              style={{ borderColor: style.lineColor, background: entry?.color || undefined }}
              onClick={() => onOpenDay(cell.dateKey)}
            >
              <span className="dayCell__number">{cell.dayNumber}</span>
              {entry?.marker ? <span className="dayCell__marker">{entry.marker}</span> : null}
              {entry?.note ? <span className="dayCell__note">{entry.note}</span> : null}
              {(entry?.caloriePlan || entry?.calorieActual) && (
                <span className="dayCell__calories">
                  {entry.calorieActual || "0"}/{entry.caloriePlan || "0"} {labels.calories}
                </span>
              )}
              {hasDetails ? <span className="dayCell__dot" aria-label={labels.hasEntry} /> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
