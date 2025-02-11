const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Import routes
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const courseRoutes = require("./routes/courseRoutes");
const advertisementRoutes = require("./routes/advertisementRoutes");
const cartRoutes = require("./routes/cartRoutes");
const languageRoutes = require("./routes/languageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const libraryNoteRoutes = require("./routes/libraryNoteRoutes");
const quickLearningVideoRoutes = require("./routes/quickLearningVideoRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const liveClassRoutes = require("./routes/liveClassRoutes"); // New route for live classes
const {
  socketWebhookController,
} = require("./socketControllers/socketWebhookController");

// Initialize app and server
const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: "*", // Default to frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions)); // Apply CORS middleware

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined");
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// WebSocket event handling for live classes
socketWebhookController(server);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api", languageRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/advertisements", advertisementRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/library-notes", libraryNoteRoutes);
app.use("/api/quick-learning-videos", quickLearningVideoRoutes);
app.use("/api/live-classes", liveClassRoutes); // Live class API routes

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
