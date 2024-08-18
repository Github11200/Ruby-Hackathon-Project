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
import { X } from "lucide-react";

interface ComplaintResponse {
  isComplaint: boolean;
  summary: string;
  category: string;
  subcategory: string;
}

interface SubmitComplaintProps {
  company: string;
  productCategory: string;
  productSubcategory: string;
  complaint: string;
}

export default function Home() {
  const [audioFile, setAudioFile] = useState<File>();
  const [imageFile, setImageFile] = useState<File>();
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [response, setResponse] = useState<ComplaintResponse>();

  const getComplaintSummaryAndCategories = async (complaint: string) => {
    const res = await fetch("/api/gemini", {
      method: "POST",
      body: JSON.stringify({ query: complaint }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  };

  const addComplaintToDatabase = async (complaint: SubmitComplaintProps) => {
    fetch("/api/addComplaintToDatabase", {
      method: "POST",
      body: JSON.stringify(complaint),
    })
      .then(() => {
        toast.success("Complaint submitted successfully!");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (query !== "") {
        const data = await getComplaintSummaryAndCategories(query);
        setResponse(data);
        addComplaintToDatabase({
          company: company,
          productCategory: data.category,
          productSubcategory: data.subcategory,
          complaint: data.summary,
        });
      } else if (audioFile) {
        const formData = new FormData();
        formData.append("voice", audioFile);

        const res = await fetch("/api/speechToText", {
          method: "POST",
          body: formData,
        });

        const text = await res.json();
        const data = await getComplaintSummaryAndCategories(text);
        setResponse(data);
        addComplaintToDatabase({
          company: company,
          productCategory: data.category,
          productSubcategory: data.subcategory,
          complaint: data.summary,
        });
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
              setResponse(
                await getComplaintSummaryAndCategories(
                  text.data.ParsedResults[0].ParsedText
                )
              );
            });
        };
        reader.readAsDataURL(imageFile as Blob);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the complaint. " + error);
    }
  };

  return (
    <>
      <Link href="/complaintsDashboard">
        <Button className="absolute right-4 top-4 md:right-6 md:top-6">
          View all complaints
        </Button>
      </Link>
      <div className="flex min-h-screen w-full max-w-[900px] flex-col items-center justify-center mx-auto px-6 sm:px-10 lg:px-12 lg:max-w-screen-xl">
        <div className="text-center mb-10 flex flex-col gap-1">
          <h2 className="scroll-m-20 border-b pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0">
            Please enter your complaint
          </h2>
          <p className="text">
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
            <Card className="p-6 sm:p-4 shadow-lg rounded-lg mt-4 ">
              <Button
                className="absolute"
                variant="outline"
                onClick={() => {
                  setResponse(undefined);
                  setQuery("");
                  setCompany("");
                }}
              >
                <X />
              </Button>
              <CardHeader className="text-center -mt-6">
                <CardTitle className="text-lg sm:text-xl  font-bold mb-1 sm:mb-2">
                  Complaint Detection
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  {response.summary}
                </CardDescription>
              </CardHeader>

              <div className="mt-3 sm:mt-4">
                <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                  <span className="font-semibold">Is Complaint: </span>
                  <span className="font-normal">
                    {response.isComplaint ? "Yes" : "No"}
                  </span>
                </p>
                <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                  <span className="font-semibold">Summary:</span>
                  <span className="font-normal">{response.summary}</span>
                </p>
                <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                  <span className="font-semibold">Category: </span>
                  <span className="font-normal">
                    {!response.category ? "None" : response.category}
                  </span>
                </p>
                <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                  <span className="font-semibold">Sub-category: </span>
                  <span className="font-normal">
                    {!response.subcategory ? "None" : response.subcategory}
                  </span>
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
