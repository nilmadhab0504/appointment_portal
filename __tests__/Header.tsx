import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/Header";  // Adjust the import path as necessary
import { useSession } from "next-auth/react";
import { useData } from "@/context/dataContext";
import React from "react";
import '@testing-library/jest-dom';
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/context/dataContext", () => ({
  useData: jest.fn(),
}));

describe("Header Component", () => {
  const mockSetIsSidebarOpen = jest.fn();
  const mockSetOpenAppointmentCart = jest.fn();

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: "John Doe",
          role: "admin",
        },
      },
    });

    (useData as jest.Mock).mockReturnValue({
      isSidebarOpen: false,
      setIsSidebarOpen: mockSetIsSidebarOpen,
      setOpenAppointmentCart: mockSetOpenAppointmentCart,
    });
  });

  it("should render the header with correct elements", () => {
    render(<Header />);

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("button-group")).toBeInTheDocument();
    expect(screen.getByTestId("add-appointment-button")).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    expect(screen.queryByTestId("avatar-image")).toBeNull();
    expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("J");
    expect(screen.getByTestId("user-info")).toHaveTextContent("John Doe (Admin)");
  });

  it("should toggle sidebar when the menu button is clicked", () => {
    render(<Header />);
    fireEvent.click(screen.getByTestId("toggle-sidebar-button"));
    expect(mockSetIsSidebarOpen).toHaveBeenCalledWith(true);
  });

  it("should open appointment cart when 'Add Appointment' button is clicked", () => {
    render(<Header />);
    fireEvent.click(screen.getByTestId("add-appointment-button"));
    expect(mockSetOpenAppointmentCart).toHaveBeenCalledWith(true);
  });

  it("should show correct user name and role in the header", () => {
    render(<Header />);
    expect(screen.getByTestId("user-info")).toHaveTextContent("John Doe (Admin)");
  });

  it("should render 'U' in the fallback when user name is not provided", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: "",
        },
      },
    });

    render(<Header />);
    expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("U");
  });
});
