import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import Image from "next/image";
import React from "react";
import { redirect } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatJoinDate } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";

const Page = async ({ params, searchParams }: URLProps) => {
  const userInfo = await getUserInfo({ userId: params.id });
  const { userId: clerkId } = auth();
  if (!userInfo) redirect("/sign-in");
  console.log(userInfo.user);
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col itmes-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user.picture}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />
          <div className="mt-3 w-full line-clamp-1 max-xs:max-w-[310px]">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <h3 className="paragraph-regular text-dark200_light800 overflow-hidden text-ellipsis ">
              @{userInfo.user.username}
            </h3>

            <div className="mt-5 flex flex-wrap items-cetner justify-start gap-5">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}

              {userInfo.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={formatJoinDate(userInfo.user.joinedAt)}
              />

              {userInfo.user.bio && (
                <p className="paragraph-regular text-dark400_light800 mt-8 sm:mt-3">
                  {userInfo.user.bio}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end max-sm:mb*5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              QuestionsTab
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              AnswersTab
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            {" "}
            <QuestionTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
