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
    const skipUsers = (page - 1) * pageSize;

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

    const users = await User.find(query)
      .skip(skipUsers)
      .limit(pageSize)
      .sort(sortOptions);

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipUsers + users.length;
    return { users, isNext };
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

    const { clerkId, page = 1, pageSize = 20 } = params;
    const skipQuestions = (page - 1) * pageSize;

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      model: Question,
      options: {
        skip: skipQuestions,
        limit: pageSize,
      },
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

    const totalSavedQuestions = await User.findOne({ clerkId }).populate({
      path: "saved",
      model: Question,
    });

    const isNext =
      totalSavedQuestions.saved.length > skipQuestions + user.saved.length;

    return { saved: user.saved, isNext };
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
    const skipQuestions = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .skip(skipQuestions)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const isNext = totalQuestions > skipQuestions + userQuestions.length;
    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAnswers = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });
    const userAnswers = await Answer.find({ author: userId })
      .skip(skipAnswers)
      .limit(pageSize)
      .sort({ upvotes: -1 })
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    const isNext = totalAnswers > skipAnswers + userAnswers.length;
    return { totalAnswers, answers: userAnswers, isNext };
  } catch (error) {
    console.log(error);
  }
}

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
