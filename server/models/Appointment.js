import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  serviceId: mongoose.Schema.Types.ObjectId,
  date: String,
  time: String,
  status: { type: String, default: "pending" },
});

export default mongoose.model("Appointment", appointmentSchema);
