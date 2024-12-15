'use client';
import { Appointment } from '@/types/appointmentTypes';
import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';
import { useSession } from 'next-auth/react';

export interface FilterOptions {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface DataContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  openAppointmentCart: boolean;
  setOpenAppointmentCart: (open: boolean) => void;
  appointments: Partial<Appointment>[];
  setAppointments: (value: any) => void;
  doctors: any[];
  fetchDoctorData: (value: string) => void;
  fetchAppointments: () => void;
  filterOptions: FilterOptions;
  setFilterOptions: (value: any) => void;
  itemsPerPage:number;
  setItemsPerPage:(value:number)=>void
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openAppointmentCart, setOpenAppointmentCart] = useState(false);
  const [appointments, setAppointments] = useState<Partial<Appointment>[]>([]);
  const { data: session } = useSession();
  const [doctors, setDoctors] = useState<any>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const fetchDoctorData = (searchTerm: string) => {
    // Fetch doctor data based on searchTerm
  };

  const fetchAppointments = async () => {
    try {
      const query = new URLSearchParams(filterOptions as Record<string, string>).toString(); 
      const response = await fetch(`/api/appointments?${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
      console.log(data, 'data');
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Set startDate and endDate when filterOptions is first initialized
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 7);

    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      startDate: currentDate.toISOString().split('T')[0], // Format to YYYY-MM-DD
      endDate: endDate.toISOString().split('T')[0], // Format to YYYY-MM-DD
    }));
  }, []);

  useEffect(() => {
    if (session) {
      fetchAppointments();
    }
  }, [session]);
  useEffect(() => {
    if (session) {
      fetchAppointments();
    }
  }, [filterOptions]);

  return (
    <DataContext.Provider
      value={{
        doctors,
        fetchDoctorData,
        appointments,
        setAppointments,
        isSidebarOpen,
        setIsSidebarOpen,
        openAppointmentCart,
        setOpenAppointmentCart,
        fetchAppointments,
        filterOptions,
        setFilterOptions,itemsPerPage,
        setItemsPerPage
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
