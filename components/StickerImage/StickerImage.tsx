"use client";

import { PointerEvent, useRef, useState } from "react";
import { BringToFront, Grip, RotateCw, SendToBack, Trash2 } from "lucide-react";
import type { StickerItem } from "@/types";

interface StickerImageProps {
  sticker: StickerItem;
  onChange: (sticker: StickerItem) => void;
  onDelete: (id: string) => void;
  onLayerChange: (id: string, direction: "up" | "down") => void;
}

export function StickerImage({ sticker, onChange, onDelete, onLayerChange }: StickerImageProps) {
  const [active, setActive] = useState<"move" | "resize" | "rotate" | null>(null);
  const pointerStart = useRef({
    x: 0,
    y: 0,
    stickerX: 0,
    stickerY: 0,
    width: 0,
    height: 0,
    rotation: 0
  });

  function captureStart(event: PointerEvent<HTMLElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      stickerX: sticker.x,
      stickerY: sticker.y,
      width: sticker.width,
      height: sticker.height,
      rotation: sticker.rotation
    };
  }

  function startMove(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button, input, textarea, .sticker__resize, .sticker__rotate")) return;
    captureStart(event);
    setActive("move");
  }

  function startHandleMove(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    captureStart(event);
    setActive("move");
  }

  function startResize(event: PointerEvent<HTMLSpanElement>) {
    event.stopPropagation();
    captureStart(event);
    setActive("resize");
  }

  function startRotate(event: PointerEvent<HTMLSpanElement>) {
    event.stopPropagation();
    captureStart(event);
    setActive("rotate");
  }

  function stopAction() {
    setActive(null);
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!active) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;

    if (active === "move") {
      onChange({ ...sticker, x: pointerStart.current.stickerX + deltaX, y: pointerStart.current.stickerY + deltaY });
      return;
    }

    if (active === "resize") {
      onChange({
        ...sticker,
        width: Math.max(70, pointerStart.current.width + deltaX),
        height: Math.max(44, pointerStart.current.height + deltaY)
      });
      return;
    }

    onChange({ ...sticker, rotation: Math.round(pointerStart.current.rotation + deltaX * 0.45 + deltaY * 0.2) });
  }

  return (
    <div
      className={`sticker sticker--${sticker.kind}`}
      style={{
        left: sticker.x,
        top: sticker.y,
        width: sticker.width,
        height: sticker.height,
        transform: `rotate(${sticker.rotation}deg)`,
        zIndex: sticker.zIndex ?? 4,
        color: sticker.color
      }}
      onPointerDown={startMove}
      onPointerMove={handlePointerMove}
      onPointerUp={stopAction}
      onPointerCancel={stopAction}
    >
      <div className="sticker__tools" aria-label="Керування стікером">
        <button
          className="sticker__dragButton"
          onPointerDown={startHandleMove}
          onPointerMove={handlePointerMove}
          onPointerUp={stopAction}
          onPointerCancel={stopAction}
          aria-label="Перетягнути стікер"
        >
          <Grip size={14} />
        </button>
        <button onClick={() => onLayerChange(sticker.id, "up")} aria-label="Перемістити шар вище">
          <BringToFront size={13} />
        </button>
        <button onClick={() => onLayerChange(sticker.id, "down")} aria-label="Перемістити шар нижче">
          <SendToBack size={13} />
        </button>
        <button onClick={() => onDelete(sticker.id)} aria-label="Видалити стікер">
          <Trash2 size={13} />
        </button>
      </div>

      {sticker.kind === "image" && sticker.src ? (
        <img src={sticker.src} alt="Стікер" draggable={false} />
      ) : (
        <textarea
          value={sticker.text}
          onChange={(event) => onChange({ ...sticker, text: event.target.value })}
          aria-label="Текстовий стікер"
        />
      )}

      {sticker.kind === "text" ? (
        <input
          className="sticker__color"
          type="color"
          value={sticker.color || "#40363a"}
          onChange={(event) => onChange({ ...sticker, color: event.target.value })}
          aria-label="Колір тексту стікера"
        />
      ) : null}

      <span className="sticker__rotate" onPointerDown={startRotate} aria-label="Повернути стікер">
        <RotateCw size={13} />
      </span>
      <span className="sticker__resize" onPointerDown={startResize} aria-hidden="true" />
    </div>
  );
}
