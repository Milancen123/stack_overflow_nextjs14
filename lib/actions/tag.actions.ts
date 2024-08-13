"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";

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
    await connectToDatabase();
    const { page = 1 } = params;

    const tags = await Tag.find({}).sort({ createdAt: -1 });

    return { tags };
  } catch (error) {
    console.log(error);
  }
}

export async function getTagById(tagId: string) {
  try {
    const tag = await Tag.findById({ _id: tagId }).populate({
      path: "questions",
      model: Question,
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
