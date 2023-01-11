const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    uuid : {
        type:String,
    },
    queue : {
        type:String,
    },
    status : {
        type:String,
    },
    failed_at : {
        type:Date,
        default:Date.now()
        
    },

})
const failed_jobs = new mongoose.model("failed_jobs",Schema)
module.exports = failed_jobs;