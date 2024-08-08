import { getTimestamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ParseHTML from "../ParseHTML";
import AnswerVote from "../AnswerVote";

interface Props {
  _id: string;
  user: string;
  author_id: string;
  author_picture: string;
  author_name: string;
  upvotes: string[];
  downvotes: string[];
  createdAt: Date;
  question_id: string;
  content: string;
}

// answerId: string;
//   userId: string;
//   path: string;
//   isUpvoted: boolean;
//   isDownvoted: boolean;
//   numUpvotes: number;
//   numDownvotes: number;
const AnswerCard = ({
  _id,
  user,
  author_id,
  author_picture,
  author_name,
  upvotes,
  downvotes,
  createdAt,
  question_id,
  content,
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <Link
          href={`/profile/${author_id}`}
          className="flex items-center gap-1"
        >
          <Image
            src={author_picture}
            alt="profile pic"
            width={24}
            height={24}
            className="rounded-full"
          />
          <p className="paragraph-semibold text-dark300_light700">
            {author_name}
          </p>
          <p className="text-gray-700 dark:text-gray-50">
            • answered {getTimestamp(createdAt)}
          </p>
        </Link>
        <div>
          <AnswerVote
            answerId={_id}
            userId={user}
            path={`/question/${question_id}`}
            isUpvoted={upvotes.includes(user)}
            isDownvoted={downvotes.includes(user)}
            numUpvotes={upvotes.length}
            numDownvotes={downvotes.length}
          />
        </div>
      </div>

      <div className="mt-4">
        <ParseHTML data={content} />
      </div>
    </div>
  );
};

export default AnswerCard;
