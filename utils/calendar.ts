import type { CalendarCell } from "@/types";

export const monthNames = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень"
];

export const weekdayLabels = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];

export function getMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function isSameDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayOffset);
  const today = new Date();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      dateKey: getDateKey(date),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: isSameDate(date, today)
    };
  });
}
