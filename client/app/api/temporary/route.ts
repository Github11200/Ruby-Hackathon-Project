import { NextRequest, NextResponse } from "next/server";
import { createClient as serverCreateClient } from "@/utils/supabase/server";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import rubyHackathonData from "../../../ruby_hackathon_data.json";

export interface Complaint {
  company: string;
  complaint: string;
  productCategory: string;
  productSubcategory: string;
  isComplaint: boolean;
}

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const embeddings = new MistralAIEmbeddings();
const client = createClient(url, supabaseKey);

let originalData = rubyHackathonData as Document[];

// Add an entry into the complaints table
export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = serverCreateClient();

  // @ts-ignore
  async function addData(complaint) {
    // Insert data into complaints table
    const { data, error } = await supabase
      .from("complaints")
      .insert([{ ...complaint }]);
  }

  let i = 0;
  for (i = 0; i < 4408; ++i) {
    const newComplaint: Complaint = {
      complaint: originalData[i]._source.complaint_what_happened,
      company: originalData[i]._source.company,
      productCategory: originalData[i]._source.product,
      productSubcategory: originalData[i]._source.sub_product,
      isComplaint: true,
    };

    await addData(newComplaint);
  }

  return new Response("OK");
}
