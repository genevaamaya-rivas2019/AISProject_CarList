const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    brand: String,
    model: String,
    year: Number,
    price: Number
});

module.exports = mongoose.model('cars', UserSchema);