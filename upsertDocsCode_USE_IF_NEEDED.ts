import { MistralAIEmbeddings } from "@langchain/mistralai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import type { Document } from "@langchain/core/documents";
import rubyHackathonData from "../../../ruby_hackathon_data.json";

const embeddings = new MistralAIEmbeddings();
const client = createClient(url, supabaseKey);

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

async function addEmbeddings(complaints, ids) {
  const vectorStore = await SupabaseVectorStore.fromTexts(
    complaints,
    ids,
    new MistralAIEmbeddings(),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );
}

let originalData = rubyHackathonData as Document[];
for (let i = 40; i < 4480; i += 40) {
  const data = originalData.slice(i - 40, i);
  const complaints = data.map((doc) => doc._source.complaint_what_happened);
  const ids = data.map((doc) => {
    return {
      id: doc._id,
    };
  });
  await addEmbeddings(complaints, ids);
}
