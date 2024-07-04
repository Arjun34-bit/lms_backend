const Wishlist = require('../models/Wishlist');

exports.addToWishlist = async(req, res) => {
    try {
        const { userId, courseId } = req.body;
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, courses: [courseId] });
        } else {
            wishlist.courses.push(courseId);
        }

        await wishlist.save();
        res.status(200).json({ message: 'Course added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromWishlist = async(req, res) => {
    try {
        const { userId, courseId } = req.body;
        let wishlist = await Wishlist.findOne({ user: userId });

        if (wishlist) {
            wishlist.courses.pull(courseId);
            await wishlist.save();
        }

        res.status(200).json({ message: 'Course removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// other wishlist controller methods