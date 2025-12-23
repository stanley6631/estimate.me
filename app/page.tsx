import React from "react";
import ProductAnalyzer from "@/components/common/ProductAnalyzer";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

//TODO: create a protected route wrapper component to avvoid duplicated session check code
const HomePage = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  if (data.session === null) {
    redirect("/login");
  }

  return <ProductAnalyzer />;
};

export default HomePage;
