"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { FiChevronRight } from "react-icons/fi";

import { Booking, Listing, User } from "@prisma/client";

interface BookingWithDetails extends Booking {
  listing: Listing & {
    owner?: User;
    category?: { name: string };
  };
  renter?: User;
}

interface BookingListProps {
  bookings: BookingWithDetails[];
  type: "bookings" | "rentals";
  emptyMessage: string;
}

export default function BookingList({
  bookings,
  type,
  emptyMessage,
}: BookingListProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setIsUpdating(bookingId);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update booking status");
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsUpdating(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
        <Link href="/listings" className="btn-primary inline-block mt-4">
          Browse Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white border rounded-lg overflow-hidden shadow-sm"
        >
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/4 h-48 md:h-auto relative">
              <Link href={`/listings/${booking.listingId}`}>
                <div className="w-full h-full relative">
                  <Image
                    src={
                      booking.listing.images?.[0] || "/images/placeholder.jpg"
                    }
                    alt={booking.listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </Link>
            </div>

            {/* Content */}
            <div className="p-6 md:w-3/4 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link
                    href={`/listings/${booking.listingId}`}
                    className="text-xl font-semibold hover:text-primary"
                  >
                    {booking.listing.title}
                  </Link>
                  {booking.listing.category && (
                    <p className="text-gray-600 text-sm">
                      {booking.listing.category.name}
                    </p>
                  )}
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {formatStatus(booking.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Dates</p>
                  <p className="font-medium">
                    {format(new Date(booking.startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(booking.endDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(Number(booking.totalPrice))}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t flex justify-between items-center">
                <div className="flex items-center">
                  {type === "bookings" ? (
                    // Show owner info for bookings
                    booking.listing.owner && (
                      <>
                        {booking.listing.owner.image ? (
                          <Image
                            src={booking.listing.owner.image}
                            alt={booking.listing.owner.name || "Owner"}
                            width={28}
                            height={28}
                            className="rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 mr-2" />
                        )}
                        <span className="text-sm">
                          Owner: {booking.listing.owner.name}
                        </span>
                      </>
                    )
                  ) : (
                    // Show renter info for rentals
                    booking.renter && (
                      <>
                        {booking.renter.image ? (
                          <Image
                            src={booking.renter.image}
                            alt={booking.renter.name || "Renter"}
                            width={28}
                            height={28}
                            className="rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 mr-2" />
                        )}
                        <span className="text-sm">
                          Renter: {booking.renter.name}
                        </span>
                      </>
                    )
                  )}
                </div>

                <div className="flex space-x-2">
                  {/* Action buttons based on booking status and type */}
                  {type === "rentals" && booking.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "confirmed")
                        }
                        disabled={isUpdating === booking.id}
                        className="btn-primary py-1 px-3 text-sm"
                      >
                        {isUpdating === booking.id
                          ? "Updating..."
                          : "Accept"}
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "cancelled")
                        }
                        disabled={isUpdating === booking.id}
                        className="btn-secondary py-1 px-3 text-sm"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  <Link
                    href={`/bookings/${booking.id}`}
                    className="flex items-center text-primary hover:underline text-sm"
                  >
                    Details <FiChevronRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper functions
function getStatusClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "active":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-purple-100 text-purple-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
} 