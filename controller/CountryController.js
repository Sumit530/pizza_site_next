const AccountCategory = require("../model/account_categories")
const Country = require("../model/countries")
const User = require("../model/users")


exports.getcountries = async(req,rs) =>{
    try {
        const country = await Country.find()
        if(country.length > 0 ){
            var data = [] 
            country.map((e)=>{
                data.push({
                    id:e._id,
                    name:e.name
                })
            })
            return res.status(201).json({status:1,message:"found data",data:data})
        }
        else {
            return res.status(402).json({status:0,message:"not found data of country"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error get countries"  + error); 
    }
}

exports.getaccountcategory = async(req,res) =>{
    try {
        const account_cat = await AccountCategory.find()
        if(account_cat.length > 0 ){
            var data = [] 
            account_cat.map((e)=>{
                data.push({
                    id:e._id,
                    name:e.name
                })
            })
            return res.status(201).json({status:1,message:"found data",data:data})
        }
        else{
            return res.status(402).json({status:0,message:"not found data of account cateogry"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error get countries" + error); 
    }
}
// exports.distance = async(req,res) =>{
//    const latitude = "23.1309312" 
//    const longitude  = "72.531968" 
//    const radius = 2500
//    const user = await find({},{_id:1,name:1,username:1,email:1,gender:1})
// }