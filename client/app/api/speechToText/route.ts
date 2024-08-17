import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();
  const voice = formData.get("voice") as File;

  const audioBuffer = await voice.arrayBuffer();

  const response = await fetch(
    "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: audioBuffer,
    }
  );
  const result = await response.json();

  return new Response(JSON.stringify({ text: result.text }));
}
