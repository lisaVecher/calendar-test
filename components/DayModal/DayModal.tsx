"use client";

import { PointerEvent, useRef } from "react";
import { GripHorizontal, Maximize2, PanelLeft, PanelRight, Square, X } from "lucide-react";
import type { DayEditorMode, DayEntry, EditorSize, FloatingPosition } from "@/types";

interface DayModalProps {
  entry: DayEntry;
  mode: DayEditorMode;
  floatingPosition: FloatingPosition;
  editorSize: EditorSize;
  labels: {
    dialog: string;
    day: string;
    dragWindow: string;
    dockLeft: string;
    floating: string;
    dockRight: string;
    close: string;
    shortNote: string;
    mood: string;
    noMood: string;
    moods: Record<string, string>;
    caloriePlan: string;
    calorieActual: string;
    dayColor: string;
    marker: string;
    noMarker: string;
    journal: string;
    journalPlaceholder: string;
    deleteDay: string;
    save: string;
    resize: string;
  };
  onModeChange: (mode: DayEditorMode) => void;
  onFloatingPositionChange: (position: FloatingPosition) => void;
  onEditorSizeChange: (size: EditorSize) => void;
  onChange: (entry: DayEntry) => void;
  onClose: () => void;
  onDelete: () => void;
}

export function DayModal({
  entry,
  mode,
  floatingPosition,
  editorSize,
  labels,
  onModeChange,
  onFloatingPositionChange,
  onEditorSizeChange,
  onChange,
  onClose,
  onDelete
}: DayModalProps) {
  const dragStart = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0, active: false });
  const resizeStart = useRef({ pointerX: 0, pointerY: 0, width: 0, height: 0, active: false });

  function update(field: keyof DayEntry, value: string) {
    onChange({ ...entry, [field]: value });
  }

  function startDrag(event: PointerEvent<HTMLElement>) {
    const rect = (event.currentTarget.closest(".dayEditor") ?? event.currentTarget).getBoundingClientRect();
    const startX = mode === "floating" ? floatingPosition.x : rect.left;
    const startY = mode === "floating" ? floatingPosition.y : rect.top;
    if (mode !== "floating") {
      onFloatingPositionChange({ x: startX, y: startY });
      onModeChange("floating");
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: startX,
      y: startY,
      active: true
    };
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    if (!dragStart.current.active) return;
    onFloatingPositionChange({
      x: Math.max(12, dragStart.current.x + event.clientX - dragStart.current.pointerX),
      y: Math.max(12, dragStart.current.y + event.clientY - dragStart.current.pointerY)
    });
  }

  function stopDrag() {
    dragStart.current.active = false;
  }

  function startResize(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      width: editorSize.width,
      height: editorSize.height,
      active: true
    };
  }

  function moveResize(event: PointerEvent<HTMLButtonElement>) {
    if (!resizeStart.current.active) return;
    onEditorSizeChange({
      width: Math.min(720, Math.max(340, resizeStart.current.width + event.clientX - resizeStart.current.pointerX)),
      height: Math.min(window.innerHeight - 24, Math.max(420, resizeStart.current.height + event.clientY - resizeStart.current.pointerY))
    });
  }

  function stopResize() {
    resizeStart.current.active = false;
  }

  function startPanelDrag(event: PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("input, textarea, select, button")) return;
    startDrag(event);
  }

  return (
    <aside
      className={`dayEditor dayEditor--${mode}`}
      style={{
        width: editorSize.width,
        height: editorSize.height,
        ...(mode === "floating" ? { left: floatingPosition.x, top: floatingPosition.y } : {})
      }}
      role="dialog"
      aria-label={labels.dialog}
      onPointerDown={startPanelDrag}
      onPointerMove={moveDrag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      <div className="dayEditor__header">
        <button
          className="dayEditor__drag"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          aria-label={labels.dragWindow}
        >
          <GripHorizontal size={18} />
        </button>
        <div className="dayEditor__title">
          <span className="eyebrow">{labels.day}</span>
          <h2>{entry.dateKey}</h2>
        </div>
        <div className="dayEditor__controls">
          <button onClick={() => onModeChange("left")} aria-label={labels.dockLeft}>
            <PanelLeft size={17} />
          </button>
          <button onClick={() => onModeChange("floating")} aria-label={labels.floating}>
            <Square size={15} />
          </button>
          <button onClick={() => onModeChange("right")} aria-label={labels.dockRight}>
            <PanelRight size={17} />
          </button>
          <button onClick={onClose} aria-label={labels.close}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="formGrid">
        <label>
          {labels.shortNote}
          <input value={entry.note} onChange={(event) => update("note", event.target.value)} maxLength={80} />
        </label>
        <label>
          {labels.mood}
          <select value={entry.mood} onChange={(event) => update("mood", event.target.value)}>
            <option value="">{labels.noMood}</option>
            <option value="calm">{labels.moods.calm}</option>
            <option value="happy">{labels.moods.happy}</option>
            <option value="focus">{labels.moods.focus}</option>
            <option value="tired">{labels.moods.tired}</option>
            <option value="dreamy">{labels.moods.dreamy}</option>
          </select>
        </label>
        <label>
          {labels.caloriePlan}
          <input value={entry.caloriePlan} onChange={(event) => update("caloriePlan", event.target.value)} inputMode="numeric" />
        </label>
        <label>
          {labels.calorieActual}
          <input value={entry.calorieActual} onChange={(event) => update("calorieActual", event.target.value)} inputMode="numeric" />
        </label>
        <label>
          {labels.dayColor}
          <input type="color" value={entry.color || "#ffffff"} onChange={(event) => update("color", event.target.value)} />
        </label>
        <label>
          {labels.marker}
          <select value={entry.marker} onChange={(event) => update("marker", event.target.value)}>
            <option value="">{labels.noMarker}</option>
            <option value="★">★</option>
            <option value="♡">♡</option>
            <option value="✓">✓</option>
            <option value="!">!</option>
            <option value="•">•</option>
          </select>
        </label>
      </div>

      <label className="journalField">
        {labels.journal}
        <textarea value={entry.journal} onChange={(event) => update("journal", event.target.value)} placeholder={labels.journalPlaceholder} />
      </label>

      <div className="modalActions">
        <button className="dangerButton" onClick={onDelete}>
          {labels.deleteDay}
        </button>
        <button className="primaryButton" onClick={onClose}>
          {labels.save}
        </button>
      </div>

      <button
        className="dayEditor__resize"
        onPointerDown={startResize}
        onPointerMove={moveResize}
        onPointerUp={stopResize}
        onPointerCancel={stopResize}
        aria-label={labels.resize}
      >
        <Maximize2 size={15} />
      </button>
    </aside>
  );
}
