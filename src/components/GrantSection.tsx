import Image from "next/image";

// Povinná publicita projektu podpořeného přes MAS Krajina srdce (SZP 2023–2027, LEADER).
// Text a loga odpovídají dodanému podkladu publicita.docx.
export default function GrantSection() {
  return (
    <section
      id="dotace"
      aria-labelledby="dotace-heading"
      className="py-16 md:py-24 bg-gray-50 cv-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-[60px] bg-red-500" />
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">
              Podpořené projekty
            </span>
          </div>
          <h2
            id="dotace-heading"
            className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Nákup vybavení hasičské zbrojnice SDH Pořín
          </h2>
        </div>

        <div className="max-w-3xl bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 md:p-10">
          <Image
            src="/images/dotace/spolufinancovano-eu.jpg"
            alt="Vlajka EU – Spolufinancováno Evropskou unií"
            width={1190}
            height={250}
            loading="lazy"
            className="h-14 md:h-16 w-auto mb-8"
          />

          <div className="space-y-6">
            <p className="text-lg md:text-xl font-semibold text-gray-900 leading-relaxed">
              Projekt byl podpořen z prostředků MAS Krajina srdce, z. s.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Sbor dobrovolných hasičů Pořín získal podporu na pořízení
              vybavení, které bude využíváno pro spolkovou činnost SDH. Nákupem
              motorového kalového čerpadla a hasičského vysavače zvýší
              akceschopnost našeho sboru, urychlí pomoc obyvatelům při
              mimořádných událostech a přispěje ke snížení škod na majetku.
              Pořízené vybavení bude sloužit při zásazích, preventivní činnosti
              i údržbě a posílí naši schopnost pomáhat obci při lokálních
              záplavách, přívalových deštích a dalších havarijních situacích.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Projekt byl spolufinancován EU prostřednictvím Strategického plánu
              SZP na období 2023–2027 v rámci intervence LEADER za aktivní
              součinnosti MAS Krajina srdce, která pomáhá rozvíjet náš region.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-x-10 gap-y-6">
            <Image
              src="/images/dotace/strategicky-plan-szp.jpg"
              alt="Logo Strategický plán SZP"
              width={721}
              height={149}
              loading="lazy"
              className="h-10 md:h-12 w-auto"
            />
            <Image
              src="/images/dotace/mas-krajina-srdce.jpg"
              alt="Logo MAS Krajina srdce"
              width={500}
              height={174}
              loading="lazy"
              className="h-12 md:h-14 w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
