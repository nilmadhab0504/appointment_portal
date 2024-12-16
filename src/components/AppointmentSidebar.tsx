import React,{ useState, useEffect } from "react";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Appointment,
  AppointmentStatus,
  BloodGroup,
  currentTeampAppointment,
} from "@/types/appointmentTypes";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useData } from "../context/dataContext";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface AppointmentSidebarProps {
  currentAppointment: Partial<Appointment>;
  setCurrentAppointment: React.Dispatch<React.SetStateAction<any>>;
  handleSaveAppointment: () => void;
}

export function AppointmentSidebar({
  currentAppointment,
  setCurrentAppointment,
  handleSaveAppointment,
}: AppointmentSidebarProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [doctorSearch, setDoctorSearch] = useState("");
  const [specialization, setSpecialization] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const { setOpenAppointmentCart } = useData();

  useEffect(() => {
    if (role === "admin" && doctorSearch.trim() !== "") {
      const fetchDoctors = async () => {
        setIsLoading(true);
        try {
          const params = new URLSearchParams();
          if (doctorSearch.trim() !== "") {
            params.append("search", doctorSearch);
          }
          if (specialization) {
            params.append("specialization", specialization);
          }

          const response = await fetch(`/api/doctor?${params.toString()}`);
          const data = await response.json();
          setFilteredDoctors(data.doctors);
        } catch (error) {
          console.error("Failed to fetch doctors:", error);
        } finally {
          setIsLoading(false);
        }
      };

      const debounceTimer = setTimeout(fetchDoctors, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setFilteredDoctors([]);
    }
  }, [doctorSearch, specialization, role]);

  const handleDoctorSelect = (doctor: any) => {
    setCurrentAppointment({
      ...currentAppointment,
      doctorId: doctor._id,
      doctorName: doctor.name,
    });
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto" data-testid="appointment-sidebar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold" data-testid="appointment-title">
          {currentAppointment.id ? "Edit" : "Add"} Appointment
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setOpenAppointmentCart(false);
            setCurrentAppointment(currentTeampAppointment);
          }}
          data-testid="close-button"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={currentAppointment.name}
            onChange={(e) =>
              setCurrentAppointment({
                ...currentAppointment,
                name: e.target.value,
              })
            }
            placeholder="Enter patient name"
            data-testid="patient-name-input"
          />
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={currentAppointment.age}
            onChange={(e) =>
              setCurrentAppointment({
                ...currentAppointment,
                age: Number(e.target.value),
              })
            }
            placeholder="Enter patient age"
            min={0}
            max={120}
            data-testid="patient-age-input"
          />
        </div>

        <div>
          <Label>Gender</Label>
          <Select
            value={currentAppointment.gender}
            onValueChange={(value: "Man" | "Woman" | "Other") =>
              setCurrentAppointment({
                ...currentAppointment,
                gender: value,
              })
            }
            data-testid="gender-select"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Man">Man</SelectItem>
              <SelectItem value="Woman">Woman</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {role === "admin" && (
          <>
            <div>
              <Label>Specialization</Label>
              <Select
                value={specialization}
                onValueChange={(value: any) => {
                  setSpecialization(value);
                  setCurrentAppointment({
                    ...currentAppointment,
                    doctorId: undefined,
                    doctorName: undefined,
                  });
                }}
                data-testid="specialization-select"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Oncology">Oncology</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                  <SelectItem value="General Physician">
                    General Physician
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center justify-between">
                <span>Doctor</span>
                {currentAppointment.doctorName && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 text-xs h-6"
                    onClick={() => {
                      setCurrentAppointment({
                        ...currentAppointment,
                        doctorId: undefined,
                        doctorName: undefined,
                      });
                    }}
                    data-testid="clear-doctor-button"
                  >
                    Clear
                  </Button>
                )}
              </Label>

              {currentAppointment.doctorName ? (
                <div className="bg-gray-100 p-2 rounded-md flex justify-between items-center" data-testid="selected-doctor">
                  <div>
                    <p className="font-medium">
                      {currentAppointment.doctorName}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Input
                    type="text"
                    placeholder="Search Doctor"
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    className="mb-2"
                    data-testid="doctor-search-input"
                  />
                  {isLoading ? (
                    <p data-testid="loading-doctors">Loading...</p>
                  ) : (
                    <ul className="space-y-2">
                      {filteredDoctors.map((doctor) => (
                        <li
                          key={doctor.id}
                          onClick={() => handleDoctorSelect(doctor)}
                          className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                          data-testid={`doctor-item-${doctor.id}`}
                        >
                          {doctor.name} ({doctor.specialization})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        <div>
          <Label htmlFor="disease">Disease</Label>
          <Input
            id="disease"
            value={currentAppointment.disease}
            onChange={(e) =>
              setCurrentAppointment({
                ...currentAppointment,
                disease: e.target.value,
              })
            }
            placeholder="Enter patient's primary disease"
            data-testid="disease-input"
          />
        </div>

        <div>
          <Label>Blood Group</Label>
          <Select
            value={currentAppointment.blood}
            onValueChange={(value: BloodGroup) =>
              setCurrentAppointment({
                ...currentAppointment,
                blood: value,
              })
            }
            data-testid="blood-group-select"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Blood Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="time">Appointment Time</Label>
          <Input
            id="time"
            type="datetime-local"
            value={
              currentAppointment.time
                ? new Date(currentAppointment.time).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => {
              const inputTime = e.target.value;
              const isoTime = new Date(inputTime).toISOString();
              setCurrentAppointment({
                ...currentAppointment,
                time: isoTime,
              });
            }}
            data-testid="appointment-time-input"
          />
        </div>

        <div>
          <Label>Appointment Status</Label>
          <Select
            value={currentAppointment.status}
            onValueChange={(value: AppointmentStatus) =>
              setCurrentAppointment({
                ...currentAppointment,
                status: value,
              })
            }
            data-testid="appointment-status-select"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Non Urgent">Non Urgent</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="Pass Away">Pass Away</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={currentAppointment.location}
            onChange={(e) =>
              setCurrentAppointment({
                ...currentAppointment,
                location: e.target.value,
              })
            }
            placeholder="Enter appointment location"
            data-testid="location-input"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setOpenAppointmentCart(false);
              setCurrentAppointment(currentTeampAppointment);
            }}
            data-testid="cancel-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAppointment}
            disabled={!currentAppointment.name || !currentAppointment.time}
            data-testid="save-appointment-button"
          >
            Save Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
