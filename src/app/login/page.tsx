"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import withOutAuth from "@/middleware/withOutAuth";

interface LoginData {
  email: string;
  password: string;
  role: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginData>({ 
    email: "", 
    password: "", 
    role: "doctor" 
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const setRole = (role: string) => {
    setFormData((prevData) => ({ ...prevData, role }));
    setError(null);
  };

  const handleSubmit = async () => {
    // Reset error before validation
    setError(null);

    // Validation
    if (!formData.email) {
      setError("Email is required");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email is invalid");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
    }
  };

  return (
    <div 
      data-testid="login-page"
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
    >
      <Card 
        data-testid="login-card"
        className="w-full max-w-md mx-auto"
      >
        <CardHeader>
          <CardTitle 
            data-testid="login-title"
            className="text-2xl font-bold text-center mb-4"
          >
            Login
          </CardTitle>
          <div className="flex justify-center space-x-4 mb-4">
            <Button
              data-testid="doctor-role-button"
              type="button"
              variant={formData.role === "doctor" ? "default" : "outline"}
              onClick={() => setRole("doctor")}
              className="w-1/2 sm:w-auto"
            >
              Doctor
            </Button>
            <Button
              data-testid="admin-role-button"
              type="button"
              variant={formData.role === "admin" ? "default" : "outline"}
              onClick={() => setRole("admin")}
              className="w-1/2 sm:w-auto"
            >
              Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="email"
                data-testid="email-label"
              >
                Email
              </Label>
              <Input
                data-testid="email-input"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="password"
                data-testid="password-label"
              >
                Password
              </Label>
              <Input
                data-testid="password-input"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {error && (
              <p 
                data-testid="error-message"
                className="text-sm text-red-500 mt-2"
              >
                {error}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            data-testid="login-submit-button"
            className="w-full"
            type="button"
            onClick={handleSubmit}
          >
            Login as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default withOutAuth(LoginPage);