import { NextRequest, NextResponse } from "next/server";
import Admin from "../../../models/Admin";
import bcrypt from "bcrypt";
import connectDB from "../../../lib/connectDB";

interface AdminRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body: AdminRequestBody = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: passwordHash,
    });

    await newAdmin.save();

    return NextResponse.json(
      { message: "Admin added successfully", adminId: newAdmin._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding admin:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while adding the admin" },
      { status: 500 }
    );
  }
}
