import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddUserPage from "../src/app/addmember/page"; // Adjust the path as necessary

// Mock dependencies
jest.mock("../src/components/Sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar" />,
}));

jest.mock("../src/components/Header", () => ({
  Header: () => <div data-testid="header" />,
}));

jest.mock("../src/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("../src/components/ui/input", () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

jest.mock("../src/components/ui/label", () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

jest.mock("../src/middleware/withAuth", () => (Component: any) => Component);

global.fetch = jest.fn();

describe("AddUserPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => render(<AddUserPage />);

  test("renders AddUserPage with all elements", () => {
    renderComponent();

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("add-user-card")).toBeInTheDocument();
    expect(screen.getByTestId("add-user-title")).toHaveTextContent("Add User");
    expect(screen.getByTestId("admin-type-button")).toBeInTheDocument();
    expect(screen.getByTestId("doctor-type-button")).toBeInTheDocument();
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  // test("switches user type to doctor and displays specialization field", () => {
  //   renderComponent();

  //   fireEvent.click(screen.getByTestId("doctor-type-button"));

  //   expect(screen.getByTestId("doctor-type-button")).toHaveClass("default");
  //   expect(screen.getByTestId("admin-type-button")).toHaveClass("outline");
  //   expect(screen.getByTestId("specialization-input")).toBeInTheDocument();
  // });

  // test("switches user type back to admin and hides specialization field", () => {
  //   renderComponent();

  //   fireEvent.click(screen.getByTestId("doctor-type-button"));
  //   fireEvent.click(screen.getByTestId("admin-type-button"));

  //   expect(screen.getByTestId("admin-type-button")).toHaveClass("default");
  //   expect(screen.queryByTestId("specialization-input")).not.toBeInTheDocument();
  // });

  test("shows error when required fields are empty", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("add-user-submit-button"));

    expect(screen.getByTestId("error-message")).toHaveTextContent(/Name is required/i);
  });

  test("shows error for invalid email format", () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Test User" } });
    fireEvent.change(screen.getByTestId("email-input"), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "validpassword" } });
    fireEvent.click(screen.getByTestId("add-user-submit-button"));

    expect(screen.getByTestId("error-message")).toHaveTextContent(/Email is invalid/i);
  });

  test("shows error for short password", () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Test User" } });
    fireEvent.change(screen.getByTestId("email-input"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "short" } });
    fireEvent.click(screen.getByTestId("add-user-submit-button"));

    expect(screen.getByTestId("error-message")).toHaveTextContent(/Password must be at least 8 characters/i);
  });

  test("shows error when doctor specialization is empty", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("doctor-type-button"));
    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Doctor User" } });
    fireEvent.change(screen.getByTestId("email-input"), { target: { value: "doctor@example.com" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "validpassword" } });
    fireEvent.click(screen.getByTestId("add-user-submit-button"));

    expect(screen.getByTestId("error-message")).toHaveTextContent(/Specialization is required for doctors/i);
  });

  test("handles successful user addition", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      status: 201,
      json: jest.fn().mockResolvedValueOnce({}),
    });

    renderComponent();

    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Admin User" } });
    fireEvent.change(screen.getByTestId("email-input"), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "validpassword" } });
    fireEvent.click(screen.getByTestId("add-user-submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("success-message")).toHaveTextContent(/Admin added successfully/i);
    });
  });

  test("handles API error during user addition", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: jest.fn().mockResolvedValueOnce({ error: "Error adding user" }),
    });

    renderComponent();

    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Admin User" } });
    fireEvent.change(screen.getByTestId("email-input"), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "validpassword" } });
    fireEvent.click(screen.getByTestId("add-user-submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(/Error adding user/i);
    });
  });
});
