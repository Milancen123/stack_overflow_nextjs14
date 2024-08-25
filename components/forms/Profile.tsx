"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { infer, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditProfileSchema } from "@/lib/validation";
import { editUserProfile } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

interface Params {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: Params) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedUser = JSON.parse(user);
  const path = usePathname();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      bio: parsedUser.bio || "",
      location: parsedUser.location || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof EditProfileSchema>) {
    setIsSubmitting(true);
    // clerkId: string;
    // updateData: Partial<IUser>;
    // path: string;
    try {
      await editUserProfile({
        clerkId: clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          bio: values.bio,
          location: values.location,
          portfolioWebsite: values.portfolioWebsite,
        },
        path: path,
      });
      router.push(`/profile/${clerkId}`);
      return toast({
        title: "Profile edited succesfully",
        className: "bg-green-400 color-white",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full gap-9 flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="your username"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Portfolio Link</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your portfolio URL"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Where are you from"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Whats special about you"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
