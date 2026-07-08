"use client";

import { PointerEvent, useRef } from "react";
import { GripHorizontal, PanelLeft, PanelRight, Square, X } from "lucide-react";
import type { DayEditorMode, DayEntry, FloatingPosition } from "@/types";

interface DayModalProps {
  entry: DayEntry;
  mode: DayEditorMode;
  floatingPosition: FloatingPosition;
  onModeChange: (mode: DayEditorMode) => void;
  onFloatingPositionChange: (position: FloatingPosition) => void;
  onChange: (entry: DayEntry) => void;
  onClose: () => void;
  onDelete: () => void;
}

export function DayModal({
  entry,
  mode,
  floatingPosition,
  onModeChange,
  onFloatingPositionChange,
  onChange,
  onClose,
  onDelete
}: DayModalProps) {
  const dragStart = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0, active: false });

  function update(field: keyof DayEntry, value: string) {
    onChange({ ...entry, [field]: value });
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (mode !== "floating") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: floatingPosition.x,
      y: floatingPosition.y,
      active: true
    };
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!dragStart.current.active || mode !== "floating") return;
    onFloatingPositionChange({
      x: Math.max(12, dragStart.current.x + event.clientX - dragStart.current.pointerX),
      y: Math.max(12, dragStart.current.y + event.clientY - dragStart.current.pointerY)
    });
  }

  function stopDrag() {
    dragStart.current.active = false;
  }

  return (
    <aside
      className={`dayEditor dayEditor--${mode}`}
      style={mode === "floating" ? { left: floatingPosition.x, top: floatingPosition.y } : undefined}
      role="dialog"
      aria-label="Запис дня"
    >
      <div className="dayEditor__header">
        <button
          className="dayEditor__drag"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          aria-label="Перетягнути вікно"
        >
          <GripHorizontal size={18} />
        </button>
        <div>
          <span className="eyebrow">День</span>
          <h2>{entry.dateKey}</h2>
        </div>
        <div className="dayEditor__controls">
          <button onClick={() => onModeChange("left")} aria-label="Прикріпити зліва">
            <PanelLeft size={17} />
          </button>
          <button onClick={() => onModeChange("floating")} aria-label="Зробити плаваючим">
            <Square size={15} />
          </button>
          <button onClick={() => onModeChange("right")} aria-label="Прикріпити справа">
            <PanelRight size={17} />
          </button>
          <button onClick={onClose} aria-label="Закрити">
            <X size={18} />
          </button>
        </div>
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
          <input value={entry.caloriePlan} onChange={(event) => update("caloriePlan", event.target.value)} inputMode="numeric" />
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
    </aside>
  );
}
