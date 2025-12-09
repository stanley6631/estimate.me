'use server'

import { cache } from 'react'
import { OpenAI } from "openai"
import axios from "axios"
import { ProductAnalysisDataObject } from "@/types/ebayProduct"

const openai = new OpenAI()

//TODO: Handle token expiration and caching in a separate service
let cachedToken: { token: string; expiresAt: number } | null = null

/**
 * Describes a product from a base64 image using OpenAI Vision
 */
export const describeProduct = cache(async (imageBase64: string): Promise<string | null> => {
  try {
    if (!imageBase64) {
      throw new Error("No image provided")
    }

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "From this image, describe the product in detail, I want to know the model/type, color, condition, and any other relevant information. Limit the response to 75 words.",
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${imageBase64}`,
              detail: "high",
            },
          ],
        },
      ],
    })

    return response.output_text
  } catch (error) {
    console.error('Error describing product:', error)
    return null
  }
})

/**
 * Generates a search query from product description using OpenAI
 */
export const getSearchQuery = cache(async (descriptionText: string): Promise<{ searchQuery: string } | null> => {
  try {
    if (!descriptionText) {
      throw new Error("No description text provided")
    }

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "user",
          content: `From the following description, generate a search query suitable for eBay's browse API: "${descriptionText}". Limit the response to a concise query string.`,
        },
      ],
    })

    const searchQuery = response.output_text
    return { searchQuery }
  } catch (error) {
    console.error('Error generating search query:', error)
    return null
  }
})

/**
 * Fetches matching products from eBay API
 */
export const getMatchingProducts = cache(async (query: string, limit: string = "100") => {
  const ebayApiUrl = `${process.env.EBAY_API_URL}buy/browse/v1/item_summary/search`
  const clientId = process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("eBay API credentials are missing")
  }

  if (!query) {
    throw new Error("Query parameter is required")
  }

  try {
    // Check if token is cached and still valid
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
      const ebayResponse = await axios.get(
        `${ebayApiUrl}?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${cachedToken.token}`,
          },
        }
      )

      return ebayResponse.data
    }

    // Fetch a new token
    const tokenResponse = await axios.post(
      `${process.env.EBAY_API_URL}identity/v1/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        scope: `https://api.ebay.com/oauth/api_scope`,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
        },
      }
    )

    const { access_token, expires_in } = tokenResponse.data

    // Cache the token with its expiration time
    cachedToken = {
      token: access_token,
      expiresAt: Date.now() + expires_in * 1000, // Convert seconds to milliseconds
    }

    const ebayResponse = await axios.get(
      `${ebayApiUrl}?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    return ebayResponse.data
  } catch (error) {
    console.error("Failed to fetch data from eBay API:", error)
    throw error
  }
})

/**
 * Analyzes price data from product listings
 */
function analyzePriceData(products: ProductAnalysisDataObject[]) {
  const prices = products.map((product) => parseFloat(product.price.value))

  const averagePrice =
    prices.reduce((sum, price) => sum + price, 0) / prices.length
  const highestPrice = Math.max(...prices)
  const lowestPrice = Math.min(...prices)

  return {
    averagePrice,
    highestPrice,
    lowestPrice,
  }
}

/**
 * Performs product analysis on a collection of products
 */
export const analyzeProducts = cache(async (products: ProductAnalysisDataObject[]) => {
  try {
    if (!products || !Array.isArray(products)) {
      throw new Error("Invalid product data")
    }

    const priceAnalysis = analyzePriceData(products)
    return { priceAnalysis }
  } catch (error) {
    console.error("Failed to analyze the product data:", error)
    throw error
  }
})
