"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { questionVote } from "@/lib/actions/answer.action";
import { Elsie_Swash_Caps } from "next/font/google";

interface Props {
  questionId: string;
  userId: string;
  path: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  numUpvotes: number;
  numDownvotes: number;
}

const Vote = ({
  questionId,
  userId,
  path,
  isUpvoted,
  isDownvoted,
  numUpvotes,
  numDownvotes,
}: Props) => {
  const [upvoteClicked, setUpvoteClick] = useState(false);
  const [downvoteClicked, setDownvoteClick] = useState(false);
  const [upvotes, setUpvotes] = useState(numUpvotes);
  const [downvotes, setDownvotes] = useState(numDownvotes);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUpvoteClick(isUpvoted);
    setDownvoteClick(isDownvoted);
  }, []);

  const handleUpvoteButtonClick = async () => {
    const newUpvoteClicked = !upvoteClicked;
    const newDownvoteClicked = false;

    if (newUpvoteClicked && downvoteClicked) {
      setUpvotes(upvotes + 1);
      setDownvotes(downvotes - 1);
    } else if (newUpvoteClicked && !downvoteClicked) {
      setUpvotes(upvotes + 1);
    } else {
      setUpvotes(upvotes - 1);
    }

    setUpvoteClick(newUpvoteClicked);
    setDownvoteClick(newDownvoteClicked);

    await questionVote({
      questionId,
      userId,
      hasupVoted: newUpvoteClicked,
      hasdownVoted: newDownvoteClicked,
      path,
    });
  };

  const handleDownvoteButtonClick = async () => {
    const newDownvoteClicked = !downvoteClicked;
    const newUpvoteClicked = false;
    if (newDownvoteClicked && upvoteClicked) {
      setDownvotes(downvotes + 1);
      setUpvotes(upvotes - 1);
    } else if (newDownvoteClicked && !upvoteClicked) {
      setDownvotes(downvotes + 1);
    } else {
      setDownvotes(downvotes - 1);
    }
    // Update the state
    setDownvoteClick(newDownvoteClicked);
    setUpvoteClick(newUpvoteClicked);

    await questionVote({
      questionId,
      userId,
      hasupVoted: newUpvoteClicked,
      hasdownVoted: newDownvoteClicked,
      path,
    });
  };

  const handleSaveQuestion = async () => {
    const newSavedState = !saved;

    setSaved(newSavedState);
  };

  return (
    <div className="flex justify-between">
      <div className="flex justify-between items-center min-w-[80px]">
        <Button onClick={handleUpvoteButtonClick}>
          {upvoteClicked ? (
            <Image
              src="/assets/icons/upvoted.svg"
              alt="upvote"
              width={24}
              height={24}
            />
          ) : (
            <Image
              src="/assets/icons/upvote.svg"
              alt="upvote"
              width={24}
              height={24}
            />
          )}
        </Button>

        <div className="min-w-[24px] bg-gray-200 dark:bg-gray-600 rounded-sm">
          <p className="text-center dark:text-white">{upvotes}</p>
        </div>
      </div>
      <div className="flex justify-between items-center min-w-[80px]">
        <Button onClick={handleDownvoteButtonClick}>
          {downvoteClicked ? (
            <Image
              src="/assets/icons/downvoted.svg"
              alt="downvote"
              width={24}
              height={24}
            />
          ) : (
            <Image
              src="/assets/icons/downvote.svg"
              alt="downvote"
              width={24}
              height={24}
            />
          )}
        </Button>

        <div className="min-w-[24px] bg-gray-200 dark:bg-gray-600 rounded-sm">
          <p className=" px-1 text-center dark:text-white">
            {downvotes > 0 ? "-" : ""}
            {downvotes}
          </p>
        </div>
      </div>
      <div className="flex item-center justify-end min-w-[40px]">
        <Image
          src={`/assets/icons/${saved ? "star-filled.svg" : "star-red.svg"}`}
          alt="star-save"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={handleSaveQuestion}
        />
      </div>
    </div>
  );
};

export default Vote;
