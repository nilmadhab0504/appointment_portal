import React, { useState, useMemo } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { useData } from "../context/dataContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";

import {
  Appointment,
  currentTeampAppointment,
} from "../types/appointmentTypes";
import Pagination from "./Pagination ";
import { Filters } from "./AppointmentFilter";
import { AppointmentSidebar } from "./AppointmentSidebar";

export default function AppointmentsDashboard() {
  const {
    appointments,
    setAppointments,
    openAppointmentCart,
    setOpenAppointmentCart,
    fetchAppointments,
    itemsPerPage
  } = useData();
  const { data: session } = useSession();
  const role = session?.user.role;
  const [currentAppointment, setCurrentAppointment] = useState<
    Partial<Appointment>
  >(currentTeampAppointment);
  const [currentPage, setCurrentPage] = useState(1);

  const tableHeaders = useMemo(() => {
    const baseHeaders: (keyof Appointment)[] = [
      "name",
      "age",
      "gender",
      "disease",
      "blood",
      "time",
      "status",
    ];

    return role === "admin"
      ? ([...baseHeaders, "doctor"] as (keyof Appointment)[])
      : baseHeaders;
  }, [role]);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return appointments.slice(startIndex, startIndex + itemsPerPage);
  }, [appointments, currentPage, itemsPerPage]);


  const handleEditAppointment = (appointment: Partial<Appointment>) => {
    setCurrentAppointment({ ...appointment });
    setOpenAppointmentCart(true);
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      // Sending the DELETE request to the backend with the id as a query parameter
      const response = await fetch(`/api/appointments?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the appointment");
      }

      // Update the state by removing the deleted appointment
      setAppointments(appointments.filter((app) => app.id != id));
    } catch (error: any) {
      console.error("Error deleting appointment:", error.message);
    }
  };

  const handleSaveAppointment = async () => {
    const doctorId =
      role === "doctor" ? session?.user.id : currentAppointment.doctorId;
    const appointmentData = {
      ...currentAppointment,
      doctorId,
    };
    const appointmentId = currentAppointment.id;

    try {
      let response;
      console.log(appointmentData, "dayt");
      if (appointmentId) {
        response = await fetch(`/api/appointments?id=${appointmentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        });
      } else {
        response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        });
      }

      if (response.ok) {
        setCurrentAppointment(currentTeampAppointment);
        fetchAppointments();
        setOpenAppointmentCart(false);
      } else {
        console.error("Failed to save appointment:", await response.json());
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="relative px-4 md:p-6 md:ml-64 max-w-full">
        <Filters setCurrentPage={setCurrentPage} />

        <div className="border w-full overflow-auto">
          <table className="w-full border-collapse overflow-auto">
            <thead>
              <tr className="bg-[#0f1729] rounded-lg text-white w-full sticky top-0 z-10">
                {tableHeaders.map((key) => (
                  <th key={key} className="p-4 text-left hover:bg-[#1a2534]">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="overflow-auto">
              {paginatedAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b w-full relative group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{appointment.name}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {appointment.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{appointment.age}</td>
                  <td className="p-4">{appointment.gender}</td>
                  <td className="p-4">
                    <Tooltip>
                      <TooltipTrigger>
                        {appointment.disease && appointment.disease.length > 15
                          ? appointment.disease.slice(0, 10) + "..."
                          : appointment.disease || ""}
                      </TooltipTrigger>
                      <TooltipContent>{appointment.disease}</TooltipContent>
                    </Tooltip>
                  </td>
                  <td className="p-4">{appointment.blood}</td>
                  <td className="p-4">
                    {appointment.time && new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }).format(new Date(appointment.time))}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium 
                      ${
                        appointment.status === "Non Urgent" &&
                        "bg-green-100 text-green-700"
                      }
                      ${
                        appointment.status === "Urgent" &&
                        "bg-yellow-100 text-yellow-700"
                      }
                      ${
                        appointment.status === "Emergency" &&
                        "bg-red-100 text-red-700"
                      }
                      ${
                        appointment.status === "Pass Away" &&
                        "bg-purple-100 text-purple-700"
                      }
                    `}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  {role === "admin" && (
                    <td className="p-4">
                      {appointment.doctorName || "Unassigned"}
                    </td>
                  )}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteAppointment(appointment.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {itemsPerPage < appointments.length && (
         <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        )}

        {openAppointmentCart && currentAppointment && (
          <AppointmentSidebar
            currentAppointment={currentAppointment}
            setCurrentAppointment={setCurrentAppointment}
            handleSaveAppointment={handleSaveAppointment}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
