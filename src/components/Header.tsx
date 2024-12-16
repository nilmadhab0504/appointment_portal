"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menu, PlusCircle } from "lucide-react";
import { useData } from "../context/dataContext";

export function Header() {
  const { isSidebarOpen, setIsSidebarOpen, setOpenAppointmentCart } = useData();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 w-full bg-background border-b" data-testid="header">
      <div className="flex items-center justify-between md:justify-end p-4 md:ml-64" data-testid="header-content">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          data-testid="toggle-sidebar-button"
        >
          <Menu className="h-8 w-8" />
        </Button>

        <div className="flex items-center gap-4" data-testid="button-group">
          <Button
            onClick={() => {
              setOpenAppointmentCart(true);
            }}
            variant="default"
            data-testid="add-appointment-button"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Appointment
          </Button>

          <Avatar className="h-10 w-10 md:hidden" data-testid="avatar">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || ""}
              data-testid="avatar-image"
            />
            <AvatarFallback data-testid="avatar-fallback">{session?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block" data-testid="user-info">
            <div>
              {session?.user?.name +
                " (" +
                (session?.user?.role
                  ? session.user.role[0].toUpperCase() +
                    session.user.role.slice(1)
                  : "") +
                ")"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
