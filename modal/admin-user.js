const mongoose = require('mongoose')

const admin_user_model = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    time: {
        type: Date,
        default: Date.now 
    }
})

const modal = mongoose.model('admin_user',admin_user_model)
module.exports = modal