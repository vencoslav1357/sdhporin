import { pripravovane_akce } from "@data/events";

const SITE_URL = "https://sdhporin.cz";

function formatDate(date: { day: number; month: number; year: number }) {
  return `${date.day}. ${date.month}. ${date.year}`;
}

function toIsoDate(date: { day: number; month: number; year: number }) {
  const m = String(date.month).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");
  return `${date.year}-${m}-${d}`;
}

function sortEventsByDate(events: typeof pripravovane_akce) {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date.year, a.date.month - 1, a.date.day);
    const dateB = new Date(b.date.year, b.date.month - 1, b.date.day);
    return dateA.getTime() - dateB.getTime();
  });
}

export default function EventsSection() {
  const sortedEvents = sortEventsByDate(pripravovane_akce);

  const eventsSchema = sortedEvents.map((item) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: item.title,
    description: item.text || `${item.title} – akce SDH Pořín.`,
    startDate: toIsoDate(item.date),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "SDH Pořín",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Pořín 71",
        addressLocality: "Dolní Hořice",
        postalCode: "391 55",
        addressCountry: "CZ",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "SDH Pořín",
      url: SITE_URL,
    },
    image: `${SITE_URL}/images/logo.png`,
  }));

  return (
    <section
      id="akce"
      aria-labelledby="akce-heading"
      className="py-16 md:py-24 bg-gray-50/50"
    >
      {sortedEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-[60px] bg-red-500" />
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">
              Kalendář
            </span>
          </div>
          <h2
            id="akce-heading"
            className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Připravované akce SDH Pořín
          </h2>
        </div>

        {/* Events list */}
        <ol className="space-y-4 md:space-y-6 max-w-3xl list-none p-0">
          {sortedEvents.map((item, index) => (
            <li
              key={index}
              className="group bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-black/5 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5"
            >
              <article
                itemScope
                itemType="https://schema.org/Event"
                className="flex items-start gap-5"
              >
                {/* Date badge */}
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-red-500/20">
                  <time
                    dateTime={toIsoDate(item.date)}
                    itemProp="startDate"
                    content={toIsoDate(item.date)}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl md:text-3xl font-black leading-none">
                      {item.date.day}
                    </span>
                    <span className="text-[10px] md:text-xs font-medium uppercase mt-0.5 opacity-90">
                      {[
                        "Led",
                        "Úno",
                        "Bře",
                        "Dub",
                        "Kvě",
                        "Čvn",
                        "Čvc",
                        "Srp",
                        "Zář",
                        "Říj",
                        "Lis",
                        "Pro",
                      ][item.date.month - 1]}
                    </span>
                  </time>
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    itemProp="name"
                    className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-1"
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {formatDate(item.date)}
                  </p>
                  <p
                    itemProp="description"
                    className="text-gray-600 leading-relaxed"
                  >
                    {item.text}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>

        {sortedEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              Zatím nejsou žádné naplánované akce.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
