import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Image from "next/image";

import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import ProfileForm from "@/components/profile/ProfileForm";
import ListingGrid from "@/components/listings/ListingGrid";

export const metadata = {
  title: "My Profile | Rent Anything",
  description: "Manage your profile and listings",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = session.user.id as string;

  // Fetch user with their listings
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      listings: {
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex flex-col items-center mb-6">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={100}
                  height={100}
                  className="rounded-full mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500 text-3xl font-medium">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Member since</span>
                <span>
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Listings</span>
                <span>{user.listings.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
            <ProfileForm user={user} />
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Listings</h2>
              <a
                href="/listings/new"
                className="btn-primary py-2 px-4"
              >
                Create New Listing
              </a>
            </div>

            {user.listings.length > 0 ? (
              <ListingGrid listings={user.listings} />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500 mb-4">
                  You haven't created any listings yet.
                </p>
                <a
                  href="/listings/new"
                  className="btn-primary py-2 px-4"
                >
                  Create Your First Listing
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 