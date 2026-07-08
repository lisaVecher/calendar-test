"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { CalendarGrid } from "@/components/CalendarGrid/CalendarGrid";
import { DayModal } from "@/components/DayModal/DayModal";
import { Moodboard } from "@/components/Moodboard/Moodboard";
import { StickerImage } from "@/components/StickerImage/StickerImage";
import { StyleSettings } from "@/components/StyleSettings/StyleSettings";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import type { DayEditorMode, DayEntry, EditorSize, FloatingPosition, Language, MonthData, StickerItem } from "@/types";
import { buildMonthGrid, getMonthKey, monthNamesByLanguage, weekdayLabelsByLanguage } from "@/utils/calendar";
import { clearMonthData, createDefaultMonthData, exportAllMonths, loadMonthData, saveMonthData } from "@/utils/storage";

const LANGUAGE_KEY = "bullet-journal-language";

const labels = {
  uk: {
    toolbar: {
      toolbar: "Панель календаря",
      previousMonth: "Попередній місяць",
      nextMonth: "Наступний місяць",
      photo: "Фото",
      text: "Текст",
      style: "Стиль",
      export: "Експорт",
      clear: "Очистити",
      language: "Мова інтерфейсу"
    },
    calendar: {
      calories: "ккал",
      hasEntry: "Є запис"
    },
    day: {
      dialog: "Запис дня",
      day: "День",
      dragWindow: "Перетягнути вікно",
      dockLeft: "Прикріпити зліва",
      floating: "Зробити плаваючим",
      dockRight: "Прикріпити справа",
      close: "Закрити",
      shortNote: "Коротка замітка",
      mood: "Настрій",
      noMood: "Без настрою",
      moods: {
        calm: "Спокій",
        happy: "Радість",
        focus: "Фокус",
        tired: "Втома",
        dreamy: "Мрійливість"
      },
      caloriePlan: "План калорій",
      calorieActual: "Фактично з'їдено",
      dayColor: "Колір дня",
      marker: "Позначка",
      noMarker: "Немає",
      journal: "Щоденниковий запис",
      journalPlaceholder: "Думки, події, плани...",
      deleteDay: "Видалити дані дня",
      save: "Зберегти",
      resize: "Змінити розмір вікна"
    },
    settings: {
      panel: "Налаштування стилю",
      eyebrow: "Стиль",
      title: "Оформлення сторінки",
      decorativeStyle: "Декоративний стиль",
      themes: {
        minimal: "Мінімальний",
        pastel: "Pastel",
        darkBlue: "Dark blue",
        vintage: "Vintage",
        fantasy: "Fantasy"
      },
      moodboard: "Верхній аркуш",
      pageBg: "Фон",
      calendar: "Календар",
      lines: "Лінії",
      text: "Текст",
      monthTitle: "Назва місяця",
      titleBg: "Фон назви",
      titlePadding: "Відступ фону назви",
      titleRadius: "Заокруглення фону",
      titleFont: "Шрифт назви місяця",
      bodyFont: "Основний шрифт",
      uploadFont: "Завантажити шрифт"
    },
    monthTitle: "Назва місяця",
    layers: "Шари календаря",
    newNote: "нова нотатка",
    clearConfirm: "Очистити всі записи, фото, стікери та стиль цього місяця?"
  },
  en: {
    toolbar: {
      toolbar: "Calendar toolbar",
      previousMonth: "Previous month",
      nextMonth: "Next month",
      photo: "Photo",
      text: "Text",
      style: "Style",
      export: "Export",
      clear: "Clear",
      language: "Interface language"
    },
    calendar: {
      calories: "kcal",
      hasEntry: "Has entry"
    },
    day: {
      dialog: "Day entry",
      day: "Day",
      dragWindow: "Drag window",
      dockLeft: "Dock left",
      floating: "Floating window",
      dockRight: "Dock right",
      close: "Close",
      shortNote: "Short note",
      mood: "Mood",
      noMood: "No mood",
      moods: {
        calm: "Calm",
        happy: "Happy",
        focus: "Focus",
        tired: "Tired",
        dreamy: "Dreamy"
      },
      caloriePlan: "Calorie plan",
      calorieActual: "Actually eaten",
      dayColor: "Day color",
      marker: "Marker",
      noMarker: "None",
      journal: "Journal entry",
      journalPlaceholder: "Thoughts, events, plans...",
      deleteDay: "Delete day data",
      save: "Save",
      resize: "Resize window"
    },
    settings: {
      panel: "Style settings",
      eyebrow: "Style",
      title: "Page appearance",
      decorativeStyle: "Decorative style",
      themes: {
        minimal: "Minimal",
        pastel: "Pastel",
        darkBlue: "Dark blue",
        vintage: "Vintage",
        fantasy: "Fantasy"
      },
      moodboard: "Top sheet",
      pageBg: "Background",
      calendar: "Calendar",
      lines: "Lines",
      text: "Text",
      monthTitle: "Month title",
      titleBg: "Title background",
      titlePadding: "Title background padding",
      titleRadius: "Title background radius",
      titleFont: "Month title font",
      bodyFont: "Body font",
      uploadFont: "Upload font"
    },
    monthTitle: "Month title",
    layers: "Calendar layers",
    newNote: "new note",
    clearConfirm: "Clear all entries, photos, stickers, and style for this month?"
  }
};

function createEmptyDay(dateKey: string): DayEntry {
  return {
    dateKey,
    note: "",
    caloriePlan: "",
    calorieActual: "",
    journal: "",
    mood: "",
    color: "#ffffff",
    marker: ""
  };
}

function readInitialLanguage(): Language {
  if (typeof window === "undefined") return "uk";
  return window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "uk";
}

export default function Home() {
  const today = new Date();
  const [language, setLanguage] = useState<Language>(readInitialLanguage);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const monthKey = useMemo(() => getMonthKey(year, month), [year, month]);
  const [monthData, setMonthData] = useState<MonthData>(() => createDefaultMonthData(monthKey));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [dayEditorMode, setDayEditorMode] = useState<DayEditorMode>("right");
  const [dayEditorPosition, setDayEditorPosition] = useState<FloatingPosition>({ x: 820, y: 90 });
  const [dayEditorSize, setDayEditorSize] = useState<EditorSize>({ width: 430, height: 680 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const t = labels[language];
  const monthNames = monthNamesByLanguage[language];
  const weekdayLabels = weekdayLabelsByLanguage[language];
  const isDockedEditorOpen = Boolean(selectedDate && dayEditorMode !== "floating");

  useEffect(() => {
    setMonthData(loadMonthData(monthKey));
    setSelectedDate(null);
  }, [monthKey]);

  useEffect(() => {
    saveMonthData(monthData);
  }, [monthData]);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    monthData.style.customFonts?.forEach((font) => {
      if (document.fonts.check(`16px "${font.name}"`)) return;
      const face = new FontFace(font.name, `url(${font.dataUrl})`);
      face.load().then((loadedFace) => document.fonts.add(loadedFace)).catch(() => undefined);
    });
  }, [monthData.style.customFonts]);

  const selectedEntry = selectedDate ? monthData.days[selectedDate] ?? createEmptyDay(selectedDate) : null;

  function updateMonthData(updater: (data: MonthData) => MonthData) {
    setMonthData((current) => updater(current));
  }

  function getNextLayer() {
    return Math.max(4, ...monthData.stickers.map((sticker) => sticker.zIndex ?? 4)) + 1;
  }

  function navigateMonth(direction: -1 | 1) {
    const nextDate = new Date(year, month + direction, 1);
    setYear(nextDate.getFullYear());
    setMonth(nextDate.getMonth());
  }

  function addTextSticker() {
    const sticker: StickerItem = {
      id: crypto.randomUUID(),
      kind: "text",
      text: t.newNote,
      x: 28,
      y: 78,
      width: 170,
      height: 80,
      rotation: Math.round(Math.random() * 10 - 5),
      zIndex: getNextLayer(),
      color: monthData.style.textColor
    };
    updateMonthData((data) => ({ ...data, stickers: [...data.stickers, sticker] }));
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const sticker: StickerItem = {
        id: crypto.randomUUID(),
        kind: "image",
        src: String(reader.result),
        x: 46,
        y: 48,
        width: 180,
        height: 140,
        rotation: Math.round(Math.random() * 12 - 6),
        zIndex: getNextLayer()
      };
      updateMonthData((data) => ({ ...data, stickers: [...data.stickers, sticker] }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function updateSticker(sticker: StickerItem) {
    updateMonthData((data) => ({
      ...data,
      stickers: data.stickers.map((item) => (item.id === sticker.id ? sticker : item))
    }));
  }

  function deleteSticker(id: string) {
    updateMonthData((data) => ({ ...data, stickers: data.stickers.filter((sticker) => sticker.id !== id) }));
  }

  function changeStickerLayer(id: string, direction: "up" | "down") {
    updateMonthData((data) => {
      const current = data.stickers.find((sticker) => sticker.id === id);
      if (!current) return data;
      const layers = data.stickers.map((sticker) => sticker.zIndex ?? 4);
      const nextLayer = direction === "up" ? Math.max(...layers) + 1 : Math.min(...layers) - 1;
      return {
        ...data,
        stickers: data.stickers.map((sticker) => (sticker.id === id ? { ...sticker, zIndex: nextLayer } : sticker))
      };
    });
  }

  function exportData() {
    const blob = new Blob([exportAllMonths()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bullet-journal-calendar.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearCurrentMonth() {
    const confirmed = window.confirm(t.clearConfirm);
    if (!confirmed) return;
    clearMonthData(monthKey);
    setMonthData(createDefaultMonthData(monthKey));
  }

  return (
    <main
      className={`appShell theme-${monthData.style.theme} ${isDockedEditorOpen ? `appShell--editor${dayEditorMode === "left" ? "Left" : "Right"}` : ""}`}
      style={
        {
          "--page-bg": monthData.style.pageBg,
          "--text-color": monthData.style.textColor,
          "--body-font": monthData.style.bodyFont,
          "--title-font": monthData.style.titleFont,
          "--day-editor-width": `${dayEditorSize.width}px`
        } as React.CSSProperties
      }
    >
      <Toolbar
        month={month}
        year={year}
        language={language}
        labels={t.toolbar}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onLanguageChange={setLanguage}
        onPrevious={() => navigateMonth(-1)}
        onNext={() => navigateMonth(1)}
        onAddImage={() => fileInputRef.current?.click()}
        onAddText={addTextSticker}
        onToggleSettings={() => setShowSettings((value) => !value)}
        onExport={exportData}
        onClear={clearCurrentMonth}
      />

      <input ref={fileInputRef} className="hiddenInput" type="file" accept="image/*" onChange={handleImageUpload} />

      <div className={`journalLayout ${showSettings ? "journalLayout--withSettings" : ""}`}>
        <div className="monthStack">
          <section className="monthHeader" aria-label={t.monthTitle}>
            <p>{year}</p>
            <h1
              style={{
                color: monthData.style.monthTitleColor,
                background: monthData.style.monthTitleBg,
                padding: monthData.style.monthTitlePadding,
                borderRadius: monthData.style.monthTitleRadius
              }}
            >
              {monthNames[month]}
            </h1>
          </section>

          <Moodboard background={monthData.style.moodboardBg} />

          <CalendarGrid
            cells={cells}
            entries={monthData.days}
            style={monthData.style}
            weekdayLabels={weekdayLabels}
            labels={t.calendar}
            onOpenDay={setSelectedDate}
          />

          <div className="canvasLayer" aria-label={t.layers}>
            {monthData.stickers.map((sticker) => (
              <StickerImage key={sticker.id} sticker={sticker} onChange={updateSticker} onDelete={deleteSticker} onLayerChange={changeStickerLayer} />
            ))}
          </div>
        </div>

        {showSettings ? <StyleSettings style={monthData.style} labels={t.settings} onChange={(style) => updateMonthData((data) => ({ ...data, style }))} /> : null}
      </div>

      {selectedEntry ? (
        <DayModal
          entry={selectedEntry}
          mode={dayEditorMode}
          floatingPosition={dayEditorPosition}
          editorSize={dayEditorSize}
          labels={t.day}
          onModeChange={setDayEditorMode}
          onFloatingPositionChange={setDayEditorPosition}
          onEditorSizeChange={setDayEditorSize}
          onChange={(entry) => updateMonthData((data) => ({ ...data, days: { ...data.days, [entry.dateKey]: entry } }))}
          onDelete={() => {
            if (!selectedDate) return;
            updateMonthData((data) => {
              const nextDays = { ...data.days };
              delete nextDays[selectedDate];
              return { ...data, days: nextDays };
            });
            setSelectedDate(null);
          }}
          onClose={() => setSelectedDate(null)}
        />
      ) : null}
    </main>
  );
}
