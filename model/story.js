const mongoose = require("mongoose")
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');

const Schema = new  mongoose.Schema({

    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    attachment: {
        type:String,
        require:true,
    },
   mentions :[ {
    type:mongoose.Schema.Types.ObjectId,
    ref : 'Users',
    require:true
   }],
   collaborator : [
    {
    type:mongoose.Schema.Types.ObjectId,
    ref : 'Users',
    require:true
    }
   ],
   accepted_collaborator : [
    {
    type:mongoose.Schema.Types.ObjectId,
    ref : 'Users',
    require:true
    }
   ]



},{timestamps:true})
Schema.plugin(softDeletePlugin)
const block_user = new mongoose.model("block_user",Schema)
module.exports = block_user;