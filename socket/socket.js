
const GroupChat = require("../model/chats")
const SingleChat = require("../model/single_chat")
const Message = require("../model/messages")
const User = require('../model/users')
global.onlineusers = new Map()
const users = []
 exports = module.exports  = (io) =>{
    io.on("connection",(socket)=>{
        //console.log(socket.id)
    socket.on("add-user-online",(userid)=>{
       // console.log(userid)
       if(!onlineusers.get(userid)){

               User.findOneAndUpdate({_id:userid},{is_online:true}).then((e)=>{
                    onlineusers.set( userid,socket.id)
                    socket.broadcast.emit('userisonline',userid)
            }) 
        }
        
    })
    socket.on("joinchat",(chatid,userid)=>{
        socket.join(chatid)
        socket.broadcast.to(chatid).emit("joinchat",userid)
    })
    socket.on("leavechat",(roomid)=>{
        socket.leave(roomid)
    })
    socket.on("typing",(user_id,chat_id)=>{
        socket.broadcast.to(chat_id).emit("typing",user_id)
       
    })
    socket.on("send-message",async(stypmsg,user_id,chat_id,isGroupChat)=>{
        //const getuser = onlineusers.get(destid)
        var checkchat = null
        var chatid = chat_id
            if(isGroupChat == false){
                checkchat = await SingleChat.find({_id:chat_id})
                if(checkchat.length <= 0){

                    const chatdata = new SingleChat({
                        user_id : user_id,
                        reciever_id : chatid 
                    })
                    const savedchat = await chatdata.save()
                    checkchat = await SingleChat.find({_id:savedchat._id}) 
                      chatid = savedchat._id
                    socket.join(chatid)

                }   
            }else{

                checkchat = await GroupChat.find({_id:chatid})   
            }
        if(  checkchat != null && checkchat?.length  > 0  ){
            const chatusers = isGroupChat == true  ? checkchat[0]?.users?.map((e)=>{
                return e._id
            }) : [checkchat[0].reciever_id,checkchat[0].user_id]
            const inchatuser = Array.from(socket.adapter.rooms.get(chatid))
            var send = []
            chatusers.map((e)=>{
                if(onlineusers.get(e.toString())){
                    send.push(onlineusers.get(e.toString()))
                }
                else{
             console.log("sending notification to the " +e )
            }
        })
        if(send.length > 0){

            var difference = send.filter(x => inchatuser.indexOf(x) === -1);
            function getByValue(map, searchValue) {
                for (let [key, value] of map.entries()) {
                    if (value === searchValue)
                    return key;
                }
            }
            if(difference.length > 0){
                difference.map((e)=>{
                    console.log("sending notification to "+getByValue(onlineusers,difference[0]))
                })
            }
        }

        const newmsg = new Message({

        })
        socket.broadcast.to(chatid).emit("message-recieve",stypmsg,user_id)
        
    }
       // const chat = new Chat({srcuser:userid,destuser:destid})
    //     await chat.save()
        // await User.findOneAndUpdate({_id:destid,recentchats:{$ne:userid}},{$push:{recentchats:userid}})
        // await User.findOneAndUpdate({_id:userid,recentchats:{$ne:destid}},{$push:{recentchats:destid}})
    })
   
    
    socket.emit("get-user",users)
    socket.on("join-room",(roomid,name,id)=>{
        socket.join(roomid);
        
       // socket.broadcast.to(roomid).emit("user-connected",userid)
        socket.on("message",(message)=>{
            io.to(roomid).emit("sendmessage",message,roomid)
        })
    })
})
}
