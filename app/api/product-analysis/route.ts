// app/api/product-analysis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ProductAnalysisDataObject } from "@/types/ebayProduct";

function analyzePriceData(products: ProductAnalysisDataObject[]) {
  const prices = products.map((product) => parseFloat(product.price.value));

  const averagePrice =
    prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const highestPrice = Math.max(...prices);
  const lowestPrice = Math.min(...prices);

  return {
    averagePrice,
    highestPrice,
    lowestPrice,
  };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Expected application/json" },
        { status: 400 }
      );
    }

    const jsonData: ProductAnalysisDataObject[] = await req.json();

    const priceAnalysis = analyzePriceData(jsonData);

    return NextResponse.json({ priceAnalysis });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze the product data" },
      { status: 500 }
    );
  }
}
