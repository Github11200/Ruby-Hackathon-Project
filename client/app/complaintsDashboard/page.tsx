"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface ComplaintResponse {
  created_at: string;
  complaint: string;
  productCategory: string;
  productSubcategory: string;
  id: string;
  company: string;
  isComplaint: boolean;
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [queryResults, setQueryResults] = useState([]);

  useEffect(() => {
    fetch("/api/getComplaintsFromDatabase", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data: { complaints: ComplaintResponse[] }) => {
        setComplaints(data.complaints);
      });
  }, []);

  const handleSearch = () => {
    fetch("/api/queryVectorDatabase", {
      method: "POST",
      body: JSON.stringify({ query: search, topK: 2 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOpenDialog(true);
        setQueryResults(data);
        console.log(data);
      });
  };

  return (
    <div className="p-8">
      <div className="flex gap-2 mb-8">
        <Link href="/">
          <Button variant="outline">
            <ChevronLeft />
          </Button>
        </Link>
        <Input
          type="text"
          placeholder="Search for similar complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => handleSearch()}>Search</Button>
      </div>

      <Table className="w-11/12 mx-auto">
        <TableCaption>All user complaints</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Complaint</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Product Category</TableHead>
            <TableHead>Product Sub-Category</TableHead>
            <TableHead>Classified as complaint</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Skeleton className="min-w-max h-10" />
              </TableCell>
            </TableRow>
          )}
          {complaints.length > 0 &&
            complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="truncate max-w-[400px] block">
                        {complaint.complaint}
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[600px] break-words">
                        {complaint.complaint}
                      </TooltipContent>
                    </Tooltip>{" "}
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  {new Date(complaint.created_at).toUTCString()}
                </TableCell>
                <TableCell>{complaint.company}</TableCell>
                <TableCell>
                  {complaint.productCategory === null
                    ? "None"
                    : complaint.productCategory}
                </TableCell>
                <TableCell>
                  {complaint.productSubcategory === null
                    ? "None"
                    : complaint.productSubcategory}
                </TableCell>
                <TableCell>{complaint.isComplaint ? "✅" : "❌"}</TableCell>
              </TableRow>
            ))}{" "}
        </TableBody>
      </Table>
      <Dialog open={openDialog}>
        <DialogContent>
          {" "}
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle>Similar Complaints</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-4">
                {queryResults.map((result, index) => (
                  <div key={index}>
                    <p>{result.pageContent}</p>
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
