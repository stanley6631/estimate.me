import React from "react";
import Link from "next/link";
import SettingsMenu from "./SettingsMenu";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gray-100 flex items-center justify-between border-b px-4">
      <Link href="/">
        <h1 className="text-2xl font-bold py-5">estimate.me</h1>
      </Link>
      <SettingsMenu />
    </header>
  );
};

export default Header;
