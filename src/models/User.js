const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Account", "Team Member", "Client"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phonenumber: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('User', UserSchema);