"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";

export async function createUser(userParam: CreateUserParams) {
  try {
    await connectToDatabase();
    console.log("sada sam ovde, u user.action.ts createUser");
    const newUser = await User.create(userParam);
    console.log("sada sam ispod funckije za kreiranje usera u bazi podatakaa");
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {}
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    //Delete user from database
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );
    //

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {}
}

export async function getUserById(params: any) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
  }
}

// export async function getAllUsers(params: GetAllUsersParams){
//   try{
//     connectToDatabase();
//   }catch(error){
//     console.log(error);
//   }

// }

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();

    const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    console.log(filter);
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query).sort(sortOptions);

    return { users };
  } catch (error) {
    console.log(error);
  }
}

export async function saveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await getUserById({ userId });

    if (!user) throw new Error("No user with this id");

    if (!user.saved.includes(questionId)) {
      console.log("cuvam pitanje u kolekciji");
      await User.updateOne(
        { clerkId: userId },
        { $push: { saved: questionId } }
      );
    } else {
      console.log("brisem pitanje iz kolekcije");
      await User.updateOne(
        { clerkId: userId },
        { $pull: { saved: questionId } }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getAllSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
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

    return user.saved;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    await connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {}
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });
    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    return { totalQuestions, questions: userQuestions };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });
    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    return { totalAnswers, answers: userAnswers };
  } catch (error) {
    console.log(error);
  }
}
// clerkId: string;
// updateData: Partial<IUser>;
// path: string;
export async function editUserProfile(params: UpdateUserParams) {
  try {
    await connectToDatabase();
    const { clerkId, updateData, path } = params;
    console.log(updateData);
    // await User.findByIdAndUpdate(clerkId, updateData);
    await User.findOneAndUpdate({ clerkId: clerkId }, updateData);
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
