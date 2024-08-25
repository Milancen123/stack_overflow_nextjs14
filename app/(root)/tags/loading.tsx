import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex justify-between gap-5 w-full max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[56px] flex-1" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </div>
      <div className="flex flex-wrap mt-10 gap-5 w-full max-sm:flex-col">
        {[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ].map((item) => (
          <Skeleton key={item} className="min-h-[200px] min-w-[150px]" />
        ))}
      </div>
    </>
  );
};

export default Loading;
