const Chat = require("../model/chats")
const Message = require("../model/messages")
const User = require('../model/users')
const e = require("express")


exports.ShowMessage = async(req,res) =>{
try {
    if(!req.body.chat_id || req.body.chat_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const message = await Message.find({chat_id:req.body.group_chat_id}).populate("users") 
    if(message.length>0){
        return res.status(201).json({data:message,status:1,message:"group created successfully"})  
    }else{
        return  res.status(406).json({status:0,message:"message not found"})    
    }
} catch (error) {
    res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on create group chat" + error);  
}
}
exports.showChat = async(req,res)=>{
    if(!req.body.user_id || req.body.user_id == ''){
        return  res.status(406).json({status:0,message:"please give proper parameter"})
    }
    const chats = await Chat
}
exports.CreateGroup = async(req,res)=>{
    try {
        if(!req.body.user_ids || req.body.user_ids == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req.body.creater_id || req.body.creater_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req.body.group_name || req.body.group_name == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
            const users = req.body.user_ids.split(",")
        const grpdata = new Chat({
            users:users,
            creater:req.body.creater_id,
            is_group_chat:true,
            name:req.body.group_name 

        })
         const group = await grpdata.save()
        return res.status(201).json({data:group,status:1,message:"group created successfully"})
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on create group chat" + error);  
    }
}

exports.DeleteGroup = async(req,res)=>{
    try {
        if(!req.body.group_chat_id || req.body.group_chat_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
            
       
         const group = await Chat.find({_id:req.body.group_chat_id})
         if(group.length>0){
                await GroupChat.deleteOne({_id:req?.body?.group_chat_id})
             return res.status(201).json({data:group,status:1,message:"group deleted successfully"})
         }else{
            return  res.status(406).json({status:0,message:"group not found"})  
         }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on delete group" + error);  
    }
}
exports.AddGroupChatMembers = async(req,res)=>{
    try {
        if(!req.body.group_chat_id || req.body.group_chat_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        if(!req.body.user_id || req.body.user_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
        const group = await Chat.find({_id:req.body.group_chat_id}).populate("users")
        if(group.length>0){
            const user = await User.find({_id:req?.body?.user_id})
            if(user.length>0){
                const updategrp = await GroupChat.findOneAndUpdate({_id:req.body.group_chat_id},{users:{$push:req?.body?.user_id}})
                return res.status(201).json({data:updategrp,status:1,message:"member added successfully"})
            }else{
                return  res.status(406).json({status:0,message:"user not found"})      
            }
        }else{
            return  res.status(406).json({status:0,message:"group not found"})  
        }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add chat memeber" + error);  
    }
}
exports.ShowGroupChatMembers = async(req,res)=>{
    try {
        if(!req.body.group_chat_id || req.body.group_chat_id == ''){
            return  res.status(406).json({status:0,message:"please give proper parameter"})
        }
         const group = await Chat.find({_id:req.body.group_chat_id}).populate("users")
         if(group.length>0){
                const data = group[0]?.users?.map((e)=>{
                        if(e.profile_image != ''){
                            const path = process.env.PUBLICPOROFILEIMAGEURL
                            if(fs.existsSync(`uploads/user/profile/${e.profile_image}`)){
                                var  profile_image = `${path}/${e.profile_image}`
                            }else{
                                
                                var profile_image = ''
                            }
                        }else{
                            var profile_image = ''
                        } 
                        var user_name  = e.name 
                        var user_username  = e.username 
                   return ({name:user_name,username:user_username,profile_image:profile_image})
                })
             return res.status(201).json({data:data,status:1,message:"group member found successfully"})
         }else{
            return  res.status(406).json({status:0,message:"group not found"})  
         }
    } catch (error) {
        res.status(502).json({status:0,message:"internal server error"})
        console.log("server error on add show group chat" + error);  
    }
}
