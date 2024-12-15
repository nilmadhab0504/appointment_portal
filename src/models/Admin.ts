import mongoose, { Schema, Document, Model } from 'mongoose';

interface AdminAttributes {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdminDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema<AdminDocument> = new Schema<AdminDocument>(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ], // Regex validation for email format
    },
    password: {
      type: String,
      required: [true, "Admin password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
    versionKey: false, // Remove `__v` field from documents
  }
);

// Middleware to log changes for debugging purposes
AdminSchema.pre("save", function (next) {
  console.log(`Admin document is being saved: ${this.name}`);
  next();
});

// Indexes for optimized queries
AdminSchema.index({ email: 1 }); // Ensures quick lookup by email

const Admin: Model<AdminDocument> =
  mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', AdminSchema);

export default Admin;
