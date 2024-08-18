"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface ComplaintResponse {
  created_at: string;
  complaint: string;
  productCategory: string;
  productSubcategory: string;
  id: string;
  company: string;
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/getComplaintsFromDatabase", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data: { complaints: ComplaintResponse[] }) => {
        setComplaints(data.complaints);
      });
  }, []);

  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for similar complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button>Search</Button>
      </div>
      {complaints.length > 0 &&
        complaints.map((complaint) => (
          <Card key={complaint.id}>
            <CardHeader>
              <CardTitle>{complaint.complaint}</CardTitle>
              <CardDescription>
                <span className="font-bold">Created:</span>{" "}
                {new Date(complaint.created_at).toUTCString()}
              </CardDescription>
              <CardDescription>
                <span className="font-bold">Company:</span> {complaint.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complaint.productCategory} - {complaint.productSubcategory}
              {complaint.complaint}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
