'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import withAuth from "@/middleware/withAuth";

interface UserData {
  name: string;
  email: string;
  password: string;
  specialization?: string;
}

const AddUserPage = () => {
  const [userType, setUserType] = useState<'admin' | 'doctor'>('admin');
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    specialization: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
    setSuccess(null);
  };

  const setUserTypeAndResetForm = (type: 'admin' | 'doctor') => {
    setUserType(type);
    setFormData({
      name: '',
      email: '',
      password: '',
      specialization: '',
    });
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    if (!formData.name) {
      setError("Name is required");
      return false;
    }
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email is invalid");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (userType === 'doctor' && !formData.specialization) {
      setError("Specialization is required for doctors");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`/api/${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.status === 201) {
        setSuccess(`${userType.charAt(0).toUpperCase() + userType.slice(1)} added successfully`);
        setFormData({
          name: '',
          email: '',
          password: '',
          specialization: '',
        });
      } else {
        setError(data.error || `Error adding ${userType}`);
      }
    } catch (err) {
      setError(`Error adding ${userType}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 md:ml-60 md:mt-20 bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Card 
              data-testid="add-user-card"
              className="w-full max-w-md mx-auto"
            >
              <CardHeader>
                <CardTitle 
                  data-testid="add-user-title"
                  className="text-2xl font-bold text-center mb-4"
                >
                  Add User
                </CardTitle>
                <div className="flex justify-center space-x-4 mb-4">
                  <Button
                    data-testid="admin-type-button"
                    type="button"
                    variant={userType === "admin" ? "default" : "outline"}
                    onClick={() => setUserTypeAndResetForm("admin")}
                    className="w-1/2 sm:w-auto"
                  >
                    Admin
                  </Button>
                  <Button
                    data-testid="doctor-type-button"
                    type="button"
                    variant={userType === "doctor" ? "default" : "outline"}
                    onClick={() => setUserTypeAndResetForm("doctor")}
                    className="w-1/2 sm:w-auto"
                  >
                    Doctor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="name"
                      data-testid="name-label"
                    >
                      Name
                    </Label>
                    <Input
                      data-testid="name-input"
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
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
                  {userType === 'doctor' && (
                    <div className="space-y-2">
                      <Label 
                        htmlFor="specialization"
                        data-testid="specialization-label"
                      >
                        Specialization
                      </Label>
                      <Input
                        data-testid="specialization-input"
                        id="specialization"
                        name="specialization"
                        type="text"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                  {error && (
                    <p 
                      data-testid="error-message"
                      className="text-sm text-red-500 mt-2"
                    >
                      {error}
                    </p>
                  )}
                  {success && (
                    <p 
                      data-testid="success-message"
                      className="text-sm text-green-500 mt-2"
                    >
                      {success}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  data-testid="add-user-submit-button"
                  className="w-full"
                  type="button"
                  onClick={handleSubmit}
                >
                  Add {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withAuth(AddUserPage);
