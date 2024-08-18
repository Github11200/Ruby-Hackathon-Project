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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

const ITEMS_PER_PAGE = 6;

export default function Dashboard() {
  const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [queryResults, setQueryResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/getComplaintsFromDatabase", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data: { complaints: ComplaintResponse[] }) => {
        setComplaints(data.complaints.slice(0, 200)); // Adjust the slice as needed
      });
  }, []);

  const handleSearch = () => {
    fetch("/api/queryVectorDatabase", {
      method: "POST",
      body: JSON.stringify({ query: search, topK: 3 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOpenDialog(true);
        setQueryResults(data);
      });
  };

  // Calculate total pages
  const totalPages = Math.ceil(complaints.length / ITEMS_PER_PAGE);

  // Slice complaints for current page
  const paginatedComplaints = complaints.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
        <Button onClick={handleSearch}>Search</Button>
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
          {paginatedComplaints.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Skeleton className="min-w-max h-10" />
              </TableCell>
            </TableRow>
          )}
          {paginatedComplaints.length > 0 &&
            paginatedComplaints.map((complaint) => (
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
                    </Tooltip>
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
            ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight />
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle>Similar Complaints</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-4">
                {queryResults.map((result, index) => (
                  <div key={index}>
                    <p>
                      <span className="font-bold">Company:</span>{" "}
                      {result.metadata.company}
                    </p>
                    <p>
                      <span className="font-bold">Product Category:</span>{" "}
                      {result.metadata.productCategory}
                    </p>
                    <p>
                      <span className="font-bold">Subproduct Category:</span>{" "}
                      {result.metadata.subProductCategory}
                    </p>
                    <p>
                      <span className="font-bold">Complaint: </span>
                      {result.pageContent}
                    </p>
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
