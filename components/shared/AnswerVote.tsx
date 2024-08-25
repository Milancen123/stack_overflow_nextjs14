"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { answerVote } from "@/lib/actions/answer.action";
import { Elsie_Swash_Caps } from "next/font/google";
import { toast } from "../ui/use-toast";

interface Props {
  answerId: string;
  userId: string;
  path: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  numUpvotes: number;
  numDownvotes: number;
}

const AnswerVote = ({
  answerId,
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

  useEffect(() => {
    setUpvoteClick(isUpvoted);
    setDownvoteClick(isDownvoted);
    setUpvotes(numUpvotes);
    setDownvotes(numDownvotes);
  }, [
    numUpvotes,
    numDownvotes,
    isUpvoted,
    isDownvoted,
    path,
    userId,
    answerId,
  ]);

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

    await answerVote({
      answerId,
      userId,
      hasupVoted: newUpvoteClicked,
      hasdownVoted: newDownvoteClicked,
      path,
    });
    if (newUpvoteClicked) {
      return toast({
        title: "Upvoted succesfully",
        className: "bg-gray-200",
      });
    } else if (newDownvoteClicked) {
      return toast({
        title: "Downvoted succesfully",
        className: "bg-gray-200",
      });
    }
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

    await answerVote({
      answerId,
      userId,
      hasupVoted: newUpvoteClicked,
      hasdownVoted: newDownvoteClicked,
      path,
    });
    if (newUpvoteClicked) {
      return toast({
        title: "Upvoted succesfully",
        className: "bg-gray-200",
      });
    } else if (newDownvoteClicked) {
      return toast({
        title: "Downvoted succesfully",
        className: "bg-gray-200",
      });
    }
  };

  return (
    <div className="flex justify-between max-sm:justify-start">
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
        {upvotes > 0 && (
          <div className="min-w-[24px] bg-gray-200 dark:bg-gray-600 rounded-sm">
            <p className="text-center dark:text-white">{upvotes}</p>
          </div>
        )}
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
        {downvotes > 0 && (
          <div className="min-w-[24px] bg-gray-200 dark:bg-gray-600 rounded-sm">
            <p className=" px-1 text-center dark:text-white">-{downvotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerVote;
