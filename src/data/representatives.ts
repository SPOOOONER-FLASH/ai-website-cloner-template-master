/**
 * Overseas representative contact points.
 *
 * WHAT THESE ARE, AND WHAT THEY ARE NOT. Canton Hyland manufactures in Zhongshan and has
 * no overseas subsidiary. The addresses below are where a representative can be reached
 * in that market — they are deliberately labelled "representative contact" rather than
 * "office", because two of them are residential buildings and one is a trade-fair ground,
 * and a buyer who checks an address will find exactly that.
 *
 * Claiming them as company offices would be the cheapest possible win and the most
 * expensive one to lose: an importer who looks up "960 W 7th Street" and finds an
 * apartment tower stops believing the rest of the page too. The whole point of publishing
 * a factory address, an ISO number and real spec data is that every one of them survives
 * being checked. Client decision, 2026-09-01.
 *
 * Not emitted into Organization JSON-LD as `location` or `branch` for the same reason.
 * The one structured claim made from this file is the US telephone number, which is a
 * real direct line to a real person.
 */

export interface Representative {
  region: string;
  regionEs: string;
  /** The city a buyer would search for, not the building name. */
  city: string;
  address: string;
  /** Present only where the client supplied a direct line. */
  phone?: string;
  /**
   * Where mail for this market actually lands.
   *
   * Client decision, 2026-09-03. North America goes to a person, not a shared mailbox —
   * the account manager reads it directly, which for two contact points in one time zone
   * is faster than a queue. China and Germany route to the company addresses, which are
   * split by function rather than by region: hyde@ for general enquiries, lock@ for
   * orders and pricing, tec@ for drawings and specification.
   */
  email: string;
  /** Why this address exists, in the buyer's terms. Kept honest and short. */
  note?: string;
  noteEs?: string;
}

export const representatives: Representative[] = [
  {
    region: "United States",
    regionEs: "Estados Unidos",
    city: "Los Angeles, California",
    address: "960 W. 7th Street, Los Angeles, CA 90017",
    phone: "+1 703 967 7493",
    email: "spoonerlau@gmail.com",
    note: "Account manager for North America. Call or email for pricing, samples and shipping to US destinations.",
    noteEs:
      "Responsable de cuentas para Norteamérica. Llame o escriba para precios, muestras y envíos a destinos de EE. UU.",
  },
  {
    region: "United States",
    regionEs: "Estados Unidos",
    city: "Arlington, Virginia",
    address: "550 14th St S, Arlington, VA 22202",
    phone: "+1 703 967 7493",
    email: "spoonerlau@gmail.com",
    note: "East-coast contact point, in the Washington D.C. metro area.",
    noteEs: "Punto de contacto en la costa este, área metropolitana de Washington D. C.",
  },
  {
    region: "Germany",
    regionEs: "Alemania",
    city: "Cologne",
    address: "Koelnmesse, Messeplatz 1, 50679 Cologne",
    email: "hyde@cantonlock.com",
    note: "Where we exhibit in Germany. Meetings can be arranged around the Cologne fair calendar.",
    noteEs:
      "Donde exponemos en Alemania. Se pueden concertar reuniones en torno al calendario ferial de Colonia.",
  },
  {
    region: "Germany",
    regionEs: "Alemania",
    city: "Remagen",
    address: "Bachstraße 2, 53424 Remagen",
    email: "hyde@cantonlock.com",
    note: "Contact point for the Rhineland region.",
    noteEs: "Punto de contacto para la región de Renania.",
  },
];
