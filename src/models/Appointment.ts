import mongoose, { Schema, Document, Model } from 'mongoose';

enum AppointmentStatus {
  NON_URGENT = 'Non Urgent',
  URGENT = 'Urgent',
  EMERGENCY = 'Emergency',
  PASS_AWAY = 'Pass Away',
}
export interface Doctor {
  _id: mongoose.Types.ObjectId;
  name: string;
}

enum BloodGroup {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

interface AppointmentAttributes {
  name: string;
  age: number;
  gender: 'Man' | 'Woman' | 'Other';
  disease: string;
  blood: BloodGroup;
  time: Date;
  status: AppointmentStatus;
  location: string;
  doctorId: Doctor | mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppointmentDocument extends Document, AppointmentAttributes {}

const AppointmentSchema: Schema = new Schema<AppointmentDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      enum: ['Man', 'Woman', 'Other'],
      required: true,
    },
    disease: {
      type: String,
      required: true,
      trim: true,
    },
    blood: {
      type: String,
      enum: Object.values(BloodGroup),
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.NON_URGENT,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Doctor', // Reference to the Doctor model
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Appointment: Model<AppointmentDocument> =
  mongoose.models.Appointment || mongoose.model<AppointmentDocument>('Appointment', AppointmentSchema);

export default Appointment;
