const mongoose = require("mongoose");
require("dotenv").config()
const DB = process.env.DB;
mongoose.set('strictQuery',false)
mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("connection is successfully done")).catch((error)=>console.log("error " + error.message))