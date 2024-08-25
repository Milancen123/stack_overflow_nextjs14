import QuestionsCard from "@/components/shared/cards/QuestionsCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import { getAllSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { useSearchParams } from "next/navigation";
import React from "react";
import Loading from "./loading";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const clerkId = auth().userId;
  if (!clerkId) throw new Error("No user with this id");

  const results = await getAllSavedQuestions({
    clerkId,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  // title, tags, author, upvotes, views, answers, createdAt
  return (
    <div>
      <h1 className="h1-bold text-dark300_light700">Saved Questions</h1>
      <div className="flex flex-col gap-4 mt-10">
        {results && results.saved.length > 0 ? (
          //@ts-ignore
          results.saved.map((question) => (
            <QuestionsCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title={"There's no saved questions"}
            description={"Search for question, and save the favorite one"}
            link={"/"}
            LinkTitle={"Explore the questions"}
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={results ? results.isNext : false}
        />
      </div>
    </div>
  );
};

export default Page;
