"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { CalendarGrid } from "@/components/CalendarGrid/CalendarGrid";
import { DayModal } from "@/components/DayModal/DayModal";
import { Moodboard } from "@/components/Moodboard/Moodboard";
import { StickerImage } from "@/components/StickerImage/StickerImage";
import { StyleSettings } from "@/components/StyleSettings/StyleSettings";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import type { DayEntry, MonthData, StickerItem } from "@/types";
import { buildMonthGrid, getMonthKey, monthNames } from "@/utils/calendar";
import { clearMonthData, createDefaultMonthData, exportAllMonths, loadMonthData, saveMonthData } from "@/utils/storage";

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

export default function Home() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const monthKey = useMemo(() => getMonthKey(year, month), [year, month]);
  const [monthData, setMonthData] = useState<MonthData>(() => createDefaultMonthData(monthKey));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  useEffect(() => {
    setMonthData(loadMonthData(monthKey));
    setSelectedDate(null);
  }, [monthKey]);

  useEffect(() => {
    saveMonthData(monthData);
  }, [monthData]);

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
      text: "нова нотатка",
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
    const confirmed = window.confirm("Очистити всі записи, фото, стікери та стиль цього місяця?");
    if (!confirmed) return;
    clearMonthData(monthKey);
    setMonthData(createDefaultMonthData(monthKey));
  }

  return (
    <main
      className={`appShell theme-${monthData.style.theme}`}
      style={
        {
          "--page-bg": monthData.style.pageBg,
          "--text-color": monthData.style.textColor,
          "--body-font": monthData.style.bodyFont,
          "--title-font": monthData.style.titleFont
        } as React.CSSProperties
      }
    >
      <Toolbar
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onPrevious={() => navigateMonth(-1)}
        onNext={() => navigateMonth(1)}
        onAddImage={() => fileInputRef.current?.click()}
        onAddText={addTextSticker}
        onToggleSettings={() => setShowSettings((value) => !value)}
        onExport={exportData}
        onClear={clearCurrentMonth}
      />

      <input ref={fileInputRef} className="hiddenInput" type="file" accept="image/*" onChange={handleImageUpload} />

      <div className="journalLayout">
        <div className="monthStack">
          <section className="monthHeader" aria-label="Назва місяця">
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

          <CalendarGrid cells={cells} entries={monthData.days} style={monthData.style} onOpenDay={setSelectedDate} />

          <div className="canvasLayer" aria-label="Шари календаря">
            {monthData.stickers.map((sticker) => (
              <StickerImage
                key={sticker.id}
                sticker={sticker}
                onChange={updateSticker}
                onDelete={deleteSticker}
                onLayerChange={changeStickerLayer}
              />
            ))}
          </div>
        </div>

        {showSettings ? (
          <StyleSettings style={monthData.style} onChange={(style) => updateMonthData((data) => ({ ...data, style }))} />
        ) : null}
      </div>

      {selectedEntry ? (
        <DayModal
          entry={selectedEntry}
          onChange={(entry) =>
            updateMonthData((data) => ({ ...data, days: { ...data.days, [entry.dateKey]: entry } }))
          }
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
