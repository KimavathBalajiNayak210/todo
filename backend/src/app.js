const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://tweeko.netlify.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Root Route
app.get('/', (req, res) => {
  res.json({ status: 'API is running 🚀', documentation: 'https://github.com/KimavathBalajiNayak210/todo' });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));

module.exports = app;
