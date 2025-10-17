// app/workspace/loading.js
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-white">
      <Skeleton className="h-10 w-64 rounded-lg" />
      <Skeleton className="h-10 w-56 rounded-lg" />
      <Skeleton className="h-10 w-64 rounded-lg" />
      <div className="text-gray-700 text-lg font-medium animate-pulse">
        Preparing your workspace...
      </div>
    </div>
  );
}
