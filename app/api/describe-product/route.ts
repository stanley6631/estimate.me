// app/api/describe-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "From this image, tell me:\n1. The exact product name and model/type (e.g., 'Apple iPhone 12 Pro Max').\n2. Your best guess of the item's condition (please pick from one of these options: new, like new, used, damaged). \n1 Based on what do you judge the condition ? Return the answer as parsable JSON with two keys: 'product_name', 'condition', 'note'. Don't return any other text, just the JSON.",
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${imageBase64}`,
              detail: "high",
            },
          ],
        },
      ],
    });

    const data = response.output_text;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
