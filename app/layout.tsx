import React, { ReactNode } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ClientProvider from "@/app/layout-client";
import { createClient } from "@/lib/supabase/server";

import "@/app/globals.css";

export const metadata = {
  title: "estimate.me - AI price estimator",
  description: "A simple Next.js application using the app router.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <Header session={session} />
        <main className="min-h-[calc(100vh-134px)] flex items-center justify-center">
          <div className="container mx-auto">
            <ClientProvider>{children}</ClientProvider>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
