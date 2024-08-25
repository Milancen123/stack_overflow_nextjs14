import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionsCard from "./cards/QuestionsCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | undefined | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <>
      {result &&
        result.questions.map((question) => (
          <QuestionsCard
            key={question._id}
            _id={question._id}
            clerkId={clerkId}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes.length}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result ? result.isNext : false}
        />
      </div>
    </>
  );
};

export default QuestionTab;
