"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormEvent } from "react";
import { Send } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { Complaint } from "./api/addComplaintToDatabase/route";

interface ComplaintResponse {
  isComplaint: boolean;
  summary: string;
  category: string;
  subcategory: string;
}

export default function Home() {
  const [audioFile, setAudioFile] = useState<File>();
  const [imageFile, setImageFile] = useState<File>();
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [response, setResponse] = useState<ComplaintResponse>();

  const getComplaintSummaryAndCategories = async (complaint: string) => {
    const res = await fetch("/api/detectComplaint", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (query) {
        const data = await getComplaintSummaryAndCategories(query);
        console.log(data);

        setResponse(data);
      } else if (audioFile) {
        const formData = new FormData();
        formData.append("voice", audioFile);

        const res = await fetch("/api/speechToText", {
          method: "POST",
          body: formData,
        });

        const text = await res.json();
        setResponse(await getComplaintSummaryAndCategories(text));
      } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target?.result;
          await fetch("/api/imageToText", {
            method: "POST",
            body: JSON.stringify({ base64String: base64String }),
          })
            .then((res) => res.json())
            .then(async (text) => {
              console.log(text.data.ParsedResults[0].ParsedText);

              setResponse(
                await getComplaintSummaryAndCategories(
                  text.data.ParsedResults[0].ParsedText
                )
              );
            });
        };
        reader.readAsDataURL(imageFile as Blob);
      }

      const complaint: Complaint = {
        company: company,
        complaint: response?.summary || query,
        productCategory: response?.category || "",
        productSubcategory: response?.subcategory || "",
      };

      fetch("/api/addComplaintToDatabase", {
        method: "POST",
        body: JSON.stringify(complaint),
      })
        .then(() => {
          toast.success("Complaint submitted successfully!");
          setQuery("");
          setCompany("");
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the complaint. " + error);
    }
  };

  return (
    <>
      <Link href="/complaintsDashboard">
        <Button className="absolute right-4 top-4">View all complaints</Button>
      </Link>
      <div className="flex min-h-screen w-[30vw] flex-col items-center justify-center mx-auto">
        <div className="text-center mb-10 flex flex-col gap-1">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Please enter your complaint
          </h2>
          <p>
            Please use one of the following methods to enter your complaint.
          </p>
        </div>
        <div className="w-full">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="w-full flex flex-col gap-4"
          >
            <div className="flex gap-2 flex-col">
              <Label htmlFor="textComplaint">Company Name 🏢</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company name..."
                id="textComplaint"
                required
              />
            </div>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="textComplaint">Use a prompt 💬</Label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Complaint..."
                id="textComplaint"
              />
            </div>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="audioComplaint">Use an audio file 🔉</Label>
              <Input
                type="file"
                accept=".mp3"
                onChange={(e) => {
                  setAudioFile(e.target.files![0] as File);
                }}
                id="audioComplaint"
              />
            </div>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="audioComplaint">Use an image file 📸</Label>
              <Input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => {
                  setImageFile(e.target.files![0] as File);
                }}
                id="audioComplaint"
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Send <Send className="size-4 ml-2" />
            </Button>
          </form>

          {response && (
            <Card>
              <CardHeader>
                <CardTitle>Complaint Detection</CardTitle>
                <CardDescription>{response.summary}</CardDescription>
              </CardHeader>
              <p>Is Complaint: {response.isComplaint ? "Yes" : "No"}</p>
              <p>Summary: {response.summary}</p>
              <p>Category: {response.category}</p>
              <p>Sub-category: {response.subcategory}</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
