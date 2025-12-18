import React from "react";
import Image from "next/image";
import Link from "next/link";

export const LoginError: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-2 max-w-[400px] mx-auto">
      <Image
        src={"/robot/sad.png"}
        height={200}
        width={200}
        alt="Your buddy estimator"
      ></Image>
      <div>
        There has been an issue with the login.{" "}
        <Link href={"/login"} className="text-[#f0f0f0]">
          Try again
        </Link>{" "}
        please.
      </div>
    </div>
  );
};
