import { NextRequest, NextResponse } from "next/server";
import { createClient as serverCreateClient } from "@/utils/supabase/server";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

export interface Complaint {
  company: string;
  complaint: string;
  productCategory: string;
  productSubcategory: string;
}

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const embeddings = new MistralAIEmbeddings();
const client = createClient(url, supabaseKey);

// Add an entry into the complaints table
export async function POST(req: NextRequest, res: NextResponse) {
  const complaint: Complaint = await req.json();

  const supabase = serverCreateClient();

  // Insert data into complaints table
  const { data, error } = await supabase
    .from("complaints")
    .insert([{ ...complaint }]);

  // Insert data into vector DB table
  await SupabaseVectorStore.fromTexts(
    [complaint.complaint],
    [
      {
        company: complaint.company,
        productCategory: complaint.productCategory,
        subProductCategory: complaint.productSubcategory,
      },
    ],
    new MistralAIEmbeddings(),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  if (error) return new Response(JSON.stringify({ error }));
  return new Response(JSON.stringify({ data }));
}
