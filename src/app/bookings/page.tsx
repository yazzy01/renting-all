import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import BookingList from "@/components/bookings/BookingList";
import BookingTabs from "@/components/bookings/BookingTabs";

export const metadata = {
  title: "My Bookings | Rent Anything",
  description: "Manage your bookings and rentals",
};

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = session.user.id as string;
  const params = await searchParams;
  const activeTab = params.tab || "bookings"; // Default to "bookings" tab

  // Fetch user bookings (items they're renting)
  const bookings = await db.booking.findMany({
    where: {
      renterId: userId,
    },
    include: {
      listing: {
        include: {
          owner: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch user rentals (items they're renting out)
  const rentals = await db.booking.findMany({
    where: {
      listing: {
        ownerId: userId,
      },
    },
    include: {
      listing: true,
      renter: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>

      <BookingTabs activeTab={activeTab} />

      <div className="mt-6">
        {activeTab === "bookings" ? (
          <BookingList
            bookings={bookings}
            type="bookings"
            emptyMessage="You haven't made any bookings yet."
          />
        ) : (
          <BookingList
            bookings={rentals}
            type="rentals"
            emptyMessage="You don't have any rental requests yet."
          />
        )}
      </div>
    </div>
  );
} 