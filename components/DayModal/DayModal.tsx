"use client";

import { X } from "lucide-react";
import type { DayEntry } from "@/types";

interface DayModalProps {
  entry: DayEntry;
  onChange: (entry: DayEntry) => void;
  onClose: () => void;
  onDelete: () => void;
}

export function DayModal({ entry, onChange, onClose, onDelete }: DayModalProps) {
  function update(field: keyof DayEntry, value: string) {
    onChange({ ...entry, [field]: value });
  }

  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="Запис дня">
      <div className="dayModal">
        <div className="dayModal__header">
          <div>
            <span className="eyebrow">День</span>
            <h2>{entry.dateKey}</h2>
          </div>
          <button className="iconButton" onClick={onClose} aria-label="Закрити">
            <X size={20} />
          </button>
        </div>

        <div className="formGrid">
          <label>
            Коротка замітка
            <input value={entry.note} onChange={(event) => update("note", event.target.value)} maxLength={80} />
          </label>
          <label>
            Настрій
            <select value={entry.mood} onChange={(event) => update("mood", event.target.value)}>
              <option value="">Без настрою</option>
              <option value="calm">Спокій</option>
              <option value="happy">Радість</option>
              <option value="focus">Фокус</option>
              <option value="tired">Втома</option>
              <option value="dreamy">Мрійливість</option>
            </select>
          </label>
          <label>
            План калорій
            <input
              value={entry.caloriePlan}
              onChange={(event) => update("caloriePlan", event.target.value)}
              inputMode="numeric"
            />
          </label>
          <label>
            Фактично з'їдено
            <input
              value={entry.calorieActual}
              onChange={(event) => update("calorieActual", event.target.value)}
              inputMode="numeric"
            />
          </label>
          <label>
            Колір дня
            <input type="color" value={entry.color || "#ffffff"} onChange={(event) => update("color", event.target.value)} />
          </label>
          <label>
            Позначка
            <select value={entry.marker} onChange={(event) => update("marker", event.target.value)}>
              <option value="">Немає</option>
              <option value="★">★</option>
              <option value="♡">♡</option>
              <option value="✓">✓</option>
              <option value="!">!</option>
              <option value="•">•</option>
            </select>
          </label>
        </div>

        <label className="journalField">
          Щоденниковий запис
          <textarea
            value={entry.journal}
            onChange={(event) => update("journal", event.target.value)}
            placeholder="Думки, події, плани..."
          />
        </label>

        <div className="modalActions">
          <button className="dangerButton" onClick={onDelete}>
            Видалити дані дня
          </button>
          <button className="primaryButton" onClick={onClose}>
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}
