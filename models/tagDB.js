var mongoose = require("mongoose")

var tagSchema = new mongoose.Schema({
    tag: String,
    tagType: String,
    tagDescription: String
})

var tag = mongoose.model("tagdescriptions", tagSchema)


module.exports = tag