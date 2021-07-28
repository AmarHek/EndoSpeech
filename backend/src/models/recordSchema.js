const mongoose = require('mongoose');


const recordSchema = new mongoose.Schema({
    timeStamp: { type: Date },
    content: { type: String }
});

module.exports = mongoose.model('Record', recordSchema);
