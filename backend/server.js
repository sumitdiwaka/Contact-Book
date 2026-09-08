const express = require('express');
const cors = require('cors');
const contactsRouter = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
