const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm({ name, email, phone, address }) {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  const digitsOnly = phone.trim().replace(/\D/g, '');

  if (!phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (digitsOnly.length !== 10 && !(digitsOnly.length === 12 && digitsOnly.startsWith('91'))) {
    errors.phone = 'Enter a valid 10-digit phone number';
  }

  if (address.trim().length > 200) {
    errors.address = 'Address is too long (max 200 characters)';
  }

  return errors;
}