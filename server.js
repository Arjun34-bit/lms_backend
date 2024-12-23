const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
require('dotenv').config();  // Load environment variables

// Import routes
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const courseRoutes = require('./routes/courseRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const libraryNoteRoutes = require('./routes/libraryNoteRoutes');
const quickLearningVideoRoutes = require('./routes/quickLearningVideoRoutes');
const liveClassRoutes = require('./routes/liveClassRoutes');  // New route for live classes

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',  // Default to frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));  // Apply CORS middleware

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined');
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
  process.exit(1);
});

// WebSocket event handling for live classes
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle joining a specific class room
  socket.on('joinClass', (classId) => {
    socket.join(classId);
    console.log(`User joined class room: ${classId}`);
  });

  // Handle sending chat messages in class rooms
  socket.on('sendMessage', (data) => {
    io.to(data.classId).emit('receiveMessage', data.message);
  });

  // Handle broadcasting announcements to the class room
  socket.on('sendAnnouncement', (data) => {
    io.to(data.classId).emit('receiveAnnouncement', data.announcement);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/library-notes', libraryNoteRoutes);
app.use('/api/quick-learning-videos', quickLearningVideoRoutes);
app.use('/api/live-classes', liveClassRoutes);  // Live class API routes

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
