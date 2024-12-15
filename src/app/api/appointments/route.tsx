import { NextRequest, NextResponse } from "next/server";
import Appointment, { Doctor } from "../../../models/Appointment";
import connectDB from "../../../lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth";
import { Session } from "next-auth";
import mongoose from "mongoose";

interface AppointmentRequestBody {
  name: string;
  age: number;
  gender: "Man" | "Woman" | "Other";
  disease: string;
  blood: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  time: string;
  status: "Non Urgent" | "Urgent" | "Emergency" | "Pass Away";
  location: string;
  doctorId: string;
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const session = await getServerSession({ req, ...authOptions }) as Session;

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, id } = session.user;

    const search = req.nextUrl.searchParams.get('search');
    const status = req.nextUrl.searchParams.get('status');
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');

    let filterQuery: any = {};

    if (search) {
      filterQuery.name = { $regex: search, $options: 'i' };
    }

    if (status && status !== "all") {
      filterQuery.status = status;
    }

    if (startDate || endDate) {
      const dateQuery: any = {};
      if (startDate) dateQuery.$gte = startDate;
      if (endDate) dateQuery.$lte = endDate;
      filterQuery.time = dateQuery;
    }

    let appointments;
    if (role === "doctor") {
      const doctorObjectId = new mongoose.Types.ObjectId(id);
      appointments = await Appointment.find({ doctorId: doctorObjectId, ...filterQuery })
        .populate("doctorId", "name")
        .exec();
    } else {
      appointments = await Appointment.find(filterQuery)
        .populate("doctorId", "name")
        .exec();
    }

    const transformedAppointments = appointments.map((appointment) => ({
      ...appointment.toObject(),
      id: appointment._id,
      _id: undefined,
      doctorName: (appointment.doctorId as Doctor).name,
      doctorId: undefined,
    }));

    return NextResponse.json(transformedAppointments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching appointments" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  await connectDB();

  const {
    name,
    age,
    gender,
    disease,
    blood,
    time,
    status,
    location,
    doctorId,
  }: AppointmentRequestBody = await req.json();

  try {
    const newAppointment = new Appointment({
      name,
      age,
      gender,
      disease,
      blood,
      time,
      status,
      location,
      doctorId,
    });

    await newAppointment.save();

    return NextResponse.json({ message: "Appointment created successfully", id: newAppointment._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating appointment" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
  }

  const { name, age, gender, disease, blood, time, status, location, doctorId }: AppointmentRequestBody = await req.json();

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        name,
        age,
        gender,
        disease,
        blood,
        time,
        status,
        location,
        doctorId,
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...updatedAppointment.toObject(),
      id: updatedAppointment._id,
      _id: undefined,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating appointment" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
  }

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Appointment deleted successfully", id: deletedAppointment._id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting appointment" }, { status: 500 });
  }
}
