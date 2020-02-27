var mongoose = require("mongoose")

var blockchainCompanySchema = new mongoose.Schema({
    companyCode: String,
    companyName: String,
    segment: String,
    newestFinance: String,
    serviceType: String,
    yearFounded: Date,
    region: String
})

var blockchaincompany = mongoose.model('blockchaincompany', blockchainCompanySchema)

module.export = blockchaincompany