const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'contacts.json');

function readContacts() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function writeContacts(contacts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));
}

module.exports = { readContacts, writeContacts };
