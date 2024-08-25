import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/utils";
import React from "react";
const Loading = () => {
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 w-full lg:flex-row ">
          <div>
            <Skeleton className="rounded-full w-[140px] h-[140px]" />
          </div>

          <div className="mt-3 w-full line-clamp-1 max-xs:max-w-[310px]">
            <Skeleton className="w-[200px] h-[20px] mt-5" />
            <Skeleton className="w-[400px] h-[20px] mt-5" />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="h3-semibold text-dark200_light900">Stats</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          <div className=" flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6">
            <div>
              <Skeleton className="h-[56px]" />
            </div>
            <div>
              <Skeleton />
            </div>
          </div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              QuestionsTab
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              AnswersTab
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts"></TabsContent>
          <TabsContent value="answers"></TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Loading;
