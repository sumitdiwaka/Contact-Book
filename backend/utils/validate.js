const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,15}$/;

function validateContact(data = {}) {
  const errors = {};
  const { name, email, phone, address } = data;

  if (typeof name !== 'string' || !name.trim()) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (name.trim().length > 100) {
    errors.name = 'Name is too long';
  }

  if (typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (typeof phone !== 'string' || !phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.phone = 'Enter a valid phone number';
  }

  if (typeof address === 'string' && address.trim().length > 200) {
    errors.address = 'Address is too long (max 200 characters)';
  }

  return errors;
}

module.exports = { validateContact };
