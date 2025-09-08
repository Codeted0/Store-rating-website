import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

// Admin can add a store
export const addStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;

  try {
    const store = await prisma.store.create({
      data: { name, email, address, ownerId: req.user.id, },
    });
    res.json({ message: 'Store created', store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all stores (any logged-in user)
export const getStores = async (req, res) => {
  const { name, address } = req.query;

  try {
    const stores = await prisma.store.findMany({
      where: {
        AND: [
          name ? { name: { contains: name, mode: 'insensitive' } } : {},
          address ? { address: { contains: address, mode: 'insensitive' } } : {},
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
