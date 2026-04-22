import { aboutData } from "@data/contact";

export default function AboutSection() {
  return (
    <section
      id="o-nas"
      aria-labelledby="o-nas-heading"
      className="py-16 md:py-24 cv-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-[60px] bg-red-500" />
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">
              Kdo jsme
            </span>
          </div>
          <h2
            id="o-nas-heading"
            className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            O Sboru dobrovolných hasičů Pořín
          </h2>
        </div>

        <div className="max-w-3xl">
          <div className="space-y-6">
            {aboutData.description.map((text, index) => (
              <p
                key={index}
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
              >
                {text}
              </p>
            ))}
          </div>

          {/* Stats / highlights */}
          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 text-center">
              <dt className="sr-only">Rok založení sboru</dt>
              <dd className="text-3xl md:text-4xl font-black text-red-600 mb-1">
                1899
              </dd>
              <p className="text-sm text-gray-500 font-medium">
                Rok založení
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 text-center">
              <dt className="sr-only">Práce s dětmi od roku</dt>
              <dd className="text-3xl md:text-4xl font-black text-red-600 mb-1">
                2016
              </dd>
              <p className="text-sm text-gray-500 font-medium">
                Děti od roku
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 text-center">
              <dt className="sr-only">Kulturní akce</dt>
              <dd
                aria-hidden="true"
                className="text-3xl md:text-4xl font-black text-red-600 mb-1"
              >
                🎉
              </dd>
              <p className="text-sm text-gray-500 font-medium">
                Kulturní akce
              </p>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
