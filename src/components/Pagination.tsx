import React from "react";
import { useData } from "../context/dataContext";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  }
export default function Pagination({currentPage, setCurrentPage}:PaginationProps) {
  const {
    appointments,
    itemsPerPage,
     setItemsPerPage
  } = useData();
  const totalPages = Math.ceil(appointments.length / itemsPerPage);



  return (
    <div className="flex justify-between items-center mt-4" data-testid="pagination">
      <div className="flex items-center gap-2">
        <span>Items per page:</span>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}
          data-testid="items-per-page-select"
        >
          <SelectTrigger className="w-[100px]" data-testid="items-per-page-trigger">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          data-testid="previous-button"
        >
          Previous
        </Button>

        <span data-testid="current-page">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages, p + 1))
          }
          disabled={currentPage === totalPages}
          data-testid="next-button"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
