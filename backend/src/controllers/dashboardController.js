import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

// Admin dashboard stats
export const adminDashboard = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Store Owner: average rating per store + list of user ratings
export const ownerDashboard = async (req, res) => {
  const ownerId = req.user.id;

  try {
    const stores = await prisma.store.findMany({
      where: { ownerId },
      include: { ratings: { include: { user: true } } },
    });

    const formattedStores = stores.map((store) => {
      const avgRating =
        store.ratings.length ? store.ratings.reduce((a, r) => a + r.ratingValue, 0) / store.ratings.length : 0;
      return { id: store.id, name: store.name, avgRating, ratings: store.ratings };
    });

    res.json({ stores: formattedStores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
