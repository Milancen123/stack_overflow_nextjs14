"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
  QuestionVoteParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";

// content: string;
//   author: string; // User ID
//   question: string; // Question ID
//   path: string;

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase(); // Ensure the connection is awaited if it returns a promise
    const { content, author, question, path } = params;

    console.log("Creating answer with params:", params);

    const newAnswer = await Answer.create({
      content,
      author,
      question,
      path,
    });

    console.log("New answer created:", newAnswer);

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    console.log("Question updated with new answer");

    // todo Add interaction

    revalidatePath(path);
    console.log("Path revalidated:", path);
  } catch (error) {
    console.error("Error creating answer:", error);
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const answers = await Question.findById(questionId).populate({
      path: "answers",
      model: Answer,
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "author",
        model: User,
      },
    });

    return answers;
  } catch (error) {
    console.log(error);
  }
}

export async function questionVote(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    const question = await Question.findById(questionId);

    if (hasupVoted) {
      //push to the upvotes
      if (!question.upvotes.includes(userId)) {
        question.upvotes.push(userId);
      }
      //check to the downvotes if its there remove it

      question.downvotes = question.downvotes.filter(
        //@ts-ignore
        (id) => id.toString() !== userId
      );
    } else if (hasdownVoted) {
      // If user has downvoted
      // Add to downvotes if not already present
      if (!question.downvotes.includes(userId)) {
        question.downvotes.push(userId);
        // Remove from upvotes if present
        question.upvotes = question.upvotes.filter(
          //@ts-ignore
          (id) => id.toString() !== userId
        );
      }
    } else if (!hasupVoted && !hasdownVoted) {
      question.upvotes = question.upvotes.filter(
        //@ts-ignore
        (id) => id.toString() !== userId
      );
      question.downvotes = question.downvotes.filter(
        //@ts-ignore
        (id) => id.toString() !== userId
      );
    }

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

// export interface AnswerVoteParams {
//   answerId: string;
//   userId: string;
//   hasupVoted: boolean;
//   hasdownVoted: boolean;
//   path: string;
// }

export async function answerVote(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    const answer = await Answer.findById(answerId);

    if (hasupVoted) {
      //push to the upvotes
      if (!answer.upvotes.includes(userId)) {
        answer.upvotes.push(userId);
      }
      //check to the downvotes if its there remove it

      answer.downvoted = answer.downvoted.filter(
        //@ts-ignore
        (id) => id.toString() !== userId
      );
    } else if (hasdownVoted) {
      // If user has downvoted
      // Add to downvotes if not already present
      if (!answer.downvoted.includes(userId)) {
        answer.downvoted.push(userId);
        // Remove from upvotes if present
        answer.upvotes = answer.upvotes.filter(
          //@ts-ignore
          (id) => id.toString() !== userId
        );
      }
    } else if (!hasupVoted && !hasdownVoted) {
      answer.upvotes = answer.upvotes.filter(
        //@ts-ignore
        (id) => id.toString() !== userId
      );
      answer.downvoted = answer.downvoted.filter(
        //@ts-ignore
        (id) => id.toString() !== userId
      );
    }

    await answer.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
