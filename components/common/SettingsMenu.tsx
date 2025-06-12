import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserIcon } from "lucide-react";

const SettingsMenu: React.FC = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger className="flex items-center text-sm hover:underline gap-1">
          <UserIcon className="w-4 h-4" />
          Stanislav Pika
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center text-md gap-1">
              <UserIcon className="w-5 h-5" />
              Stanislav Pika
            </SheetTitle>
            <SheetDescription>You have 14 remaining requests.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SettingsMenu;
