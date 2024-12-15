'use client'
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { DataProvider } from "../context/dataContext";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <SessionProvider>   
          <DataProvider>    
            {children}
            </DataProvider> 
        </SessionProvider>
      </body>
    </html>
  );
}
