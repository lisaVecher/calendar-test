"use client";

import { ChevronLeft, ChevronRight, Download, ImagePlus, Palette, Plus, RotateCcw, Type } from "lucide-react";
import { monthNames } from "@/utils/calendar";

interface ToolbarProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onAddImage: () => void;
  onAddText: () => void;
  onToggleSettings: () => void;
  onExport: () => void;
  onClear: () => void;
}

export function Toolbar({
  month,
  year,
  onMonthChange,
  onYearChange,
  onPrevious,
  onNext,
  onAddImage,
  onAddText,
  onToggleSettings,
  onExport,
  onClear
}: ToolbarProps) {
  const years = Array.from({ length: 15 }, (_, index) => new Date().getFullYear() - 7 + index);

  return (
    <header className="toolbar" aria-label="Панель календаря">
      <div className="toolbar__date">
        <button className="iconButton" onClick={onPrevious} aria-label="Попередній місяць">
          <ChevronLeft size={20} />
        </button>
        <select value={month} onChange={(event) => onMonthChange(Number(event.target.value))}>
          {monthNames.map((name, index) => (
            <option key={name} value={index}>
              {name}
            </option>
          ))}
        </select>
        <select value={year} onChange={(event) => onYearChange(Number(event.target.value))}>
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
        <button className="iconButton" onClick={onNext} aria-label="Наступний місяць">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="toolbar__actions">
        <button onClick={onAddImage}>
          <ImagePlus size={18} />
          Фото
        </button>
        <button onClick={onAddText}>
          <Type size={18} />
          Текст
        </button>
        <button onClick={onToggleSettings}>
          <Palette size={18} />
          Стиль
        </button>
        <button onClick={onExport}>
          <Download size={18} />
          Експорт
        </button>
        <button className="dangerButton" onClick={onClear}>
          <RotateCcw size={18} />
          Очистити
        </button>
      </div>
    </header>
  );
}
