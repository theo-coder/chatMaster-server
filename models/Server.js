const { model, Schema } = require('mongoose');

const serverSchema = new Schema({
    label: String,
    creator: {
        id: String,
        pseudo: String
    },
    members: [
        {
            id: String,
            pseudo: String
        }
    ],
    messages: []
})

module.exports = model('Server', serverSchema)