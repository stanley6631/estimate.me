import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { descriptionText } = body;

    if (!descriptionText) {
      return NextResponse.json(
        { error: "No description text provided" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "user",
          content: `From the following description, generate a search query suitable for eBay's browse API: "${descriptionText}". Limit the response to a concise query string.`,
        },
      ],
    });

    const searchQuery = response.output_text;
    return NextResponse.json({ searchQuery }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
