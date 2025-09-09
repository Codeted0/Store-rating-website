import { PrismaClient } from '../../generated/prisma/index.js';
import bcrypt from 'bcryptjs';
import { getSorting } from '../utils/sorting.js';

const prisma = new PrismaClient();

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const orderBy = getSorting(req, 'id', 'asc'); // default by id ascending

    const users = await prisma.user.findMany({
      include: { stores: true, ratings: true },
      orderBy, // <-- added
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Get all owners only
export const getOwners = async (req, res) => {
  try {
    const owners = await prisma.user.findMany({
      where: { role: "owner" },
      select: { id: true, name: true }, // only what you need
    });
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { stores: true, ratings: true },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update password (any user)
export const updatePassword = async (req, res) => {
  const id = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset user password (admin only)
export const resetUserPassword = async (req, res) => {
  const id = parseInt(req.params.id);
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'New password required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password reset successfully for user ' + id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Create new user (admin only)
export const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role },
    });
    res.json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search users (admin only)
export const searchUsers = async (req, res) => {
  const { name, email, address, role } = req.query;
  const orderBy = getSorting(req, 'name', 'asc'); // default by name ascending

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          name ? { name: { contains: name, mode: 'insensitive' } } : {},
          email ? { email: { contains: email, mode: 'insensitive' } } : {},
          address ? { address: { contains: address, mode: 'insensitive' } } : {},
          role ? { role } : {},
        ],
      },
      orderBy, // <-- added
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) }, // make sure it's an integer
      select: {
        id: true,
        name: true,
        email: true,
        stores: true,
        ratings: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching current user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
