export default function ListingsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white h-full flex flex-col animate-pulse">
      <div className="w-full h-48 bg-gray-200" />

      <div className="p-4 flex-grow flex flex-col">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        
        <div className="mt-auto pt-3 flex items-center justify-between border-t">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200 mr-2" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
} 