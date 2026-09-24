"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/data/site";
import { localised } from "@/lib/localised";
import { Button } from "./Button";
import styles from "./InquirySuccess.module.css";

const copy = {
  en: { title: "Thank you. Your inquiry is on its way.", detail: "Your message has been sent to our export team. We look forward to learning about your project.", received: "Inquiry submitted", browse: "Explore the catalog", another: "Send another inquiry", stop: "Stop celebration" },
  es: { title: "Gracias. Su consulta está en camino.", detail: "Su mensaje se ha enviado a nuestro equipo de exportación. Esperamos conocer más sobre su proyecto.", received: "Consulta enviada", browse: "Explorar el catálogo", another: "Enviar otra consulta", stop: "Detener animación" },
  pt: { title: "Obrigado. Sua consulta está a caminho.", detail: "Sua mensagem foi enviada à nossa equipe de exportação. Queremos conhecer melhor o seu projeto.", received: "Consulta enviada", browse: "Explorar o catálogo", another: "Enviar outra consulta", stop: "Parar animação" },
};

export function InquirySuccess({ locale, onAnother }: { locale: Locale; onAnother: () => void }) {
  const text = localised(copy, locale);
  const heading = useRef<HTMLHeadingElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stopAnimation = useRef<() => void>(() => {});

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    heading.current?.closest("section")?.scrollIntoView({ block: "center", behavior: "instant" });
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || !ctx || motion.matches) return;
    let frame = 0;
    const width = innerWidth, height = innerHeight, ratio = Math.min(devicePixelRatio || 1, 2);
    element.width = width * ratio; element.height = height * ratio; ctx.scale(ratio, ratio);
    const colours = ["#b59a54", "#dbcc9c", "#24241f", "#8b784a", "#ede3c6"];
    const count = width < 600 ? 100 : 160;
    const pieces = Array.from({ length: count }, (_, i) => {
      const rain = i >= count / 2;
      const right = i % 2;
      return { rain, x: rain ? Math.random() * width : right ? width + 10 : -10,
        y: rain ? -30 - Math.random() * height * .35 : height * .65,
        vx: rain ? (Math.random() - .5) * 70 : (right ? -1 : 1) * (220 + Math.random() * 430),
        vy: rain ? 60 + Math.random() * 60 : -350 - Math.random() * 350,
        angle: Math.random() * 6.28, spin: (Math.random() - .5) * 8,
        w: 4 + Math.random() * 5, h: rain ? 7 + Math.random() * 7 : 18 + Math.random() * 20,
        colour: colours[i % colours.length], phase: Math.random() * 6.28 };
    });
    const stop = () => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, width, height); };
    stopAnimation.current = stop;
    let start = 0, previous = 0;
    function draw(now: number) {
      if (!ctx) return;
      if (!start) { start = now; previous = now; }
      const age = (now - start) / 1000, dt = Math.min((now - previous) / 1000, .033);
      previous = now; ctx.clearRect(0, 0, width, height);
      for (const p of pieces) {
        if (p.rain && age < .45) continue;
        p.vx *= Math.pow(.986, dt * 60); p.vy += (p.rain ? 115 : 240) * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.angle += p.spin * dt;
        ctx.save(); ctx.globalAlpha = Math.min(1, Math.max(0, (4.5 - age) / .8));
        ctx.translate(p.x + Math.sin(age * 4 + p.phase) * 10, p.y); ctx.rotate(p.angle);
        ctx.scale(1, Math.cos(age * 6 + p.phase) * .7 + .3); ctx.fillStyle = p.colour;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      }
      if (age < 4.5) frame = requestAnimationFrame(draw); else stop();
    }
    const visibility = () => { if (document.hidden) stop(); };
    const preference = () => { if (motion.matches) stop(); };
    frame = requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", preference);
    window.addEventListener("resize", stop);
    return () => { stop(); document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", preference); window.removeEventListener("resize", stop); stopAnimation.current = () => {}; };
  }, []);

  const prefix = locale === "en" ? "" : `/${locale}`;
  return <section className={styles.panel} aria-labelledby="inquiry-success-heading">
    <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
    <div className={styles.mark}><svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7 16 6 6 12-13" /></svg></div>
    <h2 ref={heading} id="inquiry-success-heading" tabIndex={-1} className={styles.heading}>{text.title}</h2>
    <p className={styles.description}>{text.detail}</p>
    <p className={styles.receipt} role="status">{text.received}</p>
    <div className={styles.actions}><Button href={`${prefix}/product-finder/`}>{text.browse}</Button><button type="button" onClick={onAnother} className="short-marker short-marker-compact">{text.another}</button></div>
    <button type="button" className={styles.again} onClick={() => stopAnimation.current()}>{text.stop}</button>
  </section>;
}
