import axios from "axios";
import { NextResponse } from "next/server";

//TODO: Handle token exporation and caching in a separate service
let cachedToken: { token: string; expiresAt: number } | null = null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = searchParams.get("limit") || "100";

  const ebayApiUrl = `${process.env.EBAY_API_URL}buy/browse/v1/item_summary/search`;
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "eBay API credentials are missing" },
      { status: 500 }
    );
  }

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
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
      );

      return NextResponse.json(ebayResponse.data);
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
    );

    const { access_token, expires_in } = tokenResponse.data;

    // Cache the token with its expiration time
    cachedToken = {
      token: access_token,
      expiresAt: Date.now() + expires_in * 1000, // Convert seconds to milliseconds
    };

    const ebayResponse = await axios.get(
      `${ebayApiUrl}?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return NextResponse.json(ebayResponse.data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch data from eBay API",
        details: (error as any).message,
      },
      { status: 500 }
    );
  }
}
