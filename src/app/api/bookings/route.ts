import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

// Schema validation
const bookingSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  totalPrice: z.number().min(0, "Total price must be a positive number"),
});

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = bookingSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { listingId, startDate, endDate, totalPrice } = validation.data;
    const userId = session.user.id as string;

    // Check if listing exists
    const listing = await db.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if listing is available
    if (!listing.isAvailable) {
      return NextResponse.json(
        { message: "Listing is not available for booking" },
        { status: 400 }
      );
    }

    // Check if user is not booking their own listing
    if (listing.ownerId === userId) {
      return NextResponse.json(
        { message: "You cannot book your own listing" },
        { status: 400 }
      );
    }

    // Check for date conflicts with existing bookings
    const conflictingBooking = await db.booking.findFirst({
      where: {
        listingId,
        status: { in: ["pending", "confirmed", "active"] },
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } },
            ],
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } },
            ],
          },
          {
            AND: [
              { startDate: { gte: new Date(startDate) } },
              { endDate: { lte: new Date(endDate) } },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { message: "The listing is not available for the selected dates" },
        { status: 409 }
      );
    }

    // Create the booking
    const booking = await db.booking.create({
      data: {
        listingId,
        renterId: userId,
        ownerId: listing.ownerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        status: "pending",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 