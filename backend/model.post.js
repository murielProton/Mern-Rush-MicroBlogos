const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Post = new Schema({
    key_word: {
        type: String
    },
    content: {
        type: String
    },
    author:{
        type: String
    },
    date:{
        type: String
    },
    recipients:{
        type: [String]
    }
});

module.exports = mongoose.model('Post', Post);