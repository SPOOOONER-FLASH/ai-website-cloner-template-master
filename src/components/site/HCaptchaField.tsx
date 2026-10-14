"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/*
  hCaptcha for the Web3Forms posts. The client switched on "hCaptcha required" in the Web3Forms
  dashboard on 2026-10-14, after a run of fake OEM enquiries. From that moment Web3Forms rejects
  any submission without a token, so every form that posts with our access key must carry one.

  Loaded straight from hCaptcha with `render=explicit` instead of the @hcaptcha/react-hcaptcha
  package: no new dependency, and the widget is rendered into this div whenever the form mounts
  (Web3Forms' own client/script.js only scans the page once, on load, which misses forms React
  renders later). The widget writes its token into a textarea named `h-captcha-response` inside
  the div, so `new FormData(form)` picks it up with no further wiring.

  Site key: Web3Forms' shared key for free plans (their docs, 2026-10-14). A paid plan may set its
  own site key and secret; change it here only together with the dashboard.
*/
const SITE_KEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

interface HCaptchaApi {
  render(element: HTMLElement, options: { sitekey: string; hl?: string }): string;
  reset(widgetId?: string): void;
  getResponse(widgetId?: string): string;
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
    __hydeHCaptchaLoad?: Promise<void>;
  }
}

function loadApi(): Promise<void> {
  if (window.hcaptcha) return Promise.resolve();
  window.__hydeHCaptchaLoad ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      window.__hydeHCaptchaLoad = undefined; // let the next mount try again
      reject(new Error("hCaptcha failed to load"));
    };
    document.head.appendChild(script);
  });
  return window.__hydeHCaptchaLoad;
}

export interface HCaptchaHandle {
  /** The current token, or "" when the visitor has not completed the check. */
  token(): string;
  /** Tokens are single-use: call after every submission attempt. */
  reset(): void;
}

const MISSING: Record<string, string> = {
  en: "Please complete the verification above the button, then send again.",
  es: "Complete la verificación situada encima del botón y vuelva a enviar.",
  pt: "Conclua a verificação acima do botão e envie novamente.",
  de: "Bitte schließen Sie die Überprüfung über der Schaltfläche ab und senden Sie erneut.",
};

export function captchaMissingMessage(locale: string): string {
  return MISSING[locale] ?? MISSING.en;
}

export const HCaptchaField = forwardRef<HCaptchaHandle, { locale?: string }>(function HCaptchaField({ locale = "en" }, ref) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let live = true;
    loadApi()
      .then(() => {
        if (!live || !container.current || widgetId.current !== null || !window.hcaptcha) return;
        widgetId.current = window.hcaptcha.render(container.current, { sitekey: SITE_KEY, hl: locale });
      })
      .catch(() => {
        /* Blocked by an extension or the network: the submit check below then tells the visitor. */
      });
    return () => {
      live = false;
    };
  }, [locale]);

  useImperativeHandle(ref, () => ({
    token: () => (widgetId.current !== null && window.hcaptcha ? window.hcaptcha.getResponse(widgetId.current) : ""),
    reset: () => {
      if (widgetId.current !== null) window.hcaptcha?.reset(widgetId.current);
    },
  }));

  /* 78px is the widget's own height: reserving it keeps the button from jumping when it loads. */
  return <div ref={container} className="min-h-[78px]" />;
});
