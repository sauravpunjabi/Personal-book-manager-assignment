import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  try {
    const { connection } = await mongoose.connect(uri);
    console.info(`MongoDB connected to "${connection.name}"`);
  } catch (error) {
    console.error('Could not connect to MongoDB:', error);
    process.exit(1);
  }
}
