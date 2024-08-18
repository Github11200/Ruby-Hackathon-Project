import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Add an entry into the complaints table
export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createClient();

  let { data: complaints, error } = await supabase
    .from("complaints")
    .select("*");

  if (error) return new Response(JSON.stringify({ error }));
  return new Response(JSON.stringify({ complaints }));
}
