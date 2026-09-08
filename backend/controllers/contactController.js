const { v4: uuidv4 } = require('uuid');
const { readContacts, writeContacts } = require('../data/store');
const { validateContact } = require('../utils/validate');

function getAllContacts(req, res) {
  const contacts = readContacts();
  const { search } = req.query;

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    const filtered = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term)
    );
    return res.json(filtered);
  }

  res.json(contacts);
}

function getContactById(req, res) {
  const contacts = readContacts();
  const contact = contacts.find((c) => c.id === req.params.id);

  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json(contact);
}

function createContact(req, res) {
  const { name, email, phone, address } = req.body || {};
  const errors = validateContact({ name, email, phone, address });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const contacts = readContacts();
  const emailTaken = contacts.some(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (emailTaken) {
    return res.status(409).json({ message: 'A contact with this email already exists' });
  }

  const newContact = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    address: address ? address.trim() : '',
    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);
  writeContacts(contacts);

  res.status(201).json(newContact);
}

function updateContact(req, res) {
  const contacts = readContacts();
  const index = contacts.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  const { name, email, phone, address } = req.body || {};
  const errors = validateContact({ name, email, phone, address });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const emailTaken = contacts.some(
    (c) => c.id !== req.params.id && c.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (emailTaken) {
    return res.status(409).json({ message: 'Another contact already uses this email' });
  }

  contacts[index] = {
    ...contacts[index],
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    address: address ? address.trim() : '',
    updatedAt: new Date().toISOString(),
  };

  writeContacts(contacts);
  res.json(contacts[index]);
}

function deleteContact(req, res) {
  const contacts = readContacts();
  const index = contacts.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  const [deleted] = contacts.splice(index, 1);
  writeContacts(contacts);
  res.json(deleted);
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
