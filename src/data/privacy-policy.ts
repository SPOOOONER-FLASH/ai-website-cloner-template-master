import { legalName } from "@/data/site";
import { siteSettings } from "@/data/navigation";

/**
 * /privacy/ and /de/privacy/ — the privacy notice, English and German only
 * (PARTIAL_ROUTES in src/lib/spanish-mirror.ts).
 *
 * EVERY SENTENCE HERE DESCRIBES WHAT THE CODE DOES TODAY. It was written from the forms
 * (Web3Forms), src/components/site/Analytics.tsx, the browser-storage keys and the
 * Cloudflare setup, and it says nothing about a consent banner because the site has none.
 * The review draft with every open legal question is docs/legal/privacy-policy-draft-2026-09-28.md.
 *
 * Change the data collection → change this file in the same commit. A new tag inside GTM,
 * a new form, a hosted video embed or a consent tool each makes a paragraph below false.
 *
 * Address (client, 2026-09-28): No. 28 Lehe Road is the company's actual address and the
 * one the controller line uses; No. 76 Haiwei Road is the factory buyers are taken to for
 * audits. There is no EU representative (Art. 27 GDPR) yet, so none is named. Fixed
 * retention periods are still open and deliberately not invented.
 */

export type PrivacyLocale = "en" | "de";

export type PrivacyBlock =
  | string
  | { list: readonly string[] }
  | { table: { head: readonly string[]; rows: readonly (readonly string[])[] } };

export type PrivacySection = { id: string; heading: string; body: readonly PrivacyBlock[] };

export type PrivacyCopy = {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  updatedLabel: string;
  intro: string;
  sections: readonly PrivacySection[];
};

/** The version date shown on the page. Change it whenever the text changes. */
export const PRIVACY_UPDATED = "2026-09-28";

const { contact } = siteSettings;
const address = [contact.address, `${contact.city}, ${contact.province}`, contact.country].join(", ");
const email = contact.email;

const COPY: Record<PrivacyLocale, PrivacyCopy> = {
  en: {
    seoTitle: "Privacy Notice",
    seoDescription:
      "What personal data cantonlock.com collects through its forms, analytics and hosting, why, who receives it, and how to exercise your data-protection rights.",
    kicker: "Legal",
    title: "Privacy notice",
    updatedLabel: "Last updated",
    intro: `This notice explains what personal data ${legalName} collects when you use cantonlock.com, why, and what rights you have. We sell door hardware to businesses. The site does not sell to consumers and has no user accounts.`,
    sections: [
      {
        id: "controller",
        heading: "1. Who is responsible",
        body: [
          `The controller is ${legalName}, ${address}.`,
          `For any data-protection question or request, write to ${email}.`,
        ],
      },
      {
        id: "visit",
        heading: "2. When you visit the site",
        body: [
          "Our web server and our content-delivery and security provider, Cloudflare, Inc. (101 Townsend St, San Francisco, CA 94107, USA), process the technical data every browser sends: IP address, date and time, the page requested, the referring page, browser and operating system. This is needed to deliver the pages, protect the site from automated attacks and investigate faults. Cloudflare may set a short-lived security cookie to tell people from bots, and it replaces email addresses in the page with a protected link so spam robots cannot collect them.",
          "Legal basis: our legitimate interest in a secure, working website (Art. 6(1)(f) GDPR). Logs are kept only as long as needed for these purposes.",
          "Our typeface and our product videos are served from our own server. Opening a page does not contact Google Fonts, YouTube or Vimeo.",
          "The site stores two small items in your browser. Neither identifies you and neither is sent to us:",
          {
            list: [
              "in session storage, the catalog page you came from, so the back link returns you to the same place. It is deleted when you close the tab;",
              "in local storage, when the promotions panel was last shown and its version, so it does not reappear too soon.",
            ],
          },
        ],
      },
      {
        id: "forms",
        heading: "3. When you contact us or request something",
        body: [
          "The site has four forms. Each is delivered by Web3Forms (web3forms.com), a form service that forwards what you enter to our mailbox as an email. A hidden field filters out spam robots; no captcha service is used.",
          {
            table: {
              head: ["Form", "What we receive (* required)", "Purpose"],
              rows: [
                ["Product inquiry", "name*, email*, company, country, product, model, application, quantity, message*", "to answer your inquiry and prepare a quotation"],
                ["Document or price-list request", "name*, email*, company*, country, message", "to send the document you asked for"],
                ["BAU 2027 meeting request", "name*, email*, company, country, preferred day and time, products of interest, message", "to arrange and follow up a meeting at the fair"],
                ["Newsletter request", "email*, name, company, country, topic of interest, consent*", "to send occasional product, document and exhibition updates"],
              ],
            },
          },
          "You can also write to us by email or WhatsApp. If you use the WhatsApp link, the conversation is processed by WhatsApp / Meta under their own terms.",
          "Legal basis: for inquiries, document and meeting requests, steps taken at your request before a possible contract (Art. 6(1)(b) GDPR) and our legitimate interest in answering business inquiries (Art. 6(1)(f) GDPR). For the newsletter, your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time by replying \"unsubscribe\" or writing to the address in section 1.",
          "We keep inquiries as long as needed to answer them and follow up, and business correspondence for as long as commercial and tax law require. Newsletter addresses are kept until you unsubscribe.",
        ],
      },
      {
        id: "analytics",
        heading: "4. Analytics",
        body: [
          "To understand which pages and products buyers look at, and where the site is hard to use, every page loads the following services.",
          "Google Analytics 4 and Google Tag Manager, provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Google Analytics sets cookies and records the pages viewed, approximate location, device and browser, how far you scroll, how long you read, and clicks on product and contact links. Google Analytics 4 does not store IP addresses. Google Tag Manager loads such tags and does not itself profile you. Data may be processed by Google LLC in the USA. More: policies.google.com/privacy",
          "Microsoft Clarity, provided by Microsoft Ireland Operations Ltd., One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Ireland. Clarity records how visitors move, scroll and click on a page and produces heatmaps and session replays; text typed into form fields is masked. We label sessions with the type of page and whether the visitor skimmed or read. Data may be processed by Microsoft Corporation in the USA. More: privacy.microsoft.com/privacystatement",
          "Legal basis: our legitimate interest in improving the site for buyers (Art. 6(1)(f) GDPR). You can object at any time (section 8). You can also stop both services with your browser's tracking protection or a content blocker, or install Google's opt-out add-on (tools.google.com/dlpage/gaoptout).",
        ],
      },
      {
        id: "links",
        heading: "5. Links to other sites",
        body: [
          "Our links to YouTube, Instagram, Facebook, Pinterest, Tumblr and our Alibaba storefront are plain links. Nothing is sent to those platforms until you click one; after that, their own privacy policies apply.",
        ],
      },
      {
        id: "recipients",
        heading: "6. Who receives your data",
        body: [
          "Only the service providers named above, our web host and our email provider, each processing data for the purposes described here, and our own sales and technical staff. We do not sell personal data or pass it to other companies for their marketing.",
        ],
      },
      {
        id: "transfers",
        heading: "7. International transfers",
        body: [
          "We are based in China, and your inquiry is read and answered there. Google, Microsoft and Cloudflare may process data in the USA; all three are certified under the EU-U.S. Data Privacy Framework.",
        ],
      },
      {
        id: "rights",
        heading: "8. Your rights",
        body: [
          "Under the GDPR you have the right to access your data (Art. 15), to have it corrected (Art. 16) or deleted (Art. 17), to restrict its processing (Art. 18), to receive it in a portable format (Art. 20), and to withdraw any consent at any time with effect for the future (Art. 7(3)).",
          "Right to object (Art. 21 GDPR): where we process your data on the basis of legitimate interest, you may object at any time on grounds relating to your particular situation. You may object to direct marketing at any time without giving reasons.",
          `To exercise any of these rights, write to ${email}. You also have the right to complain to a data-protection supervisory authority, in particular in the EU member state where you live or work.`,
        ],
      },
      {
        id: "other",
        heading: "9. Other",
        body: [
          "You do not have to give us personal data, but without an email address we cannot answer an inquiry. We do not use automated decision-making with legal effect. The site is intended for businesses, not children. We update this notice when our processing changes; the date above shows the current version.",
        ],
      },
    ],
  },
  de: {
    seoTitle: "Datenschutzerklärung",
    seoDescription:
      "Welche personenbezogenen Daten cantonlock.com über Formulare, Webanalyse und Hosting verarbeitet, zu welchem Zweck, wer sie erhält und wie Sie Ihre Rechte ausüben.",
    kicker: "Rechtliches",
    title: "Datenschutzerklärung",
    updatedLabel: "Stand",
    intro: `Diese Erklärung beschreibt, welche personenbezogenen Daten die ${legalName} bei der Nutzung von cantonlock.com verarbeitet, zu welchem Zweck und welche Rechte Sie haben. Wir verkaufen Türbeschläge an Unternehmen. Die Website richtet sich nicht an Verbraucher und hat keine Benutzerkonten.`,
    sections: [
      {
        id: "controller",
        heading: "1. Verantwortlicher",
        body: [
          `Verantwortlicher ist die ${legalName}, ${address}.`,
          `Für alle Fragen und Anliegen zum Datenschutz schreiben Sie an ${email}.`,
        ],
      },
      {
        id: "visit",
        heading: "2. Beim Besuch der Website",
        body: [
          "Unser Webserver und unser Dienstleister für Auslieferung und Sicherheit, Cloudflare, Inc. (101 Townsend St, San Francisco, CA 94107, USA), verarbeiten die technischen Daten, die jeder Browser übermittelt: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, verweisende Seite, Browser und Betriebssystem. Das ist erforderlich, um die Seiten auszuliefern, die Website vor automatisierten Angriffen zu schützen und Fehler zu untersuchen. Cloudflare kann ein kurzlebiges Sicherheits-Cookie setzen, um Menschen von Bots zu unterscheiden, und ersetzt E-Mail-Adressen im Seitentext durch einen geschützten Link, damit Spam-Roboter sie nicht auslesen können.",
          "Rechtsgrundlage: unser berechtigtes Interesse an einer sicheren, funktionsfähigen Website (Art. 6 Abs. 1 lit. f DSGVO). Protokolle werden nur so lange aufbewahrt, wie es für diese Zwecke erforderlich ist.",
          "Unsere Schrift und unsere Produktvideos werden von unserem eigenen Server ausgeliefert. Beim Aufruf einer Seite werden weder Google Fonts noch YouTube oder Vimeo kontaktiert.",
          "Die Website legt zwei kleine Einträge in Ihrem Browser ab. Keiner davon identifiziert Sie, und keiner wird an uns übertragen:",
          {
            list: [
              "im Session Storage die Katalogseite, von der Sie kamen, damit der Zurück-Link Sie an dieselbe Stelle führt. Der Eintrag wird beim Schließen des Tabs gelöscht;",
              "im Local Storage, wann das Aktionsfenster zuletzt angezeigt wurde und in welcher Version, damit es nicht zu früh erneut erscheint.",
            ],
          },
        ],
      },
      {
        id: "forms",
        heading: "3. Wenn Sie uns kontaktieren oder etwas anfordern",
        body: [
          "Die Website enthält vier Formulare. Jedes wird über Web3Forms (web3forms.com) versendet, einen Formulardienst, der Ihre Eingaben als E-Mail an unser Postfach weiterleitet. Ein verborgenes Feld filtert Spam-Roboter heraus; ein Captcha-Dienst wird nicht eingesetzt.",
          {
            table: {
              head: ["Formular", "Daten, die wir erhalten (* Pflichtfeld)", "Zweck"],
              rows: [
                ["Produktanfrage", "Name*, E-Mail*, Firma, Land, Produkt, Modell, Einsatzbereich, Menge, Nachricht*", "Beantwortung Ihrer Anfrage und Erstellung eines Angebots"],
                ["Dokument- oder Preislistenanfrage", "Name*, E-Mail*, Firma*, Land, Nachricht", "Zusendung des angeforderten Dokuments"],
                ["Terminanfrage BAU 2027", "Name*, E-Mail*, Firma, Land, Wunschtag und -uhrzeit, gewünschte Produkte, Nachricht", "Vereinbarung und Nachbereitung eines Termins auf der Messe"],
                ["Newsletter-Anfrage", "E-Mail*, Name, Firma, Land, Interessengebiet, Einwilligung*", "gelegentliche Informationen zu Produkten, Unterlagen und Messen"],
              ],
            },
          },
          "Sie können uns auch per E-Mail oder über WhatsApp schreiben. Wenn Sie den WhatsApp-Link nutzen, wird die Unterhaltung von WhatsApp / Meta nach deren eigenen Bedingungen verarbeitet.",
          "Rechtsgrundlage: für Anfragen, Dokument- und Terminanfragen vorvertragliche Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO) sowie unser berechtigtes Interesse an der Beantwortung geschäftlicher Anfragen (Art. 6 Abs. 1 lit. f DSGVO). Für den Newsletter Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit widerrufen können, indem Sie mit „Abmelden“ antworten oder an die Adresse in Abschnitt 1 schreiben.",
          "Anfragen bewahren wir so lange auf, wie es für ihre Beantwortung und Nachbereitung erforderlich ist, Geschäftskorrespondenz für die handels- und steuerrechtlichen Fristen. Newsletter-Adressen speichern wir bis zu Ihrer Abmeldung.",
        ],
      },
      {
        id: "analytics",
        heading: "4. Webanalyse",
        body: [
          "Um zu verstehen, welche Seiten und Produkte Einkäufer ansehen und wo die Website schwer zu bedienen ist, lädt jede Seite die folgenden Dienste.",
          "Google Analytics 4 und Google Tag Manager, Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics setzt Cookies und erfasst aufgerufene Seiten, ungefähren Standort, Gerät und Browser, Scrolltiefe, Lesedauer sowie Klicks auf Produkt- und Kontaktlinks. Google Analytics 4 speichert keine IP-Adressen. Der Google Tag Manager lädt solche Tags und erstellt selbst keine Profile. Daten können von Google LLC in den USA verarbeitet werden. Mehr: policies.google.com/privacy",
          "Microsoft Clarity, Anbieter: Microsoft Ireland Operations Ltd., One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland. Clarity erfasst, wie Besucher sich auf einer Seite bewegen, scrollen und klicken, und erstellt daraus Heatmaps und Sitzungsaufzeichnungen; Eingaben in Formularfelder werden maskiert. Wir kennzeichnen Sitzungen mit dem Seitentyp und damit, ob der Besucher überflogen oder gelesen hat. Daten können von der Microsoft Corporation in den USA verarbeitet werden. Mehr: privacy.microsoft.com/privacystatement",
          "Rechtsgrundlage: unser berechtigtes Interesse an der Verbesserung der Website für Einkäufer (Art. 6 Abs. 1 lit. f DSGVO). Sie können jederzeit widersprechen (Abschnitt 8). Sie können beide Dienste außerdem mit dem Tracking-Schutz Ihres Browsers oder einem Inhaltsblocker unterbinden oder das Deaktivierungs-Add-on von Google installieren (tools.google.com/dlpage/gaoptout).",
        ],
      },
      {
        id: "links",
        heading: "5. Links zu anderen Websites",
        body: [
          "Unsere Links zu YouTube, Instagram, Facebook, Pinterest, Tumblr und zu unserem Alibaba-Shop sind einfache Links. Erst wenn Sie einen davon anklicken, werden Daten an die jeweilige Plattform übertragen; danach gilt deren Datenschutzerklärung.",
        ],
      },
      {
        id: "recipients",
        heading: "6. Empfänger",
        body: [
          "Nur die oben genannten Dienstleister, unser Webhoster und unser E-Mail-Anbieter, die Daten jeweils für die hier beschriebenen Zwecke verarbeiten, sowie unsere eigenen Vertriebs- und Technikmitarbeiter. Wir verkaufen keine personenbezogenen Daten und geben sie nicht zu Werbezwecken an andere Unternehmen weiter.",
        ],
      },
      {
        id: "transfers",
        heading: "7. Übermittlung in Drittländer",
        body: [
          "Unser Unternehmen hat seinen Sitz in China; Ihre Anfrage wird dort gelesen und beantwortet. Google, Microsoft und Cloudflare können Daten in den USA verarbeiten; alle drei sind unter dem EU-U.S. Data Privacy Framework zertifiziert.",
        ],
      },
      {
        id: "rights",
        heading: "8. Ihre Rechte",
        body: [
          "Nach der DSGVO haben Sie das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20) sowie das Recht, eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen (Art. 7 Abs. 3).",
          "Widerspruchsrecht (Art. 21 DSGVO): Soweit wir Ihre Daten auf Grundlage eines berechtigten Interesses verarbeiten, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen. Der Verarbeitung zu Zwecken der Direktwerbung können Sie jederzeit ohne Angabe von Gründen widersprechen.",
          `Zur Ausübung dieser Rechte schreiben Sie an ${email}. Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, insbesondere in dem EU-Mitgliedstaat Ihres Aufenthalts oder Arbeitsplatzes.`,
        ],
      },
      {
        id: "other",
        heading: "9. Sonstiges",
        body: [
          "Sie sind nicht verpflichtet, uns personenbezogene Daten zu geben; ohne E-Mail-Adresse können wir eine Anfrage jedoch nicht beantworten. Wir setzen keine automatisierte Entscheidungsfindung mit rechtlicher Wirkung ein. Die Website richtet sich an Unternehmen, nicht an Kinder. Wir passen diese Erklärung an, wenn sich unsere Verarbeitung ändert; das Datum oben zeigt die aktuelle Fassung.",
        ],
      },
    ],
  },
};

export function privacyCopy(locale: PrivacyLocale): PrivacyCopy {
  return COPY[locale];
}
