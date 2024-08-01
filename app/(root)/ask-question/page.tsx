import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

// redirect koristi se kada se preusmerenje treba dogoditi na serverskoj strani ili kada želiš da zaustaviš učitavanje stranice i odmah preusmeriš korisnika.
// router.push koristi se kada se preusmerenje treba dogoditi na klijentskoj strani, obično kao odgovor na neku radnju korisnika.

const Page = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId: "1234567890" });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default Page;
