import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateAddress,
} from "../utils/validation.js";

const prisma = new PrismaClient();

// Register user
export const register = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "Missing fields" });

  if (!validateName(name))
    return res.status(400).json({ message: "Name must be 20-60 chars" });
  if (!validateEmail(email))
    return res.status(400).json({ message: "Invalid email" });
  if (!validatePassword(password))
    return res
      .status(400)
      .json({ message: "Password 8-16 chars, 1 uppercase & 1 special char" });
  if (!["admin", "user", "owner"].includes(role))
    return res.status(400).json({ message: "Invalid role" });

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 12); // stronger
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role },
    });

    res
      .status(201)
      .json({
        message: "User registered",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
