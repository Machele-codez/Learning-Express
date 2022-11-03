const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// Creates the `Post` DB document using the `PostSchema`
module.exports = mongoose.model("Post", PostSchema);