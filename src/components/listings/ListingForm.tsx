"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category, Listing } from "@prisma/client";
import { FiUpload, FiX } from "react-icons/fi";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce
    .number()
    .min(1, "Price must be at least 1")
    .max(10000, "Price cannot exceed 10,000"),
  categoryId: z.string().min(1, "Please select a category"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  images: z
    .array(z.string())
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  categories: Category[];
  listing?: Listing;
}

export default function ListingForm({ categories, listing }: ListingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(listing?.images || []);
  const [imageUploadError, setImageUploadError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      price: listing?.price ? Number(listing.price) : undefined,
      categoryId: listing?.categoryId || "",
      location: listing?.location || "",
      images: listing?.images || [],
    },
  });

  // Set images in the form when they change
  useState(() => {
    setValue("images", images);
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 10) {
      setImageUploadError("Maximum 10 images allowed");
      return;
    }

    setImageUploadError("");

    // In a real app, you would upload these to a storage service like S3
    // For this demo, we'll just create data URLs
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        setImageUploadError("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          
          // When all images are processed
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages]);
            setValue("images", [...images, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setValue("images", newImages);
  };

  const onSubmit = async (data: ListingFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const url = listing 
        ? `/api/listings/${listing.id}` 
        : "/api/listings";
      
      const method = listing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save listing");
      }

      router.push(`/listings/${result.id}`);
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
    <div>
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            placeholder="What are you renting out?"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            placeholder="Describe your item in detail"
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price per day ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price")}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              placeholder="0.00"
              disabled={isLoading}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register("location")}
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            placeholder="City, State"
            disabled={isLoading}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          
          <div className="mb-2">
            <label
              htmlFor="images"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
            >
              <div className="flex flex-col items-center">
                <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload images (max 10)
                </span>
              </div>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading || images.length >= 10}
              />
            </label>
          </div>

          {imageUploadError && (
            <p className="text-red-500 text-sm mb-2">{imageUploadError}</p>
          )}

          {errors.images && (
            <p className="text-red-500 text-sm mb-2">{errors.images.message}</p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Listing image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    aria-label="Remove image"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="btn-primary py-2 px-4"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : listing
              ? "Update Listing"
              : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
} 