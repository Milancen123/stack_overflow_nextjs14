import Link from "next/link";
import React from "react";
import { formatNumber } from "@/lib/utils";

interface Props {
  tag: {
    _id: string;
    followers: string[];
    name: string;
    questions: string[];
    description: string;
  };
}

const TagCard = ({ tag }: Props) => {
  return (
    <Link href={`/tags/${tag._id}`} className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10  max-sm:min-w-[300px] max-sm:items-center">
        <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
          <p className="paragraph-semibold text-dark300_light900 line-clamp-1">
            {tag.name}
          </p>
        </div>
        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {formatNumber(tag.questions.length)}+
          </span>{" "}
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
