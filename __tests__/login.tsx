import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginPage from "../src/app/login/page"; // Adjust the path as necessary

// Mock dependencies
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock components
jest.mock("../src/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("", () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

// Mock global fetch
beforeAll(() => {
  global.fetch = jest.fn();
});

// Function to simulate window resizing
function resizeWindow(width: number) {
  global.innerWidth = width;
  global.dispatchEvent(new Event("resize"));
}

describe("LoginPage Component", () => {
  let mockRouter: any;

  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test

    // Mock session and router
    mockRouter = {
      push: jest.fn(),
    };
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const renderComponent = () => render(<LoginPage />);

  test("renders the initial login form", () => {
    renderComponent();

    // Check for email input field
    expect(screen.getByTestId("email-input")).toBeInTheDocument();

    // Check for password input field
    expect(screen.getByTestId("password-input")).toBeInTheDocument();

    // Check for login button
    expect(screen.getByTestId("login-submit-button")).toBeInTheDocument();
  });

  // Test for responsiveness

  test("should render login form correctly on large screens", () => {
    // Simulate a large screen (e.g., desktop)
    resizeWindow(1200); // Simulate desktop screen width

    renderComponent();

    // Check for the initial layout using data-testid
    expect(screen.getByTestId("login-title")).toBeInTheDocument(); // Check for the title
    expect(screen.getByTestId("email-input")).toBeInTheDocument(); // Check for email input
    expect(screen.getByTestId("password-input")).toBeInTheDocument(); // Check for password input
    expect(screen.getByTestId("login-submit-button")).toBeInTheDocument(); // Check for login button
  });

  test("shows error when email is empty", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("login-submit-button"));
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      /Email is required/i
    );
  });

  test("shows error when password is less than 8 characters", () => {
    renderComponent();
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByTestId("login-submit-button"));
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      /Password must be at least 8 characters/i
    );
  });

  test("successful login", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: null });
    renderComponent();
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "validpassword" },
    });
    fireEvent.click(screen.getByTestId("login-submit-button"));
    // Add assertions for successful login behavior
  });

  test("failed login", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      error: "Invalid credentials",
    });
    renderComponent();
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "validpassword" },
    });
    fireEvent.click(screen.getByTestId("login-submit-button"));
    expect(await screen.findByTestId("error-message")).toHaveTextContent(
      /Invalid credentials/i
    );
  });

//   test("changes role to admin when Admin button is clicked", () => {
//     renderComponent();
//     fireEvent.click(screen.getByTestId("admin-role-button"));
//     expect(screen.getByTestId("admin-role-button")).toHaveClass("default");
//     expect(screen.getByTestId("doctor-role-button")).toHaveClass("outline");
//   });
});
