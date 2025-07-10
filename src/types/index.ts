import { User, Listing, Category, Booking, Review } from "@prisma/client";

// Extended types with relations
export type SafeUser = Omit<User, "hashedPassword"> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type ListingWithOwner = Listing & {
  owner: SafeUser;
  category: Category;
};

export type BookingWithListing = Booking & {
  listing: Listing;
  renter: SafeUser;
};

export type ReviewWithDetails = Review & {
  reviewer: SafeUser;
  listing: Listing;
};

// Form types
export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export type ListingFormData = {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  location: string;
  images: string[];
}; 