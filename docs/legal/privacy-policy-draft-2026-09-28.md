# Privacy policy — DRAFT for review (EN + DE)

**Status: draft, not published, not legal advice.** Nothing here is linked from the site.
Every `[OWNER]` marker needs a fact only the company has; every `[LAWYER]` marker needs a
decision from a lawyer qualified in EU/German data-protection law. Do not publish until both
are cleared and the three blockers below are resolved.

Written 2026-09-28 from the code as it stood at `origin/main` that day. Every statement about
what the site collects is traced to a file, listed in the evidence table at the end. If the
code changes (a new tag in GTM, a new form, a new embed), this text is stale.

---

## Read first: three blockers

These are not wording problems. The policy cannot truthfully describe the site until they are
fixed, because the site currently does something the policy would have to call unlawful.

| # | Blocker | Why it matters | Fix |
|---|---|---|---|
| 1 | **Analytics fire before any consent.** GA4 (`G-RBTE7KF82P`), Google Tag Manager (`GTM-MQHHPGJL`) and Microsoft Clarity (`y8utyrgvv0`) load on every page for every visitor. There is no consent banner. | In Germany §25 TDDDG and in the EU the ePrivacy Directive require prior consent to read/write non-essential identifiers on a device. GA4 sets cookies; Clarity records sessions. The `/de/` pages and BAU 2027 (Munich) make EU targeting explicit, so GDPR applies (Art. 3(2)). | Add a consent banner that gates `Analytics.tsx` as a whole (the code comment there already says so), with Google Consent Mode v2 and Clarity's consent API. The draft below is written for the site *after* that fix. `[OWNER]` choose a consent tool. |
| 2 | **No EU representative.** The controller is established only in China. | Art. 27 GDPR requires a non-EU controller that targets EU residents to appoint a representative in the EU in writing. The policy must name it. | `[OWNER]` appoint one (commercial services exist, typically a few hundred €/year). `[LAWYER]` confirm the Art. 27(2) "occasional processing" exemption does not apply; with continuous analytics and a trade-fair campaign it very likely does not. |
| 3 | **Controller identity is inconsistent.** `content/site-settings.json` gives two street addresses (No. 28 Lehe Road, Lianfeng Industry Park, Xiaolan Town vs. No. 76 Haiwei Road) and a US phone number (+1 703 967 7493) for a Chinese company. | A privacy policy must name the controller and a working contact exactly. | `[OWNER]` confirm the registered legal address and a privacy contact address (suggest a dedicated `privacy@cantonlock.com`). |

## Other points needing input

| # | Point | Who |
|---|---|---|
| 4 | **Web3Forms**: identity of the operator, its location, whether it offers a data-processing agreement (Art. 28), and how long it keeps submissions. All four forms post to `api.web3forms.com`. If no DPA is available, consider switching to a provider that offers one (or a form endpoint on the company's own server). | OWNER + LAWYER |
| 5 | **Email hosting**: which provider runs the `@cantonlock.com` mailboxes (where the form data lands), and where its servers are. | OWNER |
| 6 | **Origin server**: where the web server is hosted (country, provider) and how long its access logs are kept. The runbook says it pulls from GitHub every five minutes but not where it is. | OWNER |
| 7 | **Cloudflare**: confirm the account's plan; Cloudflare's DPA is part of its standard terms. Bot Fight Mode and email obfuscation are on. | OWNER |
| 8 | **Newsletter**: the form sends a *request* by email; there is no double opt-in and no named mailing tool. Which tool sends the updates? German practice expects double opt-in to prove consent (§7 UWG). | OWNER + LAWYER |
| 9 | **Retention periods** for inquiries, document requests, BAU meeting requests and newsletter addresses. Placeholders below. | OWNER |
| 10 | **Transfer to China.** The controller itself is in China, which has no EU adequacy decision. Whether data collected directly from the visitor by a non-EU controller is a "transfer" under Chapter V is disputed (EDPB Guidelines 05/2021 say no); onward transfers to service providers in China would be. Wording in §9 below is a placeholder. | LAWYER |
| 11 | **Microsoft Clarity** since late 2025 requires a consent signal for visitors from the EEA, UK and Switzerland; confirm the project's Clarity settings (masking mode, whether recordings are enabled) so §6.3 is accurate. | OWNER |
| 12 | **China PIPL** may apply to the processing done in China. Out of scope of this draft. | LAWYER |
| 13 | **Impressum.** The footer links "Imprint" and "Privacy Notice" to `/company` as placeholders (`SiteFooter.tsx`). German visitors will expect a real Impressum; whether §5 DDG binds a foreign provider is debated, but it is the market norm. | LAWYER |
| 14 | **Other languages.** The site's main locales are EN, ES and PT, and it also serves FR, RU, TR, AR, JA, KO. This draft covers EN and DE only. A Spanish and Portuguese version should follow once the English text is approved. | OWNER decides scope |
| 15 | **GTM container contents.** The code says GTM holds neither GA4 nor Clarity. Anything else added inside the GTM container (Meta pixel, LinkedIn, Ads conversion) must be added to §6. | OWNER |

---

# ENGLISH VERSION

## Privacy Notice

*Last updated: [DATE OF PUBLICATION]*

This notice explains what personal data Canton Hyland Hardware (Group) Co., Ltd. collects
when you use **cantonlock.com**, why, and what rights you have. We sell door hardware to
businesses; this site does not sell to consumers and does not require an account.

### 1. Who is responsible

Canton Hyland Hardware (Group) Co., Ltd.
[OWNER: registered address — see blocker 3]
Zhongshan, Guangdong, China
Email: [OWNER: privacy@cantonlock.com or chosen address]

**Our representative in the European Union (Art. 27 GDPR):**
[OWNER: name, address and email of the appointed EU representative — see blocker 2]

You may contact the representative instead of us on any data-protection matter.

### 2. When you simply visit the site

**Server and network logs.** Our web server and our content-delivery and security provider,
Cloudflare, Inc. (101 Townsend St, San Francisco, CA 94107, USA), process the technical data
every browser sends: IP address, date and time, the page requested, referrer, browser and
operating system. We need this to deliver the pages, protect the site from automated attacks
and investigate faults. Cloudflare may set a short-lived security cookie (for example
`__cf_bm`) to tell people from bots, and replaces email addresses in the page with a protected
link so they cannot be harvested by spam robots.

*Legal basis:* our legitimate interest in a secure and working website (Art. 6(1)(f) GDPR);
the security cookie is strictly necessary (§25(2) TDDDG).
*Retention:* [OWNER: server log retention, e.g. 14 days]. Cloudflare's own retention is set out in its privacy policy.

**Fonts and videos.** Our typeface and our product videos are served from our own server.
Visiting the site does not contact Google Fonts, YouTube or Vimeo.

**Browser storage.** The site stores two small items in your browser, neither of which
identifies you or is sent to us:
- in *session storage*, the catalogue page you came from, so the back link returns you to the
  same place; deleted when you close the tab;
- in *local storage*, the date on which the promotions panel was last shown and its version,
  so it is not shown again too soon.

*Legal basis:* both serve a function you use on the site (§25(2) no. 2 TDDDG). [LAWYER:
confirm the promotions-panel entry qualifies as strictly necessary; if not, move it behind consent.]

### 3. When you contact us or request something

The site has four forms. Each is sent through **Web3Forms** [OWNER/LAWYER: operator name and
address — see point 4], a form-delivery service that forwards the content to our mailbox as
an email. A hidden field filters out spam robots; no captcha service is used.

| Form | Where | Data we receive (\* required) | Purpose |
|---|---|---|---|
| Product inquiry | Contact pages | name\*, email\*, company, country, product, model, application, quantity, message\* | to answer your inquiry and prepare a quotation |
| Document / price-list request | Price-list and document pages | name\*, email\*, company\*, country, message | to send the requested document |
| BAU 2027 meeting request | BAU 2027 pages | name\*, email\*, company, country, preferred day and time, products of interest, message | to arrange and follow up a meeting at the fair |
| Newsletter request | Newsletter page | email\*, name, company, country, topic of interest, consent\* | to send occasional product, technical-document and exhibition updates |

You may also write to us directly by email or on WhatsApp. If you use the WhatsApp link, the
conversation is processed by WhatsApp Ireland Ltd. / Meta under their own terms.

*Legal basis:* for inquiries, document and meeting requests, taking steps before a possible
contract at your request (Art. 6(1)(b) GDPR) and our legitimate interest in answering business
enquiries (Art. 6(1)(f) GDPR); for the newsletter, your consent (Art. 6(1)(a) GDPR), which you
can withdraw at any time by replying "unsubscribe" or writing to the address in §1.
*Retention:* [OWNER: e.g. inquiries that do not lead to business, 2 years after the last
contact; business correspondence for the periods commercial and tax law require; newsletter
addresses until you unsubscribe]. [OWNER: Web3Forms retention — see point 4.]

### 4. Analytics — only with your consent

With your consent, given in the cookie banner, we use the services below to understand which
pages and products buyers look at, and where the site is hard to use. Without consent none of
them is loaded. You can change your choice at any time via [OWNER: "Cookie settings" link in
the footer].

**4.1 Google Analytics 4 and Google Tag Manager.** Provided by Google Ireland Limited, Gordon
House, Barrow Street, Dublin 4, Ireland. Google Analytics sets cookies (`_ga`, `_ga_*`) and
records pages viewed, approximate location, device and browser, how far you scroll, how long
you read, and clicks on product and contact links. IP addresses are not stored by Google
Analytics 4. Google Tag Manager is the loader for such tags; it does not itself profile you.
Data may be processed by Google LLC in the USA, which is certified under the EU-U.S. Data
Privacy Framework. Retention in Google Analytics: [OWNER: 2 or 14 months, per the GA4 property
setting]. More: https://policies.google.com/privacy

**4.2 Microsoft Clarity.** Provided by Microsoft Ireland Operations Ltd., One Microsoft Place,
South County Business Park, Leopardstown, Dublin 18, Ireland. Clarity records how visitors
move, scroll and click on a page and produces heatmaps and session replays. Text you type into
form fields is masked and not recorded [OWNER: confirm masking setting — point 11]. We tag
sessions with the type of page and whether the visitor skimmed or read, so we can improve
product pages. Data may be processed by Microsoft Corporation in the USA, certified under the
EU-U.S. Data Privacy Framework. Clarity keeps recordings for 30 days and aggregated data for
13 months. More: https://privacy.microsoft.com/privacystatement

*Legal basis:* your consent (Art. 6(1)(a) GDPR; §25(1) TDDDG).

### 5. Links to other sites

Links to our pages on YouTube, Instagram, Facebook, Pinterest, Tumblr and our Alibaba
storefront are plain links. No data is sent to those platforms until you click one; after that
their own privacy policies apply.

### 6. Who receives your data

Only the service providers named above (Cloudflare, our web host [OWNER: point 6], Web3Forms,
our email provider [OWNER: point 5], and, with consent, Google and Microsoft), each bound to
process data only on our instructions, and our own sales and technical staff. We do not sell
personal data or pass it to other companies for their marketing.

### 7. International transfers

We are based in China, and your inquiry is read and answered there. [LAWYER: wording on the
basis for data reaching the controller in China and on any onward transfers — see point 10.]
Transfers to the USA (Google, Microsoft, Cloudflare) are covered by the EU-U.S. Data Privacy
Framework and, where it does not apply, the European Commission's standard contractual clauses.

### 8. Your rights

Under the GDPR you have the right to access your data (Art. 15), to have it corrected
(Art. 16) or deleted (Art. 17), to restrict its processing (Art. 18), to receive it in a
portable format (Art. 20), and to withdraw any consent at any time with effect for the future
(Art. 7(3)).

**Right to object (Art. 21 GDPR).** Where we process your data on the basis of legitimate
interest, you may object at any time on grounds relating to your particular situation. You
may object to direct marketing at any time without giving reasons.

To exercise any right, write to the address in §1 or to our EU representative. You also have
the right to lodge a complaint with a data-protection supervisory authority, in particular in
the EU member state where you live or work.

### 9. Other

You are not obliged to provide personal data, but without an email address we cannot answer
an inquiry. We do not use automated decision-making or profiling with legal effect. The site
is aimed at businesses and not at children. We will update this notice when our processing
changes; the date at the top shows the current version.

---

# DEUTSCHE FASSUNG

## Datenschutzerklärung

*Stand: [DATUM DER VERÖFFENTLICHUNG]*

Diese Erklärung beschreibt, welche personenbezogenen Daten die Canton Hyland Hardware (Group)
Co., Ltd. bei der Nutzung von **cantonlock.com** verarbeitet, zu welchem Zweck und welche
Rechte Sie haben. Wir verkaufen Türbeschläge an Unternehmen; die Website richtet sich nicht an
Verbraucher und erfordert kein Benutzerkonto.

### 1. Verantwortlicher

Canton Hyland Hardware (Group) Co., Ltd.
[OWNER: eingetragene Anschrift — siehe Blocker 3]
Zhongshan, Guangdong, China
E-Mail: [OWNER: privacy@cantonlock.com oder gewählte Adresse]

**Unser Vertreter in der Europäischen Union (Art. 27 DSGVO):**
[OWNER: Name, Anschrift und E-Mail des bestellten EU-Vertreters — siehe Blocker 2]

Sie können sich in allen Datenschutzfragen auch an unseren Vertreter wenden.

### 2. Beim bloßen Besuch der Website

**Server- und Netzwerkprotokolle.** Unser Webserver und unser Dienstleister für
Auslieferung und Sicherheit, Cloudflare, Inc. (101 Townsend St, San Francisco, CA 94107, USA),
verarbeiten die technischen Daten, die jeder Browser übermittelt: IP-Adresse, Datum und
Uhrzeit, aufgerufene Seite, Referrer, Browser und Betriebssystem. Das ist erforderlich, um die
Seiten auszuliefern, die Website vor automatisierten Angriffen zu schützen und Fehler zu
untersuchen. Cloudflare kann ein kurzlebiges Sicherheits-Cookie (z. B. `__cf_bm`) setzen, um
Menschen von Bots zu unterscheiden, und ersetzt E-Mail-Adressen im Seitentext durch einen
geschützten Link, damit Spam-Roboter sie nicht auslesen können.

*Rechtsgrundlage:* unser berechtigtes Interesse an einer sicheren und funktionsfähigen Website
(Art. 6 Abs. 1 lit. f DSGVO); das Sicherheits-Cookie ist unbedingt erforderlich (§ 25 Abs. 2 TDDDG).
*Speicherdauer:* [OWNER: Aufbewahrung der Server-Logs, z. B. 14 Tage]. Die Speicherdauer bei
Cloudflare ergibt sich aus dessen Datenschutzerklärung.

**Schriften und Videos.** Unsere Schrift und unsere Produktvideos werden von unserem eigenen
Server ausgeliefert. Beim Besuch der Website werden weder Google Fonts noch YouTube oder Vimeo
kontaktiert.

**Speicher im Browser.** Die Website legt zwei kleine Einträge in Ihrem Browser ab, die Sie
nicht identifizieren und nicht an uns übertragen werden:
- im *Session Storage* die Katalogseite, von der Sie kamen, damit der Zurück-Link Sie an
  dieselbe Stelle führt; gelöscht beim Schließen des Tabs;
- im *Local Storage* das Datum, an dem das Aktionsfenster zuletzt angezeigt wurde, und dessen
  Version, damit es nicht zu früh erneut erscheint.

*Rechtsgrundlage:* beide dienen einer von Ihnen genutzten Funktion der Website (§ 25 Abs. 2
Nr. 2 TDDDG). [LAWYER: prüfen, ob der Eintrag zum Aktionsfenster unbedingt erforderlich ist;
falls nicht, hinter die Einwilligung verschieben.]

### 3. Wenn Sie uns kontaktieren oder etwas anfordern

Die Website enthält vier Formulare. Jedes wird über **Web3Forms** [OWNER/LAWYER: Name und
Anschrift des Betreibers — siehe Punkt 4] versendet, einen Dienst, der den Inhalt als E-Mail
an unser Postfach weiterleitet. Ein verborgenes Feld filtert Spam-Roboter heraus; ein
Captcha-Dienst wird nicht eingesetzt.

| Formular | Ort | Daten, die wir erhalten (\* Pflichtfeld) | Zweck |
|---|---|---|---|
| Produktanfrage | Kontaktseiten | Name\*, E-Mail\*, Firma, Land, Produkt, Modell, Einsatzbereich, Menge, Nachricht\* | Beantwortung Ihrer Anfrage und Erstellung eines Angebots |
| Dokument- / Preislistenanfrage | Preislisten- und Dokumentseiten | Name\*, E-Mail\*, Firma\*, Land, Nachricht | Zusendung des angeforderten Dokuments |
| Terminanfrage BAU 2027 | Seiten zur BAU 2027 | Name\*, E-Mail\*, Firma, Land, Wunschtag und -uhrzeit, gewünschte Produkte, Nachricht | Vereinbarung und Nachbereitung eines Termins auf der Messe |
| Newsletter-Anfrage | Newsletter-Seite | E-Mail\*, Name, Firma, Land, Interessengebiet, Einwilligung\* | gelegentliche Informationen zu Produkten, technischen Unterlagen und Messen |

Sie können uns auch direkt per E-Mail oder über WhatsApp schreiben. Wenn Sie den
WhatsApp-Link nutzen, wird die Unterhaltung von WhatsApp Ireland Ltd. / Meta nach deren
eigenen Bedingungen verarbeitet.

*Rechtsgrundlage:* für Anfragen, Dokument- und Terminanfragen die Durchführung
vorvertraglicher Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO) sowie unser
berechtigtes Interesse an der Beantwortung geschäftlicher Anfragen (Art. 6 Abs. 1 lit. f
DSGVO); für den Newsletter Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit
widerrufen können, indem Sie mit „Abmelden“ antworten oder an die Adresse in Abschnitt 1 schreiben.
*Speicherdauer:* [OWNER: z. B. Anfragen ohne Geschäftsabschluss 2 Jahre nach dem letzten
Kontakt; Geschäftskorrespondenz für die handels- und steuerrechtlichen Fristen;
Newsletter-Adressen bis zur Abmeldung]. [OWNER: Speicherdauer bei Web3Forms — siehe Punkt 4.]

### 4. Webanalyse — nur mit Ihrer Einwilligung

Mit Ihrer Einwilligung, die Sie im Cookie-Banner erteilen, nutzen wir die folgenden Dienste,
um zu verstehen, welche Seiten und Produkte Einkäufer ansehen und wo die Website schwer zu
bedienen ist. Ohne Einwilligung wird keiner davon geladen. Sie können Ihre Auswahl jederzeit
über [OWNER: Link „Cookie-Einstellungen“ im Footer] ändern.

**4.1 Google Analytics 4 und Google Tag Manager.** Anbieter: Google Ireland Limited, Gordon
House, Barrow Street, Dublin 4, Irland. Google Analytics setzt Cookies (`_ga`, `_ga_*`) und
erfasst aufgerufene Seiten, ungefähren Standort, Gerät und Browser, Scrolltiefe, Lesedauer
sowie Klicks auf Produkt- und Kontaktlinks. Google Analytics 4 speichert keine IP-Adressen.
Der Google Tag Manager lädt solche Tags; er erstellt selbst keine Profile. Daten können von
Google LLC in den USA verarbeitet werden, die unter dem EU-U.S. Data Privacy Framework
zertifiziert ist. Speicherdauer in Google Analytics: [OWNER: 2 oder 14 Monate laut
GA4-Einstellung]. Mehr: https://policies.google.com/privacy

**4.2 Microsoft Clarity.** Anbieter: Microsoft Ireland Operations Ltd., One Microsoft Place,
South County Business Park, Leopardstown, Dublin 18, Irland. Clarity erfasst, wie Besucher sich
auf einer Seite bewegen, scrollen und klicken, und erstellt daraus Heatmaps und
Sitzungsaufzeichnungen. Texte, die Sie in Formularfelder eingeben, werden maskiert und nicht
aufgezeichnet [OWNER: Maskierungseinstellung bestätigen — Punkt 11]. Wir kennzeichnen
Sitzungen mit dem Seitentyp und damit, ob der Besucher überflogen oder gelesen hat, um
Produktseiten zu verbessern. Daten können von der Microsoft Corporation in den USA verarbeitet
werden, die unter dem EU-U.S. Data Privacy Framework zertifiziert ist. Clarity speichert
Aufzeichnungen 30 Tage und aggregierte Daten 13 Monate. Mehr:
https://privacy.microsoft.com/privacystatement

*Rechtsgrundlage:* Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO; § 25 Abs. 1 TDDDG).

### 5. Links zu anderen Websites

Die Links zu unseren Seiten auf YouTube, Instagram, Facebook, Pinterest, Tumblr und zu unserem
Alibaba-Shop sind einfache Links. Erst wenn Sie einen davon anklicken, werden Daten an die
jeweilige Plattform übertragen; danach gilt deren Datenschutzerklärung.

### 6. Empfänger

Nur die oben genannten Dienstleister (Cloudflare, unser Webhoster [OWNER: Punkt 6],
Web3Forms, unser E-Mail-Anbieter [OWNER: Punkt 5] und, mit Einwilligung, Google und
Microsoft), die jeweils nur nach unserer Weisung verarbeiten dürfen, sowie unsere eigenen
Vertriebs- und Technikmitarbeiter. Wir verkaufen keine personenbezogenen Daten und geben sie
nicht zu Werbezwecken an andere Unternehmen weiter.

### 7. Übermittlung in Drittländer

Unser Unternehmen hat seinen Sitz in China; Ihre Anfrage wird dort gelesen und beantwortet.
[LAWYER: Formulierung zur Grundlage für Daten, die den Verantwortlichen in China erreichen, und
zu etwaigen Weiterübermittlungen — siehe Punkt 10.] Übermittlungen in die USA (Google,
Microsoft, Cloudflare) sind durch das EU-U.S. Data Privacy Framework und, soweit dieses nicht
greift, durch die Standardvertragsklauseln der Europäischen Kommission abgesichert.

### 8. Ihre Rechte

Nach der DSGVO haben Sie das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung
(Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20) sowie
das Recht, eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen
(Art. 7 Abs. 3).

**Widerspruchsrecht (Art. 21 DSGVO).** Soweit wir Ihre Daten auf Grundlage eines berechtigten
Interesses verarbeiten, können Sie aus Gründen, die sich aus Ihrer besonderen Situation
ergeben, jederzeit widersprechen. Der Verarbeitung zu Zwecken der Direktwerbung können Sie
jederzeit ohne Angabe von Gründen widersprechen.

Zur Ausübung Ihrer Rechte schreiben Sie an die Adresse in Abschnitt 1 oder an unseren
EU-Vertreter. Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
beschweren, insbesondere in dem EU-Mitgliedstaat Ihres Aufenthalts oder Arbeitsplatzes.

### 9. Sonstiges

Sie sind nicht verpflichtet, personenbezogene Daten anzugeben; ohne E-Mail-Adresse können wir
eine Anfrage jedoch nicht beantworten. Wir setzen keine automatisierte Entscheidungsfindung
oder Profiling mit rechtlicher Wirkung ein. Die Website richtet sich an Unternehmen, nicht an
Kinder. Wir passen diese Erklärung an, wenn sich unsere Verarbeitung ändert; das Datum oben
zeigt die aktuelle Fassung.

---

## Evidence: where each claim comes from

| Claim | Source |
|---|---|
| GA4 `G-RBTE7KF82P`, Clarity `y8utyrgvv0`, GTM `GTM-MQHHPGJL`, loaded whenever `indexable` is true (it is) | `src/data/site.ts:44-68`, `src/components/site/Analytics.tsx` |
| No consent gating anywhere | `Analytics.tsx:48-49` (comment: "if a consent banner is added later…") |
| Events: scroll depth, read style, product and contact clicks; Clarity tags `page_type`, `read_style` | `src/components/site/EngagementTracker.tsx`, `src/lib/engagement.ts` |
| Four forms, fields and required flags | `InquiryForm.tsx`, `AssetRequestForm.tsx`, `BauMeetingForm.tsx`, `NewsletterForm.tsx` |
| All forms post to `api.web3forms.com` with a `botcheck` honeypot | `src/lib/inquiry-submit.ts`, each form |
| Newsletter consent checkbox text | `NewsletterForm.tsx:105-117` |
| BAU form's existing privacy line (EN/DE) | `content/bau-2027.json:43,85` |
| Font self-hosted via `next/font` | `src/app/fonts.ts` |
| Product videos self-hosted (`/videos/products/*.mp4`); embed code would use youtube-nocookie / Vimeo `dnt=1` if a hosted URL were ever added | `content/products/*.json`, `ProductVideo.tsx` |
| sessionStorage catalogue return; localStorage promo cooldown `{lastSeen, version}` | `CatalogueNavigation.tsx`, `PromoDialog.tsx:42-70` |
| Cloudflare email obfuscation and Bot Fight Mode | `EmailLink.tsx:18`, `Analytics.tsx` header comment |
| Controller name, addresses, phone, mailboxes, social links | `content/site-settings.json` |
| Footer "Imprint"/"Privacy Notice" point to `/company` placeholders | `SiteFooter.tsx:14-30` |
