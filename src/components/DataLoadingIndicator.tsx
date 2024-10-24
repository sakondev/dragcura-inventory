import React from "react";
import { Loader2 } from "lucide-react";

const DataLoadingIndicator = () => {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">กำลังโหลดข้อมูล...</span>
      </div>
    </div>
  );
};

export default DataLoadingIndicator;