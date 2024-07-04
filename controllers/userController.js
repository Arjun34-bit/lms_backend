// controllers/userController.js
const User = require('../models/user');
const Course = require('../models/course');

// Add to cart
exports.addToCart = async(req, res) => {
    try {
        const { email, productId } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, cart: [], wishlist: [], courses: [] });
        }

        if (!user.cart.includes(productId)) {
            user.cart.push(productId);
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Delete from cart
exports.deleteFromCart = async(req, res) => {
    try {
        const { email } = req.body;
        const { productId } = req.params;

        const user = await User.findOne({ email });

        if (user) {
            user.cart = user.cart.filter(id => id !== productId);
            await user.save();
            res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Add to wishlist
exports.addToWishlist = async(req, res) => {
    try {
        const { email, productId } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, cart: [], wishlist: [], courses: [] });
        }

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
        }

        await user.save();
        res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Delete from wishlist
exports.deleteFromWishlist = async(req, res) => {
    try {
        const { email } = req.body;
        const { productId } = req.params;

        const user = await User.findOne({ email });

        if (user) {
            user.wishlist = user.wishlist.filter(id => id !== productId);
            await user.save();
            res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Buy course
exports.buyCourse = async(req, res) => {
    try {
        const { email, courseId } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, cart: [], wishlist: [], courses: [] });
        }

        if (!user.courses.includes(courseId)) {
            user.courses.push(courseId);
        }

        await user.save();
        res.status(200).json({ message: 'Course purchased', courses: user.courses });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.listCourses = async(req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// List featured courses
exports.featuredCourses = async(req, res) => {
    try {
        const courses = await Course.find({ featured: true });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// List top courses
exports.topCourses = async(req, res) => {
    try {
        const courses = await Course.find({ top: true });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Search for courses
exports.searchCourses = async(req, res) => {
    try {
        const { query } = req.params;
        const courses = await Course.find({ title: new RegExp(query, 'i') });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Fetch course-related videos
exports.courseVideos = async(req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (course) {
            res.status(200).json({ videos: course.videos });
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Fetch quick learning reels
exports.quickLearningReels = async(req, res) => {
    try {
        const reels = await Course.find({}, 'reels');
        res.status(200).json(reels);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Fetch PCC centers
exports.pccCenters = async(req, res) => {
    try {
        const centers = await Center.find(); // Assuming Center model is created
        res.status(200).json(centers);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Fetch our results
exports.ourResults = async(req, res) => {
    try {
        const results = await Result.find(); // Assuming Result model is created
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Test series
exports.testSeries = async(req, res) => {
    try {
        const tests = await Test.find(); // Assuming Test model is created
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Feeds
exports.feeds = async(req, res) => {
    try {
        const feeds = await Feed.find(); // Assuming Feed model is created
        res.status(200).json(feeds);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Library
exports.library = async(req, res) => {
    try {
        const library = await Library.find(); // Assuming Library model is created
        res.status(200).json(library);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Live lecture
exports.liveLecture = async(req, res) => {
    try {
        const lectures = await LiveLecture.find(); // Assuming LiveLecture model is created
        res.status(200).json(lectures);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Doubts session
exports.doubtsSession = async(req, res) => {
    try {
        const sessions = await DoubtsSession.find(); // Assuming DoubtsSession model is created
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Refer & earn
exports.referAndEarn = async(req, res) => {
    try {
        const { email, referralCode } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, cart: [], wishlist: [], courses: [], wallet: 0 });
        }

        // Add referral code logic here

        await user.save();
        res.status(200).json({ message: 'Referral code applied', wallet: user.wallet });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// My wallet
exports.myWallet = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            res.status(200).json({ wallet: user.wallet });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};