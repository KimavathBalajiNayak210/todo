const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));

module.exports = app;
