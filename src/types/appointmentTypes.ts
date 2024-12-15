export interface Appointment {
    id: string;
    name: string;
    age: number;
    gender: 'Man' | 'Woman' | 'Other';
    disease: string;
    blood: BloodGroup;
    time: string;
    status: AppointmentStatus;
    location: string;
    doctorName:string;
    doctorId:string;
  }
  
  export type BloodGroup = 
    | 'A+' | 'A-'
    | 'B+' | 'B-'
    | 'AB+' | 'AB-'
    | 'O+' | 'O-';
  
  export type AppointmentStatus = 
    | 'Non Urgent' 
    | 'Urgent' 
    | 'Emergency' 
    | 'Pass Away';

  export const currentTeampAppointment:Partial<Appointment>={ 
    name: "",
    age: 0,
    gender: "Man",
    disease: "",
    blood: "A+",
    time: "",
    status: "Non Urgent",
    location: ""
  }