import { bauEvent } from "@/data/bau-2027";
import type { Locale } from "@/data/locales";

interface BauEntryCopy {
  bandIntro: string;
  titleIntro: string;
  body: string;
  meeting: string;
  hall: string;
  stand: string;
  product: string;
}

const copy = {
  en: {
    bandIntro: "HYDE at", titleIntro: "Meet HYDE at",
    body: "Bring your drawings. Meet our team.", meeting: "Book a meeting",
    hall: "Hall", stand: "Stand", product: "Panic exit device",
  },
  es: {
    bandIntro: "HYDE en", titleIntro: "Conozca a HYDE en",
    body: "Traiga sus planos. Conozca a nuestro equipo.", meeting: "Agendar una reunión",
    hall: "Pabellón", stand: "Stand", product: "Dispositivo antipánico",
  },
  pt: {
    bandIntro: "HYDE na", titleIntro: "Conheça a HYDE na",
    body: "Traga seus desenhos. Conheça nossa equipe.", meeting: "Agendar reunião",
    hall: "Pavilhão", stand: "Estande", product: "Dispositivo antipânico",
  },
  fr: {
    bandIntro: "HYDE à", titleIntro: "Rencontrez HYDE à",
    body: "Apportez vos plans. Rencontrez notre équipe.", meeting: "Prendre rendez-vous",
    hall: "Hall", stand: "Stand", product: "Dispositif antipanique",
  },
  de: {
    bandIntro: "HYDE auf der", titleIntro: "Treffen Sie HYDE auf der",
    body: "Bringen Sie Ihre Zeichnungen mit. Lernen Sie unser Team kennen.",
    meeting: "Termin vereinbaren", hall: "Halle", stand: "Stand", product: "Panikstange",
  },
  ja: {
    bandIntro: "HYDE 出展：", titleIntro: "HYDEとお会いしましょう：",
    body: "図面をお持ちください。担当チームとご相談いただけます。", meeting: "商談を予約",
    hall: "ホール", stand: "ブース", product: "パニックバー",
  },
  ko: {
    bandIntro: "HYDE 참가:", titleIntro: "HYDE를 만나보세요:",
    body: "도면을 가져오세요. 현장에서 팀을 만나보세요.", meeting: "미팅 예약",
    hall: "홀", stand: "부스", product: "비상구용 패닉바",
  },
  tr: {
    bandIntro: "HYDE:", titleIntro: "HYDE ile tanışın:",
    body: "Çizimlerinizi getirin. Ekibimizle tanışın.", meeting: "Randevu alın",
    hall: "Salon", stand: "Stant", product: "Panik bar",
  },
  ru: {
    bandIntro: "HYDE на", titleIntro: "Встретьтесь с HYDE на",
    body: "Возьмите с собой чертежи. Познакомьтесь с нашей командой.", meeting: "Назначить встречу",
    hall: "Павильон", stand: "Стенд", product: "Устройство «антипаника»",
  },
  ar: {
    bandIntro: "HYDE في", titleIntro: "تعرّفوا على HYDE في",
    body: "أحضروا مخططاتكم. تعرّفوا على فريقنا.", meeting: "احجزوا موعدًا",
    hall: "القاعة", stand: "الجناح", product: "جهاز خروج للطوارئ",
  },
} satisfies Record<Locale, BauEntryCopy>;

const dateLocales: Record<Locale, string> = {
  en: "en-GB", es: "es-419", pt: "pt-BR", fr: "fr-FR", de: "de-DE",
  ja: "ja-JP", ko: "ko-KR", tr: "tr-TR", ru: "ru-RU", ar: "ar",
};

/** Only presentation is localized here; all event facts remain in bau-2027. */
export function bauEntryDetails(locale: Locale = "en") {
  const start = new Date(`${bauEvent.startDate}T00:00:00Z`);
  const end = new Date(`${bauEvent.endDate}T00:00:00Z`);
  const format = (month: "short" | "long") => new Intl.DateTimeFormat(dateLocales[locale], {
    day: "numeric", month, year: "numeric", calendar: "gregory", timeZone: "UTC",
  }).formatRange(start, end);
  const primaryLanguage = locale === "de" ? "de" : "en";

  return {
    copy: copy[locale],
    event: bauEvent,
    year: String(start.getUTCFullYear()),
    dates: format("long"),
    compactDates: format("short"),
    primaryHref: primaryLanguage === "de" ? "/de/bau-2027/" : "/bau-2027/",
    primaryLanguage,
    markEnglish: primaryLanguage === "en" && locale !== "en",
    secondaryHref: primaryLanguage === "de" ? "/bau-2027/" : "/de/bau-2027/",
    secondaryLanguage: primaryLanguage === "de" ? "en" : "de",
    secondaryLabel: primaryLanguage === "de" ? "English" : "Deutsch",
  };
}

export const bauEntryPhotos = [
  { model: "307", src: "/images/products-hyde/307-panic-exit-device.webp" },
  { model: "311", src: "/images/products-hyde/311-panic-exit-device.webp" },
] as const;
