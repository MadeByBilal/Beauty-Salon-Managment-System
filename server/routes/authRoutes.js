import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isAuth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });//password created
  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);//compare the pass 
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },//here the token is created
    process.env.JWT_SECRET
  );

  res.json({ token, role: user.role });//the token is sent back to frontend
});

// Get staff users (admin only)
router.get("/staff", async (req, res) => {
  try {
    const staffUsers = await User.find({ role: "staff" }).select("-password");
    res.json(staffUsers);
  } catch (error) {
    console.error("Error fetching staff users:", error);
    res.status(500).json({ message: "Error fetching staff users" });
  }
});

// Delete staff user (admin only)
router.delete("/staff/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "staff") {
      return res.status(400).json({ message: "Can only delete staff users" });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "Staff user deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff user:", error);
    res.status(500).json({ message: "Error deleting staff user" });
  }
});

export default router;
