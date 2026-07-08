"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, ImagePlus, Languages, MoreHorizontal, Palette, RotateCcw, Type } from "lucide-react";
import type { Language } from "@/types";
import { monthNamesByLanguage } from "@/utils/calendar";

interface ToolbarProps {
  month: number;
  year: number;
  language: Language;
  labels: {
    toolbar: string;
    previousMonth: string;
    nextMonth: string;
    photo: string;
    text: string;
    style: string;
    export: string;
    clear: string;
    language: string;
  };
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onLanguageChange: (language: Language) => void;
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
  language,
  labels,
  onMonthChange,
  onYearChange,
  onLanguageChange,
  onPrevious,
  onNext,
  onAddImage,
  onAddText,
  onToggleSettings,
  onExport,
  onClear
}: ToolbarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const years = Array.from({ length: 15 }, (_, index) => new Date().getFullYear() - 7 + index);
  const monthNames = monthNamesByLanguage[language];

  const secondaryActions = (
    <>
      <button onClick={onToggleSettings}>
        <Palette size={18} />
        {labels.style}
      </button>
      <button onClick={onExport}>
        <Download size={18} />
        {labels.export}
      </button>
      <button className="dangerButton" onClick={onClear}>
        <RotateCcw size={18} />
        {labels.clear}
      </button>
      <label className="languageControl" aria-label={labels.language}>
        <Languages size={17} />
        <select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)}>
          <option value="uk">UA</option>
          <option value="en">EN</option>
        </select>
      </label>
    </>
  );

  return (
    <header className="toolbar" aria-label={labels.toolbar}>
      <div className="toolbar__date">
        <button className="iconButton" onClick={onPrevious} aria-label={labels.previousMonth}>
          <ChevronLeft size={20} />
        </button>
        <select value={month} onChange={(event) => onMonthChange(Number(event.target.value))} aria-label="Month">
          {monthNames.map((name, index) => (
            <option key={name} value={index}>
              {name}
            </option>
          ))}
        </select>
        <select value={year} onChange={(event) => onYearChange(Number(event.target.value))} aria-label="Year">
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
        <button className="iconButton" onClick={onNext} aria-label={labels.nextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="toolbar__actions">
        <button onClick={onAddImage}>
          <ImagePlus size={18} />
          {labels.photo}
        </button>
        <button onClick={onAddText}>
          <Type size={18} />
          {labels.text}
        </button>
        <div className="toolbar__secondaryActions">{secondaryActions}</div>
        <div className="toolbar__more">
          <button className="iconButton" onClick={() => setMoreOpen((value) => !value)} aria-label="More actions" aria-expanded={moreOpen}>
            <MoreHorizontal size={20} />
          </button>
          {moreOpen ? (
            <div className="toolbar__moreMenu" onClick={() => setMoreOpen(false)}>
              {secondaryActions}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
