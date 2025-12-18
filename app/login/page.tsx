import React from "react";
import { LoginForm } from "@/components/login/LoginForm";
import { LoginError } from "@/components/login/LoginError";

const AuthPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) => {
  const { error } = await searchParams;

  if (error) {
    return <LoginError />;
  }

  return <LoginForm />;
};

export default AuthPage;
