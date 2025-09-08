import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

// Normal User: submit or update rating
export const submitRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId, ratingValue } = req.body;

  if (ratingValue < 1 || ratingValue > 5)
    return res.status(400).json({ message: 'Rating must be 1–5' });

  try {
    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { ratingValue },
      create: { userId, storeId, ratingValue },
    });

    // Update store avgRating
    const allRatings = await prisma.rating.findMany({ where: { storeId } });
    const avg = allRatings.reduce((a, r) => a + r.ratingValue, 0) / allRatings.length;
    await prisma.store.update({ where: { id: storeId }, data: { avgRating: avg } });

    res.json({ message: 'Rating submitted', rating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
