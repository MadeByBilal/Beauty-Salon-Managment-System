import express from "express";
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

// Customer dashboard
router.get("/my", isAuth, async (req, res) => {
  const apps = await Appointment.find({ userId: req.user.id });
  res.json(apps);
});

// Staff dashboard
router.get("/staff", isAuth, isStaff, async (req, res) => {
  const apps = await Appointment.find();
  res.json(apps);
});

// Update status (staff)
router.put("/:id/status", isAuth, isStaff, async (req, res) => {
  const app = await Appointment.findByIdAndUpdate(req.params.id, {
    status: "completed",
  });
  res.json(app);
});

// Admin dashboard
router.get("/admin", isAuth, isAdmin, async (req, res) => {
  const apps = await Appointment.find();
  res.json(apps);
});

export default router;
