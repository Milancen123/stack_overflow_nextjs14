"use server";

import Question, { IQuestion } from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  ToggleSaveQuestionParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";
import { skip } from "node:test";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase();

    const { title, content, tags, author, path } = params;

    //create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];
    //create the tags
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create an interaction record for the users ask_questoin action
    await Interaction.create({
      user: author,
      actions: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    //increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
  } catch (error) {}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getHotQuestions() {
  try {
    await connectToDatabase();
    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5)
      .select("_id title");

    return hotQuestions;
  } catch (error) {
    console.log(error);
  }
}
