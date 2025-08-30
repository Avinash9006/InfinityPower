const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middlewares/errorMiddleware');
const connectDB = require('./config/db');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');

const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");   // ✅ renamed from playlist // ✅ for subjects
const chapterRoutes = require("./routes/chapterRoutes"); // ✅ for chapters

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);

// Error handler (last middleware)
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
