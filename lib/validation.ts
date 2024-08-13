import * as z from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const EditProfileSchema = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(2).max(50),
  bio: z
    .string()
    .max(200)
    .or(z.literal("")) // Allow either a valid string or an empty string
    .optional(),
  location: z
    .string()
    .min(2)
    .max(50)
    .or(z.literal("")) // Allow either a valid string or an empty string
    .optional(),
  portfolioWebsite: z
    .string()
    .url()
    .or(z.literal("")) // Allow either a valid URL or an empty string
    .optional(),
});
