import mongoose from "mongoose";
const mongodburl =
  "";
const connectDB = async () => {
  try {
    await mongoose.connect(mongodburl);
    console.log(mongodburl);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
