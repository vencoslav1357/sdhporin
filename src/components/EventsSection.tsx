import { pripravovane_akce } from "@data/events";

function formatDate(date: { day: number; month: number; year: number }) {
  return `${date.day}. ${date.month}. ${date.year}`;
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

  return (
    <section id="akce" className="py-16 md:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-[60px] bg-red-500" />
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">
              Kalendář
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Připravované akce
          </h2>
        </div>

        {/* Events list */}
        <div className="space-y-4 md:space-y-6 max-w-3xl">
          {sortedEvents.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-black/5 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-5">
                {/* Date badge */}
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-red-500/20">
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
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {formatDate(item.date)}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

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
