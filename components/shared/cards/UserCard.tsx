import { Badge } from "@/components/ui/badge";
import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-w-[300px] xs:max-w-[200px] overflow-hidden"
    >
      <article className="background-light900_dark200 light-border flex flex-col items-center justify-center rounded-2xl border p-4 xs:p-8 w-full">
        <Image
          src={user.picture}
          alt="user profile picture"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div className="mt-4 text-center w-full">
          <h3 className="h3-bold text-dark200_light900 overflow-hidden text-ellipsis whitespace-nowrap">
            {user.name}
          </h3>
          <h3 className="body-regular text-dark500_light500 mt-2 overflow-hidden text-ellipsis whitespace-nowrap break-all">
            @{user.username}
          </h3>
        </div>

        <div className="mt-5">
          {interactedTags && interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
