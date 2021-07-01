const mongoose = require('mongoose');


const dictSchema = new mongoose.Schema({
    parts: { type: mongoose.Schema.Types.Mixed, required: true},
    name: { type: String}
});

module.exports = mongoose.model('Dict', dictSchema);
