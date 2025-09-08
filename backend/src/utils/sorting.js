// backend/src/utils/sorting.js
export const getSorting = (req, defaultField = 'id', defaultOrder = 'asc') => {
  const { sortBy, order } = req.query;

  // whitelist allowed fields to avoid unexpected injection / errors
  const safeFields = ['id', 'name', 'email', 'address', 'role', 'avgRating', 'createdAt'];
  const field = safeFields.includes(sortBy) ? sortBy : defaultField;

  const safeOrders = ['asc', 'desc'];
  const sortOrder = order && safeOrders.includes(order.toLowerCase())
    ? order.toLowerCase()
    : defaultOrder;

  return { [field]: sortOrder };
};
