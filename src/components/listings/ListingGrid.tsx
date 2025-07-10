"use client";

import { Listing, Category } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

interface ListingWithCategory extends Listing {
  category?: Category;
}

interface ListingGridProps {
  listings: ListingWithCategory[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingGridItem key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

function ListingGridItem({ listing }: { listing: ListingWithCategory }) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(listing.price));

  const defaultImage = "/images/placeholder.jpg";
  const imageUrl = listing.images.length > 0 ? listing.images[0] : defaultImage;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col">
      <div className="relative">
        <Link href={`/listings/${listing.id}`}>
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              listing.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {listing.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 bg-primary text-white px-2 py-1 text-sm font-medium">
          {formattedPrice}/day
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <Link href={`/listings/${listing.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-primary">
            {listing.title}
          </h3>
        </Link>

        <div className="text-sm text-gray-600 mb-2">
          {listing.category?.name}
          {listing.location && (
            <>
              <span className="mx-1">•</span>
              <span>{listing.location}</span>
            </>
          )}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {listing.description}
        </p>

        <div className="mt-auto pt-4 flex justify-between items-center border-t mt-4">
          <Link
            href={`/listings/${listing.id}`}
            className="text-primary hover:underline text-sm"
          >
            View Details
          </Link>
          <Link
            href={`/listings/${listing.id}/edit`}
            className="text-sm border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1 rounded transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
} 