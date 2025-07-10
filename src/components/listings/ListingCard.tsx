"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { ListingWithOwner } from "@/types";

interface ListingCardProps {
  listing: ListingWithOwner;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    price,
    images,
    location,
    category,
    owner,
    createdAt,
  } = listing;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  const defaultImage = "/images/placeholder.jpg";
  const imageUrl = images.length > 0 && !imageError ? images[0] : defaultImage;

  return (
    <Link href={`/listings/${id}`}>
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white h-full flex flex-col">
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 bg-primary text-white px-2 py-1 text-sm font-medium">
            {formattedPrice}/day
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="line-clamp-1">{category.name}</span>
            {location && (
              <>
                <span className="mx-1">•</span>
                <span className="line-clamp-1">{location}</span>
              </>
            )}
          </div>
          
          <div className="mt-auto pt-3 flex items-center justify-between text-sm border-t">
            <div className="flex items-center">
              {owner.image ? (
                <Image
                  src={owner.image}
                  alt={owner.name || "Owner"}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 mr-2" />
              )}
              <span>{owner.name}</span>
            </div>
            <span className="text-gray-500">{timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 