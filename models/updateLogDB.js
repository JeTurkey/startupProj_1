var mongoose = require("mongoose")

var updateLogSchema = new mongoose.Schema({
    title: String,
    date: Date,
    editor: String,
    content: String
})

var updateLog = mongoose.model("updatelog", updateLogSchema)

module.exports = updateLog