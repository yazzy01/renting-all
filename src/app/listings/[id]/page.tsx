import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";

import db from "@/lib/db";
import BookingForm from "@/components/bookings/BookingForm";
import ListingGallery from "@/components/listings/ListingGallery";
import ListingReviews from "@/components/listings/ListingReviews";

interface ListingDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ListingDetailPageProps) {
  const listing = await db.listing.findUnique({
    where: { id: params.id },
  });

  if (!listing) {
    return {
      title: "Listing Not Found",
      description: "The listing you're looking for doesn't exist.",
    };
  }

  return {
    title: `${listing.title} | Rent Anything`,
    description: listing.description.substring(0, 160),
  };
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const listing = await db.listing.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      category: true,
      reviews: {
        include: {
          reviewer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(listing.price));

  const joinDate = format(new Date(listing.owner.createdAt), "MMMM yyyy");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <span>{listing.category.name}</span>
            {listing.location && (
              <>
                <span className="mx-1">•</span>
                <span>{listing.location}</span>
              </>
            )}
          </div>

          <ListingGallery images={listing.images} title={listing.title} />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              {listing.latitude && listing.longitude ? (
                <div className="w-full h-full">
                  {/* Map component would go here */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    Map placeholder - {listing.location}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">{listing.location || "Location not specified"}</p>
              )}
            </div>
          </div>

          <ListingReviews reviews={listing.reviews} listingId={listing.id} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold">{formattedPrice}<span className="text-sm font-normal text-gray-600">/day</span></div>
              </div>

              <BookingForm listingId={listing.id} price={Number(listing.price)} />
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">About the Owner</h3>
              
              <div className="flex items-center mb-4">
                {listing.owner.image ? (
                  <Image
                    src={listing.owner.image}
                    alt={listing.owner.name || "Owner"}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 mr-4 flex items-center justify-center text-gray-500 text-xl font-medium">
                    {listing.owner.name?.charAt(0) || "U"}
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold">{listing.owner.name}</h4>
                  <p className="text-sm text-gray-600">Member since {joinDate}</p>
                </div>
              </div>

              <button className="w-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors py-2 rounded-md mb-3">
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 