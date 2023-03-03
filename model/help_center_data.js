const mongoose = require("mongoose")

const Schema = new  mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require:true
    },
    help_center_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'help_centers',
        require:true
    },
    problem_solved : {
        type:Boolean,
        default:false
    },
    
    status : {
        type:Boolean,
        default:true
    }
}
,{timestamps:true})

const help_center_data = new mongoose.model("help_center_data",Schema)
module.exports = help_center_data;