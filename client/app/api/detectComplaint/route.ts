import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Handling POST requests
export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json(); // Parse JSON from request body

    if (!query) {
      return NextResponse.json(
        { message: "Query is required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api.gemini.com/v1/complaint-detection",
      { query },
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
      }
    );

    const { is_complaint, summary } = response.data;

    console.log("Gmini API response", response.data);

    return NextResponse.json({ is_complaint, summary });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error interacting with Gemini API",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
