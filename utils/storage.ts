import type { MonthData, MonthStyle } from "@/types";

const STORAGE_PREFIX = "bullet-journal-month:";

export const defaultStyle: MonthStyle = {
  theme: "pastel",
  moodboardBg: "#f9dfe8",
  pageBg: "#fffaf3",
  calendarBg: "#fffefd",
  lineColor: "#d9bfc8",
  textColor: "#40363a",
  monthTitleColor: "#40363a",
  monthTitleBg: "transparent",
  monthTitlePadding: 0,
  monthTitleRadius: 18,
  titleFont: "Georgia, serif",
  bodyFont: "Inter, Arial, sans-serif",
  customFonts: []
};

export function createDefaultMonthData(monthKey: string): MonthData {
  return {
    monthKey,
    stickers: [
      {
        id: crypto.randomUUID(),
        kind: "text",
        text: "my month",
        x: 8,
        y: 8,
        width: 180,
        height: 58,
        rotation: -4,
        zIndex: 4,
        color: "#7b4f61"
      }
    ],
    days: {},
    style: defaultStyle
  };
}

export function loadMonthData(monthKey: string): MonthData {
  if (typeof window === "undefined") return createDefaultMonthData(monthKey);

  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${monthKey}`);
  if (!raw) return createDefaultMonthData(monthKey);

  try {
    const parsed = JSON.parse(raw) as MonthData;
    const stickers = (parsed.stickers ?? []).map((sticker, index) => ({
      ...sticker,
      zIndex: sticker.zIndex ?? index + 4
    }));

    return {
      ...createDefaultMonthData(monthKey),
      ...parsed,
      stickers,
      style: { ...defaultStyle, ...parsed.style }
    };
  } catch {
    return createDefaultMonthData(monthKey);
  }
}

export function saveMonthData(data: MonthData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${STORAGE_PREFIX}${data.monthKey}`, JSON.stringify(data));
}

export function clearMonthData(monthKey: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`${STORAGE_PREFIX}${monthKey}`);
}

export function exportAllMonths() {
  if (typeof window === "undefined") return "{}";

  const exported: Record<string, MonthData> = {};
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (key?.startsWith(STORAGE_PREFIX)) {
      exported[key.replace(STORAGE_PREFIX, "")] = JSON.parse(window.localStorage.getItem(key) ?? "{}");
    }
  }

  return JSON.stringify(exported, null, 2);
}
