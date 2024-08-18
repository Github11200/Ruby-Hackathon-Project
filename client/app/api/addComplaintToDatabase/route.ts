import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export interface Complaint {
  company: string;
  complaint: string;
  productCategory: string;
  productSubcategory: string;
}

// Add an entry into the complaints table
export async function POST(req: NextRequest, res: NextResponse) {
  const complaint: Complaint = await req.json();

  const supabase = createClient();

  const { data, error } = await supabase
    .from("complaints")
    .insert([{ ...complaint }]);

  console.log(error);

  if (error) return new Response(JSON.stringify({ error }));
  return new Response(JSON.stringify({ data }));
}
