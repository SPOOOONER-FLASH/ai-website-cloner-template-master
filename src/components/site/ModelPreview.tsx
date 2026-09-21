"use client";
import type { Locale } from "@/data/site";

import { createElement, useEffect, useRef, useState } from "react";

interface ModelPreviewProps {
  src: string;
  model: string;
  orbit: string;
  locale: Locale;
}

export function ModelPreview({ src, model, orbit, locale }: ModelPreviewProps) {
  const es = locale === "es";
  const pt = locale === "pt";
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const viewer = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = viewer.current;
    if (!element) return;
    const onError = () => setFailed(true);
    element.addEventListener("error", onError);
    return () => element.removeEventListener("error", onError);
  }, [ready]);

  async function openPreview() {
    setLoading(true);
    setFailed(false);
    try {
      // Load the renderer only after a deliberate click; all assets are self-hosted.
      await import("@google/model-viewer");
      setReady(true);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-24">
      {!ready ? (
        <button type="button" onClick={openPreview} disabled={loading} className="short-marker short-marker-compact cursor-pointer text-c1 text-ink disabled:opacity-50">
          {loading
            ? es
              ? "Cargando visor…"
              : pt
                ? "Carregando o visualizador…"
                : "Loading viewer…"
            : es
              ? "Abrir vista 3D"
              : pt
                ? "Abrir visualização 3D"
                : "Open 3D preview"}
        </button>
      ) : createElement("model-viewer", {
        ref: viewer,
        src,
        alt: es
          ? `${model}: modelo exterior parcial`
          : pt
            ? `${model}: modelo externo parcial`
            : `${model}: partial exterior model`,
        "camera-controls": true,
        "camera-orbit": orbit,
        "touch-action": "pan-y",
        "environment-image": "neutral",
        "interaction-prompt": "none",
        "shadow-intensity": "0",
        exposure: "0.65",
        className: "block h-[360px] w-full border border-line bg-neutral-200 sm:h-[440px]",
      })}
      {ready && !failed ? <p className="mt-12 text-c2 text-ink-secondary">{es
            ? "Arrastre para girar. Use la rueda o pellizque para ampliar. Con teclado: flechas para girar y Re Pág / Av Pág para ampliar."
            : pt
              ? "Arraste para girar. Use a roda ou o gesto de pinça para ampliar. No teclado: setas para girar e Page Up / Page Down para ampliar."
              : "Drag to rotate. Scroll or pinch to zoom. Keyboard: arrow keys to rotate and Page Up / Page Down to zoom."}</p> : null}
      {failed ? <p role="status" className="mt-12 text-c2 text-ink-secondary">{es
            ? "No se pudo abrir la vista 3D. Los archivos de descarga siguen disponibles abajo."
            : pt
              ? "Não foi possível abrir a visualização 3D. Os arquivos para download continuam disponíveis abaixo."
              : "The 3D preview could not load. You can still download the files below."}</p> : null}
    </div>
  );
}
