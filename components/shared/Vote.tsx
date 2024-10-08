"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { questionVote } from "@/lib/actions/answer.action";
import { Elsie_Swash_Caps } from "next/font/google";
import { saveQuestion } from "@/lib/actions/user.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { toast } from "../ui/use-toast";

interface Props {
  questionId: string;
  userId: string;
  clerkId: string;
  path: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  isSaved: boolean;
  numUpvotes: number;
  numDownvotes: number;
}

const Vote = ({
  questionId,
  userId,
  clerkId,
  path,
  isUpvoted,
  isDownvoted,
  isSaved,
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
    setUpvotes(numUpvotes);
    setDownvotes(numDownvotes);
    setSaved(isSaved);
  }, []);

  useEffect(() => {
    viewQuestion({
      questionId: questionId,
      userId: userId ? userId : undefined,
    });
  }, [userId, questionId, clerkId, path]);

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
    if (newUpvoteClicked) {
      return toast({
        title: "Upvoted succesfully",
        className: "bg-green-600",
      });
    } else if (newDownvoteClicked) {
      return toast({
        title: "Upvoted succesfully",
        className: "bg-green-600",
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

    await questionVote({
      questionId,
      userId,
      hasupVoted: newUpvoteClicked,
      hasdownVoted: newDownvoteClicked,
      path,
    });
    if (newUpvoteClicked) {
      return toast({
        title: "Upvoted succesfully",
        className: "bg-green-400",
      });
    } else if (newDownvoteClicked) {
      return toast({
        title: "Downvoted succesfully",
        className: "bg-red-400",
      });
    }
  };

  const handleSaveQuestion = async () => {
    const newSavedState = !saved;

    setSaved(newSavedState);

    //toggles the question
    await saveQuestion({ userId: clerkId, questionId, path });
    if (newSavedState) {
      return toast({
        title: "Saved to collection",
        className: "bg-orange-400",
      });
    } else {
      return toast({
        title: "Removed from collection",
        className: "bg-red-400",
      });
    }
  };

  return (
    <div className="flex justify-between w-ful max-w-[200px]">
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
