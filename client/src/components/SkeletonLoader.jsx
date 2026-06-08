export const RouteSkeleton = () => (
  <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-8 animate-pulse flex flex-col h-full">
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mb-4 self-end"></div>
    <div className="space-y-4 sm:space-y-6 flex-grow">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="space-y-2 w-full">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="pl-4 py-1">
        <div className="w-0.5 h-6 bg-gray-200"></div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="space-y-2 w-full">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

export const CabSkeleton = () => (
  <div className="bg-white rounded-[16px] sm:rounded-[24px] border border-gray-200 animate-pulse flex flex-col h-full overflow-hidden">
    <div className="h-28 sm:h-48 w-full bg-gray-200"></div>
    <div className="p-3 sm:p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 w-1/2">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="space-y-2 w-1/4">
          <div className="h-3 bg-gray-200 rounded w-full ml-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 bg-gray-200 rounded-xl"></div>
        <div className="h-6 w-16 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="mt-auto h-10 sm:h-12 w-full bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);
