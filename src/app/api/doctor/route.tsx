import { NextRequest, NextResponse } from "next/server";
import Doctor from "../../../models/Doctor";
import bcrypt from "bcrypt";
import connectDB from "../../../lib/connectDB";

interface DoctorRequestBody {
    name: string;
    email: string;
    password: string;
    specialization: string;
}

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const { name, email, password, specialization }: DoctorRequestBody = await req.json();

        // Validate the request body
        if (!name || !email || !password || !specialization) {
            return NextResponse.json(
                { error: "All fields (name, email, password, specialization) are required" },
                { status: 400 }
            );
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Check if the doctor already exists
        const existingDoctor = await Doctor.findOne({ email: normalizedEmail });
        if (existingDoctor) {
            return NextResponse.json(
                { error: "A doctor with this email already exists" },
                { status: 400 }
            );
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new doctor
        const newDoctor = new Doctor({
            name,
            email: normalizedEmail,
            password: passwordHash,
            specialization,
        });

        // Save the doctor to the database
        await newDoctor.save();

        return NextResponse.json(
            { message: "Doctor added successfully", doctorId: newDoctor._id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding doctor:", error);
        return NextResponse.json(
            { error: "An error occurred while adding the doctor. Please try again later." },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    await connectDB();

    try {
        const search = req.nextUrl.searchParams.get('search');
        // Build filter object
        const filter: any = {};

        if (search) {
            const regexSearch = new RegExp(search, "i"); // Case-insensitive regex search
            filter.$or = [
                { name: { $regex: regexSearch } },
                { specialization: { $regex: regexSearch } }
            ];
        }

        // Get doctors based on the filter
        const doctors = await Doctor.find(filter);

        return NextResponse.json(
            { doctors },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching doctors. Please try again later." },
            { status: 500 }
        );
    }
}