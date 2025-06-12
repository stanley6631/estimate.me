import React, { ReactNode } from "react";
import "@/app/globals.css";

export const metadata = {
  title: "My Next.js App",
  description: "A simple Next.js application using the app router.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <header className="w-full bg-gray-100">
          <h1 className="text-2xl font-bold p-5">estimate.me</h1>
        </header>
        <main className="h-[calc(100vh-134px)] flex items-center justify-center">
          <div className="container mx-auto">{children}</div>
        </main>
        <footer className="w-full border-y p-5 text-center">
          <p className="text-sm">© {new Date().getFullYear()} estimate.me</p>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
