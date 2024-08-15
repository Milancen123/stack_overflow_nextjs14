"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // Find interactoins for the user and group by tags...

    return [
      { _id: "1", name: "tag" },
      { _id: "2", name: "tag" },
      { _id: "3", name: "tag" },
    ];
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    // page?: number;
    // pageSize?: number;
    // filter?: string;
    // searchQuery?: string;
    await connectToDatabase();
    const { page = 1, pageSize = 1, searchQuery, filter } = params;

    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { followers: -1 };
        break;
      case "recent":
        sortOptions = { createdOn: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query).sort(sortOptions);

    return { tags };
  } catch (error) {
    console.log(error);
  }
}

// tagId: string;
// page?: number;
// pageSize?: number;
// searchQuery?: string;

export async function getTagById(params: GetQuestionsByTagIdParams) {
  try {
    const { tagId, searchQuery } = params;
    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    const tag = await Tag.findById({ _id: tagId }).populate({
      path: "questions",
      model: Question,
      match: query,
      populate: [
        {
          path: "tags",
          model: Tag,
        },
        {
          path: "author",
          model: User,
        },
      ],
    });
    return tag;
  } catch (error) {
    console.log(error);
  }
}

export async function getPopularTags() {
  try {
    await connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        $addFields: {
          questionCount: { $size: "$questions" }, // Count the number of questions
        },
      },
      {
        $sort: { questionCount: -1 }, // Sort by the number of questions in descending order
      },
      {
        $project: {
          _id: 1, // Include the _id field
          name: 1, // Include the name field
          questions: 1, // Include the questions field
        },
      },
      {
        $limit: 5, // Limit the results to the top 5
      },
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    return []; // Return an empty array in case of error
  }
}
