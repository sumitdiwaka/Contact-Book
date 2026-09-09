const express = require('express');
const cors = require('cors');
const contactsRouter = require('./routes/contacts');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://contact-book-d4n9.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());

const connectDB = require('./data/db');

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/contacts', contactsRouter);

// unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// central error handler - catches bad JSON bodies and anything unexpected
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Contact Book API running on http://localhost:${PORT}`);
});

module.exports = app;