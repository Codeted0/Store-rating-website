// utils/validation.js

// Email: standard format check
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password: 8-16 chars, at least 1 uppercase + 1 special char
export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  return regex.test(password);
};

// Name: 20–60 chars
export const validateName = (name) => {
  return typeof name === 'string' && name.length >= 20 && name.length <= 60;
};

// Address: optional, but <= 400 chars
export const validateAddress = (address) => {
  return !address || (typeof address === 'string' && address.length <= 400);
};
