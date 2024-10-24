import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="ml-2 text-lg text-gray-600">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;