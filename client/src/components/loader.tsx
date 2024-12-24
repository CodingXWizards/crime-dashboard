export const Loader = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
      </div>
      <span className="text-sm text-gray-500">Loading data...</span>
    </div>
  </div>
); 