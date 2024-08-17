import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 2048,
});

const prompt = `You are an intelligent AI that can detect complaints in text, decide whether it is a complaint, summarize them, and assign them categories.

Detect the complaint in the given text and summarize it. Also assign it a category and subcategory.

When using categories and subcategories try not to create new ones if you don't need to and just use previously created ones.

Return the following JSON output:

{
  isComplaint: boolean,
  summary: string,
  category: string,
  subcategory: string
}
`;

// Handling POST requests
export async function POST(req: NextRequest) {
  const { query } = await req.json();

  const res = await model.invoke([
    ["system", prompt],
    ["human", query],
  ]);

  return new Response(res.content);
}
