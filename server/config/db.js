import mongoose from "mongoose";
const mongodburl =
  "mongodb+srv://bilaldev121_db_user:CJSWcplPIrAqall1@bsms.e6qp0jb.mongodb.net/";
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
