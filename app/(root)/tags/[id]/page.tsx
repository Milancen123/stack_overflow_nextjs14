import QuestionsCard from "@/components/shared/cards/QuestionsCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getTagById } from "@/lib/actions/tag.actions";
import React from "react";

const Page = async ({ params, searchParams }: any) => {
  const result = await getTagById(params.id);

  return (
    <div>
      <h1 className="h1-bold text-dark300_light700">{result.name}</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </div>

      <section className="flex flex-col w-full gap-5 mt-8 ">
        {result.questions && result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionsCard
              _id={question._id}
              key={question._id}
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
            title={"There's no questions related to this tag"}
            description={"Be the first one to ask a question with this tag"}
            link={"/ask-question"}
            LinkTitle={"Ask a question"}
          />
        )}
      </section>
    </div>
  );
};

export default Page;
