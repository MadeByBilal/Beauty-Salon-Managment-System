import express from "express";
import Service from "../models/Service.js";
import { isAuth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get services (public)
router.get("/", async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

// Add service (admin)
router.post("/", isAuth, isAdmin, async (req, res) => {
  const service = await Service.create(req.body);
  res.json(service);
});

// Update service
router.put("/:id", isAuth, isAdmin, async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body);
  res.json(service);
});

// Delete service
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
