"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File>();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/detectComplaint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResponse(data);

    const formData = new FormData();
    formData.append("voice", file as Blob);
    fetch("/api/speechToText", {
      method: "POST",
      body: formData,
    });
  };

  useEffect(() => {
    // fetch("api/upsertJSON");
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
          required
        />
        <Input
          type="file"
          accept=".mp3"
          onChange={(e) => {
            setFile(e.target.files![0] as File);
          }}
        />
        <Button type="submit">Send</Button>
      </form>

      {response && (
        <div>
          <h3>Complaint Detection</h3>
          <p>Is Complaint: {response.is_complaint ? "Yes" : "No"}</p>
          <p>Summary: {response.summary}</p>
        </div>
      )}
    </div>
  );
}
