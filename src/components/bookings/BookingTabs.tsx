"use client";

import Link from "next/link";

interface BookingTabsProps {
  activeTab: string;
}

export default function BookingTabs({ activeTab }: BookingTabsProps) {
  const tabs = [
    { id: "bookings", label: "My Bookings" },
    { id: "rentals", label: "Rental Requests" },
  ];

  return (
    <div className="border-b">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/bookings?tab=${tab.id}`}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
} 