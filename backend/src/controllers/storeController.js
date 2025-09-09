import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

export const addStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  if (!name || !email || !address || !ownerId)
    return res.status(400).json({ message: "All fields required" });

  try {
    const ownerUser = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!ownerUser || ownerUser.role !== "owner")
      return res.status(400).json({ message: "Owner not valid" });

    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore)
      return res.status(400).json({ message: "Store email exists" });

    const store = await prisma.store.create({
      data: { name, email, address, ownerId },
    });
    res.status(201).json({ message: "Store created", store });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all stores (any logged-in user)
export const getStores = async (req, res) => {
  const { name, address } = req.query;

  try {
    const stores = await prisma.store.findMany({
      where: {
        AND: [
          name ? { name: { contains: name, mode: "insensitive" } } : {},
          address
            ? { address: { contains: address, mode: "insensitive" } }
            : {},
        ],
      },
      include: {
        owner: true,
        ratings: true,
      },
    });

    // Add overallRating to response
    const storesWithAvg = stores.map((store) => {
      const total = store.ratings.reduce((a, r) => a + r.ratingValue, 0);
      const avgRating = store.ratings.length ? total / store.ratings.length : 0;
      return { ...store, avgRating };
    });

    res.json(storesWithAvg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get store details for logged-in owner
export const getOwnerStore = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await prisma.store.findFirst({
      where: { ownerId },
      include: { ratings: true },
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    // calculate avg rating
    const total = store.ratings.reduce((sum, r) => sum + r.ratingValue, 0);
    const averageRating = store.ratings.length
      ? total / store.ratings.length
      : 0;

    res.json({ ...store, averageRating });
  } catch (err) {
    console.error("getOwnerStore error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Store Owner: get ratings submitted by users
export const getStoreRatings = async (req, res) => {
  const ownerId = req.user.id; // Store Owner

  try {
    const stores = await prisma.store.findMany({
      where: { ownerId },
      include: { ratings: { include: { user: true } } },
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
