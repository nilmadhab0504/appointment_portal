'use client';
import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { useData, FilterOptions } from '../context/dataContext';
import { format } from "date-fns";

import { parseISO } from "date-fns";

export function Filters({ setCurrentPage }: any) {
  const { filterOptions, setFilterOptions } = useData();
  const [searchTerm, setSearchTerm] = useState(filterOptions.search || "");
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilterOptions((prev: FilterOptions) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterOptions((prev: FilterOptions) => ({ ...prev, status: value }));
  };

  const handleDateChange = (selectedDate: Date, isStartDate: boolean) => {
    if (isStartDate) {
      setFilterOptions((prev: FilterOptions) => ({
        ...prev,
        startDate: selectedDate.toISOString(),
      }));
      setIsStartDatePopoverOpen(false);
    } else {
      setFilterOptions((prev: FilterOptions) => ({
        ...prev,
        endDate: selectedDate.toISOString(),
      }));
      setIsEndDatePopoverOpen(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Date :</span>
          <Popover open={isStartDatePopoverOpen} onOpenChange={setIsStartDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterOptions.startDate ? format(parseISO(filterOptions.startDate), "MM/dd/yyyy") : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filterOptions.startDate ? parseISO(filterOptions.startDate) : undefined}
                onSelect={(date) => date && handleDateChange(date, true)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <span className="text-sm text-muted-foreground">To</span>
          <Popover open={isEndDatePopoverOpen} onOpenChange={setIsEndDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterOptions.endDate ? format(parseISO(filterOptions.endDate), "MM/dd/yyyy") : "Select end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filterOptions.endDate ? parseISO(filterOptions.endDate) : undefined}
                onSelect={(date) => date && handleDateChange(date, false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status</span>
          <Select defaultValue={filterOptions.status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Non Urgent">Non Urgent</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="Pass Away">Pass Away</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search appointments by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
        </div>
      </div>
    </div>
  );
}
