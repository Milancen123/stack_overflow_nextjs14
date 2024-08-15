import TagCard from "@/components/shared/cards/TagCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.actions";
import { SearchParamsProps } from "@/types";
import React from "react";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4 max-sm:flex-col max-sm:justify-center">
        {result && result.tags.length > 0 ? (
          result.tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <NoResult
            title={"There's no tags to show"}
            description={
              "Be the first to break the silence! Ask a question, and help the developer find the solution"
            }
            link={"/ask-question"}
            LinkTitle={"Ask a question"}
          />
        )}
      </section>
    </>
  );
};

export default Page;
