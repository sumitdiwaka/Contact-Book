const { v4: uuidv4 } = require('uuid');
const Contact = require('../models/Contact');
const { validateContact } = require('../utils/validate');

async function getAllContacts(req, res) {
  const { search } = req.query;

  if (search && search.trim()) {
    const term = search.trim();
    const regex = new RegExp(term, 'i');
    const filtered = await Contact.find({
      $or: [{ name: regex }, { email: regex }, { phone: regex }],
    });
    return res.json(filtered);
  }

  const contacts = await Contact.find();
  res.json(contacts);
}

async function getContactById(req, res) {
  const contact = await Contact.findOne({ id: req.params.id });
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json(contact);
}

async function createContact(req, res) {
  const { name, email, phone, address } = req.body || {};
  const errors = validateContact({ name, email, phone, address });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const emailTaken = await Contact.findOne({ email: email.trim().toLowerCase() });
  if (emailTaken) {
    return res.status(409).json({ message: 'A contact with this email already exists' });
  }

  const newContact = await Contact.create({
    id: uuidv4(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    address: address ? address.trim() : '',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newContact);
}

async function updateContact(req, res) {
  const existing = await Contact.findOne({ id: req.params.id });
  if (!existing) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  const { name, email, phone, address } = req.body || {};
  const errors = validateContact({ name, email, phone, address });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const emailTaken = await Contact.findOne({
    email: email.trim().toLowerCase(),
    id: { $ne: req.params.id },
  });
  if (emailTaken) {
    return res.status(409).json({ message: 'Another contact already uses this email' });
  }

  existing.name = name.trim();
  existing.email = email.trim().toLowerCase();
  existing.phone = phone.trim();
  existing.address = address ? address.trim() : '';
  existing.updatedAt = new Date().toISOString();
  await existing.save();

  res.json(existing);
}

async function deleteContact(req, res) {
  const deleted = await Contact.findOneAndDelete({ id: req.params.id });
  if (!deleted) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json(deleted);
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};