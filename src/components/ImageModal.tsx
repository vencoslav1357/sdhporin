"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export default function ImageModal({
  images,
  currentIndex,
  onClose,
  onChangeIndex,
}: ImageModalProps) {
  const showPrev = useCallback(() => {
    onChangeIndex(
      (currentIndex - 1 + images.length) % images.length
    );
  }, [currentIndex, images.length, onChangeIndex]);

  const showNext = useCallback(() => {
    onChangeIndex((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onChangeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (images.length > 1) showPrev();
          break;
        case "ArrowRight":
          if (images.length > 1) showNext();
          break;
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, showPrev, showNext, images.length]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galerie fotografií"
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Zavřít galerii"
        className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            showPrev();
          }}
          aria-label="Předchozí fotografie"
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative w-[90vw] h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt={`Fotografie ${currentIndex + 1} z ${images.length} – galerie SDH Pořín`}
          fill
          sizes="90vw"
          className="object-contain rounded-lg"
          priority
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            showNext();
          }}
          aria-label="Další fotografie"
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
