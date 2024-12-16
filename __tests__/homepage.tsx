import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import "@testing-library/jest-dom";

jest.mock("../src/components/Sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));
jest.mock("../src/components/Header", () => ({
  Header: () => <div data-testid="header">Header</div>,
}));
jest.mock("../src/components/Appointments", () => {
  const AppointmentsDashboard = () => (
    <div data-testid="appointments-dashboard">AppointmentsDashboard</div>
  );
  return AppointmentsDashboard;
});

jest.mock("../src/middleware/withAuth", () => {
  return (Component: React.ComponentType) => (props: any) => <Component {...props} />;
});

describe("Home Component", () => {
  it("renders the Sidebar, Header, and AppointmentsDashboard components", () => {
    render(<Home />);

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveTextContent("Sidebar");

    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Header");

    const appointmentsDashboard = screen.getByTestId("appointments-dashboard");
    expect(appointmentsDashboard).toBeInTheDocument();
    expect(appointmentsDashboard).toHaveTextContent("AppointmentsDashboard");
  });
});
