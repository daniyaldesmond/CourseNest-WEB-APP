import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coursenest');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Server warning: MongoDB database is not active. Ensure MongoDB is running or configure your connection.');
    // We don't exit the process here to allow the server to boot and report errors on requests, or for offline mockup purposes.
  }
};

export default connectDB;
