export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="card">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-5 bg-gray-800 rounded w-16" />
                <div className="h-5 bg-gray-800 rounded w-16" />
                <div className="h-5 bg-gray-800 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-800 rounded w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
