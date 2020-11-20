const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    pseudo: String,
    password: String,
    servers: []
})

module.exports = model('User', userSchema)