export type ThemeStyle = "minimal" | "pastel" | "darkBlue" | "vintage" | "fantasy";

export type StickerKind = "image" | "text";

export type Language = "uk" | "en";

export interface StickerItem {
  id: string;
  kind: StickerKind;
  src?: string;
  text?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex?: number;
  color?: string;
}

export interface DayEntry {
  dateKey: string;
  note: string;
  caloriePlan: string;
  calorieActual: string;
  journal: string;
  mood: string;
  color: string;
  marker: string;
}

export interface MonthStyle {
  theme: ThemeStyle;
  moodboardBg: string;
  pageBg: string;
  calendarBg: string;
  lineColor: string;
  textColor: string;
  monthTitleColor: string;
  monthTitleBg: string;
  monthTitlePadding: number;
  monthTitleRadius: number;
  titleFont: string;
  bodyFont: string;
  customFonts?: CustomFont[];
}

export interface CustomFont {
  name: string;
  dataUrl: string;
}

export interface MonthData {
  monthKey: string;
  stickers: StickerItem[];
  days: Record<string, DayEntry>;
  style: MonthStyle;
}

export interface CalendarCell {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export type DayEditorMode = "right" | "left" | "floating";

export interface FloatingPosition {
  x: number;
  y: number;
}

export interface EditorSize {
  width: number;
  height: number;
}
