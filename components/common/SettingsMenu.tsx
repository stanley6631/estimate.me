"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserIcon, LogOutIcon } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { signOutAction } from "@/actions/actions";
interface SettingsMenuProps {
  session: Session | null;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ session }) => {
  if (!session) return null;

  const userEmail = session.user.email || "User";
  const userName =
    session.user.user_metadata?.full_name ||
    session.user.user_metadata?.name ||
    userEmail;

  return (
    <>
      <Sheet>
        <SheetTrigger className="flex items-center text-sm hover:underline gap-1">
          <UserIcon className="w-4 h-4" />
          {userName}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center text-md gap-1">
              <UserIcon className="w-5 h-5" />
              {userName}
            </SheetTitle>
            <SheetDescription>Your account</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button
              variant={"default"}
              onClick={async () => await signOutAction()}
            >
              <LogOutIcon />
              Log out
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SettingsMenu;
