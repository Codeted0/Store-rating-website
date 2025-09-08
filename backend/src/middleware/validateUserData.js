import { validateEmail, validatePassword, validateName, validateAddress } from '../utils/validation.js';

export const validateUserData = (req, res, next) => {
  const { name, email, password, address } = req.body;

  if (!validateName(name))
    return res.status(400).json({ message: "Name must be between 20–60 characters." });

  if (!validateEmail(email))
    return res.status(400).json({ message: "Invalid email format." });

  if (!validatePassword(password))
    return res.status(400).json({ message: "Password must be 8–16 chars with 1 uppercase & 1 special char." });

  if (!validateAddress(address))
    return res.status(400).json({ message: "Address must be <= 400 chars." });

  next();
};
