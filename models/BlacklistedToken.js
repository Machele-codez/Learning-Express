const mongoose = require("mongoose");

const BlacklistedTokenSchema = mongoose.Schema({
    token: String
}) 

module.exports = mongoose.model("BlacklistedToken", BlacklistedTokenSchema);