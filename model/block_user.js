const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({

    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    block_user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    }

},{timestamps:true})
const block_user = new mongoose.model("block_user",Schema)
module.exports = block_user;