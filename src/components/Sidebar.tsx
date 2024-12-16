'use client'
import { useSession, signOut } from "next-auth/react"
import { LogOut, Menu, Home, Calendar, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { useData } from "../context/dataContext"


export function Sidebar (){
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const {isSidebarOpen,setIsSidebarOpen}=useData()

  const navItems = [
    { 
      href: "/", 
      icon: Home, 
      label: "Dashboard", 
      show: true 
    },
    { 
      href: "/addmember", 
      icon: Users, 
      label: "Add User", 
      show: session?.user?.role === "admin" 
    }
  ]

  const NavLink = ({ href, icon: Icon, label, active }:any) => (
    <Link 
      href={href} 
      className={`
        flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
        ${active 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-accent text-muted-foreground hover:text-foreground'
        }
      `}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )

  return (
    <>
     

      {/* Sidebar - Desktop */}
      <aside 
        data-testid="sidebar"
        className={`
          fixed top-0 left-0 h-full w-64 bg-background border-r 
          transform transition-transform duration-300 z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:block
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo/Title */}
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold truncate" data-testid="sidebar-title">
              Appointment Portal
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow space-y-2">
            {navItems.map((item) => (
              item.show && (
                <NavLink 
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href}
                  data-testid={`nav-link-${item.label.toLowerCase().replace(" ", "-")}`}
                />
              )
            ))}
          </nav>

          {/* User Actions */}
          <div className="mt-auto space-y-2">
            {session?.user ? (
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => signOut()}
                data-testid="logout-button"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button 
                className="w-full"
                onClick={() => router.push("/login")}
                data-testid="login-button"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          data-testid="overlay"
        />
      )}
    </>
  )
}
