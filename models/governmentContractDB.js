var mongoose = require('mongoose');

var governmentContractSchema = new mongoose.Schema({
    title: String,
    date: Date,
    caigouren: String,
    dailishang: String,
    location: String,
    caigouneirong: String,
    link: String
})

var governmentcontract = mongoose.model('governmentcontract', governmentContractSchema)

module.exports = governmentcontract