const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the PaymentSuccessResponse schema
const paymentSuccessResponseSchema = new Schema({
    paymentId: {
        type: String,
        required: false, // Change to true if this field is mandatory
    },
    orderId: {
        type: String,
        required: false, // Change to true if this field is mandatory
    },
    signature: {
        type: String,
        required: false, // Change to true if this field is mandatory
    },
    data: {
        type: Map,
        of: Schema.Types.Mixed,
        required: false,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Create the model from the schema
const PaymentSuccessResponse = mongoose.model('PaymentSuccessResponse', paymentSuccessResponseSchema);

module.exports = PaymentSuccessResponse;