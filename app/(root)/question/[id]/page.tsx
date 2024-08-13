import { getQuestionById } from "@/lib/actions/question.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { formatNumber, getTimestamp } from "@/lib/utils";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Answer from "@/components/forms/Answer";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import { getAnswers } from "@/lib/actions/answer.action";
import AnswerCard from "@/components/shared/cards/AnswerCard";
import Filter from "@/components/shared/Filter";
import { AnswerFilters } from "@/constants/filters";
import { Button } from "@/components/ui/button";
import Vote from "@/components/shared/Vote";
import { redirect } from "next/navigation";
import NoResult from "@/components/shared/NoResult";

const Page = async ({ params, searchParams }: any) => {
  const result = await getQuestionById({ questionId: params.id });
  const { userId } = auth();
  console.log(userId);
  if (!userId) throw new Error("No user with this id");
  let mongoUser = await getUserById({ userId: userId });
  let questionId: string = params.id;
  let authorId: string = mongoUser._id.toString();

  const answers = await getAnswers({ questionId });
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse flex-1 justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              alt="user profile picture"
              className="rounded-full"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <Vote
            questionId={questionId}
            userId={authorId}
            clerkId={userId}
            path={`/question/${questionId}`}
            isUpvoted={result.upvotes.includes(authorId)}
            isDownvoted={result.downvotes.includes(authorId)}
            isSaved={mongoUser.saved.includes(questionId)}
            numUpvotes={result.upvotes.length}
            numDownvotes={result.downvotes.length}
          />
        </div>
      </div>
      <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
        {result.title}
      </h2>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={`asked ${getTimestamp(result.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />

        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />

        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.content} />
      <div className="flex mt-8 flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            name={tag.name}
            _id={tag._id}
            showCount={false}
          />
        ))}
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h3 className="h3-bold text-primary-500 shadow-none dark:text-primary-500">
            {answers.answers.length}
            {answers.answers.length != 1 ? " Answers" : " Answer"}
          </h3>
          <Filter filters={AnswerFilters} />
        </div>
        <div className="flex flex-col mt-8 gap-6">
          {answers.answers && answers.answers.length > 0 ? (
            //@ts-ignore
            answers.answers.map((answer) => (
              <AnswerCard
                key={answer._id}
                _id={answer._id.toString()}
                user={authorId}
                author_id={answer.author._id.toString()}
                author_picture={answer.author.picture}
                author_name={answer.author.name}
                upvotes={answer.upvotes}
                downvotes={answer.downvoted}
                createdAt={answer.createdAt}
                question_id={answer.question}
                content={answer.content}
              />
            ))
          ) : (
            // title, description, link, LinkTitle
            <NoResult
              title={"There's no answers to show"}
              description={
                "Be the first to break the silence! Answer the question, and help the developer find the solution"
              }
              link={"/ask-question"}
              LinkTitle={"Ask a question"}
            />
          )}
        </div>
        <Answer authorId={authorId} questionId={questionId} />
      </div>
    </>
  );
};

export default Page;
