const Category = require("../model/categories")


exports.getcategories = async(req,res) =>{
    try {
        const category = await Category.find()
        if(category.length > 0 ){
            var data = [] 
            category.map((e)=>{
                data.push({
                    id:e._id,
                    name:e.name
                })
            })
            return res.status(201).json({status:1,message:"categories got successfully",data:data})
        }
        else{
            return res.status(402).json({status:0,message:"no data found"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on get categories"); 
    }
}