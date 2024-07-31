// // app.js
// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const userRoutes = require("./routes");
// const courseRoutes = require("./routes/courseRoutes");
// const wishlistRoutes = require("./routes/wishlistRoute")
// const videoRoutes = require('./routes/videoRoutes');
// const scholarshipRoutes = require('./routes/scholarshipRoutes');
// const materialRoutes = require('./routes/materialRoutes');
// const testSeriesRoutes = require('./routes/testSeriesRoutes');
// const pccCenterRoutes = require('./routes/pccCenterRoutes');
// const walletRoutes = require('./routes/walletRoutes')
//     // const cartRoutes = require('./routes/cartRoutes')
//     // Connect to MongoDB
// mongoose
//     .connect("mongodb://0.0.0.0:27017/pcc", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => {
//         console.log("Connected to MongoDB");
//     })
//     .catch((error) => {
//         console.error("MongoDB connection error:", error);
//     });

// const app = express();

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use("/api", userRoutes);
// app.use('/api', courseRoutes);
// app.use('/api', wishlistRoutes);
// app.use('/api', videoRoutes);
// app.use('/api', scholarshipRoutes);
// app.use('/api', materialRoutes);
// app.use('/api', testSeriesRoutes);
// app.use('/api', pccCenterRoutes);
// app.use('/api', walletRoutes)
//     // app.use('/api', cartRoutes)

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });



const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios"); // Added axios for making HTTP requests
const userRoutes = require("./routes");
const courseRoutes = require("./routes/courseRoutes");
const wishlistRoutes = require("./routes/wishlistRoute");
const videoRoutes = require('./routes/videoRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const materialRoutes = require('./routes/materialRoutes');
const testSeriesRoutes = require('./routes/testSeriesRoutes');
const pccCenterRoutes = require('./routes/pccCenterRoutes');
const walletRoutes = require('./routes/walletRoutes');
require('dotenv').config(); // Load environment variables from .env file

// Connect to MongoDB using environment variable
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

const app = express();

// Middleware
app.use(bodyParser.json());

// Example route using SERVER_URL from environment variables
app.get('/api/external-data', async(req, res) => {
    try {
        // Make a GET request to the external server using SERVER_URL
        const response = await axios.get(`${process.env.SERVER_URL}/some-endpoint`);
        res.json(response.data); // Send the response data to the client
    } catch (error) {
        res.status(500).send(error.message); // Send error message in case of failure
    }
});

// Routes
app.use("/api", userRoutes);
app.use('/api', courseRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', videoRoutes);
app.use('/api', scholarshipRoutes);
app.use('/api', materialRoutes);
app.use('/api', testSeriesRoutes);
app.use('/api', pccCenterRoutes);
app.use('/api', walletRoutes);

const PORT = process.env.PORT || 8000; // Use PORT from environment variables
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});