const help_centers= require("../model/help_centers")
const help_center_data = require("../model/help_center_data")


exports.gethelp = async(req,res) =>{

    try {
        const helpcenter = await help_centers() 
        if(helpcenter.length > 0){
            const data = []
            helpcenter.map((e)=>{
                data.push({
                    id:e._id,
                    title:e.title
                })
            })
            return res.status(201).json({status:1,message:"data found",data:data})
        }
        else{
            return  res.status(406).json({status:0,message:"no data found of helpcenter"})
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on  get help center" + error);   
    }

}

exports.gethelpbyid = async(req,res) =>{
    try {
        if(!req.body.id || req.body.id == '' ){ 
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const helpcenter =await help_centers({_id:req.body.id})
        if(helpcenter.length > 0) {
            const data = {
                id : helpcenter[0]._id,
                title:helpcenter[0].title,
            }
            return res.status(201).json({status:1,message:"data found",data:data})
        }
        else{
            res.status(402).json({status:0,message:"not found helpcenter"})    
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on get help by id" + error);  
    }
} 
exports.add_help_center_problem_resolved = async(req,res) =>{
    try {
        if(!req.body.user_id || req.body.user_id == '' || req.body.help_center_id == '' || !req.body.help_center_id || req.body.problem_resolved == '' || !req.body.problem_resolved){ 
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const checkdata = await help_centers.find({_id:req.body.help_center_id})
        if(checkdata.length > 0){

            const helpdata = new help_center_data({
                user_id : req.body.user_id ,
                help_center_id : req.body.help_center_id ,
                problem_resolved : req.body.problem_resolved ,
                
            })
            await helpdata.save()
            return res.status(201).json({status:1,message:"'Problem resolved add successfully"})
        }else {
            res.status(402).json({status:0,message:"not found helpcenter"})    
        }
            
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
    console.log("server error on add_help_center_problem_resolved" + error);  
    }
}