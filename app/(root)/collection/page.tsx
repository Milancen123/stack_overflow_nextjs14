import QuestionsCard from "@/components/shared/cards/QuestionsCard";
import NoResult from "@/components/shared/NoResult";
import { getAllSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const Page = async () => {
  const clerkId = auth().userId;
  if (!clerkId) throw new Error("No user with this id");

  const results = await getAllSavedQuestions({ clerkId });
  // title, tags, author, upvotes, views, answers, createdAt
  return (
    <div>
      <h1 className="h1-bold text-dark300_light700">Saved Questions</h1>
      <div className="flex flex-col gap-4 mt-10">
        {results && results.length > 0 ? (
          //@ts-ignore
          results.map((question) => (
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
    </div>
  );
};

export default Page;
