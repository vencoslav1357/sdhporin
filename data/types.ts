// Typy dat webu — aktuality (news.json) a připravované akce (events.json).
// Data se spravují přes admin panel na /admin.

export interface EventDate {
  day: number;
  month: number;
  year: number;
}

export interface NewsItem {
  date: EventDate;
  title: string;
  mainImage: string;
  preview: string;
  fullText: string;
  gallery: string[];
}

export interface EventItem {
  date: EventDate;
  title: string;
  text: string;
}
