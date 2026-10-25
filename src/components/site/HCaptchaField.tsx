"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Locale } from "@/data/site";
import { dict } from "@/lib/i18n-client";

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

/*
  Ready is hCaptcha's own `onload` callback, not the script element's load event. With render=explicit
  the element can fire before the API is usable, and hCaptcha says so in the console ("should not render
  before js api is fully loaded … `render=explicit` should be used in combination with `onload`",
  seen 2026-10-25); a render that early can leave the box empty with no error to act on.
  A script that never answers counts as unavailable after LOAD_TIMEOUT_MS, so the form offers email
  instead of waiting for a box that will not come.
*/
const READY_CALLBACK = "__hydeHCaptchaReady";
const LOAD_TIMEOUT_MS = 20000;

function loadApi(): Promise<void> {
  if (window.hcaptcha && !window.__hydeHCaptchaLoad) return Promise.resolve();
  window.__hydeHCaptchaLoad ??= new Promise<void>((resolve, reject) => {
    const fail = () => {
      window.__hydeHCaptchaLoad = undefined; // let the next mount try again
      reject(new Error("hCaptcha failed to load"));
    };
    const timer = window.setTimeout(fail, LOAD_TIMEOUT_MS);
    (window as unknown as Record<string, () => void>)[READY_CALLBACK] = () => {
      window.clearTimeout(timer);
      resolve();
    };
    const script = document.createElement("script");
    script.src = `https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off&onload=${READY_CALLBACK}`;
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timer);
      fail();
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
  /** True when the widget could not load, so no token can ever arrive: the form has to offer email instead. */
  unavailable(): boolean;
}

/*
  Through `dict`, so the seven overlay locales read their ui.json translations of the English line.
  Until 2026-10-25 this was a plain lookup with its own en/es/pt/de rows, and French, Japanese, Korean,
  Turkish, Russian and Arabic buyers were told in English, although all six translations existed.
*/
const MISSING = {
  en: "Please complete the verification above the button, then send again.",
  es: "Complete la verificación situada encima del botón y vuelva a enviar.",
  pt: "Conclua a verificação acima do botão e envie novamente.",
  de: "Bitte schließen Sie die Überprüfung über der Schaltfläche ab und senden Sie erneut.",
};

/*
  The widget never loaded (a firewall, a privacy extension, a network that cannot reach hcaptcha.com).
  Asking that buyer to "complete the verification" points at a box that is not there, a dead end with
  their enquiry already typed. They are told up front, and the enquiry form hands them its email route.
*/
const UNAVAILABLE = {
  en: "The verification could not load on this connection, so this form cannot send. Please email us instead.",
  es: "La verificación no pudo cargarse en esta conexión, así que este formulario no puede enviarse. Escríbanos por correo.",
  pt: "A verificação não pôde carregar nesta conexão, então este formulário não pode ser enviado. Escreva-nos por e-mail.",
};

export function captchaMissingMessage(locale: Locale): string {
  return dict(MISSING, locale);
}

export function captchaUnavailableMessage(locale: Locale): string {
  return dict(UNAVAILABLE, locale);
}

export const HCaptchaField = forwardRef<HCaptchaHandle, { locale?: Locale }>(function HCaptchaField({ locale = "en" }, ref) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    loadApi()
      .then(() => {
        if (!live || !container.current || widgetId.current !== null || !window.hcaptcha) return;
        widgetId.current = window.hcaptcha.render(container.current, { sitekey: SITE_KEY, hl: locale });
      })
      .catch(() => {
        /* Blocked by an extension or the network. Shown below, and reported to the form through unavailable(). */
        if (live) setFailed(true);
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
    unavailable: () => failed,
  }), [failed]);

  /* 78px is the widget's own height: reserving it keeps the button from jumping when it loads. */
  return (
    <div ref={container} className="min-h-[78px]">
      {failed ? <p className="text-c2 text-ink">{captchaUnavailableMessage(locale)}</p> : null}
    </div>
  );
});
