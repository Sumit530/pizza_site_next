
const Chat = require("../model/chats")
const Message = require("../model/messages")
const User = require('../model/users')
global.onlineusers = new Map()
const users = []
 exports = module.exports  = (io) =>{
    io.on("connection",(socket)=>{
        //console.log(socket.id)
    socket.on("add-user-online",(userid)=>{
       // console.log(userid)
        User.findOneAndUpdate({_id:userid},{is_online:true}).then(()=>{

            onlineusers.set( userid,socket.id)
            socket.broadcast.emit('userisonline',userid)
        }) 
    })
    socket.on("joinchat",(chatid,userid)=>{
       // console.log(chatid,userid)
        socket.join(chatid)
        socket.broadcast.to(chatid).emit("joinchat",userid)
    })
    socket.on("typing",(user_id,chat_id)=>{
        socket.broadcast.to(chat_id).emit("typing",user_id)
       console.log(socket.adapter.rooms.get(chat_id))
    })
    socket.on("sendmsg",async({stypmsg,userid,chat_id})=>{
        //const getuser = onlineusers.get(destid)
            socket.to(chat_id).emit("msg-recieve",stypmsg,userid)
      
       // const chat = new Chat({srcuser:userid,destuser:destid})
    //     await chat.save()
        // await User.findOneAndUpdate({_id:destid,recentchats:{$ne:userid}},{$push:{recentchats:userid}})
        // await User.findOneAndUpdate({_id:userid,recentchats:{$ne:destid}},{$push:{recentchats:destid}})
    })
    socket.on("leavechat",(roomid)=>{
            socket.leave(roomid)
            console.log(socket.adapter.rooms.get(roomid))
    })
    
    socket.emit("get-user",users)
    socket.on("join-room",(roomid,name,id)=>{
        socket.join(roomid);
        
        socket.broadcast.to(roomid).emit("user-connected",userid)
        socket.on("message",(message)=>{
            io.to(roomid).emit("sendmessage",message,roomid)
        })
    })
})
}
