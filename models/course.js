const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const courseSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        required: true
    },
    demoVideo: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    enrolled: {
        type: Number,
        required: true,
        min: 0
    },
    language: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    notPrice: {
        type: Number
    },
    bestseller: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        // default: false,
        required: true

    },
    top: {
        type: Boolean,
        // default: false,
        required: true

    }
    // _id: mongoose.Schema.Types.ObjectId,

});

module.exports = mongoose.model('courses',  courseSchema);