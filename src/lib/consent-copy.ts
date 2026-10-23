import type { Locale } from "@/data/locales";

/**
 * The consent banner and its footer link, in all ten languages.
 *
 * Its own dictionary rather than content/i18n: the banner renders before the reader has
 * done anything, so a sentence that fell back to English would be the first thing a
 * German buyer reads. Accept and decline are the same length and the same weight on
 * purpose — a refusal that is harder to find than an acceptance is not consent.
 */
export interface ConsentCopy {
  message: string;
  accept: string;
  decline: string;
  privacy: string;
  settings: string;
}

export const CONSENT_COPY: Record<Locale, ConsentCopy> = {
  en: {
    message:
      "We use Google Analytics and Microsoft Clarity to see which pages and products buyers use. They set cookies only if you agree.",
    accept: "Accept",
    decline: "Decline",
    privacy: "Privacy notice",
    settings: "Cookie settings",
  },
  es: {
    message:
      "Usamos Google Analytics y Microsoft Clarity para saber qué páginas y productos consultan los compradores. Solo instalan cookies si usted lo acepta.",
    accept: "Aceptar",
    decline: "Rechazar",
    privacy: "Privacidad",
    settings: "Configuración de cookies",
  },
  pt: {
    message:
      "Usamos o Google Analytics e o Microsoft Clarity para saber quais páginas e produtos os compradores consultam. Eles só gravam cookies se você aceitar.",
    accept: "Aceitar",
    decline: "Recusar",
    privacy: "Privacidade",
    settings: "Configurações de cookies",
  },
  fr: {
    message:
      "Nous utilisons Google Analytics et Microsoft Clarity pour savoir quelles pages et quels produits les acheteurs consultent. Ils ne déposent des cookies qu’avec votre accord.",
    accept: "Accepter",
    decline: "Refuser",
    privacy: "Confidentialité",
    settings: "Paramètres des cookies",
  },
  de: {
    message:
      "Wir nutzen Google Analytics und Microsoft Clarity, um zu sehen, welche Seiten und Produkte Einkäufer aufrufen. Cookies werden nur mit Ihrer Zustimmung gesetzt.",
    accept: "Akzeptieren",
    decline: "Ablehnen",
    privacy: "Datenschutzhinweis",
    settings: "Cookie-Einstellungen",
  },
  ja: {
    message:
      "バイヤーがどのページや製品を見ているかを把握するため、Google Analytics と Microsoft Clarity を使用しています。Cookie は同意いただいた場合にのみ保存されます。",
    accept: "同意する",
    decline: "拒否する",
    privacy: "プライバシー",
    settings: "Cookie 設定",
  },
  ko: {
    message:
      "구매자가 어떤 페이지와 제품을 보는지 파악하기 위해 Google Analytics와 Microsoft Clarity를 사용합니다. 쿠키는 동의하신 경우에만 저장됩니다.",
    accept: "동의",
    decline: "거부",
    privacy: "개인정보 처리방침",
    settings: "쿠키 설정",
  },
  tr: {
    message:
      "Alıcıların hangi sayfalara ve ürünlere baktığını görmek için Google Analytics ve Microsoft Clarity kullanıyoruz. Çerezler yalnızca onay vermeniz hâlinde kaydedilir.",
    accept: "Kabul et",
    decline: "Reddet",
    privacy: "Gizlilik",
    settings: "Çerez ayarları",
  },
  ru: {
    message:
      "Мы используем Google Analytics и Microsoft Clarity, чтобы понимать, какие страницы и товары смотрят покупатели. Файлы cookie сохраняются только с вашего согласия.",
    accept: "Принять",
    decline: "Отклонить",
    privacy: "Конфиденциальность",
    settings: "Настройки cookie",
  },
  ar: {
    message:
      "نستخدم Google Analytics وMicrosoft Clarity لمعرفة الصفحات والمنتجات التي يطّلع عليها المشترون. لا تُحفظ ملفات تعريف الارتباط إلا بموافقتك.",
    accept: "قبول",
    decline: "رفض",
    privacy: "الخصوصية",
    settings: "إعدادات ملفات تعريف الارتباط",
  },
};

/** The notice exists in English and German only (src/data/privacy-policy.ts). */
export function privacyHref(locale: Locale): string {
  return locale === "de" ? "/de/privacy" : "/privacy";
}
