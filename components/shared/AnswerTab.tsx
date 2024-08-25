import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import UserAnswersCard from "./cards/UserAnswersCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | undefined | null;
}
const AnswerTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams?.page ? +searchParams.page : 1,
  });

  return (
    <div className="flex flex-col gap-5">
      {result &&
        result.answers.map((item) => (
          <UserAnswersCard
            key={item._id}
            clerkId={clerkId}
            _id={item._id}
            question={item.question}
            author={item.author}
            upvotes={item.upvotes.length}
            createdAt={item.createdAt}
          />
        ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result ? result.isNext : false}
        />
      </div>
    </div>
  );
};

export default AnswerTab;
