"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { signInWithEmailAction } from "@/actions/actions";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const result = await signInWithEmailAction(email);

    if (result.success) {
      setMessage("Check your email for the magic link!");
    } else {
      setMessage(result.error || "Failed to send magic link");
    }

    setIsLoading(false);
  }

  return (
    <div
      className={cn("flex flex-col gap-6 max-w-[400px] mx-auto", className)}
      {...props}
    >
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Image
                  src={"/robot/estimate.me.png"}
                  height={90}
                  width={40}
                  alt="Your buddy estimator"
                ></Image>
              </div>
              <span className="sr-only">estimate.me</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to estimate.me</h1>
            <FieldDescription>
              Provide an email address to sign in. We'll send you a magic link.
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@gmail.com"
              required
              disabled={isLoading}
            />
          </Field>
          {message && (
            <p
              className={cn(
                "text-sm text-center",
                message.includes("Check") ? "text-green-600" : "text-red-600"
              )}
            >
              {message}
            </p>
          )}
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Login"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
