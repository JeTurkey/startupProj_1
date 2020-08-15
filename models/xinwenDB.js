var mongoose = require("mongoose")

var xinwenSchema = new mongoose.Schema({
    title: String,
    dateAdded: String,
    source: String,
    content: String
})

var xinwen = mongoose.model("news", xinwenSchema)

module.exports = xinwen