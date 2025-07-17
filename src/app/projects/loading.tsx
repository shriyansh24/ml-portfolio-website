export default function ProjectsLoading() {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mb-8 animate-pulse"></div>
        <div className="h-4 w-full max-w-2xl bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 w-3/4 max-w-xl bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mb-12 animate-pulse"></div>
        
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800">
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="p-5 space-y-4">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="h-9 flex-1 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-9 flex-1 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}