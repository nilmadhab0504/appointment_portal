"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menu, PlusCircle } from "lucide-react";
import { useData } from "../context/dataContext";

export function Header() {
  const { isSidebarOpen, setIsSidebarOpen, setOpenAppointmentCart } = useData();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 w-full bg-background border-b">
      <div className="flex items-center justify-between md:justify-end p-4 md:ml-64">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-8 w-8" />
        </Button>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setOpenAppointmentCart(true);
            }}
            variant="default"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Appointment
          </Button>

          <Avatar className="h-10 w-10 md:hidden">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || ""}
            />
            <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
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
