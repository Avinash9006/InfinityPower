const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorMiddleware = require('./middlewares/errorMiddleware');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const tenantRoutes = require("./routes/tenantRoutes");

dotenv.config();

const app = express();

// 🔹 CORS configuration
const allowedOrigins = [
  "http://localhost:3000",            // local dev
  "https://your-frontend.vercel.app"  // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Not allowed"));
    }
  },
  credentials: true
}));

// 🔹 Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 API routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tenants", tenantRoutes); 

// 🔹 Error handler (last middleware)
app.use(errorMiddleware);

// 🔹 Start server after DB connection
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
