const mongoose = require('mongoose');

// this is just like a constructor
const UserSchema = new mongoose.Schema({
    // pass in an object with fields we want for User
        // we'll get back an id from google, we'll call it google id to separate it from object id that mongodb gives us by default
        googleId: {
            type: String,
            sparse: true
            // required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            sparse: true
        },
        password: {
            type: String,
            sparse: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
});

module.exports = mongoose.model('User', UserSchema);