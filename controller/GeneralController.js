const AcoountCategory = require("../model/account_categories")
const Country = require("../model/countries")
const User = require("../model/users")


exports.getcountries = async(req,res) =>{
        var country_data = await Country.find({},{name:1})
        if(country_data.length>0){
            return res.status(201).json({data:country_data, status:1,message:"countries data found!."})    
        }else{
            return res.status(402).json({status:0,message:"data not found ."})
        }
}

exports.getaccountcategory = async(req,res)=>{
    var account_category = await  AcoountCategory.find({},{name:1})
    if(account_category.length>0){
        return res.status(201).json({data:account_category, status:1,message:"account categories  data found!."})    
    }else{
        return res.status(402).json({status:0,message:"data not found ."})
    }
}