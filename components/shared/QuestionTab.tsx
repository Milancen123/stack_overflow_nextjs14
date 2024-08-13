import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionsCard from "./cards/QuestionsCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | undefined | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({ userId, page: 1 });
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
    </>
  );
};

export default QuestionTab;
