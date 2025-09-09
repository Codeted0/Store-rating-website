import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

// Submit rating
export const submitRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: "Invalid rating" });

  try {
    const newRating = await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId: Number(storeId) } },
      create: { userId, storeId: Number(storeId), ratingValue: rating },
      update: { ratingValue: rating },
    });

    const stats = await prisma.rating.aggregate({
      _avg: { ratingValue: true },
      _count: { ratingValue: true },
      where: { storeId: Number(storeId) },
    });

    res.json({
      avgRating: stats._avg.ratingValue
        ? Number(stats._avg.ratingValue.toFixed(1))
        : 0,
      totalRatings: stats._count.ratingValue,
      userRating: newRating.ratingValue,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
