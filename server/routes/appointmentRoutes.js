import express from "express";
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import { isAuth, isStaff, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Book appointment
router.post("/", isAuth, async (req, res) => {
  const { serviceId, date, time } = req.body;

  const exists = await Appointment.findOne({ serviceId, date, time });
  if (exists) return res.status(400).json({ message: "Slot already booked" });

  const appointment = await Appointment.create({
    userId: req.user.id,
    serviceId,
    date,
    time,
  });

  res.json(appointment);
});

// GET /appointments/my/completed - Must come before /my to avoid route conflict
router.get("/my/completed", isAuth, async (req, res) => {
  try {
    let query = { status: "completed" };

    // If not admin, filter by userId
    if (req.user.role !== "admin") {
      let userId = req.user.id;
      // Convert to ObjectId if it's a valid ObjectId string
      if (mongoose.Types.ObjectId.isValid(userId)) {
        userId = new mongoose.Types.ObjectId(userId);
      }
      query.userId = userId;
    }

    const apps = await Appointment.find(query);
    res.json(apps);
  } catch (error) {
    console.error("Error fetching completed appointments:", error);
    res.status(500).json({ message: "Error fetching completed appointments" });
  }
});
// Customer dashboard - Only show pending appointments (all for admin)
router.get("/my", isAuth, async (req, res) => {
  try {
    let query = { status: "pending" };

    // If not admin, filter by userId
    if (req.user.role !== "admin") {
      let userId = req.user.id;
      // Convert to ObjectId if it's a valid ObjectId string
      if (mongoose.Types.ObjectId.isValid(userId)) {
        userId = new mongoose.Types.ObjectId(userId);
      }
      query.userId = userId;
    }

    const apps = await Appointment.find(query);
    res.json(apps);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});
// Staff dashboard
router.get("/staff", isAuth, isStaff, async (req, res) => {
  const apps = await Appointment.find();
  res.json(apps);
});

// Update status (staff)
router.put("/:id/status", isAuth, isStaff, async (req, res) => {
  const app = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: "completed" },
    { new: true } // Return the updated document
  );
  res.json(app);
});

export default router;
