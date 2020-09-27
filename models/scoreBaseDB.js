var mongoose = require("mongoose")


var scoreSchema = new mongoose.Schema({
    firmName: String,
    firmScore: Number,
    scoreDate: Date
})

var score = mongoose.model("scorebases", scoreSchema)


module.exports = score