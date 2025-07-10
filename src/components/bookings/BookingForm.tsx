"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { differenceInDays, addDays } from "date-fns";

import { useAuth } from "@/contexts/AuthContext";

const bookingSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  listingId: string;
  price: number;
}

export default function BookingForm({ listingId, price }: BookingFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = addDays(new Date(), 1).toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      startDate: today,
      endDate: tomorrow,
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Calculate total price when dates change
  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = differenceInDays(end, start);
      
      if (days > 0) {
        return days * price;
      }
    }
    return price; // Default to 1 day
  };

  // Update total price when dates change
  useState(() => {
    setTotalPrice(calculateTotalPrice());
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          startDate: data.startDate,
          endDate: data.endDate,
          totalPrice: calculateTotalPrice(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      router.push(`/bookings/${result.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formattedTotalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalPrice);

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            {...register("startDate")}
            min={today}
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            disabled={isLoading}
            onChange={() => setTotalPrice(calculateTotalPrice())}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            {...register("endDate")}
            min={startDate || today}
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            disabled={isLoading}
            onChange={() => setTotalPrice(calculateTotalPrice())}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
          )}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span className="font-semibold">{formattedTotalPrice}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary py-3"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Book Now"}
        </button>

        <p className="text-xs text-center text-gray-500 mt-2">
          You won't be charged yet
        </p>
      </form>
    </div>
  );
} 