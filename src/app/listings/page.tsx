import { Suspense } from "react";
import Link from "next/link";

import db from "@/lib/db";
import ListingCard from "@/components/listings/ListingCard";
import ListingsFilter from "@/components/listings/ListingsFilter";
import ListingsSkeleton from "@/components/listings/ListingsSkeleton";

export const metadata = {
  title: "Browse Listings | Rent Anything",
  description: "Browse all available items for rent",
};

type ListingsPageProps = {
  searchParams: Promise<{
    category?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  }>;
};

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const params = await searchParams;
  const {
    category,
    location,
    minPrice,
    maxPrice,
    sortBy = "createdAt_desc",
  } = params;

  // Build filter conditions
  const filters: any = {};

  if (category) {
    filters.category = {
      slug: category,
    };
  }

  if (location) {
    filters.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.gte = parseFloat(minPrice);
    if (maxPrice) filters.price.lte = parseFloat(maxPrice);
  }

  // Parse sorting
  const [sortField, sortDirection] = sortBy.split("_");
  const orderBy = { [sortField]: sortDirection };

  // Fetch categories for filter
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Listings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ListingsFilter
            categories={categories}
            initialFilters={params}
          />
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<ListingsSkeleton count={6} />}>
            <ListingsContent
              filters={filters}
              orderBy={orderBy}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ListingsContent({
  filters,
  orderBy,
}: {
  filters: any;
  orderBy: any;
}) {
  // Fetch listings with filters
  const listings = await db.listing.findMany({
    where: {
      isAvailable: true,
      ...filters,
    },
    include: {
      owner: true,
      category: true,
    },
    orderBy,
  });

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-4">No listings found</h3>
        <p className="text-gray-500 mb-6">
          Try adjusting your filters or browse all listings
        </p>
        <Link
          href="/listings"
          className="btn-primary inline-block"
        >
          View All Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing as any} />
      ))}
    </div>
  );
} 