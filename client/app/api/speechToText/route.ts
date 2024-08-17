import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  // const voice = await req.json();

  // console.log(voice);
  console.log(await req.body?.getReader().read());

  return new Response(JSON.stringify({ hi: "Hi" }));
}
