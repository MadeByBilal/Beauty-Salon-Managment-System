import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: String,
  price: Number,
  duration: Number, // minutes
});

export default mongoose.model("Service", serviceSchema);
