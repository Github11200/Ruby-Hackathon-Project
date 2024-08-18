import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const embeddings = new MistralAIEmbeddings();
const client = createClient(url, supabaseKey);

// Perform a similarity search
export async function POST(req: NextRequest, res: NextResponse) {
  const { query, topK } = await req.json();

  const store = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "complaints_vector_db",
  });

  const results = await store.similaritySearch(query, topK);

  return new Response(JSON.stringify(results));
}
