"use client";

import { ChangeEvent } from "react";
import type { CustomFont, MonthStyle, ThemeStyle } from "@/types";

interface StyleSettingsProps {
  style: MonthStyle;
  onChange: (style: MonthStyle) => void;
}

const themes: Record<ThemeStyle, Partial<MonthStyle>> = {
  minimal: {
    theme: "minimal",
    moodboardBg: "#f6f4ef",
    pageBg: "#fbfaf7",
    calendarBg: "#ffffff",
    lineColor: "#d8d3ca",
    textColor: "#2d2b29",
    monthTitleColor: "#2d2b29",
    monthTitleBg: "transparent"
  },
  pastel: {
    theme: "pastel",
    moodboardBg: "#f9dfe8",
    pageBg: "#fff7ec",
    calendarBg: "#fffefd",
    lineColor: "#d9bfc8",
    textColor: "#40363a",
    monthTitleColor: "#40363a",
    monthTitleBg: "#fff1f6"
  },
  darkBlue: {
    theme: "darkBlue",
    moodboardBg: "#27364d",
    pageBg: "#172234",
    calendarBg: "#f6f8fb",
    lineColor: "#8aa0bf",
    textColor: "#182337",
    monthTitleColor: "#f6f8fb",
    monthTitleBg: "#27364d"
  },
  vintage: {
    theme: "vintage",
    moodboardBg: "#ead8bd",
    pageBg: "#f7ecd8",
    calendarBg: "#fff9ed",
    lineColor: "#a7825d",
    textColor: "#4d3525",
    monthTitleColor: "#4d3525",
    monthTitleBg: "#ead8bd"
  },
  fantasy: {
    theme: "fantasy",
    moodboardBg: "#dcd3ff",
    pageBg: "#f7f0ff",
    calendarBg: "#fffaff",
    lineColor: "#9b83c6",
    textColor: "#33264f",
    monthTitleColor: "#33264f",
    monthTitleBg: "#efe8ff"
  }
};

const titleFonts = [
  "Georgia, serif",
  "Garamond, serif",
  "Palatino Linotype, serif",
  "Baskerville, serif",
  "Didot, serif",
  "Trebuchet MS, sans-serif",
  "Verdana, sans-serif",
  "Arial Rounded MT Bold, Arial, sans-serif",
  "Brush Script MT, cursive",
  "Lucida Handwriting, cursive",
  "Segoe Script, cursive",
  "Courier New, monospace"
];

const bodyFonts = [
  "Inter, Arial, sans-serif",
  "Arial, sans-serif",
  "Trebuchet MS, sans-serif",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "Georgia, serif",
  "Garamond, serif",
  "Palatino Linotype, serif",
  "Courier New, monospace",
  "Segoe UI, sans-serif"
];

function fontLabel(font: string) {
  return font.replace(/"/g, "").split(",")[0];
}

export function StyleSettings({ style, onChange }: StyleSettingsProps) {
  const customFonts = style.customFonts ?? [];
  const customFontValues = customFonts.map((font) => `"${font.name}", sans-serif`);
  const allTitleFonts = [...titleFonts, ...customFontValues];
  const allBodyFonts = [...bodyFonts, ...customFontValues];

  function patch(next: Partial<MonthStyle>) {
    onChange({ ...style, ...next });
  }

  function uploadFont(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const fontName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9А-Яа-яІіЇїЄєҐґ _-]/g, "").trim() || "Custom font";
    const reader = new FileReader();
    reader.onload = () => {
      const nextFont: CustomFont = { name: fontName, dataUrl: String(reader.result) };
      patch({
        customFonts: [...customFonts.filter((font) => font.name !== fontName), nextFont],
        titleFont: `"${fontName}", sans-serif`
      });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <aside className="settingsPanel" aria-label="Налаштування стилю">
      <div>
        <span className="eyebrow">Стиль</span>
        <h2>Оформлення сторінки</h2>
      </div>

      <label>
        Декоративний стиль
        <select value={style.theme} onChange={(event) => patch(themes[event.target.value as ThemeStyle])}>
          <option value="minimal">Мінімальний</option>
          <option value="pastel">Pastel</option>
          <option value="darkBlue">Dark blue</option>
          <option value="vintage">Vintage</option>
          <option value="fantasy">Fantasy</option>
        </select>
      </label>

      <div className="swatchGrid">
        <label>
          Верхній аркуш
          <input type="color" value={style.moodboardBg} onChange={(event) => patch({ moodboardBg: event.target.value })} />
        </label>
        <label>
          Фон
          <input type="color" value={style.pageBg} onChange={(event) => patch({ pageBg: event.target.value })} />
        </label>
        <label>
          Календар
          <input type="color" value={style.calendarBg} onChange={(event) => patch({ calendarBg: event.target.value })} />
        </label>
        <label>
          Лінії
          <input type="color" value={style.lineColor} onChange={(event) => patch({ lineColor: event.target.value })} />
        </label>
        <label>
          Текст
          <input type="color" value={style.textColor} onChange={(event) => patch({ textColor: event.target.value })} />
        </label>
        <label>
          Назва місяця
          <input type="color" value={style.monthTitleColor} onChange={(event) => patch({ monthTitleColor: event.target.value })} />
        </label>
        <label>
          Фон назви
          <input
            type="color"
            value={style.monthTitleBg === "transparent" ? "#ffffff" : style.monthTitleBg}
            onChange={(event) => patch({ monthTitleBg: event.target.value })}
          />
        </label>
      </div>

      <div className="titleShapeGrid">
        <label>
          Відступ фону назви
          <input
            type="range"
            min="0"
            max="42"
            value={style.monthTitlePadding}
            onChange={(event) => patch({ monthTitlePadding: Number(event.target.value) })}
          />
        </label>
        <label>
          Заокруглення фону
          <input
            type="range"
            min="0"
            max="60"
            value={style.monthTitleRadius}
            onChange={(event) => patch({ monthTitleRadius: Number(event.target.value) })}
          />
        </label>
      </div>

      <label>
        Шрифт назви місяця
        <select value={style.titleFont} onChange={(event) => patch({ titleFont: event.target.value })}>
          {allTitleFonts.map((font) => (
            <option key={font} value={font}>
              {fontLabel(font)}
            </option>
          ))}
        </select>
      </label>

      <label>
        Основний шрифт
        <select value={style.bodyFont} onChange={(event) => patch({ bodyFont: event.target.value })}>
          {allBodyFonts.map((font) => (
            <option key={font} value={font}>
              {fontLabel(font)}
            </option>
          ))}
        </select>
      </label>

      <label>
        Завантажити шрифт
        <input type="file" accept=".ttf,.otf,.woff,.woff2,font/*" onChange={uploadFont} />
      </label>
    </aside>
  );
}
