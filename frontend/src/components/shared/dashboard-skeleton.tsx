import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-64 bg-gray-100 rounded-md"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-11 w-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 border-none shadow-sm bg-gray-50/50"></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-80 bg-gray-50 rounded-xl"></div>
        <Card className="h-80"></Card>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
        <div className="h-64 bg-gray-50 rounded-xl border"></div>
      </div>
    </div>
  );
}
