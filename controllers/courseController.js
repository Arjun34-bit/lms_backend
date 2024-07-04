const Course = require('../models/course');
const User = require('../models/user');

// const Course = require('../models/Course');

exports.addCourse = async(req, res) => {
    try {
        const { thumbnail, demoVideo, title, hours, description, author, rating, enrolled, language, price, notPrice, bestseller, featured, top } = req.body;

        const newCourse = new Course({
            thumbnail,
            demoVideo,
            title,
            hours,
            description,
            author,
            rating,
            enrolled,
            language,
            price,
            notPrice,
            bestseller,
            featured,
            top

        });

        await newCourse.save();
        res.status(201).json({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all courses
exports.getAllCourses = async(req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get featured courses
exports.getFeaturedCourses = async(req, res) => {
    try {
        const { userId } = req.body; // Assume userId is passed as a URL parameter

        // Find the user and populate the purchased courses
        const user = await User.findOne({ "email": userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const purchasedCourseIds = user.purchased;

        // Find top courses that are not in the user's purchased list
        const topCourses = await Course.find({
            featured: true,
            _id: { $nin: purchasedCourseIds }
        });

        res.status(200).json(topCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get top courses not purchased by the user
exports.getTopCourses = async(req, res) => {
    console.log("hii");
    try {
        const { userId } = req.body; // Assume userId is passed as a URL parameter

        // Find the user and populate the purchased courses
        const user = await User.findOne({ "email": userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const purchasedCourseIds = user.purchased;

        // Find top courses that are not in the user's purchased list
        const topCourses = await Course.find({
            top: true,
            _id: { $nin: purchasedCourseIds }
        });

        res.status(200).json(topCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search for courses
exports.searchCourses = async(req, res) => {
    try {
        const query = req.query.q;
        const courses = await Course.find({
            title: { $regex: query, $options: 'i' }
        });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get course by ID
exports.getCourseById = async(req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findOne({ _id: courseId });
        // courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// List all courses
exports.listCourses = async(req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching courses' });
    }
};

// List featured courses
exports.featuredCourses = async(req, res) => {
    try {
        const courses = await Course.find({ featured: true });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching featured courses' });
    }
};

// List top courses
exports.topCourses = async(req, res) => {
    try {
        const courses = await Course.find({}).sort({ rating: -1 }).limit(10);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching top courses' });
    }
};

// Search for courses
exports.searchCourses = async(req, res) => {
    try {
        const { query } = req.params;
        const courses = await Course.find({ title: new RegExp(query, 'i') });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for courses' });
    }
};

// Fetch course-related videos
exports.courseVideos = async(req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('videos');
        res.status(200).json(course.videos);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching course videos' });
    }
};

// Fetch quick learning reels
exports.quickLearningReels = async(req, res) => {
    try {
        const reels = await Reels.find({});
        res.status(200).json(reels);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching quick learning reels' });
    }
};

// Fetch PCC centers
exports.pccCenters = async(req, res) => {
    try {
        const centers = await PCCCenter.find({});
        res.status(200).json(centers);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching PCC centers' });
    }
};

// Fetch our results
exports.ourResults = async(req, res) => {
    try {
        const results = await Result.find({});
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching results' });
    }
};

// Test series
exports.testSeries = async(req, res) => {
    try {
        const testSeries = await TestSeries.find({});
        res.status(200).json(testSeries);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching test series' });
    }
};

// Feeds
exports.feeds = async(req, res) => {
    try {
        const feeds = await Feed.find({});
        res.status(200).json(feeds);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching feeds' });
    }
};

// Library
exports.library = async(req, res) => {
    try {
        const library = await Library.find({});
        res.status(200).json(library);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching library' });
    }
};

// Live lecture
exports.liveLecture = async(req, res) => {
    try {
        const liveLectures = await LiveLecture.find({});
        res.status(200).json(liveLectures);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching live lectures' });
    }
};

// Doubts session
exports.doubtsSession = async(req, res) => {
    try {
        const sessions = await DoubtSession.find({});
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching doubts sessions' });
    }
};

//create course
exports.createCourse = async(req, res) => {
    try {
        const {
            title,
            hours,
            description,
            category,
            price,
            rating,
            featured,
            top,
            reels,
            videos
        } = req.body;

        const newCourse = new Course({
            title,
            hours,
            description,
            category,
            price,
            rating,
            featured,
            top,
            reels,
            videos
        });

        await newCourse.save();

        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.log(error);;
        res.status(500).json({ error: 'An error occurred while creating the course ' });
    }
};



/*

add course in cart

 */
exports.addToCart = async(req, res) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findOne({
            email: userId
        });
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (!user.cart.includes(courseId)) {
            user.cart.push(courseId);
            await user.save();
            return res.status(200).send('Course added to cart');
        } else {
            return res.status(400).send('Course already in cart');
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


/*

add course in wishlist

 */
exports.addToWishlist = async(req, res) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findOne({
            email: userId
        });
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (!user.wishlist.includes(courseId)) {
            user.wishlist.push(courseId);
            await user.save();
            return res.status(200).send('Course added to cart');
        } else {
            return res.status(400).send('Course already in cart');
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


/*

fetch user cart

 */
exports.fetchUserCart = async(req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findOne({
            email: userId
        });

        const courses = [];

        for (const courseId of user.cart) {
            const course = await Course.findById(courseId);

            if (course) {
                courses.push({
                    "_id": course._id,
                    "thumbnail": course.thumbnail,
                    "demoVideo": course.demoVideo,
                    "title": course.title,
                    "hours": course.hours,
                    "description": course.description,
                    "author": course.author,
                    "rating": course.rating,
                    "enrolled": course.enrolled,
                    "language": course.language,
                    "price": course.price,
                    "notPrice": course.notPrice,
                    "bestseller": course.bestseller,
                    "featured": course.featured,
                    "top": course.top,
                    "uploadDate": course.uploadDate,
                    "__v": course.__v
                });
            }
        }
        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


/*

fetch user wishlist

 */
exports.fetchUserWishlist = async(req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findOne({
            email: userId
        });

        const courses = [];

        for (const courseId of user.wishlist) {
            const course = await Course.findById(courseId);

            if (course) {
                courses.push({
                    "_id": course._id,
                    "thumbnail": course.thumbnail,
                    "demoVideo": course.demoVideo,
                    "title": course.title,
                    "hours": course.hours,
                    "description": course.description,
                    "author": course.author,
                    "rating": course.rating,
                    "enrolled": course.enrolled,
                    "language": course.language,
                    "price": course.price,
                    "notPrice": course.notPrice,
                    "bestseller": course.bestseller,
                    "featured": course.featured,
                    "top": course.top,
                    "uploadDate": course.uploadDate,
                    "__v": course.__v
                });
            }
        }
        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


/*

Remove item remove from cart

 */
exports.removeUserCartItem = async(req, res) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findOne({
            email: userId
        });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const courseIndex = user.cart.indexOf(courseId);
        if (courseIndex > -1) {
            user.cart.splice(courseIndex, 1);
            await user.save();
            return res.status(200).send('Course removed from cart');
        } else {
            return res.status(400).send('Course not found in cart');
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

/*

Remove item from wishlist

 */
exports.removeUserWishlistItem = async(req, res) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findOne({
            email: userId
        });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const courseIndex = user.wishlist.indexOf(courseId);
        if (courseIndex > -1) {
            user.wishlist.splice(courseIndex, 1);
            await user.save();
            return res.status(200).send('Course removed from cart');
        } else {
            return res.status(400).send('Course not found in cart');
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


/*

add new user 

 */
exports.addUser = async(req, res) => {
    console.log("create user route");
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const newUser = new User({ email });
        await newUser.save();

        return res.status(201).send('User created successfully');
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


/*

fetch user purchased

 */
exports.fetchUserPurchasedList = async(req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findOne({
            email: userId
        });

        const courses = [];

        for (const courseId of user.purchased) {
            const course = await Course.findById(courseId);

            if (course) {
                courses.push({
                    "_id": course._id,
                    "thumbnail": course.thumbnail,
                    "demoVideo": course.demoVideo,
                    "title": course.title,
                    "hours": course.hours,
                    "description": course.description,
                    "author": course.author,
                    "rating": course.rating,
                    "enrolled": course.enrolled,
                    "language": course.language,
                    "price": course.price,
                    "notPrice": course.notPrice,
                    "bestseller": course.bestseller,
                    "featured": course.featured,
                    "top": course.top,
                    "uploadDate": course.uploadDate,
                    "__v": course.__v
                });
            }
        }
        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


/*

add course in purchased

 */
exports.addToPurchased = async(req, res) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findOne({
            email: userId
        });
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (!user.purchased.includes(courseId)) {
            user.purchased.push(courseId);
            await user.save();
            return res.status(200).send('Course added to cart');
        } else {
            return res.status(400).send('Course already in cart');
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};