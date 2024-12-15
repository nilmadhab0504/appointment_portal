import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://niltewari05:g8IpwLAM5yzLNlv6@cluster0.j5x8z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;


