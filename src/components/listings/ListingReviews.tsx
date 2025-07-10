"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { FaStar } from "react-icons/fa";

import { useAuth } from "@/contexts/AuthContext";
import { Review, User } from "@prisma/client";

interface ReviewWithUser extends Review {
  reviewer: User;
}

interface ListingReviewsProps {
  reviews: ReviewWithUser[];
  listingId: string;
}

export default function ListingReviews({ reviews, listingId }: ListingReviewsProps) {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      // Reset form and hide it
      setRating(5);
      setComment("");
      setShowReviewForm(false);

      // Refresh the page to show new review
      window.location.reload();
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

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Reviews{" "}
          {reviews.length > 0 && (
            <span className="text-gray-600">
              ({reviews.length}) · {averageRating.toFixed(1)}{" "}
              <FaStar className="inline-block text-yellow-500 mb-1" />
            </span>
          )}
        </h2>
        {user && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="text-primary hover:underline"
          >
            Write a review
          </button>
        )}
      </div>

      {showReviewForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      size={24}
                      className={`${
                        star <= rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Comment
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                disabled={isLoading}
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="btn-primary py-2 px-4"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-secondary py-2 px-4"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center mb-3">
                {review.reviewer.image ? (
                  <Image
                    src={review.reviewer.image}
                    alt={review.reviewer.name || "Reviewer"}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500 font-medium">
                    {review.reviewer.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{review.reviewer.name}</h4>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            } w-4 h-4`}
                          />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {review.comment && <p className="text-gray-700">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 