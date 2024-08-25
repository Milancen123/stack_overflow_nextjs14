import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark300_light700">Saved Questions</h1>
      <div className="flex flex-col gap-4 mt-10">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton key={item} className="w-full min-h-[150px] rounded-xl" />
        ))}
      </div>
    </>
  );
};

export default Loading;
