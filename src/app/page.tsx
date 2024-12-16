"use client";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import AppointmentsDashboard from "@/components/Appointments";
import React from "react";
import withAuth from "../middleware/withAuth";
const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full p-0 m-0 ">
        <Header />
        <AppointmentsDashboard />
      </div>
    </div>
  );
};

export default withAuth(Home);
