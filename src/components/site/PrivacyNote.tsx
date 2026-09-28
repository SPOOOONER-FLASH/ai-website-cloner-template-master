import Link from "next/link";
import type { Locale } from "@/data/site";
import { localisedHref } from "@/lib/spanish-mirror";

/*
  One line under every form that collects personal data, linking the privacy notice.
  The notice exists in English and German only, so Spanish and Portuguese readers are told
  the link opens English. Other overlay locales read the English line and English page.
*/
const NOTE: Partial<Record<Locale, { before: string; link: string; after: string }>> = {
  en: { before: "How we handle what you send: ", link: "privacy notice", after: "." },
  de: { before: "Wie wir mit Ihren Angaben umgehen, steht in der ", link: "Datenschutzerklärung", after: "." },
  es: { before: "Cómo tratamos sus datos: ", link: "aviso de privacidad (en inglés)", after: "." },
  pt: { before: "Como tratamos seus dados: ", link: "aviso de privacidade (em inglês)", after: "." },
};

export function PrivacyNote({ locale = "en", className = "" }: { locale?: Locale; className?: string }) {
  const note = NOTE[locale] ?? NOTE.en!;
  return (
    <p className={`text-c2 text-ink-secondary ${className}`}>
      {note.before}
      <Link href={localisedHref("/privacy", locale)} className="underline hover:text-ink">
        {note.link}
      </Link>
      {note.after}
    </p>
  );
}
