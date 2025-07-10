"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const defaultImage = "/images/placeholder.jpg";

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        <Image
          src={defaultImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  if (showAllImages) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={imageError[index] ? defaultImage : image}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover"
                onError={() => handleImageError(index)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAllImages(false)}
          className="text-primary hover:underline"
        >
          Show less
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        <Image
          src={imageError[currentImageIndex] ? defaultImage : images[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          onError={() => handleImageError(currentImageIndex)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Previous image"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Next image"
            >
              <FiChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            {images.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
            {images.length > 5 && <span className="text-sm text-gray-500">+{images.length - 5} more</span>}
          </div>
          
          {images.length > 1 && (
            <button
              onClick={() => setShowAllImages(true)}
              className="text-primary hover:underline text-sm"
            >
              Show all photos
            </button>
          )}
        </div>
      )}
    </div>
  );
} 