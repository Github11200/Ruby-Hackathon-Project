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
import { useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ComplaintResponse {
  created_at: string;
  complaint: string;
  productCategory: string;
  productSubcategory: string;
  id: string;
  company: string;
  isComplaint: boolean;
}

const ITEMS_PER_PAGE = 50;

export default function Dashboard() {
  const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [queryResults, setQueryResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("");
  const fitlerComplaints = useRef<boolean>(true);
  const originalData = useRef<ComplaintResponse[]>([]);
  const date = useRef<Date>(new Date());

  useEffect(() => {
    fetch("/api/getComplaintsFromDatabase", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data: { complaints: ComplaintResponse[] }) => {
        originalData.current = data.complaints;
        setComplaints(data.complaints);
      });
  }, []);

  const handleSearch = () => {
    fetch("/api/queryVectorDatabase", {
      method: "POST",
      body: JSON.stringify({ query: search, topK: 4 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOpenDialog(true);
        setQueryResults(data);
      });
  };

  const totalPages = Math.ceil(complaints.length / ITEMS_PER_PAGE);

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

  const sortChange = (newSortingFunction: string) => {
    setSort(newSortingFunction);
    let sortedComplaints = [...complaints];
    switch (newSortingFunction) {
      case "descendingDate":
        sortedComplaints.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "ascendingDate":
        sortedComplaints.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "company":
        sortedComplaints.sort((a, b) => a.company.localeCompare(b.company));
        break;
      default:
        break;
    }
    setComplaints(sortedComplaints);
  };

  const filterComplaintsList = (showAllComplaints: boolean) => {
    if (showAllComplaints) {
      setComplaints(originalData.current);
    } else {
      setComplaints(
        originalData.current.filter((complaint) => !complaint.isComplaint)
      );
    }
  };

  const handleDateChange = (date: Date) => {
    if (date) {
      setComplaints(
        complaints.filter(
          (complaint) =>
            new Date(complaint.created_at).getTime() >= date.getTime()
        )
      );
    } else {
      setComplaints(complaints);
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
        <Select value={sort} onValueChange={(e) => sortChange(e)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="descendingDate">Date (descending)</SelectItem>
            <SelectItem value="ascendingDate">Date (ascending)</SelectItem>
            <SelectItem value="company">Company</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center gap-16">
        <div className="flex flex-row gap-3 items-center">
          <Checkbox
            checked={fitlerComplaints.current}
            onClick={() => {
              fitlerComplaints.current = !fitlerComplaints.current;
              filterComplaintsList(fitlerComplaints.current);
            }}
          />
          <p>Classified as complaint</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p>Dates after: </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date.current, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date.current}
                onSelect={(newDate) => {
                  if (newDate) {
                    date.current = newDate;
                    handleDateChange(newDate as Date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="p-6 m-4 rounded-lg max-w-lg w-full">
          <ScrollArea className="flex flex-col gap-4 max-h-[80vh]">
            <DialogHeader className="flex flex-col gap-4">
              <DialogTitle className="text-xl font-semibold">
                Similar Complaints
              </DialogTitle>
              <DialogDescription>
                <div className="flex flex-col gap-4 text-sm text-gray-600">
                  {queryResults.map((result, index) => (
                    <div key={index}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-bold">
                            {result.metadata.company}
                          </CardTitle>
                          <CardDescription>
                            <p>
                              <span className="font-bold">
                                Product category:{" "}
                              </span>
                              {result.metadata.productCategory}
                            </p>
                            <p>
                              <span className="font-bold">
                                Product subcategory:{" "}
                              </span>
                              {result.metadata.subProductCategory}
                            </p>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            {result.pageContent}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="self-end w-full mt-4"
            >
              Close
            </Button>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
