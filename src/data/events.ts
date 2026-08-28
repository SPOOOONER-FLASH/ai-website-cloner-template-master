import eventsFile from "../../content/events.json";

export type EventStatus = "planned-visit" | "exhibiting" | "researching";

export interface TradeEvent {
  slug: string;
  name: string;
  market: string;
  city: string;
  venue: string;
  startDate?: string;
  endDate?: string;
  status: EventStatus;
  statusLabel: string;
  summary: string;
  sourceUrl?: string;
  published: boolean;
}

export const events = eventsFile.events as TradeEvent[];

export function getPublishedEvents(): TradeEvent[] {
  return events
    .filter((event) => event.published && event.startDate && event.endDate && event.sourceUrl)
    .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
}

export function formatEventDateRange(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  const monthYear = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(end);

  return `${start.getUTCDate()}–${end.getUTCDate()} ${monthYear}`;
}
