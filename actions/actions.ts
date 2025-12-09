"use server";

import {
  describeProduct,
  getSearchQuery,
  getMatchingProducts,
  analyzeProducts,
} from "@/lib/server-utils";

/**
 * Server Action: Describes a product from base64 image
 */
export async function describeProductAction(imageBase64: string) {
  try {
    const description = await describeProduct(imageBase64);
    return { success: true, data: description };
  } catch (error) {
    console.error("Error in describeProductAction:", error);
    return { success: false, error: "Failed to describe product" };
  }
}

/**
 * Server Action: Generates search query from description
 */
export async function getSearchQueryAction(descriptionText: string) {
  try {
    const result = await getSearchQuery(descriptionText);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in getSearchQueryAction:", error);
    return { success: false, error: "Failed to generate search query" };
  }
}

/**
 * Server Action: Fetches matching products from eBay
 */
export async function getMatchingProductsAction(query: string, limit?: string) {
  try {
    const products = await getMatchingProducts(query, limit);
    return { success: true, data: products };
  } catch (error) {
    console.error("Error in getMatchingProductsAction:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

/**
 * Server Action: Analyzes product data
 */
export async function analyzeProductsAction(products: any[]) {
  try {
    const analysis = await analyzeProducts(products);
    return { success: true, data: analysis };
  } catch (error) {
    console.error("Error in analyzeProductsAction:", error);
    return { success: false, error: "Failed to analyze products" };
  }
}
