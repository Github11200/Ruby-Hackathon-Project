import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 2048,
});

let productCategories = ["Credit card"];
let productSubcategories = [
  "Store credit card",
  "General-purpose credit card or charge card",
];

const prompt = `You are an intelligent AI that can detect complaints in text, decide whether it is a complaint, summarize them, and assign them categories.

Detect the complaint in the given text and summarize it. Also assign it a product category and product sub category.

Try using the following categories by default: ${productCategories}
And the following sub categories: ${productSubcategories}

ONLY CREATE NEW CATEGORIES IF NECESSARY OR IS APPROPRIATE TO DO SO.

When using categories and subcategories try not to create new ones if you don't need to and just use previously created ones.

DO NOT INCLUDE BACKTICKS OR SAY JOSN ANYWHERE, JUST RETURN THE PLAIN JSON.

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

  const content = JSON.parse(res.content as string);

  if (content.category && !productCategories.includes(content.category)) {
    productCategories.push(content.category);
  } else if (
    content.subcategory &&
    !productSubcategories.includes(content.subcategory)
  ) {
    productSubcategories.push(content.subcategory);
  }

  return new Response(res.content as BodyInit);
}
