"use client";

import { useState, useCallback } from "react";
import { udalosti } from "@data/news";
import ImageModal from "./ImageModal";

function formatDate(date: { day: number; month: number; year: number }) {
  return `${date.day}. ${date.month}. ${date.year}`;
}

function sortNewsByDate(news: typeof udalosti) {
  return [...news].sort((a, b) => {
    const dateA = new Date(a.date.year, a.date.month - 1, a.date.day);
    const dateB = new Date(b.date.year, b.date.month - 1, b.date.day);
    return dateB.getTime() - dateA.getTime();
  });
}

export default function NewsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState(0);

  const sortedNews = sortNewsByDate(udalosti);

  const handleCardClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleImageClick = useCallback(
    (e: React.MouseEvent, images: string[], clickedIndex: number) => {
      e.stopPropagation();
      setModalImages(images);
      setModalIndex(clickedIndex);
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalImages([]);
    setModalIndex(0);
  }, []);

  return (
    <section id="udalosti" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-[60px] bg-red-500" />
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">
              Novinky
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Události
          </h2>
        </div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedNews.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const isHidden =
              expandedIndex !== null && expandedIndex !== index;

            const allImages = [
              `/images/${item.mainImage}`,
              ...item.gallery.map((img) => `/images/${img}`),
            ];

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`group cursor-pointer transition-all duration-500 ${
                  isExpanded
                    ? "md:col-span-2 lg:col-span-3"
                    : ""
                } ${
                  isHidden
                    ? "hidden"
                    : ""
                }`}
              >
                <div
                  className={`bg-white rounded-2xl overflow-hidden border border-gray-100 transition-[box-shadow,transform] duration-500 ${
                    isExpanded
                      ? "shadow-2xl shadow-black/10"
                      : "shadow-md shadow-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
                  }`}
                >
                  {!isExpanded ? (
                    /* Collapsed card */
                    <>
                      <div className="relative overflow-hidden">
                        <img
                          src={`/images/${item.mainImage}`}
                          alt={item.title}
                          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                          <span className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h3>
                        {item.preview && (
                          <p className="text-gray-500 text-sm line-clamp-2">
                            {item.preview}
                          </p>
                        )}
                        <div className="mt-4 flex items-center text-red-500 text-sm font-medium">
                          Číst více
                          <svg
                            className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Expanded card */
                    <div className="p-6 md:p-8">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedIndex(null);
                        }}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Zpět na přehled
                      </button>

                      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        <div className="md:w-1/3">
                          <img
                            src={`/images/${item.mainImage}`}
                            alt={item.title}
                            className="w-full rounded-xl object-cover cursor-zoom-in"
                            onClick={(e) =>
                              handleImageClick(e, allImages, 0)
                            }
                          />
                        </div>
                        <div className="md:w-2/3">
                          <span className="text-red-500 text-sm font-medium">
                            {formatDate(item.date)}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-4">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                            {item.fullText}
                          </p>
                        </div>
                      </div>

                      {/* Gallery */}
                      {item.gallery.length > 0 && (
                        <div className="mt-8">
                          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Galerie
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {allImages.map((img, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt="Fotografie z události"
                                className="w-full h-32 md:h-40 object-cover rounded-xl cursor-zoom-in hover:opacity-90 transition-opacity"
                                onClick={(e) =>
                                  handleImageClick(
                                    e,
                                    allImages,
                                    imgIndex
                                  )
                                }
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {sortedNews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              Zatím nejsou žádné aktuality.
            </p>
          </div>
        )}
      </div>

      {/* Image modal */}
      {modalImages.length > 0 && (
        <ImageModal
          images={modalImages}
          currentIndex={modalIndex}
          onClose={closeModal}
          onChangeIndex={setModalIndex}
        />
      )}
    </section>
  );
}
