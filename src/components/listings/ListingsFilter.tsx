"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";

interface ListingsFilterProps {
  categories: Category[];
  initialFilters: {
    category?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  };
}

export default function ListingsFilter({
  categories,
  initialFilters,
}: ListingsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: initialFilters.category || "",
    location: initialFilters.location || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    sortBy: initialFilters.sortBy || "createdAt_desc",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.category) params.set("category", filters.category);
    if (filters.location) params.set("location", filters.location);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);

    router.push(`/listings?${params.toString()}`);
  }, [filters, router]);

  const resetFilters = useCallback(() => {
    setFilters({
      category: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt_desc",
    });
    router.push("/listings");
  }, [router]);

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            placeholder="Any location"
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium mb-1">
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="Min"
              min="0"
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="Max"
              min="0"
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
          >
            <option value="createdAt_desc">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={applyFilters}
            className="btn-primary flex-1 py-2"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="btn-secondary flex-1 py-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
} 