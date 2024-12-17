const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    description: { type: String, required: true },
    album: { type: String, required: true },
    llmResponse: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },  // User ID
    tripId: { type: mongoose.Schema.Types.ObjectId, required: true }   // Trip ID
});


const Image = mongoose.model('Image', imageSchema);


module.exports = Image;