const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({

    reason : {
       type:String,
       require:true
    },

},{timestamps:true})
const ban_reasons = new mongoose.model("ban_reasons",Schema)
module.exports = ban_reasons;