"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
