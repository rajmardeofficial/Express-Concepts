const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    birthDate: String,
})

// create a model (collection) named User
//Note: 
//- model name: User => collection name: users

module.exports = mongoose.model('User', UserSchema)