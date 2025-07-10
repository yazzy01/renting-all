import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import ListingForm from "@/components/listings/ListingForm";

export const metadata = {
  title: "Create New Listing | Rent Anything",
  description: "List your item for rent",
};

export default async function CreateListingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch categories for the form
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Listing</h1>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <ListingForm categories={categories} />
      </div>
    </div>
  );
} 